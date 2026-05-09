import { useState, useMemo } from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags: string[];
  image?: string;
  readingTime?: number;
}

function tagStyle(_tag: string): { background: string; color: string } {
  return { background: 'rgba(79,124,172,0.12)', color: '#4f7cac' };
}

interface Props {
  posts: BlogPost[];
}

export default function BlogGrid({ posts }: Props) {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => posts.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }), [posts, search]);

  return (
    <div>
      {/* Controls row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '400px' }}>
          <svg style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.375rem', border: '1px solid var(--color-border)', borderRadius: '0.75rem', fontSize: '0.875rem', outline: 'none', background: 'var(--color-card)', color: 'var(--color-text)' }} />
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

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
          <p>No posts match your search.</p>
        </div>
      ) : view === 'list' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', maxWidth: '680px' }}>
          {filtered.map(post => <BlogListCard key={post.slug} post={post} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.25rem' }}>
          {filtered.map(post => <BlogGridCard key={post.slug} post={post} />)}
        </div>
      )}
    </div>
  );
}

function BlogListCard({ post }: { post: BlogPost }) {
  const [hovered, setHovered] = useState(false);
  const date = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <a
      href={`/blog/${post.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '0.875rem', padding: '0.875rem 1.25rem', transition: 'all 0.2s',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.09)' : '0 1px 3px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-2px)' : 'none' }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>{date}</span>
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{ padding: '0.1rem 0.5rem', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: 500, ...tagStyle(tag) }}>{tag}</span>
          ))}
        </div>
        <h2 style={{ margin: '0 0 0.2rem', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</h2>
        {post.description && (
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.description}</p>
        )}
      </div>
      <svg style={{ flexShrink: 0, color: 'var(--color-text-muted)', opacity: hovered ? 1 : 0.4, transition: 'opacity 0.15s' }} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}

function BlogGridCard({ post }: { post: BlogPost }) {
  const [hovered, setHovered] = useState(false);
  const date = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <a
      href={`/blog/${post.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '1rem', overflow: 'hidden', transition: 'all 0.2s',
        boxShadow: hovered ? '0 6px 20px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-3px)' : 'none' }}
    >
      {post.image ? (
        <div style={{ height: '140px', overflow: 'hidden', background: 'var(--color-code-bg)', flexShrink: 0 }}>
          <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', transform: hovered ? 'scale(1.04)' : 'scale(1)' }} />
        </div>
      ) : (
        <div style={{ height: '80px', background: 'linear-gradient(135deg,rgba(79,124,172,0.1),rgba(79,124,172,0.04))', flexShrink: 0 }} />
      )}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.4, flex: 1 }}>{post.title}</h3>
        <p style={{ margin: '0 0 0.625rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{date}</p>
        {post.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{ padding: '0.1rem 0.5rem', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: 500, ...tagStyle(tag) }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
