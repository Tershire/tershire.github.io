import { useState, useMemo } from 'react';

export interface MusicReview {
  slug: string;
  title: string;
  artist: string;
  type: 'album' | 'EP' | 'single' | 'track' | 'compilation';
  releaseDate: string;
  country: string;
  countryCode: string;
  flag: string;
  description?: string;
  rating?: number;
  tags: string[];
  color?: string;
  accent?: string;
}

const TYPE_LABELS: Record<MusicReview['type'], string> = {
  album: 'Album',
  EP: 'EP',
  single: 'Single',
  track: 'Track',
  compilation: 'Compilation',
};

const TYPE_COLORS: Record<MusicReview['type'], { bg: string; text: string }> = {
  album:       { bg: 'rgba(219,234,254,0.7)', text: '#1d4ed8' },
  EP:          { bg: 'rgba(209,250,229,0.7)', text: '#059669' },
  single:      { bg: 'rgba(254,243,199,0.7)', text: '#d97706' },
  track:       { bg: 'rgba(243,232,255,0.7)', text: '#7c3aed' },
  compilation: { bg: 'rgba(243,244,246,0.7)', text: '#4b5563' },
};

function releaseYear(r: MusicReview) {
  return new Date(r.releaseDate).getFullYear();
}

function RatingDots({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ fontSize: '0.5rem', color: i < rating ? 'var(--color-accent)' : 'var(--color-border)' }}>●</span>
      ))}
    </span>
  );
}

export default function MusicReviewsGrid({ reviews }: { reviews: MusicReview[] }) {
  const [yearRange, setYearRange] = useState<[number, number]>(() => {
    const years = reviews.map(releaseYear);
    return years.length > 0 ? [Math.min(...years), Math.max(...years)] : [2000, new Date().getFullYear()];
  });

  const minYear = useMemo(() => {
    const years = reviews.map(releaseYear);
    return years.length > 0 ? Math.min(...years) : 2000;
  }, [reviews]);

  const maxYear = useMemo(() => {
    const years = reviews.map(releaseYear);
    return years.length > 0 ? Math.max(...years) : new Date().getFullYear();
  }, [reviews]);

  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<MusicReview['type']>>(new Set());
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set());

  const allTypes = useMemo(() => {
    const s = new Set<MusicReview['type']>();
    reviews.forEach(r => s.add(r.type));
    return Array.from(s);
  }, [reviews]);

  const toggleType = (t: MusicReview['type']) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  const toggleCountry = (code: string) => {
    setSelectedCountries(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  const filtered = useMemo(() => reviews.filter(r => {
    const yr = releaseYear(r);
    if (yr < yearRange[0] || yr > yearRange[1]) return false;
    if (selectedTypes.size > 0 && !selectedTypes.has(r.type)) return false;
    if (selectedCountries.size > 0 && !selectedCountries.has(r.countryCode)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.title.toLowerCase().includes(q) && !r.artist.toLowerCase().includes(q) && !r.tags.some(t => t.toLowerCase().includes(q))) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.releaseDate).valueOf() - new Date(a.releaseDate).valueOf()), [reviews, yearRange, selectedTypes, selectedCountries, search]);

  const countryStats = useMemo(() => {
    const counts: Record<string, { country: string; flag: string; countryCode: string; count: number }> = {};
    reviews.forEach(r => {
      if (!counts[r.countryCode]) counts[r.countryCode] = { country: r.country, flag: r.flag, countryCode: r.countryCode, count: 0 };
      counts[r.countryCode].count++;
    });
    return Object.values(counts).sort((a, b) => b.count - a.count);
  }, [reviews]);

  const maxCount = countryStats.length > 0 ? countryStats[0].count : 1;

  const years = useMemo(
    () => Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i),
    [minYear, maxYear]
  );

  const leftZ = yearRange[0] >= yearRange[1] ? 1 : 2;
  const rightZ = yearRange[0] >= yearRange[1] ? 2 : 1;

  return (
    <div>
      {/* Search + type filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '400px' }}>
          <svg style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search reviews..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.375rem', border: '1px solid var(--color-border)', borderRadius: '0.75rem', fontSize: '0.875rem', outline: 'none', background: 'var(--color-card)', color: 'var(--color-text)' }} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Type:</span>
          {allTypes.map(type => {
            const active = selectedTypes.has(type);
            const col = TYPE_COLORS[type];
            return (
              <button key={type} onClick={() => toggleType(type)}
                style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 500, border: `2px solid ${active ? col.text : 'transparent'}`, background: active ? col.bg : 'var(--color-code-bg)', color: active ? col.text : 'var(--color-text-muted)', cursor: 'pointer', transition: 'all 0.15s' }}>
                {TYPE_LABELS[type]}
              </button>
            );
          })}
          {selectedTypes.size > 0 && (
            <button onClick={() => setSelectedTypes(new Set())} style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8125rem', color: '#ef4444', background: 'rgba(254,226,226,0.5)', border: 'none', cursor: 'pointer' }}>Clear</button>
          )}
        </div>
      </div>

      {/* Country distribution */}
      {countryStats.length > 0 && (
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', margin: '0 0 0.75rem' }}>By Country</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {countryStats.map(stat => {
              const intensity = stat.count / maxCount;
              const isSelected = selectedCountries.has(stat.countryCode);
              return (
                <button
                  key={stat.countryCode}
                  onClick={() => toggleCountry(stat.countryCode)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 500,
                    background: isSelected
                      ? `rgba(79,124,172,${0.2 + intensity * 0.5})`
                      : `rgba(79,124,172,${0.06 + intensity * 0.18})`,
                    border: `2px solid ${isSelected ? 'var(--color-accent)' : 'transparent'}`,
                    color: isSelected ? 'var(--color-accent)' : 'var(--color-text)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <span>{stat.flag}</span>
                  <span>{stat.country}</span>
                  <span style={{ fontSize: '0.6875rem', opacity: 0.65 }}>({stat.count})</span>
                </button>
              );
            })}
            {selectedCountries.size > 0 && (
              <button onClick={() => setSelectedCountries(new Set())} style={{ padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.8125rem', color: '#ef4444', background: 'rgba(254,226,226,0.5)', border: 'none', cursor: 'pointer' }}>Clear</button>
            )}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>Release Year</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            {yearRange[0]}{yearRange[0] !== yearRange[1] ? ` – ${yearRange[1]}` : ''}
          </span>
        </div>
        <div style={{ paddingBottom: '1rem' }}>
          <div style={{ position: 'relative', height: '18px', marginBottom: '0.75rem' }}>
            <div style={{ position: 'absolute', top: '6px', left: 0, right: 0, height: '6px', background: 'var(--color-code-bg)', borderRadius: '9999px', pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: 0, height: '100%', left: `${((yearRange[0]-minYear)/Math.max(maxYear-minYear,1))*100}%`, right: `${((maxYear-yearRange[1])/Math.max(maxYear-minYear,1))*100}%`, background: 'linear-gradient(90deg,var(--color-accent),var(--color-accent-light))', borderRadius: '9999px' }} />
            </div>
            <input type="range" min={minYear} max={maxYear} value={yearRange[0]} onChange={e => { const v=parseInt(e.target.value); if(v<=yearRange[1]) setYearRange([v,yearRange[1]]); }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', appearance: 'none', background: 'transparent', cursor: 'pointer', zIndex: leftZ, margin: 0, padding: 0 }} className="range-slider" />
            <input type="range" min={minYear} max={maxYear} value={yearRange[1]} onChange={e => { const v=parseInt(e.target.value); if(v>=yearRange[0]) setYearRange([yearRange[0],v]); }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', appearance: 'none', background: 'transparent', cursor: 'pointer', zIndex: rightZ, margin: 0, padding: 0 }} className="range-slider" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {years.filter((_, i) => i % Math.max(1, Math.floor(years.length / 8)) === 0 || _ === maxYear).map(y =>
              <span key={y} style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{y}</span>
            )}
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Showing <strong style={{ color: 'var(--color-text)' }}>{filtered.length}</strong> of {reviews.length} reviews
      </p>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
          <p>No reviews match your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '680px' }}>
          {filtered.map(r => <ReviewCard key={r.slug} review={r} />)}
        </div>
      )}

      <style>{`
        .range-slider { pointer-events: none; }
        .range-slider::-webkit-slider-thumb { appearance:none;width:18px;height:18px;border-radius:50%;background:var(--color-card);border:2px solid var(--color-accent);box-shadow:0 1px 4px rgba(0,0,0,0.2);cursor:pointer;pointer-events:all; }
        .range-slider::-moz-range-thumb { width:18px;height:18px;border-radius:50%;background:var(--color-card);border:2px solid var(--color-accent);cursor:pointer;pointer-events:all; }
      `}</style>
    </div>
  );
}

