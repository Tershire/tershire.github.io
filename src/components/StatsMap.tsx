import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// ISO 3166-1 alpha-2 → UN M.49 numeric (used by world-atlas TopoJSON)
const A2_TO_NUM: Record<string, number> = {
  AD:20,AE:784,AF:4,AG:28,AL:8,AM:51,AO:24,AR:32,AT:40,AU:36,
  AZ:31,BA:70,BB:52,BD:50,BE:56,BF:854,BG:100,BH:48,BI:108,BJ:204,
  BN:96,BO:68,BR:76,BS:44,BT:64,BW:72,BY:112,BZ:84,CA:124,CD:180,
  CF:140,CG:178,CH:756,CI:384,CL:152,CM:120,CN:156,CO:170,CR:188,CU:192,
  CV:132,CY:196,CZ:203,DE:276,DJ:262,DK:208,DM:212,DO:214,DZ:12,EC:218,
  EE:233,EG:818,ER:232,ES:724,ET:231,FI:246,FJ:242,FM:583,FR:250,
  GA:266,GB:826,GD:308,GE:268,GH:288,GM:270,GN:324,GQ:226,GR:300,GT:320,
  GW:624,GY:328,HN:340,HR:191,HT:332,HU:348,ID:360,IE:372,IL:376,IN:356,
  IQ:368,IR:364,IS:352,IT:380,JM:388,JO:400,JP:392,KE:404,KG:417,KH:116,
  KI:296,KM:174,KN:659,KP:408,KR:410,KW:414,KZ:398,LA:418,LB:422,LC:662,
  LI:438,LK:144,LR:430,LS:426,LT:440,LU:442,LV:428,LY:434,MA:504,MC:492,
  MD:498,ME:499,MG:450,MH:584,MK:807,ML:466,MM:104,MN:496,MR:478,MT:470,
  MU:480,MV:462,MW:454,MX:484,MY:458,MZ:508,NA:516,NE:562,NG:566,NI:558,
  NL:528,NO:578,NP:524,NR:520,NZ:554,OM:512,PA:591,PE:604,PG:598,PH:608,
  PK:586,PL:616,PT:620,PW:585,PY:600,QA:634,RO:642,RS:688,RU:643,RW:646,
  SA:682,SB:90,SC:690,SD:729,SE:752,SG:702,SI:705,SK:703,SL:694,SM:674,
  SN:686,SO:706,SR:740,SS:728,ST:678,SV:222,SY:760,SZ:748,TD:148,TG:768,
  TH:764,TJ:762,TL:626,TM:795,TN:788,TO:776,TR:792,TT:780,TV:798,TZ:834,
  UA:804,UG:800,US:840,UY:858,UZ:860,VA:336,VC:670,VE:862,VN:704,VU:548,
  WS:882,YE:887,ZA:710,ZM:894,ZW:716,
};

interface LocationStat {
  id: string;
  name: string;
  count: number;
  count_unique?: number;
}

interface Tooltip {
  name: string;
  count: number;
  x: number;
  y: number;
}

const SITE = 'https://tershire.goatcounter.com';
const TOKEN_KEY = 'gc_api_token';

