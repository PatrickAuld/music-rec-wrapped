'use client';

import { Card } from '../types';

interface WrappedCardProps {
  card: Card;
  userName: string;
  cardIndex: number;
  totalCards: number;
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

function getRankSuffix(rank: number): string {
  if (rank === 1) return 'st';
  if (rank === 2) return 'nd';
  if (rank === 3) return 'rd';
  return 'th';
}

export default function WrappedCard({ card, userName, cardIndex, totalCards }: WrappedCardProps) {
  const gradient = getGradient(cardIndex, card);

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
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                i <= cardIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
        <div className="text-center mt-3 text-white/60 text-sm">
          {cardIndex + 1} / {totalCards}
        </div>
      </div>
    </div>
  );
}
