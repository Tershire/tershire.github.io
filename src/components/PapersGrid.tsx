import { useState, useMemo } from 'react';

export interface Paper {
  slug: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  abstract: string;
  tags: string[];
  type: 'conference' | 'journal' | 'workshop' | 'preprint';
  pdfLink?: string;
  codeLink?: string;
  projectLink?: string;
  award?: string;
}

const TYPE_COLORS: Record<Paper['type'], { bg: string; text: string }> = {
  conference: { bg: '#dbeafe', text: '#1d4ed8' },
  journal:    { bg: '#d1fae5', text: '#065f46' },
  workshop:   { bg: '#fef3c7', text: '#92400e' },
  preprint:   { bg: '#f3e8ff', text: '#6d28d9' },
};

const TYPE_LABELS: Record<Paper['type'], string> = {
  conference: 'Conference',
  journal: 'Journal',
  workshop: 'Workshop',
  preprint: 'Preprint',
};

const MIN_YEAR = 2018;
const MAX_YEAR = new Date().getFullYear();

interface Props {
  papers: Paper[];
}

export default function PapersGrid({ papers }: Props) {
  const [selectedTypes, setSelectedTypes] = useState<Set<Paper['type']>>(new Set());
  const [yearRange, setYearRange] = useState<[number, number]>([MIN_YEAR, MAX_YEAR]);
  const [search, setSearch] = useState('');
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('list');

  const allTypes = useMemo(() => {
    const s = new Set<Paper['type']>();
    papers.forEach(p => s.add(p.type));
    return Array.from(s);
  }, [papers]);

  const toggleType = (t: Paper['type']) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return papers.filter(p => {
      if (selectedTypes.size > 0 && !selectedTypes.has(p.type)) return false;
      if (p.year < yearRange[0] || p.year > yearRange[1]) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.venue.toLowerCase().includes(q) && !p.tags.some(t => t.toLowerCase().includes(q)) && !p.authors.join(' ').toLowerCase().includes(q)) return false;
      }
      return true;
    }).sort((a, b) => b.year - a.year);
  }, [papers, selectedTypes, yearRange, search]);

  const years = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);

  return (
    <div>
      {/* Controls row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '360px' }}>
          <svg style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search papers, authors, venues..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.375rem', border: '1px solid #e5e5e0', borderRadius: '0.75rem', fontSize: '0.875rem', outline: 'none', background: 'white' }}
          />
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: '0.25rem', background: '#f3f4f6', padding: '0.25rem', borderRadius: '0.625rem' }}>
          {(['list', 'grid'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.8125rem', fontWeight: 500, border: 'none', cursor: 'pointer', background: view === v ? 'white' : 'transparent', color: view === v ? '#111' : '#6b7280', boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s' }}
            >
              {v === 'list' ? '≡ List' : '⊞ Grid'}
            </button>
          ))}
        </div>
      </div>

      {/* Type filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.8125rem', color: '#6b7280', alignSelf: 'center', marginRight: '0.25rem' }}>Type:</span>
        {allTypes.map(type => {
          const active = selectedTypes.has(type);
          const col = TYPE_COLORS[type];
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              style={{ padding: '0.25rem 0.875rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 500, border: `2px solid ${active ? col.text : 'transparent'}`, background: active ? col.bg : '#f3f4f6', color: active ? col.text : '#6b7280', cursor: 'pointer', transition: 'all 0.15s' }}
            >
              {TYPE_LABELS[type]}
            </button>
          );
        })}
        {selectedTypes.size > 0 && (
          <button onClick={() => setSelectedTypes(new Set())} style={{ padding: '0.25rem 0.875rem', borderRadius: '9999px', fontSize: '0.8125rem', color: '#ef4444', background: '#fee2e2', border: 'none', cursor: 'pointer' }}>Clear</button>
        )}
      </div>

      {/* Timeline */}
      <div style={{ background: 'white', border: '1px solid #e5e5e0', borderRadius: '1rem', padding: '1rem 1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>Year Range</span>
          <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{yearRange[0]} – {yearRange[1]}</span>
        </div>
        <div style={{ position: 'relative', paddingBottom: '1.25rem' }}>
          <div style={{ height: '5px', background: '#f3f4f6', borderRadius: '9999px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, height: '100%', left: `${((yearRange[0]-MIN_YEAR)/(MAX_YEAR-MIN_YEAR))*100}%`, right: `${((MAX_YEAR-yearRange[1])/(MAX_YEAR-MIN_YEAR))*100}%`, background: 'linear-gradient(90deg,#4f7cac,#7aa3cc)', borderRadius: '9999px' }} />
          </div>
          <div style={{ position: 'relative', height: 0 }}>
            <input type="range" min={MIN_YEAR} max={MAX_YEAR} value={yearRange[0]} onChange={e => { const v=parseInt(e.target.value); if(v<=yearRange[1]) setYearRange([v,yearRange[1]]); }} style={{ position: 'absolute', top: '-10px', left: 0, right: 0, width: '100%', appearance: 'none', background: 'transparent', cursor: 'pointer', zIndex: 2 }} className="range-slider" />
            <input type="range" min={MIN_YEAR} max={MAX_YEAR} value={yearRange[1]} onChange={e => { const v=parseInt(e.target.value); if(v>=yearRange[0]) setYearRange([yearRange[0],v]); }} style={{ position: 'absolute', top: '-10px', left: 0, right: 0, width: '100%', appearance: 'none', background: 'transparent', cursor: 'pointer', zIndex: 1 }} className="range-slider" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.625rem' }}>
            {years.filter((_, i) => i % 2 === 0 || _ === MAX_YEAR).map(y => <span key={y} style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>{y}</span>)}
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
        {filtered.length} paper{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Papers list/grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9ca3af' }}>
          <p>No papers match your filters.</p>
        </div>
      ) : view === 'list' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(p => (
            <PaperRow key={p.slug} paper={p} expanded={expandedSlug === p.slug} onToggle={() => setExpandedSlug(expandedSlug === p.slug ? null : p.slug)} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
          {filtered.map(p => <PaperCard key={p.slug} paper={p} />)}
        </div>
      )}

      <style>{`
        .range-slider::-webkit-slider-thumb { appearance:none;width:16px;height:16px;border-radius:50%;background:white;border:2px solid #4f7cac;box-shadow:0 1px 4px rgba(0,0,0,0.15);cursor:pointer; }
        .range-slider::-moz-range-thumb { width:16px;height:16px;border-radius:50%;background:white;border:2px solid #4f7cac;cursor:pointer; }
      `}</style>
    </div>
  );
}

function PaperRow({ paper, expanded, onToggle }: { paper: Paper; expanded: boolean; onToggle: () => void }) {
  const col = TYPE_COLORS[paper.type];
  return (
    <div style={{ background: 'white', border: '1px solid #e5e5e0', borderRadius: '0.875rem', overflow: 'hidden', transition: 'box-shadow 0.15s' }}>
      <div
        onClick={onToggle}
        style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
            <span style={{ ...col, padding: '0.1rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600 }}>
              {TYPE_LABELS[paper.type]}
            </span>
            <span style={{ fontSize: '0.8125rem', color: '#6b7280', fontWeight: 500 }}>{paper.venue} · {paper.year}</span>
            {paper.award && (
              <span style={{ padding: '0.1rem 0.625rem', background: '#fef3c7', color: '#92400e', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600 }}>
                🏆 {paper.award}
              </span>
            )}
          </div>
          <h3 style={{ margin: '0 0 0.375rem', fontSize: '1rem', fontWeight: 600, color: '#111827', lineHeight: 1.4 }}>{paper.title}</h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>{paper.authors.join(', ')}</p>
        </div>
        <svg
          style={{ flexShrink: 0, color: '#9ca3af', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'none', marginTop: '0.25rem' }}
          width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {expanded && (
        <div style={{ padding: '0 1.5rem 1.25rem', borderTop: '1px solid #f3f4f6' }}>
          <p style={{ margin: '1rem 0', fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7 }}>{paper.abstract}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
            {paper.tags.map(t => (
              <span key={t} style={{ padding: '0.15rem 0.625rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '9999px', fontSize: '0.6875rem', color: '#374151' }}>{t}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            {paper.pdfLink && <a href={paper.pdfLink} target="_blank" rel="noopener" style={{ padding: '0.375rem 1rem', background: '#4f7cac', color: 'white', borderRadius: '0.5rem', fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none' }}>PDF</a>}
            {paper.codeLink && <a href={paper.codeLink} target="_blank" rel="noopener" style={{ padding: '0.375rem 1rem', background: '#f3f4f6', color: '#374151', borderRadius: '0.5rem', fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none' }}>Code</a>}
            {paper.projectLink && <a href={paper.projectLink} target="_blank" rel="noopener" style={{ padding: '0.375rem 1rem', background: '#eff6ff', color: '#1d4ed8', borderRadius: '0.5rem', fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none' }}>Project Page</a>}
          </div>
        </div>
      )}
    </div>
  );
}

function PaperCard({ paper }: { paper: Paper }) {
  const [hovered, setHovered] = useState(false);
  const col = TYPE_COLORS[paper.type];
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: 'white', border: '1px solid #e5e5e0', borderRadius: '1rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', boxShadow: hovered ? '0 6px 20px rgba(0,0,0,0.09)' : '0 1px 3px rgba(0,0,0,0.06)', transform: hovered ? 'translateY(-2px)' : 'none', transition: 'all 0.2s' }}
    >
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
        <span style={{ ...col, padding: '0.1rem 0.5rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600 }}>{TYPE_LABELS[paper.type]}</span>
        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{paper.year}</span>
      </div>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.9375rem', fontWeight: 600, color: '#111827', lineHeight: 1.4, flex: 1 }}>{paper.title}</h3>
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.8125rem', color: '#6b7280' }}>{paper.venue}</p>
      <p style={{ margin: '0 0 0.875rem', fontSize: '0.8125rem', color: '#9ca3af' }}>{paper.authors.slice(0,3).join(', ')}{paper.authors.length > 3 ? ' et al.' : ''}</p>
      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
        {paper.pdfLink && <a href={paper.pdfLink} target="_blank" rel="noopener" style={{ padding: '0.25rem 0.75rem', background: '#4f7cac', color: 'white', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 500, textDecoration: 'none' }}>PDF</a>}
        {paper.codeLink && <a href={paper.codeLink} target="_blank" rel="noopener" style={{ padding: '0.25rem 0.75rem', background: '#f3f4f6', color: '#374151', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 500, textDecoration: 'none' }}>Code</a>}
      </div>
    </div>
  );
}
