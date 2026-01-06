export interface Card {
  type: 'intro' | 'stat' | 'platform' | 'mvp' | 'timeline' | 'leaderboard_highlight' | 'outro';
  title: string;
  stat?: number;
  stat_label?: string;
  subtitle?: string;
  rank?: number;
  total_users?: number;
  emoji?: string;
  platform?: string;
  count?: number;
  total_links?: number;
  years?: number[];
  years_count?: number;
  first_year?: number;
  last_year?: number;
  value?: number;
  board_name?: string;
  messages?: number;
  links?: number;
  reactions?: number;
}

export interface User {
  messages: number;
  music_links: number;
  reactions_received: number;
  replies_sent: number;
  replies_received: number;
  longest_streak: number;
  links_by_platform: Record<string, number>;
  messages_by_year: Record<string, number>;
  pct_messages: number;
  pct_links: number;
  pct_reactions: number;
  pct_replies: number;
  cards: Card[];
}

export interface TopLevel {
  total_messages: number;
  total_music_links: number;
  unique_music_links: number;
  total_reactions: number;
  total_replies: number;
  messages_by_year: Record<string, number>;
  most_active_month: (string | number)[];
  most_active_day: (string | number)[];
  busiest_hour: number[];
  busiest_dow: (string | number)[];
  longest_streak: number;
  reaction_breakdown: Record<string, number>;
}

export type LeaderboardEntry = [string, number, number]; // [user name, value, rank]

export interface Leaderboards {
  messages: LeaderboardEntry[];
  music_links: LeaderboardEntry[];
  reactions_received: LeaderboardEntry[];
  replies_received: LeaderboardEntry[];
  replies_sent: LeaderboardEntry[];
  longest_streak: LeaderboardEntry[];
  spotify: LeaderboardEntry[];
  soundcloud: LeaderboardEntry[];
  youtube: LeaderboardEntry[];
}

export type LeaderboardKey = keyof Leaderboards;

export interface WrappedData {
  top_level: TopLevel;
  leaderboards: Leaderboards;
  yearly_mvps: Record<string, (string | number)[]>;
  users: Record<string, User>;
}