export default function StatsMap() {
  const [stats, setStats] = useState<LocationStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [token, setToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  function loadData(apiToken: string | null = null) {
    setLoading(true);
    setError(null);
    setErrorDetail(null);

    const today = new Date().toISOString().slice(0, 10);
    const url = `${SITE}/api/v0/stats/locations?period-start=2024-01-01&period-end=${today}&limit=200`;
    const headers: Record<string, string> = {};
    if (apiToken) headers['Authorization'] = `Bearer ${apiToken}`;

    fetch(url, { headers })
      .then(async r => {
        if (!r.ok) {
          const body = await r.text().catch(() => '');
          throw new Error(`HTTP ${r.status}|${body}`);
        }
        return r.json();
      })
      .then(data => {
        setStats((data.stats ?? []) as LocationStat[]);
        setLoading(false);
      })
      .catch(err => {
        const parts = (err.message as string).split('|');
        setError(parts[0]);
        setErrorDetail(parts[1] ?? null);
        setLoading(false);
      });
  }

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) setToken(saved);
    loadData(saved || null);
  }, []);

  function handleTokenSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const t = token.trim();
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
    setShowTokenInput(false);
    loadData(t || null);
  }

  // Only use 2-letter country codes (not sub-regions like "KR-11")
  const countryStats = stats.filter(s => s.id && s.id.length === 2);
  const numToStat = new Map(countryStats.map(s => [A2_TO_NUM[s.id.toUpperCase()], s]));
  const maxCount = Math.max(...countryStats.map(s => s.count), 1);
  const total = stats.reduce((sum, s) => sum + s.count, 0);

  function countryColor(numericId: number, hover = false): string {
    const stat = numToStat.get(numericId);
    if (!stat) return hover ? '#c0c0bc' : 'var(--color-code-bg)';
    const intensity = Math.log(stat.count + 1) / Math.log(maxCount + 1);
    const alpha = hover ? Math.min(intensity * 0.65 + 0.55, 1) : intensity * 0.65 + 0.2;
    return `rgba(79,124,172,${alpha.toFixed(2)})`;
  }

  const topCountries = [...countryStats].sort((a, b) => b.count - a.count).slice(0, 10);

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
        Loading analytics…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginBottom: '0.5rem' }}>
          Could not load analytics data ({error}).
        </p>
        {errorDetail && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontFamily: 'monospace', marginBottom: '1rem', opacity: 0.7 }}>
            {errorDetail.slice(0, 300)}
          </p>
        )}
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          GoatCounter 대시보드를 <strong style={{ color: 'var(--color-text)' }}>Viewable by: Everyone</strong>으로 설정하거나,<br />
          API 토큰을 입력해 주세요.
        </p>

        {showTokenInput ? (
          <form onSubmit={handleTokenSubmit} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="GoatCounter API token"
              autoFocus
              style={{
                padding: '0.5rem 0.875rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--color-border)',
                background: 'var(--color-code-bg)',
                color: 'var(--color-text)',
                fontSize: '0.875rem',
                minWidth: '260px',
                outline: 'none',
              }}
            />
            <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: 'var(--color-accent)', color: '#fff', border: 'none', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
              Load
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowTokenInput(true)}
            style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-muted)', fontSize: '0.8125rem', cursor: 'pointer' }}
          >
            Enter API token
          </button>
        )}

        <div style={{ marginTop: '1rem' }}>
          <a href={SITE} target="_blank" rel="noopener" style={{ fontSize: '0.8125rem', color: 'var(--color-accent)' }}>
            Open GoatCounter →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Summary */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total views', value: total.toLocaleString() },
          { label: 'Countries', value: countryStats.length.toString() },
        ].map(item => (
          <div key={item.label} style={{ background: 'var(--color-code-bg)', borderRadius: '0.75rem', padding: '0.875rem 1.25rem', minWidth: '110px' }}>
            <div style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>{item.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{item.label}</div>
          </div>
        ))}
        <button
          onClick={() => setShowTokenInput(v => !v)}
          style={{ marginLeft: 'auto', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
        >
          {showTokenInput ? 'Cancel' : 'API token'}
        </button>
      </div>

      {showTokenInput && (
        <form onSubmit={handleTokenSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="GoatCounter API token (saved in localStorage)"
            autoFocus
            style={{ flex: 1, padding: '0.5rem 0.875rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', background: 'var(--color-code-bg)', color: 'var(--color-text)', fontSize: '0.875rem', minWidth: '200px', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: 'var(--color-accent)', color: '#fff', border: 'none', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
            Load
          </button>
        </form>
      )}

      {/* World map */}
      <div style={{ background: 'var(--color-code-bg)', borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem' }}>
        <ComposableMap projectionConfig={{ scale: 147, center: [10, 10] }} style={{ width: '100%', height: 'auto', display: 'block' }}>
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: { id: string; rsmKey: string; [key: string]: unknown }[] }) =>
              geographies.map((geo: { id: string; rsmKey: string; [key: string]: unknown }) => {
                const numId = parseInt(geo.id);
                const stat = numToStat.get(numId);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={countryColor(numId)}
                    stroke="var(--color-border)"
                    strokeWidth={0.4}
                    onMouseEnter={(e: React.MouseEvent) => {
                      if (stat) setTooltip({ name: stat.name, count: stat.count, x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e: React.MouseEvent) => {
                      if (stat) setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null);
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: countryColor(numId, true), outline: 'none', cursor: stat ? 'pointer' : 'default' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Top countries */}
      {topCountries.length > 0 && (
        <div>
          <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>
            Top Countries
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {topCountries.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', width: '1.25rem', textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text)', width: '9rem', flexShrink: 0 }}>{c.name}</span>
                <div style={{ flex: 1, height: '6px', background: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.round((c.count / maxCount) * 100)}%`, height: '100%', background: 'var(--color-accent)', borderRadius: '3px' }} />
                </div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', width: '3rem', textAlign: 'right', flexShrink: 0 }}>
                  {c.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem', padding: '2rem' }}>
          No visitor data yet.
        </p>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div style={{ position: 'fixed', left: tooltip.x + 14, top: tooltip.y - 36, background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '0.5rem', padding: '0.4rem 0.875rem', fontSize: '0.8125rem', pointerEvents: 'none', zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{tooltip.name}</span>
          <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.625rem' }}>{tooltip.count.toLocaleString()} views</span>
        </div>
      )}
    </div>
  );
}
