import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface ThreeMapUkraineProps {
  variant?: 'hero' | 'workspace';
  activeThreatCount?: number;
  highlightedCity?: string;
  onSelectCity?: (city: string) => void;
  className?: string;
}

export const ThreeMapUkraine: React.FC<ThreeMapUkraineProps> = ({
  variant = 'hero',
  activeThreatCount = 3,
  highlightedCity = 'kyiv',
  onSelectCity,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || (variant === 'hero' ? 360 : 300);

    // 1. Three.js Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    
    // Isometric-like perspective camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 38, 48);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    // 2. Realistic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xf1f5f9, 1.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainLight.position.set(25, 45, 30);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 10;
    mainLight.shadow.camera.far = 100;
    mainLight.shadow.camera.left = -30;
    mainLight.shadow.camera.right = 30;
    mainLight.shadow.camera.top = 30;
    mainLight.shadow.camera.bottom = -30;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.2);
    fillLight.position.set(-25, 20, -20);
    scene.add(fillLight);

    const blueAccentLight = new THREE.PointLight(0x3b82f6, 2.5, 40);
    blueAccentLight.position.set(0, 8, 2);
    scene.add(blueAccentLight);

    const redAlertLight = new THREE.PointLight(0xef4444, variant === 'hero' ? 3.0 : 4.0, 35);
    redAlertLight.position.set(10, 6, 0);
    scene.add(redAlertLight);

    // 3. Main Map 3D Extrusion Group
    const mapGroup = new THREE.Group();
    scene.add(mapGroup);

    // Geographic shape of Ukraine in normalized coordinate space
    const ukraineShape = new THREE.Shape();
    
    // Scale factor to map Ukraine coords into Three.js units (~36x24 units)
    const pts: [number, number][] = [
      [-17.0, 4.5],   // Volyn west
      [-14.5, 6.8],   // Shatsk north
      [-10.0, 7.2],   // Rivne north
      [-4.0, 8.0],    // Zhytomyr north
      [0.5, 8.8],     // Kyiv north / Chornobyl
      [4.2, 9.5],     // Chernihiv north
      [11.0, 8.8],    // Sumy north
      [16.2, 5.5],    // Kharkiv north-east
      [18.5, 1.5],    // Luhansk east
      [18.0, -3.0],   // Luhansk south-east
      [14.5, -5.5],   // Donetsk south / Azov coast
      [9.5, -6.5],    // Berdiansk / Mariupol
      [5.5, -6.8],    // Melitopol / Henichesk
      [5.0, -9.8],    // Crimea Kerch / Feodosia
      [1.5, -11.5],   // Crimea Yalta / Sevastopol
      [-1.0, -9.0],   // Crimea Perekop
      [-1.5, -6.2],   // Kherson Dnieper mouth
      [-4.5, -5.8],   // Ochakiv / Odesa
      [-7.5, -7.5],   // Bilhorod-Dnistrovskyi / Danube delta
      [-10.0, -5.0],  // Odesa north-west / Moldova border
      [-13.0, -3.5],  // Vinnytsia / Chernivtsi south
      [-17.5, -4.5],  // Zakarpattia / Uzhhorod
      [-18.5, -0.5],  // Lviv / Chop
      [-17.0, 4.5],   // back to Volyn
    ];

    ukraineShape.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      ukraineShape.lineTo(pts[i][0], pts[i][1]);
    }
    ukraineShape.closePath();

    // 3D Extrusion settings for crisp ceramic clay bevel
    const extrudeSettings = {
      depth: 3.2,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.45,
      bevelThickness: 0.45,
    };

    const geometry = new THREE.ExtrudeGeometry(ukraineShape, extrudeSettings);
    geometry.center();
    geometry.rotateX(-Math.PI / 2); // Lay flat on XZ plane

    // Premium Ceramic White/Light-Blue Material
    const topMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.35,
      metalness: 0.05,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      reflectivity: 0.5,
    });

    const sideMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.65,
      metalness: 0.1,
    });

    const materials = [topMaterial, sideMaterial];
    const mapMesh = new THREE.Mesh(geometry, materials);
    mapMesh.castShadow = true;
    mapMesh.receiveShadow = true;
    mapMesh.position.y = 0.5;
    mapGroup.add(mapMesh);

    // Soft Ambient Occlusion Shadow Plane beneath the map
    const shadowPlaneGeo = new THREE.PlaneGeometry(55, 38);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 120);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.25)');
      grad.addColorStop(0.5, 'rgba(59, 130, 246, 0.08)');
      grad.addColorStop(1, 'rgba(244, 247, 251, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowPlaneGeo, shadowMat);
    shadowMesh.rotateX(-Math.PI / 2);
    shadowMesh.position.y = -1.8;
    mapGroup.add(shadowMesh);

    // 4. Region Boundary Lines on Top Surface
    const borderPoints: [number, number, number][][] = [
      [[-4, 2.5, -3], [-4, 2.5, 3]],
      [[2, 2.5, -4], [2, 2.5, 4]],
      [[8, 2.5, -4], [8, 2.5, 3]],
      [[-10, 2.5, -1], [-10, 2.5, 3]],
      [[-12, 2.5, -2], [14, 2.5, -2]],
    ];

    borderPoints.forEach((ptsArray) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints(
        ptsArray.map(p => new THREE.Vector3(p[0], p[1], p[2]))
      );
      const lineMat = new THREE.LineDashedMaterial({
        color: 0xcbd5e1,
        dashSize: 0.8,
        gapSize: 0.4,
        linewidth: 1,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      line.computeLineDistances();
      mapGroup.add(line);
    });

    // 5. City Coordinates on 3D Map (X, Y=elevation, Z)
    const cityCoords: { [key: string]: THREE.Vector3 } = {
      kyiv: new THREE.Vector3(0.5, 2.6, -3.2),
      kharkiv: new THREE.Vector3(10.8, 2.6, -1.8),
      dnipro: new THREE.Vector3(8.5, 2.6, 2.4),
      odesa: new THREE.Vector3(-4.5, 2.6, 5.8),
      lviv: new THREE.Vector3(-13.5, 2.6, -1.2),
    };

    // 6. Glowing Radar Beacon Rings (Kyiv & Dnipro)
    const radarRings: { mesh: THREE.Mesh; speed: number; maxScale: number }[] = [];

    const createRadarRing = (pos: THREE.Vector3, color: number, maxScale: number, speed: number) => {
      const ringGeo = new THREE.RingGeometry(0.5, 0.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotateX(-Math.PI / 2);
      ringMesh.position.copy(pos);
      ringMesh.position.y += 0.05;
      mapGroup.add(ringMesh);
      radarRings.push({ mesh: ringMesh, speed, maxScale });
      return ringMesh;
    };

    // Kyiv Blue Beacons
    createRadarRing(cityCoords.kyiv, 0x3b82f6, 4.0, 0.035);
    createRadarRing(cityCoords.kyiv, 0x60a5fa, 6.5, 0.025);

    // Dnipro Red Alert Beacons (pulsing)
    createRadarRing(cityCoords.dnipro, 0xef4444, 5.0, 0.04);
    createRadarRing(cityCoords.dnipro, 0xf87171, 7.5, 0.03);

    // 7. 3D Trajectory Bezier Light Arcs (Kyiv -> Kharkiv, Kharkiv -> Dnipro, Dnipro -> Odesa)
    const createTrajectoryArc = (p1: THREE.Vector3, p2: THREE.Vector3, color: number) => {
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += 5.5; // Arched height in 3D space

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(50);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      const arcMat = new THREE.LineDashedMaterial({
        color,
        dashSize: 0.7,
        gapSize: 0.35,
        linewidth: 2,
        transparent: true,
        opacity: 0.85,
      });

      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcLine.computeLineDistances();
      mapGroup.add(arcLine);
      return arcLine;
    };

    const arc1 = createTrajectoryArc(cityCoords.kyiv, cityCoords.kharkiv, 0x3b82f6);
    const arc2 = createTrajectoryArc(cityCoords.kharkiv, cityCoords.dnipro, 0xf59e0b);
    const arc3 = createTrajectoryArc(cityCoords.dnipro, cityCoords.odesa, 0xef4444);
    const arc4 = createTrajectoryArc(cityCoords.kyiv, cityCoords.odesa, 0x60a5fa);

    // 8. Interactive Mouse Tilt & Parallax
    let targetRotX = -0.12;
    let targetRotY = 0.05;
    let currentRotX = -0.12;
    let currentRotY = 0.05;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.18 + 0.05;
      targetRotX = -y * 0.12 - 0.12;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // 9. Render Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera / map tilt
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;
      mapGroup.rotation.x = currentRotX;
      mapGroup.rotation.y = currentRotY;

      // Animate Radar Wave Rings
      radarRings.forEach((r, idx) => {
        const cycle = (elapsedTime * 1.2 + idx * 0.6) % 2.5;
        const progress = cycle / 2.5;
        const scale = 1 + progress * (r.maxScale - 1);
        r.mesh.scale.set(scale, scale, scale);
        (r.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.7 * (1 - progress));
      });

      // Subtle light oscillation
      redAlertLight.intensity = 2.8 + Math.sin(elapsedTime * 4.5) * 1.2;
      blueAccentLight.intensity = 2.2 + Math.cos(elapsedTime * 2.5) * 0.6;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      topMaterial.dispose();
      sideMaterial.dispose();
      shadowMat.dispose();
    };
  }, [variant]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* City Labels Overlay on Top of 3D Canvas */}
      {variant === 'hero' ? (
        <>
          {/* Kyiv Label */}
          <div 
            onClick={() => onSelectCity?.('kyiv')}
            className="absolute top-[32%] left-[47%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 cursor-pointer z-20 group hover:scale-110 transition-transform"
          >
            <div className="relative flex items-center justify-center w-5 h-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-600 border-2 border-white shadow-md" />
            </div>
            <span className="text-xs font-black text-slate-900 drop-shadow-xs group-hover:text-blue-600 transition-colors">
              Київ
            </span>
          </div>

          {/* Kharkiv Label */}
          <div 
            onClick={() => onSelectCity?.('kharkiv')}
            className="absolute top-[36%] left-[73%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 cursor-pointer z-20 group hover:scale-110 transition-transform"
          >
            <div className="relative flex items-center justify-center w-4 h-4">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white shadow-md" />
            </div>
            <span className="text-xs font-bold text-slate-800 drop-shadow-xs group-hover:text-blue-600 transition-colors">
              Харків
            </span>
          </div>

          {/* Dnipro Label (Active Threat Epicenter) */}
          <div 
            onClick={() => onSelectCity?.('dnipro')}
            className="absolute top-[55%] left-[67%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 cursor-pointer z-20 group hover:scale-110 transition-transform"
          >
            <div className="relative flex items-center justify-center w-6 h-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 border-2 border-white shadow-lg" />
            </div>
            <span className="text-xs font-black text-slate-900 drop-shadow-xs group-hover:text-rose-600 transition-colors">
              Дніпро
            </span>
          </div>

          {/* Odesa Label */}
          <div 
            onClick={() => onSelectCity?.('odesa')}
            className="absolute top-[68%] left-[44%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 cursor-pointer z-20 group hover:scale-110 transition-transform"
          >
            <div className="relative flex items-center justify-center w-4 h-4">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600 border-2 border-white shadow-md" />
            </div>
            <span className="text-xs font-bold text-slate-800 drop-shadow-xs group-hover:text-blue-600 transition-colors">
              Одеса
            </span>
          </div>
        </>
      ) : (
        /* Workspace variant overlay: Focused alert on Kyiv */
        <div className="absolute top-[38%] left-[48%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 cursor-pointer z-20">
          <div className="relative flex items-center justify-center w-7 h-7">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-70" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-md" />
          </div>
          <span className="text-xs font-black text-slate-900 drop-shadow-xs bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
            Київ
          </span>
        </div>
      )}
    </div>
  );
};
