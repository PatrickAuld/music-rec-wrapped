'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Leaderboards, User } from '../types';
import WrappedCard from './WrappedCard';

interface WrappedViewerProps {
  user: User;
  userName: string;
  leaderboards: Leaderboards;
}

const AUTO_ADVANCE_MS = 30000; // 30 seconds

export default function WrappedViewer({ user, userName, leaderboards }: WrappedViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);

  const cards = user.cards;
  const totalCards = cards.length;

  const resetProgress = useCallback(() => {
    elapsedRef.current = 0;
    setProgress(0);
  }, []);

  const goToNext = useCallback(() => {
    resetProgress();
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  }, [resetProgress, totalCards]);

  const goToPrev = useCallback(() => {
    resetProgress();
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  }, [resetProgress, totalCards]);

  // Auto-advance timer & progress animation
  useEffect(() => {
    if (isPaused) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const startTime = performance.now() - elapsedRef.current;

    const tick = () => {
      const elapsed = performance.now() - startTime;
      elapsedRef.current = elapsed;

      const nextProgress = Math.min(elapsed / AUTO_ADVANCE_MS, 1);
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        goToNext();
        return;
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
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

    // Don't advance if clicking on buttons or links
    if ((e.target as HTMLElement).closest('button, a')) return;

    if (clickX > width * 0.6) {
      goToNext();
    } else if (clickX < width * 0.4) {
      goToPrev();
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
          leaderboards={leaderboards}
          cardIndex={currentIndex}
          totalCards={totalCards}
          progress={progress}
        />
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
