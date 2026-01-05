'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { User } from '../types';
import WrappedCard from './WrappedCard';
import html2canvas from 'html2canvas';

interface WrappedViewerProps {
  user: User;
  userName: string;
  initialCardIndex?: number;
}

const AUTO_ADVANCE_MS = 30000; // 30 seconds

export default function WrappedViewer({ user, userName, initialCardIndex = 0 }: WrappedViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(() => Math.min(Math.max(initialCardIndex, 0), user.cards.length - 1));
  const [isPaused, setIsPaused] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cards = user.cards;
  const totalCards = cards.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  }, [totalCards]);

  // Ensure the URL stays in sync without triggering a navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const desiredCard = (currentIndex + 1).toString();
    const url = new URL(window.location.href);

    if (url.searchParams.get('card') === desiredCard) return;

    url.searchParams.set('card', desiredCard);
    window.history.replaceState(null, '', url.toString());
  }, [currentIndex]);

  const getShareUrl = useCallback(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('card', (currentIndex + 1).toString());
    return url.toString();
  }, [currentIndex]);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setTimeout(goToNext, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPaused, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Touch/swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Only register horizontal swipes (ignore vertical scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Click to advance (on mobile, tap right side to advance, left to go back)
  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    // Don't advance if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) return;

    if (clickX > width * 0.6) {
      goToNext();
    } else if (clickX < width * 0.4) {
      goToPrev();
    }
  };

  // Share functionality
  const handleShare = async () => {
    setIsSharing(true);
    setIsPaused(true);
    const shareUrl = getShareUrl();

    try {
      const cardElement = document.getElementById(`card-${currentIndex}`);
      if (!cardElement) return;

      const canvas = await html2canvas(cardElement, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png', 1.0);
      });

      const file = new File([blob], `music-rec-wrapped-${userName.replace(/\s+/g, '-')}.png`, {
        type: 'image/png',
      });

      if (navigator.share) {
        const shareData: ShareData = {
          title: 'Music Rec Wrapped',
          text: `Check out my Music Rec Wrapped (card ${currentIndex + 1}/${totalCards})!`,
          url: shareUrl,
        };

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }

        await navigator.share(shareData);
      } else {
        // Fallback: download the image and copy the link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        try {
          await navigator.clipboard?.writeText(shareUrl);
        } catch (error) {
          console.warn('Could not copy link to clipboard', error);
        }
      }
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsSharing(false);
      setIsPaused(false);
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Current card */}
      <div className="h-full">
        <WrappedCard
          key={currentIndex}
          card={cards[currentIndex]}
          userName={userName}
          cardIndex={currentIndex}
          totalCards={totalCards}
        />
      </div>

      {/* Navigation controls */}
      <div className="fixed bottom-24 left-0 right-0 flex justify-center gap-4 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          disabled={isSharing}
          className="share-btn bg-white/20 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2 font-medium"
        >
          {isSharing ? (
            <>
              <span className="animate-spin">⏳</span>
              Preparing...
            </>
          ) : (
            <>
              <span>📤</span>
              Share
            </>
          )}
        </button>
      </div>

      {/* Pause/play indicator */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsPaused(!isPaused);
        }}
        className="fixed top-4 right-4 z-20 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
      >
        {isPaused ? '▶️' : '⏸️'}
      </button>

      {/* Home button */}
      <Link
        href="/"
        onClick={(e) => e.stopPropagation()}
        className="fixed top-4 left-4 z-20 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-xl"
        aria-label="Back to Music Rec Wrapped"
      >
        ←
      </Link>

      {/* Swipe hint (only on first card) */}
      {currentIndex === 0 && (
        <div className="swipe-hint fixed bottom-8 left-0 right-0 text-center text-white/50 text-sm">
          Swipe or tap to navigate
        </div>
      )}
    </div>
  );
}
