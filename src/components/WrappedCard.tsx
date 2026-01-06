'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '../types';

interface WrappedCardProps {
  card: Card;
  userName: string;
  cardIndex: number;
  totalCards: number;
  progress: number;
}

const cardGradients = [
  'from-purple-600 to-pink-500',
  'from-cyan-500 to-blue-600',
  'from-green-500 to-teal-500',
  'from-orange-500 to-red-500',
  'from-violet-600 to-indigo-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-cyan-500',
];

function getGradient(index: number, card: Card): string {
  if (card.type === 'platform') {
    const platform = card.platform?.toLowerCase() || '';
    if (platform.includes('spotify')) return 'from-green-500 to-green-600';
    if (platform.includes('soundcloud')) return 'from-orange-500 to-orange-600';
    if (platform.includes('youtube')) return 'from-red-500 to-red-600';
    if (platform.includes('bandcamp')) return 'from-cyan-500 to-blue-500';
  }
  return cardGradients[index % cardGradients.length];
}

function getCardPercentage(card: Card): number | null {
  if (card.type === 'platform' && card.count && card.total_links) {
    return Math.min(100, Math.round(((card.count / card.total_links) * 100 + Number.EPSILON) * 10) / 10);
  }

  if ((card.type === 'stat' || card.type === 'intro') && card.subtitle) {
    const match = card.subtitle.match(/([0-9]+(?:\.[0-9]+)?)%/);
    if (match) {
      return Math.min(100, parseFloat(match[1]));
    }
  }

  return null;
}

function getPlayfulMessage(card: Card, percentage: number | null): string | null {
  if (percentage === null) return null;

  if (card.type === 'platform' && card.platform) {
    return `${percentage}% on ${card.platform}? That's like DJing a house party with one vinyl and still keeping the floor packed.`;
  }

  if (card.type === 'intro' || card.type === 'stat') {
    const statLabel = card.stat_label?.toLowerCase() ?? 'conversations';

    if (statLabel.includes('messages')) {
      return "That's more messages than Coco the gorilla could sign in a week!";
    }

    if (statLabel.includes('repl')) {
      return `${percentage}% of conversations kept going. What is the accuracy of the African Swallow Tail when hunting in the dark? About that.`;
    }

    if (statLabel.includes('reaction')) {
      return `${percentage}% of the vibes landed—practically a standing ovation from a group chat full of critics.`;
    }

    if (statLabel.includes('songs') || statLabel.includes('music')) {
      return `${percentage}% of the soundtrack? Somewhere a mixtape curator just tipped their hat.`;
    }
  }

  return `${percentage}% share—enough to convince a quiz show host you're the secret MVP.`;
}

function getGraphVariant(cardType: Card['type'], cardIndex: number): AnimatedCalloutGraphProps['variant'] {
  if (cardType === 'intro') return 'ring';
  if (cardType === 'platform') return cardIndex % 2 === 0 ? 'bar' : 'ring';
  return cardIndex % 2 === 0 ? 'ring' : 'bar';
}

interface AnimatedCalloutGraphProps {
  percentage: number;
  label: string;
  detail?: string;
  variant: 'ring' | 'bar';
}

