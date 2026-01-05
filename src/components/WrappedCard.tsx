'use client';

import { Card, Leaderboards, LeaderboardEntry } from '../types';

interface WrappedCardProps {
  card: Card;
  userName: string;
  cardIndex: number;
  totalCards: number;
  leaderboards: Leaderboards;
}

const leaderboardKeyMap: Record<string, keyof Leaderboards> = {
  'Most Messages': 'messages',
  'Music Curator': 'music_links',
  'Most Loved': 'reactions_received',
  'Reply Champion': 'replies_sent',
  'YouTube DJ': 'youtube',
};

const TOP_POSITIONS_COUNT = 3;

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

function getScoreboardEntries(card: Card, leaderboards: Leaderboards): LeaderboardEntry[] | undefined {
  if (card.type !== 'leaderboard_highlight' || !card.board_name) return undefined;

  const key = leaderboardKeyMap[card.board_name];
  if (!key) return undefined;

  return leaderboards[key];
}

export default function WrappedCard({ card, userName, cardIndex, totalCards, leaderboards }: WrappedCardProps) {
  const gradient = getGradient(cardIndex, card);
  const scoreboardEntries = getScoreboardEntries(card, leaderboards);

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
            {scoreboardEntries && (
              <div className="mt-8 space-y-4 text-left max-w-md mx-auto">
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/70">
                    Top {TOP_POSITIONS_COUNT} positions
                  </div>
                  <div className="mt-2 space-y-2">
                    {scoreboardEntries.slice(0, TOP_POSITIONS_COUNT).map(([name, value, rank]) => {
                      const isCurrentUser = name === userName;
                      return (
                        <div
                          key={`${name}-${rank}`}
                          className={`bg-white/15 rounded-xl px-4 py-3 flex items-center justify-between gap-3 ${isCurrentUser ? 'border-2 border-white/80 shadow-lg' : ''}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                              #{rank}
                            </div>
                            <div className="min-w-0">
                              <div className={`font-semibold truncate ${isCurrentUser ? 'text-white' : ''}`}>
                                {name}
                              </div>
                              <div className="text-sm text-white/80">{value.toLocaleString()} pts</div>
                            </div>
                          </div>
                          {isCurrentUser && (
                            <span className="text-xs px-2 py-1 rounded-full bg-white/25 font-semibold">You</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {scoreboardEntries.length > TOP_POSITIONS_COUNT && (
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-xs uppercase tracking-widest text-white/70 mb-2">Other users on the board</div>
                    <div className="space-y-1">
                      {scoreboardEntries.slice(TOP_POSITIONS_COUNT).map(([name, value, rank]) => {
                        const isCurrentUser = name === userName;
                        return (
                          <div
                            key={`${name}-${rank}`}
                            className={`flex items-center justify-between text-sm ${isCurrentUser ? 'font-semibold text-white' : 'text-white/90'}`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-7 text-white/70">#{rank}</span>
                              <span className="truncate">{name}</span>
                            </div>
                            <span className="text-white/80">{value.toLocaleString()} pts</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
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
