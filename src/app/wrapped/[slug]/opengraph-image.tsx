import { ImageResponse } from 'next/og';
import data from '../../../data.json';
import { WrappedData } from '../../../types';
import { slugify } from '../../../utils/slugify';

const wrappedData = data as unknown as WrappedData;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

const gradients = [
  ['#8b5cf6', '#ec4899'],
  ['#06b6d4', '#2563eb'],
  ['#22c55e', '#14b8a6'],
  ['#f97316', '#ef4444'],
  ['#a855f7', '#6366f1'],
  ['#f59e0b', '#f97316'],
  ['#ef4444', '#ec4899'],
  ['#10b981', '#06b6d4'],
];

function findUserBySlug(slug: string): { name: string; user: typeof wrappedData.users[string] } | null {
  for (const [name, user] of Object.entries(wrappedData.users)) {
    if (slugify(name) === slug) {
      return { name, user };
    }
  }
  return null;
}

function getCardStat(card: typeof wrappedData.users[string]['cards'][number]) {
  const numericValue =
    card.stat ??
    card.rank ??
    card.count ??
    card.value ??
    card.years_count ??
    card.messages ??
    card.links ??
    card.reactions ??
    card.total_links;

  const label =
    card.stat_label ??
    card.subtitle ??
    card.board_name ??
    (card.type === 'platform' ? card.platform : undefined);

  return { numericValue, label };
}

export default function Image({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { card?: string };
}) {
  const result = findUserBySlug(params.slug);

  if (!result) {
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          color: '#fff',
          fontSize: 48,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        Wrapped not found
      </div>,
      {
        ...size,
      }
    );
  }

  const { name, user } = result;
  const parsedCard = Number.parseInt(searchParams?.card ?? '', 10);
  const cardIndex = Number.isFinite(parsedCard)
    ? Math.min(user.cards.length - 1, Math.max(0, parsedCard - 1))
    : 0;
  const card = user.cards[cardIndex];
  const gradient = gradients[cardIndex % gradients.length];
  const { numericValue, label } = getCardStat(card);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          background: `linear-gradient(140deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
          color: '#fff',
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(900px at 20% 20%, rgba(255,255,255,0.14), transparent), radial-gradient(700px at 80% 0%, rgba(255,255,255,0.1), transparent)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 28, opacity: 0.85 }}>Music Rec</div>
            <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.05 }}>{name}&apos;s Wrapped</div>
            <div style={{ fontSize: 24, opacity: 0.85 }}>{card.title}</div>
          </div>
          <div
            style={{
              padding: '12px 18px',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.14)',
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            Card {cardIndex + 1} / {user.cards.length}
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            marginTop: 12,
            background: 'rgba(255,255,255,0.16)',
            borderRadius: 28,
            padding: '28px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            boxShadow: '0 30px 60px rgba(0,0,0,0.18)',
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background: 'rgba(255,255,255,0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
            }}
          >
            {card.emoji ?? '🎵'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {numericValue !== undefined && (
              <div style={{ fontSize: 54, fontWeight: 900, lineHeight: 1 }}>{numericValue.toLocaleString()}</div>
            )}
            {label && <div style={{ fontSize: 26, opacity: 0.85 }}>{label}</div>}
            {card.subtitle && (
              <div style={{ fontSize: 22, opacity: 0.75, maxWidth: 720, lineHeight: 1.3 }}>{card.subtitle}</div>
            )}
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 22,
            opacity: 0.92,
          }}
        >
          <div>
            {name} sent {user.messages.toLocaleString()} messages & shared {user.music_links.toLocaleString()} songs.
          </div>
          <div style={{ fontWeight: 700 }}>music-rec-wrapped.vercel.app</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