function AnimatedCalloutGraph({ percentage, label, detail, variant }: AnimatedCalloutGraphProps) {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const radius = 56;
  const circumference = 2 * Math.PI * radius;

  const clampedPercent = Math.max(0, Math.min(percentage, 100));

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedPercent(clampedPercent), 120);

    return () => clearTimeout(timeout);
  }, [clampedPercent]);

  const strokeDashoffset = useMemo(
    () => circumference - (circumference * animatedPercent) / 100,
    [animatedPercent, circumference]
  );

  if (variant === 'ring') {
    return (
      <div className="callout-graph mt-6">
        <div className="relative flex items-center justify-center">
          <div className="callout-glow" aria-hidden />
          <svg
            className="callout-ring"
            width="150"
            height="150"
            viewBox="0 0 150 150"
          >
            <circle
              className="callout-ring-bg"
              cx="75"
              cy="75"
              r={radius}
              strokeWidth="14"
            />
            <circle
              className="callout-ring-progress"
              cx="75"
              cy="75"
              r={radius}
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute text-center">
            <div className="text-xl font-semibold">{animatedPercent.toFixed(1)}%</div>
            <div className="text-xs text-white/70">{label}</div>
          </div>
        </div>
        {detail && (
          <div className="mt-3 text-xs text-white/70 text-center">{detail}</div>
        )}
      </div>
    );
  }

  return (
    <div className="callout-graph mt-6 w-full max-w-md mx-auto">
      <div className="h-3 rounded-full bg-white/15 overflow-hidden ring-1 ring-white/20">
        <div
          className="h-full callout-bar"
          style={{ width: `${animatedPercent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-white/70 mt-2">
        <span>0%</span>
        <span className="font-semibold text-white">{clampedPercent}%</span>
      </div>
      <div className="mt-2 text-xs text-white/70 text-center">
        <div className="font-semibold text-white">{animatedPercent.toFixed(1)}%</div>
        <div>{label}</div>
      </div>
      {detail && (
        <div className="mt-2 text-xs text-white/70 text-center">{detail}</div>
      )}
    </div>
  );
}

export default function WrappedCard({ card, userName, cardIndex, totalCards, progress }: WrappedCardProps) {
  const gradient = getGradient(cardIndex, card);
  const percentage = getCardPercentage(card);
  const graphVariant = useMemo(() => getGraphVariant(card.type, cardIndex), [card.type, cardIndex]);
  const playfulMessage = useMemo(() => getPlayfulMessage(card, percentage), [card, percentage]);

  return (
    <div
      id={`card-${cardIndex}`}
      className={`min-h-[100dvh] w-full bg-gradient-to-br ${gradient} flex flex-col justify-between p-6 relative overflow-hidden`}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center flex-1">
        {/* Intro Card */}
        {card.type === 'intro' && (
          <div className="text-center animate-fade-in">
            <div className="text-xl mb-2 text-white/80">Hey {userName.split(' ')[0]}!</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-8">{card.title}</h1>
            <div className="stat-number animate-count-up">{card.stat?.toLocaleString()}</div>
            <div className="text-xl mt-2 text-white/90">{card.stat_label}</div>
            <div className="mt-6 text-white/70">{card.subtitle}</div>
            {percentage !== null && (
              <AnimatedCalloutGraph
                percentage={percentage}
                label="of all messages"
                detail="Your footprint in the conversation"
                variant={graphVariant}
              />
            )}
            {playfulMessage && (
              <div className="mt-3 text-sm text-white/80">{playfulMessage}</div>
            )}
            {card.rank && (
              <div className="mt-4">
                <span className="rank-badge">
                  #{card.rank} of {card.total_users} members
                </span>
              </div>
            )}
          </div>
        )}

        {/* Stat Card */}
        {card.type === 'stat' && (
          <div className="text-center animate-fade-in">
            <div className="card-emoji mb-4">{card.emoji}</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{card.title}</h2>
            <div className="stat-number animate-count-up delay-200" style={{ opacity: 0 }}>{card.stat?.toLocaleString()}</div>
            <div className="text-xl mt-2 text-white/90">{card.stat_label}</div>
            <div className="mt-6 text-white/70">{card.subtitle}</div>
            {percentage !== null && (
              <AnimatedCalloutGraph
                percentage={percentage}
                label="of the group"
                detail="Animated from 0 to your share"
                variant={graphVariant}
              />
            )}
            {playfulMessage && (
              <div className="mt-3 text-sm text-white/80 max-w-xl mx-auto">{playfulMessage}</div>
            )}
            {card.rank && card.rank <= 10 && (
              <div className="mt-4">
                <span className="rank-badge">
                  #{card.rank} in the group
                </span>
              </div>
            )}
          </div>
        )}

        {/* Platform Card */}
        {card.type === 'platform' && (
          <div className="text-center animate-fade-in">
            <div className="card-emoji mb-4">{card.emoji}</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{card.title}</h2>
            <div className="text-5xl md:text-7xl font-bold mb-2 animate-scale-in">
              {card.platform}
            </div>
            {card.count && card.total_links && (
              <div className="mt-6">
                <div className="text-2xl font-semibold">{card.count} links</div>
                <div className="text-white/70">
                  {Math.round((card.count / card.total_links) * 100)}% of your shares
                </div>
                {percentage !== null && (
                  <AnimatedCalloutGraph
                    percentage={percentage}
                    label={`${card.platform} love`}
                    detail="Your go-to platform share"
                    variant={graphVariant}
                  />
                )}
                {playfulMessage && (
                  <div className="mt-3 text-sm text-white/80 max-w-xl mx-auto">{playfulMessage}</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MVP Card */}
        {card.type === 'mvp' && (
          <div className="text-center animate-fade-in">
            <div className="card-emoji mb-4">{card.emoji}</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{card.title}</h2>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {card.years?.map((year, i) => (
                <div
                  key={year}
                  className="bg-white/20 px-6 py-3 rounded-full text-2xl font-bold animate-scale-in"
                  style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
                >
                  {year}
                </div>
              ))}
            </div>
            <div className="mt-6 text-white/70">{card.subtitle}</div>
          </div>
        )}

        {/* Timeline Card */}
        {card.type === 'timeline' && (
          <div className="text-center animate-fade-in">
            <div className="card-emoji mb-4">{card.emoji}</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{card.title}</h2>
            <div className="text-5xl md:text-6xl font-bold mb-2">
              {card.years_count} years
            </div>
            <div className="text-white/70 mb-8">
              of sharing music
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap max-w-xs mx-auto">
              {card.years?.map((year, i) => (
                <div key={year} className="flex items-center">
                  <div
                    className="timeline-dot animate-scale-in"
                    style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
                    title={year.toString()}
                  />
                  {i < (card.years?.length || 0) - 1 && (
                    <div className="timeline-line w-4" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-white/60">
              {card.first_year} → {card.last_year}
            </div>
          </div>
        )}

        {/* Leaderboard Highlight Card */}
        {card.type === 'leaderboard_highlight' && (
          <div className="text-center animate-fade-in">
            <div className="card-emoji mb-4">{card.emoji}</div>
            <div className="text-8xl md:text-9xl font-black mb-4 animate-scale-in">
              #{card.rank}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">{card.board_name}</h2>
            <div className="mt-4 text-white/70">
              {card.value?.toLocaleString()} total
            </div>
          </div>
        )}

        {/* Outro Card */}
        {card.type === 'outro' && (
          <div className="text-center animate-fade-in">
            <div className="card-emoji mb-4">{card.emoji}</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{card.title}</h2>
            <div className="text-xl text-white/80 mb-8">
              Here&apos;s to another year of great music
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-2xl font-bold">{card.messages}</div>
                <div className="text-xs text-white/70">messages</div>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-2xl font-bold">{card.links}</div>
                <div className="text-xs text-white/70">songs</div>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-2xl font-bold">{card.reactions}</div>
                <div className="text-xs text-white/70">reactions</div>
              </div>
            </div>
            <div className="mt-8 text-white/60 text-sm">
              Music Rec Wrapped 2025
            </div>
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="relative z-10 mt-4">
        <div className="flex gap-1">
          {Array.from({ length: totalCards }).map((_, i) => (
            <div
              key={i}
              className="relative flex-1 h-1 rounded-full bg-white/20 overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-white transition-[width] duration-200"
                style={{
                  width: `${Math.min(
                    1,
                    i < cardIndex ? 1 : i === cardIndex ? progress : 0
                  ) * 100}%`,
                }}
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-3 text-white/60 text-sm">
          {cardIndex + 1} / {totalCards}
        </div>
      </div>
    </div>
  );
}
