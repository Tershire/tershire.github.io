import { useState, useMemo } from 'react';
import type { Hobby } from '../data/hobbies';
import { TYPE_LABELS } from '../data/hobbies';

const NC = { bg: 'rgba(79,124,172,0.12)', text: '#4f7cac' };
const TYPE_COLORS: Record<Hobby['type'], { bg: string; text: string }> = {
  tech:          NC,
  physical:      NC,
  art:           NC,
  game:          NC,
  unclassified:  NC,
};

const MIN_YEAR = 2010;
const MAX_YEAR = new Date().getFullYear();

export default function HobbiesGrid({ hobbies }: { hobbies: Hobby[] }) {
  const [selectedTypes, setSelectedTypes] = useState<Set<Hobby['type']>>(new Set());
  const [yearRange, setYearRange] = useState<[number, number]>([MIN_YEAR, MAX_YEAR]);
  const [search, setSearch] = useState('');

  const allTypes = useMemo(() => {
    const s = new Set<Hobby['type']>();
    hobbies.forEach(h => s.add(h.type));
    return Array.from(s);
  }, [hobbies]);

  const toggleType = (t: Hobby['type']) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  const filtered = useMemo(() => hobbies.filter(h => {
    if (selectedTypes.size > 0 && !selectedTypes.has(h.type)) return false;
    const end = h.endYear ?? MAX_YEAR;
    if (end < yearRange[0] || h.startYear > yearRange[1]) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!h.name.toLowerCase().includes(q) && !h.description.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [hobbies, selectedTypes, yearRange, search]);

  const years = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);
  const leftZ = yearRange[0] >= yearRange[1] ? 1 : 2;
  const rightZ = yearRange[0] >= yearRange[1] ? 2 : 1;

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <svg style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search hobbies..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem', border: '1px solid var(--color-border)', borderRadius: '0.75rem', fontSize: '0.9375rem', outline: 'none', background: 'var(--color-card)', color: 'var(--color-text)' }} />
        </div>
      </div>

      {/* Type filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', alignSelf: 'center', marginRight: '0.25rem' }}>Type:</span>
        {allTypes.map(type => {
          const active = selectedTypes.has(type);
          const col = TYPE_COLORS[type];
          return (
            <button key={type} onClick={() => toggleType(type)}
              style={{ padding: '0.3rem 0.875rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 500, border: `2px solid ${active ? col.text : 'transparent'}`, background: active ? col.bg : 'var(--color-code-bg)', color: active ? col.text : 'var(--color-text-muted)', cursor: 'pointer', transition: 'all 0.15s' }}>
              {TYPE_LABELS[type]}
            </button>
          );
        })}
        {selectedTypes.size > 0 && (
          <button onClick={() => setSelectedTypes(new Set())} style={{ padding: '0.3rem 0.875rem', borderRadius: '9999px', fontSize: '0.8125rem', color: '#ef4444', background: 'rgba(254,226,226,0.5)', border: 'none', cursor: 'pointer' }}>Clear</button>
        )}
      </div>

      {/* Timeline */}
      <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>Timeline</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{yearRange[0]} – {yearRange[1] === MAX_YEAR ? 'Present' : yearRange[1]}</span>
        </div>
        <div style={{ paddingBottom: '1.5rem' }}>
          <div style={{ position: 'relative', height: '18px', marginBottom: '0.75rem' }}>
            <div style={{ position: 'absolute', top: '6px', left: 0, right: 0, height: '6px', background: 'var(--color-code-bg)', borderRadius: '9999px', pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: 0, height: '100%', left: `${((yearRange[0]-MIN_YEAR)/(MAX_YEAR-MIN_YEAR))*100}%`, right: `${((MAX_YEAR-yearRange[1])/(MAX_YEAR-MIN_YEAR))*100}%`, background: 'linear-gradient(90deg,var(--color-accent),var(--color-accent-light))', borderRadius: '9999px' }} />
            </div>
            <input type="range" min={MIN_YEAR} max={MAX_YEAR} value={yearRange[0]} onChange={e => { const v=parseInt(e.target.value); if(v<=yearRange[1]) setYearRange([v,yearRange[1]]); }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', appearance: 'none', background: 'transparent', cursor: 'pointer', zIndex: leftZ, margin: 0, padding: 0 }} className="range-slider" />
            <input type="range" min={MIN_YEAR} max={MAX_YEAR} value={yearRange[1]} onChange={e => { const v=parseInt(e.target.value); if(v>=yearRange[0]) setYearRange([yearRange[0],v]); }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', appearance: 'none', background: 'transparent', cursor: 'pointer', zIndex: rightZ, margin: 0, padding: 0 }} className="range-slider" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {years.filter((_, i) => i % 3 === 0 || _ === MAX_YEAR).map(y => <span key={y} style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{y}</span>)}
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Showing <strong style={{ color: 'var(--color-text)' }}>{filtered.length}</strong> of {hobbies.length} hobbies
      </p>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
          <p>No hobbies match your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}>
          {filtered.map(h => <HobbyCard key={h.slug} hobby={h} />)}
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

function HobbyCard({ hobby }: { hobby: Hobby }) {
  const [hovered, setHovered] = useState(false);
  const col = TYPE_COLORS[hobby.type];
  const Wrapper = hobby.hasDetail ? 'a' : 'div';

  return (
    <Wrapper
      {...(hobby.hasDetail ? { href: `/hobbies/${hobby.slug}` } : {})}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column',
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '1.25rem', overflow: 'hidden',
        textDecoration: 'none',
        transition: 'box-shadow 0.2s, transform 0.2s',
        boxShadow: hovered && hobby.hasDetail ? '0 8px 24px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.06)',
        transform: hovered && hobby.hasDetail ? 'translateY(-3px)' : 'none',
        cursor: hobby.hasDetail ? 'pointer' : 'default',
      }}
    >
      {/* Image / color header */}
      <div style={{ height: hobby.image ? '160px' : '90px', background: hobby.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
        {hobby.image
          ? <img src={hobby.image} alt={hobby.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: hobby.imagePosition ?? 'center' }} />
          : hobby.emoji
        }
      </div>

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: 0, color: hobby.accent }}>{hobby.name}</h2>
          {hobby.hasDetail && (
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: hobby.accent, opacity: 0.6, flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.65, margin: '0 0 1rem', flex: 1 }}>{hobby.description}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.875rem' }}>
          {hobby.highlights.map(h => (
            <span key={h} style={{ padding: '0.15rem 0.625rem', background: hobby.color, color: hobby.accent, borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 500 }}>{h}</span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
          <span style={{ background: col.bg, color: col.text, padding: '0.15rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 500 }}>
            {TYPE_LABELS[hobby.type]}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {hobby.startYear}–{hobby.endYear ?? 'Now'}
          </span>
        </div>
      </div>
    </Wrapper>
  );
}
