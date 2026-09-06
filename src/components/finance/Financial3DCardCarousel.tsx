import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FinancialCardScene } from './FinancialCardScene';
import { CardPagination } from './CardPagination';
import { CardNavigation } from './CardNavigation';
import { FinancialDataSkeleton, FinancialDataBanner } from './FinancialDataState';
import { PartnerFinancialSummary, FinancialCardViewModel } from '../../types/finance';
import { 
  getPartnerFinancialSummary, 
  mapSummaryToViewModel, 
  DEFAULT_FINANCIAL_SUMMARY 
} from '../../services/financialService';

interface Financial3DCardCarouselProps {
  initialSummary?: PartnerFinancialSummary;
  onOpenPayout?: () => void;
  isPayoutModalOpen?: boolean;
  className?: string;
}

export const Financial3DCardCarousel: React.FC<Financial3DCardCarouselProps> = ({
  initialSummary,
  onOpenPayout,
  isPayoutModalOpen = false,
  className = '',
}) => {
  // Current active 3D card index: 0 (Balance), 1 (Earnings), 2 (Payout)
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Financial summary & loading state
  const [summary, setSummary] = useState<PartnerFinancialSummary>(
    initialSummary || DEFAULT_FINANCIAL_SUMMARY
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Autoplay pause controls
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isCooldown, setIsCooldown] = useState<boolean>(false);

  // Fetch real/ledger data on mount if not provided
  const loadData = useCallback(async () => {
    if (initialSummary) {
      setSummary(initialSummary);
      return;
    }
    setIsLoading(true);
    try {
      const data = await getPartnerFinancialSummary();
      setSummary(data);
    } catch {
      // Keep default with error status
      setSummary((prev) => ({ ...prev, status: 'ERROR' }));
    } finally {
      setIsLoading(false);
    }
  }, [initialSummary]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Transform to ViewModel
  const viewModel: FinancialCardViewModel = mapSummaryToViewModel(summary);

  // User manual interaction callback (delays auto-rotation)
  const handleUserInteraction = useCallback(() => {
    setIsCooldown(true);
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    userInteractionTimeoutRef.current = setTimeout(() => {
      setIsCooldown(false);
    }, 12000); // 12 seconds cooldown after manual swipe/drag
  }, []);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + 3) % 3);
    handleUserInteraction();
  }, [handleUserInteraction]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % 3);
    handleUserInteraction();
  }, [handleUserInteraction]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setActiveIndex(0);
        handleUserInteraction();
      } else if (e.key === 'End') {
        e.preventDefault();
        setActiveIndex(2);
        handleUserInteraction();
      }
    },
    [handlePrev, handleNext, handleUserInteraction]
  );

  // Autoplay Effect (6-8 seconds, automatically stops on conditions)
  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (
      isHovered ||
      isFocused ||
      isPayoutModalOpen ||
      isCooldown ||
      prefersReducedMotion ||
      isLoading ||
      summary.status === 'ERROR'
    ) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 7000); // 7 seconds per card

    return () => clearInterval(interval);
  }, [
    isHovered,
    isFocused,
    isPayoutModalOpen,
    isCooldown,
    isLoading,
    summary.status,
  ]);

  if (isLoading) {
    return <FinancialDataSkeleton />;
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`relative w-full outline-none focus:ring-1 focus:ring-cyan-500/30 rounded-3xl py-2 ${className}`}
      aria-label="3D Фінансові картки Dev20"
      role="region"
    >
      {/* Freshness / Status Warnings */}
      <FinancialDataBanner
        status={summary.status}
        onRetry={loadData}
      />

      {summary.status !== 'ERROR' ? (
        <div className="relative">
          {/* Dynamic 3D Stage Floor Lighting Glow */}
          <div 
            className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 max-w-2xl h-16 rounded-full blur-2xl pointer-events-none transition-all duration-700 ${
              activeIndex === 0
                ? 'bg-cyan-500/25'
                : activeIndex === 1
                ? 'bg-amber-500/25'
                : 'bg-emerald-500/25'
            }`} 
          />

          {/* Main 3D Perspective Card Scene */}
          <FinancialCardScene
            data={viewModel}
            activeIndex={activeIndex}
            onSelectIndex={(idx) => {
              setActiveIndex(idx);
              handleUserInteraction();
            }}
            onOpenPayout={onOpenPayout}
            onUserInteraction={handleUserInteraction}
          />

          {/* Desktop Navigation Arrows (← / →) */}
          <CardNavigation
            onPrev={handlePrev}
            onNext={handleNext}
          />

          {/* Tactical Quick-Selector Dock & Pagination Dots */}
          <CardPagination
            total={3}
            activeIndex={activeIndex}
            balanceTotal={viewModel.balance.total}
            monthlyEarnings={viewModel.earnings.thisMonth}
            availablePayout={viewModel.payout.available}
            onChange={(idx) => {
              setActiveIndex(idx);
              handleUserInteraction();
            }}
          />
        </div>
      ) : (
        <FinancialDataBanner
          status="ERROR"
          onRetry={loadData}
        />
      )}
    </div>
  );
};
