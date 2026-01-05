import { ImageResponse } from 'next/og';
import data from '../data.json';
import { WrappedData } from '../types';

const wrappedData = data as unknown as WrappedData;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function Image() {
  const { top_level: topLevel } = wrappedData;

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
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #06b6d4 100%)',
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
              'radial-gradient(1000px at 10% 20%, rgba(255,255,255,0.12), transparent), radial-gradient(800px at 80% 0%, rgba(255,255,255,0.1), transparent)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 28, opacity: 0.8 }}>Music Rec</div>
            <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05 }}>Wrapped 2025</div>
          </div>
          <div
            style={{
              padding: '10px 18px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.12)',
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            2016 – 2025
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            gap: 16,
          }}
        >
          {[
            { label: 'messages', value: topLevel.total_messages },
            { label: 'songs shared', value: topLevel.total_music_links },
            { label: 'reactions', value: topLevel.total_reactions },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: '20px 24px',
                borderRadius: 24,
                background: 'rgba(255,255,255,0.14)',
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                gap: 8,
                boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
              }}
            >
              <div style={{ fontSize: 46, fontWeight: 800 }}>{stat.value.toLocaleString()}</div>
              <div style={{ fontSize: 22, opacity: 0.8 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 24,
            opacity: 0.9,
          }}
        >
          <div>Celebrate nine years of music sharing.</div>
          <div style={{ fontWeight: 700 }}>music-rec-wrapped.vercel.app</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
