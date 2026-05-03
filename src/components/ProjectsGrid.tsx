import { useState, useMemo } from 'react';

export interface Project {
  slug: string;
  title: string;
  description: string;
  type: 'academic' | 'personal' | 'collaborative' | 'open-source';
  startYear: number;
  endYear: number | null;
  tags: string[];
  image?: string;
  link?: string;
  paperLink?: string;
  codeLink?: string;
  featured?: boolean;
}

const TYPE_LABELS: Record<Project['type'], string> = {
  academic: 'Academic Research',
  personal: 'Personal Research',
  collaborative: 'Collaborative',
  'open-source': 'Open Source',
};

const TYPE_COLORS: Record<Project['type'], string> = {
  academic: '#dbeafe:#1d4ed8',
  personal: '#d1fae5:#065f46',
  collaborative: '#fef3c7:#92400e',
  'open-source': '#f3e8ff:#6d28d9',
};

function typeStyle(type: Project['type']) {
  const [bg, text] = TYPE_COLORS[type].split(':');
  return { background: bg, color: text };
}

const MIN_YEAR = 2015;
const MAX_YEAR = new Date().getFullYear();

interface Props {
  projects: Project[];
}

export default function ProjectsGrid({ projects }: Props) {
  const [selectedTypes, setSelectedTypes] = useState<Set<Project['type']>>(new Set());
  const [yearRange, setYearRange] = useState<[number, number]>([MIN_YEAR, MAX_YEAR]);
  const [search, setSearch] = useState('');

  const allTypes = useMemo(() => {
    const s = new Set<Project['type']>();
    projects.forEach(p => s.add(p.type));
    return Array.from(s);
  }, [projects]);

  const toggleType = (t: Project['type']) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return projects.filter(p => {
      if (selectedTypes.size > 0 && !selectedTypes.has(p.type)) return false;
      const end = p.endYear ?? MAX_YEAR;
      if (end < yearRange[0] || p.startYear > yearRange[1]) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.tags.some(t => t.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [projects, selectedTypes, yearRange, search]);

  // Timeline ticks
  const years = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <svg style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem', border: '1px solid #e5e5e0', borderRadius: '0.75rem', fontSize: '0.9375rem', outline: 'none', background: 'white', color: '#111' }}
          />
        </div>
      </div>

      {/* Type filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.8125rem', color: '#6b7280', alignSelf: 'center', marginRight: '0.25rem' }}>Type:</span>
        {allTypes.map(type => {
          const active = selectedTypes.has(type);
          const colors = typeStyle(type);
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              style={{
                padding: '0.3rem 0.875rem',
                borderRadius: '9999px',
                fontSize: '0.8125rem',
                fontWeight: 500,
                border: `2px solid ${active ? colors.color : 'transparent'}`,
                background: active ? colors.background : '#f3f4f6',
                color: active ? colors.color : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {TYPE_LABELS[type]}
            </button>
          );
        })}
        {selectedTypes.size > 0 && (
          <button
            onClick={() => setSelectedTypes(new Set())}
            style={{ padding: '0.3rem 0.875rem', borderRadius: '9999px', fontSize: '0.8125rem', color: '#ef4444', background: '#fee2e2', border: 'none', cursor: 'pointer' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Timeline filter */}
      <div style={{ background: 'white', border: '1px solid #e5e5e0', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>Timeline</span>
          <span style={{ fontSize: '0.8125rem', color: '#6b7280', fontWeight: 500 }}>
            {yearRange[0]} – {yearRange[1] === MAX_YEAR ? 'Present' : yearRange[1]}
          </span>
        </div>

        {/* Visual timeline with tick marks */}
        <div style={{ position: 'relative', paddingBottom: '1.5rem' }}>
          {/* Track background */}
          <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '9999px', position: 'relative', marginBottom: '0.5rem' }}>
            {/* Active range highlight */}
            <div style={{
              position: 'absolute',
              top: 0,
              height: '100%',
              left: `${((yearRange[0] - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%`,
              right: `${((MAX_YEAR - yearRange[1]) / (MAX_YEAR - MIN_YEAR)) * 100}%`,
              background: 'linear-gradient(90deg,#4f7cac,#7aa3cc)',
              borderRadius: '9999px',
            }} />
          </div>

          {/* Dual range slider */}
          <div style={{ position: 'relative', height: '0' }}>
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={yearRange[0]}
              onChange={e => {
                const v = parseInt(e.target.value);
                if (v <= yearRange[1]) setYearRange([v, yearRange[1]]);
              }}
              style={{ position: 'absolute', top: '-11px', left: 0, right: 0, width: '100%', appearance: 'none', background: 'transparent', cursor: 'pointer', zIndex: 2 }}
              className="range-slider"
            />
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={yearRange[1]}
              onChange={e => {
                const v = parseInt(e.target.value);
                if (v >= yearRange[0]) setYearRange([yearRange[0], v]);
              }}
              style={{ position: 'absolute', top: '-11px', left: 0, right: 0, width: '100%', appearance: 'none', background: 'transparent', cursor: 'pointer', zIndex: 1 }}
              className="range-slider"
            />
          </div>

          {/* Year labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
            {years.filter((_, i) => i % 3 === 0 || _ === MAX_YEAR).map(y => (
              <span key={y} style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>{y}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
        Showing <strong style={{ color: '#111' }}>{filtered.length}</strong> of {projects.length} projects
      </p>

      {/* Projects grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9ca3af' }}>
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ margin: '0 auto 1rem', display: 'block' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No projects match your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}>
          {filtered.map(p => <ProjectCard key={p.slug} project={p} />)}
        </div>
      )}

      <style>{`
        .range-slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid #4f7cac;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          cursor: pointer;
        }
        .range-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid #4f7cac;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);
  const colors = typeStyle(project.type);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        border: '1px solid #e5e5e0',
        borderRadius: '1rem',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, transform 0.2s',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      {project.image && (
        <div style={{ height: '160px', overflow: 'hidden', background: '#f3f4f6' }}>
          <img
            src={project.image}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
          />
        </div>
      )}
      {!project.image && (
        <div style={{ height: '120px', background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#93c5fd" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{project.title}</h3>
          {project.featured && (
            <span style={{ flexShrink: 0, padding: '0.1rem 0.5rem', background: '#fef3c7', color: '#92400e', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600 }}>
              Featured
            </span>
          )}
        </div>

        <p style={{ margin: '0 0 0.875rem', fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6, flex: 1 }}>{project.description}</p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
          {project.tags.slice(0, 4).map(tag => (
            <span key={tag} style={{ padding: '0.15rem 0.625rem', background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '9999px', fontSize: '0.6875rem' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
          <span style={{ ...colors, padding: '0.15rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 500 }}>
            {TYPE_LABELS[project.type]}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            {project.startYear}–{project.endYear ?? 'Now'}
          </span>
        </div>

        {/* Links */}
        {(project.link || project.paperLink || project.codeLink) && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener"
                style={{ padding: '0.375rem 0.875rem', background: '#4f7cac', color: 'white', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 500, textDecoration: 'none' }}
                onClick={e => e.stopPropagation()}>
                Details
              </a>
            )}
            {project.codeLink && (
              <a href={project.codeLink} target="_blank" rel="noopener"
                style={{ padding: '0.375rem 0.875rem', background: '#f3f4f6', color: '#374151', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 500, textDecoration: 'none' }}
                onClick={e => e.stopPropagation()}>
                Code
              </a>
            )}
            {project.paperLink && (
              <a href={project.paperLink} target="_blank" rel="noopener"
                style={{ padding: '0.375rem 0.875rem', background: '#eff6ff', color: '#1d4ed8', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 500, textDecoration: 'none' }}
                onClick={e => e.stopPropagation()}>
                Paper
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