function ReviewCard({ review: r }: { review: MusicReview }) {
  const [hovered, setHovered] = useState(false);
  const col = TYPE_COLORS[r.type];
  const yr = releaseYear(r);

  return (
    <a
      href={`/interests/music/${r.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', textDecoration: 'none',
        background: 'var(--color-card)', border: '1px solid var(--color-border)',
        borderRadius: '1rem', padding: '1.5rem',
        transition: 'box-shadow 0.2s, transform 0.2s',
        boxShadow: hovered ? '0 6px 20px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ background: col.bg, color: col.text, padding: '0.1rem 0.5rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600 }}>{TYPE_LABELS[r.type]}</span>
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{r.flag} {r.country} · {yr}</span>
        {r.rating != null && <RatingDots rating={r.rating} />}
      </div>

      {/* Title + artist */}
      <h3 style={{ margin: '0 0 0.1875rem', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3 }}>{r.title}</h3>
      <p style={{ margin: '0 0 0.625rem', fontSize: '0.9375rem', fontWeight: 500, color: r.accent ?? 'var(--color-accent)' }}>{r.artist}</p>

      {/* Description */}
      {r.description && (
        <p style={{ margin: '0 0 0.875rem', fontSize: '0.9375rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{r.description}</p>
      )}

      {/* Tags + arrow */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {r.tags.map(t => (
            <span key={t} style={{ padding: '0.15rem 0.5rem', background: 'var(--color-code-bg)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', borderRadius: '9999px', fontSize: '0.6875rem' }}>{t}</span>
          ))}
        </div>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0, color: 'var(--color-text-muted)', opacity: hovered ? 1 : 0.5, transition: 'opacity 0.15s' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}
