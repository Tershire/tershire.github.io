import { useState, useEffect } from 'react';
import StatsMap from './StatsMap';

// Force dark palette inside the modal regardless of site theme
const DARK: React.CSSProperties = {
  '--color-text': 'rgba(255,255,255,0.87)',
  '--color-text-muted': 'rgba(255,255,255,0.42)',
  '--color-code-bg': 'rgba(255,255,255,0.07)',
  '--color-border': 'rgba(255,255,255,0.1)',
  '--color-card': 'rgba(25,25,25,0.95)',
  '--color-accent': '#6fa3d4',
  '--color-accent-light': '#93bfe0',
  '--map-stroke': 'rgba(255,255,255,0.22)',
} as React.CSSProperties;

export default function FloatingStats() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Floating button — chart icon or X */}
      <button
        onClick={() => setOpen(v => !v)}
        title={open ? 'Close analytics' : 'Site analytics'}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '2.75rem',
          height: '2.75rem',
          borderRadius: '0.625rem',
          background: open ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.38)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: `1px solid ${open ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: open ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          zIndex: 9999,
        }}
      >
        {open ? (
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 16l4-4 4 4 4-6" />
          </svg>
        )}
      </button>

      {/* Overlay + modal */}
      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 9000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: 'rgba(12,12,12,0.94)',
              borderRadius: '1.25rem',
              border: '1px solid rgba(255,255,255,0.1)',
              width: '100%',
              maxWidth: '820px',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
              ...DARK,
            }}
          >
            <div style={{ marginBottom: '1.75rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', margin: '0 0 0.3rem' }}>
                Site
              </p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                Analytics
              </h2>
            </div>

            <StatsMap />
          </div>
        </div>
      )}
    </>
  );
}
