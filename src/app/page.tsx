'use client';

import Link from 'next/link';
import { useMemo, useState, type FormEvent } from 'react';
import data from '../data.json';
import { WrappedData } from '../types';

const wrappedData = data as unknown as WrappedData;

const gradients = [
  'from-purple-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-green-400 to-cyan-500',
  'from-pink-500 to-orange-400',
  'from-violet-500 to-purple-500',
  'from-amber-400 to-orange-500',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('wrapped-access-granted') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordInput === 'HearThat?') {
      setIsUnlocked(true);
      setHasError(false);
      localStorage.setItem('wrapped-access-granted', 'true');
    } else {
      setHasError(true);
    }
  };

  const users = useMemo(() => (
    Object.entries(wrappedData.users)
      .sort((a, b) => b[1].messages - a[1].messages)
  ), []);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;
    return users.filter(([name]) => name.toLowerCase().includes(query));
  }, [searchQuery, users]);

  const topLevel = wrappedData.top_level;

  if (!isUnlocked) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="glass max-w-md w-full rounded-2xl p-8 text-center animate-fade-in" style={{ opacity: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Music Rec Wrapped</h1>
          <p className="text-gray-300 mb-6">Enter the password to view the page.</p>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm text-gray-300">Password</label>
              <input
                id="password"
                type="password"
                className="w-full glass rounded-xl px-4 py-3 bg-white/5 focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={passwordInput}
                onChange={(event) => setPasswordInput(event.target.value)}
                autoComplete="off"
                required
              />
              {hasError && (
                <p className="text-sm text-rose-300">Incorrect password. Please try again.</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-[1.01] transition-transform"
            >
              Unlock
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 pb-20">
      {/* Header */}
      <div className="text-center py-8 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold mb-2">
          Music Rec
        </h1>
        <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Wrapped
        </p>
        <p className="text-gray-400 mt-4">
          2016 - 2025 &bull; {topLevel.total_messages.toLocaleString()} messages
        </p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-8 animate-fade-in delay-200" style={{ opacity: 0 }}>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold">{topLevel.total_music_links.toLocaleString()}</div>
          <div className="text-sm text-gray-300">songs shared</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold">{topLevel.total_reactions.toLocaleString()}</div>
          <div className="text-sm text-gray-300">reactions</div>
        </div>
      </div>

      {/* User list */}
      <div className="max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">
          Choose your Wrapped
        </h2>
        <div className="mb-4">
          <label htmlFor="user-search" className="sr-only">Search users</label>
          <div className="glass rounded-xl flex items-center px-3 py-2 gap-2">
            <input
              id="user-search"
              type="search"
              placeholder="Search users..."
              className="w-full bg-transparent focus:outline-none text-sm placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="text-gray-400 text-xs hover:text-white transition-colors"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-6 glass rounded-2xl">
              No users found. Try a different name.
            </div>
          ) : (
            filteredUsers.map(([name, user], index) => (
              <Link
                key={name}
                href={`/wrapped/${slugify(name)}`}
                className="block animate-fade-in"
                style={{
                  opacity: 0,
                  animationDelay: `${0.3 + index * 0.05}s`
                }}
              >
                <div className={`user-card rounded-2xl p-4 bg-gradient-to-r ${gradients[index % gradients.length]} flex items-center gap-4`}>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                    {getInitials(name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{name}</div>
                    <div className="text-sm text-white/80">
                      {user.messages} messages &bull; {user.music_links} songs
                    </div>
                  </div>
                  <div className="text-2xl">→</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-500 text-sm">
        Music Rec Wrapped 2025
      </div>
    </main>
  );
}
