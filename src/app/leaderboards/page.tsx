import Link from 'next/link';
import data from '../../data.json';
import { LeaderboardEntry, Leaderboards, WrappedData } from '../../types';

const wrappedData = data as unknown as WrappedData;

type LeaderboardKey = keyof Leaderboards;

const leaderboardMeta: Record<LeaderboardKey, { title: string; description: string; gradient: string; metricLabel: string }> = {
  messages: {
    title: 'Messages sent',
    description: 'Who kept the conversation alive the most.',
    gradient: 'from-purple-500 to-indigo-600',
    metricLabel: 'messages',
  },
  music_links: {
    title: 'Music shared',
    description: 'Most songs linked in the chat.',
    gradient: 'from-pink-500 to-orange-500',
    metricLabel: 'songs',
  },
  reactions_received: {
    title: 'Reactions received',
    description: 'Most kudos, laughs, and hype from others.',
    gradient: 'from-emerald-500 to-cyan-500',
    metricLabel: 'reactions',
  },
  replies_received: {
    title: 'Replies received',
    description: 'Who sparked the longest threads.',
    gradient: 'from-blue-500 to-cyan-500',
    metricLabel: 'replies',
  },
  replies_sent: {
    title: 'Replies sent',
    description: 'The most responsive conversationalists.',
    gradient: 'from-amber-500 to-orange-500',
    metricLabel: 'replies',
  },
  longest_streak: {
    title: 'Longest streak',
    description: 'Most consecutive days of sharing.',
    gradient: 'from-rose-500 to-pink-600',
    metricLabel: 'days',
  },
  spotify: {
    title: 'Spotify shares',
    description: 'Top Spotify linkers.',
    gradient: 'from-green-500 to-green-700',
    metricLabel: 'links',
  },
  soundcloud: {
    title: 'SoundCloud shares',
    description: 'Most SoundCloud drops.',
    gradient: 'from-orange-500 to-amber-500',
    metricLabel: 'links',
  },
  youtube: {
    title: 'YouTube shares',
    description: 'Most YouTube embeds.',
    gradient: 'from-red-500 to-red-700',
    metricLabel: 'links',
  },
};

function LeaderboardList({ entries, metricLabel }: { entries: LeaderboardEntry[]; metricLabel: string }) {
  const maxValue = Math.max(...entries.map(([, value]) => value));

  return (
    <div className="space-y-3">
      {entries.map(([name, value, rank]) => {
        const percent = Math.round((value / maxValue) * 100);

        return (
          <div
            key={`${name}-${rank}`}
            className="glass rounded-xl px-4 py-3 bg-black/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center font-bold text-lg">
                {rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{name}</div>
                <div className="text-xs text-white/70 truncate capitalize">{metricLabel}</div>
              </div>
              <div className="text-right font-semibold text-white">
                {value.toLocaleString()}
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/15">
              <div
                className="h-full bg-gradient-to-r from-white to-white/70"
                style={{ width: `${percent}%` }}
                aria-hidden
              />
            </div>
            <div className="mt-1 flex justify-end text-[11px] text-white/60">
              <span>{percent}% of leader peak</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function LeaderboardsPage() {
  const leaderboards = wrappedData.leaderboards;

  return (
    <main className="min-h-screen p-4 pb-16">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col gap-4 animate-fade-in">
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <Link
              href="/"
              className="glass rounded-full px-4 py-2 inline-flex items-center gap-2 hover:bg-white/20 transition-colors"
            >
              ← Back home
            </Link>
            <span className="text-white/50">/</span>
            <span className="text-white font-semibold">Leaderboards</span>
          </div>
          <div className="glass rounded-2xl p-6 md:p-8">
            <p className="text-sm text-white/70 uppercase tracking-wide mb-2">Music Rec Wrapped</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">All leaderboards</h1>
            <p className="text-white/80 max-w-3xl">
              See how every member stacks up across messages, replies, reactions, and platform shares.
              Celebrate the MVPs—and maybe find your next friendly rival.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {(Object.keys(leaderboardMeta) as LeaderboardKey[]).map((key) => {
            const meta = leaderboardMeta[key];
            const entries = leaderboards[key];

            return (
              <section
                key={key}
                className={`rounded-2xl p-[1px] bg-gradient-to-br ${meta.gradient} animate-fade-in`}
                style={{ opacity: 0 }}
              >
                <div className="rounded-[1.4rem] bg-black/40 p-5 h-full flex flex-col gap-5">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold">{meta.title}</h2>
                    <p className="text-sm text-white/70">{meta.description}</p>
                  </div>
                  <LeaderboardList entries={entries} metricLabel={meta.metricLabel} />
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
