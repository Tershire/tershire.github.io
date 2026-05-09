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

const NC = { bg: 'rgba(79,124,172,0.12)', text: '#4f7cac' };
const TYPE_COLORS: Record<Project['type'], { bg: string; text: string }> = {
  academic:      NC,
  personal:      NC,
  collaborative: NC,
  'open-source': NC,
};

const MIN_YEAR = 2015;
const MAX_YEAR = new Date().getFullYear();

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [selectedTypes, setSelectedTypes] = useState<Set<Project['type']>>(new Set());
  const [yearRange, setYearRange] = useState<[number, number]>([MIN_YEAR, MAX_YEAR]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const allTypes = useMemo(() => {
    const s = new Set<Project['type']>();
    projects.forEach(p => s.add(p.type));
    return Array.from(s);
  }, [projects]);

  const toggleType = (t: Project['type']) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  const filtered = useMemo(() => projects.filter(p => {
    if (selectedTypes.size > 0 && !selectedTypes.has(p.type)) return false;
    const end = p.endYear ?? MAX_YEAR;
    if (end < yearRange[0] || p.startYear > yearRange[1]) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.tags.some(t => t.toLowerCase().includes(q))) return false;
    }
    return true;
  }), [projects, selectedTypes, yearRange, search]);

  const years = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);
  const leftZ = yearRange[0] >= yearRange[1] ? 1 : 2;
  const rightZ = yearRange[0] >= yearRange[1] ? 2 : 1;

  return (
    <div>
      {/* Search + view toggle */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '400px' }}>
          <svg style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem', border: '1px solid var(--color-border)', borderRadius: '0.75rem', fontSize: '0.9375rem', outline: 'none', background: 'var(--color-card)', color: 'var(--color-text)' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--color-code-bg)', padding: '0.25rem', borderRadius: '0.625rem' }}>
          {(['list', 'grid'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.8125rem', fontWeight: 500, border: 'none', cursor: 'pointer',
                background: view === v ? 'var(--color-card)' : 'transparent',
                color: view === v ? 'var(--color-text)' : 'var(--color-text-muted)',
                boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s' }}>
              {v === 'list' ? '≡ List' : '⊞ Grid'}
            </button>
          ))}
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
        Showing <strong style={{ color: 'var(--color-text)' }}>{filtered.length}</strong> of {projects.length} projects
      </p>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
          <p>No projects match your filters.</p>
        </div>
      ) : view === 'list' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(p => (
            <ProjectRow key={p.slug} project={p} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}>
          {filtered.map(p => <ProjectCard key={p.slug} project={p} />)}
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

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);
  const col = TYPE_COLORS[project.type];

  return (
    <a
      href={`/projects/${project.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '1rem', overflow: 'hidden', textDecoration: 'none', transition: 'box-shadow 0.2s, transform 0.2s', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.06)', transform: hovered ? 'translateY(-3px)' : 'none' }}
    >
      {project.image ? (
        <div style={{ height: '160px', overflow: 'hidden', background: 'var(--color-code-bg)' }}>
          <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', transform: hovered ? 'scale(1.04)' : 'scale(1)' }} />
        </div>
      ) : (
        <div style={{ height: '100px', background: 'linear-gradient(135deg,rgba(79,124,172,0.1),rgba(79,124,172,0.04))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={1.5} style={{ opacity: 0.4 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3 }}>{project.title}</h3>
          {project.featured && <span style={{ flexShrink: 0, padding: '0.1rem 0.5rem', background: 'rgba(251,146,60,0.15)', color: '#ea6c00', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600 }}>Featured</span>}
        </div>
        <p style={{ margin: '0 0 0.875rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, flex: 1 }}>{project.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
          {project.tags.slice(0, 4).map(tag => (
            <span key={tag} style={{ padding: '0.15rem 0.625rem', background: 'var(--color-code-bg)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', borderRadius: '9999px', fontSize: '0.6875rem' }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
          <span style={{ background: col.bg, color: col.text, padding: '0.15rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 500 }}>{TYPE_LABELS[project.type]}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{project.startYear}–{project.endYear ?? 'Now'}</span>
        </div>
        {(project.codeLink || project.paperLink) && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            {project.codeLink && <a href={project.codeLink} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} style={{ padding: '0.375rem 0.875rem', background: 'var(--color-code-bg)', color: 'var(--color-text)', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 500, textDecoration: 'none' }}>Code</a>}
            {project.paperLink && <a href={project.paperLink} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} style={{ padding: '0.375rem 0.875rem', background: 'rgba(79,124,172,0.12)', color: 'var(--color-accent)', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 500, textDecoration: 'none' }}>Paper</a>}
          </div>
        )}
      </div>
    </a>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);
  const col = TYPE_COLORS[project.type];
  return (
    <a
      href={`/projects/${project.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '0.875rem', padding: '1rem 1.25rem', transition: 'all 0.2s',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.09)' : '0 1px 3px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-2px)' : 'none' }}
    >
      {/* Thumbnail */}
      {project.image ? (
        <img src={project.image} alt={project.title}
          style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0 }} />
      ) : (
        <div style={{ width: '56px', height: '56px', borderRadius: '0.5rem', flexShrink: 0, background: 'linear-gradient(135deg,rgba(79,124,172,0.12),rgba(79,124,172,0.04))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={1.5} style={{ opacity: 0.4 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
          <span style={{ background: col.bg, color: col.text, padding: '0.1rem 0.5rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600 }}>{TYPE_LABELS[project.type]}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{project.startYear}–{project.endYear ?? 'Now'}</span>
          {project.featured && <span style={{ padding: '0.1rem 0.5rem', background: 'rgba(251,146,60,0.15)', color: '#ea6c00', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600 }}>Featured</span>}
        </div>
        <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.title}</h3>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.description}</p>
      </div>

      <svg style={{ flexShrink: 0, color: 'var(--color-text-muted)', opacity: hovered ? 1 : 0.4, transition: 'opacity 0.15s' }}
        width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}
