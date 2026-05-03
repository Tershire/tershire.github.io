import { useRef, useState } from 'react';
import type { Artist } from '../data/music';

export default function ArtistsCarousel({ artists }: { artists: Artist[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -244 : 244, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        style={{ position: 'absolute', left: '-1.125rem', top: '50%', transform: 'translateY(-50%)', zIndex: 2, width: '2rem', height: '2rem', borderRadius: '50%', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.15s' }}
      >
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        style={{ display: 'flex', gap: '1rem', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', paddingBottom: '4px', paddingLeft: '2px', paddingRight: '2px' }}
      >
        {artists.map(a => <ArtistTile key={a.slug} artist={a} />)}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        style={{ position: 'absolute', right: '-1.125rem', top: '50%', transform: 'translateY(-50%)', zIndex: 2, width: '2rem', height: '2rem', borderRadius: '50%', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.15s' }}
      >
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <style>{`.artist-scroll::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}

function ArtistTile({ artist }: { artist: Artist }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: '220px',
        scrollSnapAlign: 'start',
        background: 'var(--color-card)',
        border: `1px solid ${hovered ? artist.accent + '55' : 'var(--color-border)'}`,
        borderRadius: '1.25rem',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s',
        boxShadow: hovered ? `0 8px 24px ${artist.accent}22` : '0 1px 4px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'none',
      }}
    >
      {/* Image header — photo if set, colored placeholder if not */}
      <div style={{ height: '120px', background: artist.color, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
        {artist.image ? (
          <img
            src={artist.image}
            alt={artist.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transition: 'transform 0.3s', transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke={artist.accent} strokeWidth={1.25} style={{ opacity: 0.45 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1rem' }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: artist.accent, margin: '0 0 0.25rem' }}>{artist.genre}</p>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 0.1875rem', lineHeight: 1.2 }}>{artist.name}</h3>
        <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', margin: '0 0 0.375rem' }}>{artist.flag} {artist.country}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0 0 0.875rem', lineHeight: 1.5 }}>{artist.description}</p>

        {/* Key works */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {artist.keyWorks.map(w => (
            <span
              key={w}
              style={{ fontSize: '0.6875rem', padding: '0.15rem 0.5rem', background: artist.color, color: artist.accent, borderRadius: '9999px', display: 'inline-block', width: 'fit-content', fontWeight: 500 }}
            >
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
