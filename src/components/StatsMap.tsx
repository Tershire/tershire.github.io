import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const WEBSITE_ID = '5979ffcd-d67f-45c4-8f87-941ee6f62d04';
const API_BASE = 'https://api.umami.is/v1/eu';
const API_KEY = 'api_UwYR1MkHGa3nEt9n6QILummwH5SjCN5t';

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

// Country code → name fallback
const A2_NAME: Record<string, string> = {
  KR:'South Korea',US:'United States',JP:'Japan',CN:'China',GB:'United Kingdom',
  DE:'Germany',FR:'France',CA:'Canada',AU:'Australia',IN:'India',BR:'Brazil',
  NL:'Netherlands',SE:'Sweden',SG:'Singapore',CH:'Switzerland',NO:'Norway',
  FI:'Finland',DK:'Denmark',IT:'Italy',ES:'Spain',PL:'Poland',RU:'Russia',
  TR:'Turkey',TW:'Taiwan',HK:'Hong Kong',ID:'Indonesia',TH:'Thailand',VN:'Vietnam',
  MY:'Malaysia',NZ:'New Zealand',IE:'Ireland',AT:'Austria',BE:'Belgium',PT:'Portugal',
};

interface CountryStat { code: string; name: string; count: number; }
interface Tooltip { name: string; count: number; x: number; y: number; }

export default function StatsMap() {
  const [countries, setCountries] = useState<CountryStat[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  useEffect(() => {
    const startAt = new Date('2024-01-01').getTime();
    const endAt = Date.now();
    const headers = { 'x-umami-api-key': API_KEY };

    Promise.all([
      fetch(`${API_BASE}/websites/${WEBSITE_ID}/metrics?type=country&startAt=${startAt}&endAt=${endAt}&limit=200`, { headers })
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
      fetch(`${API_BASE}/websites/${WEBSITE_ID}/stats?startAt=${startAt}&endAt=${endAt}`, { headers })
        .then(r => r.ok ? r.json() : null).catch(() => null),
    ])
      .then(([metricsData, statsData]) => {
        const list: CountryStat[] = (metricsData as { x: string; y: number }[]).map(d => ({
          code: d.x.toUpperCase(),
          name: A2_NAME[d.x.toUpperCase()] ?? d.x,
          count: d.y,
        }));
        setCountries(list);
        if (statsData) {
          setTotalViews(statsData.pageviews?.value ?? 0);
          setTotalVisitors(statsData.visitors?.value ?? 0);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const numToStat = new Map(countries.map(c => [A2_TO_NUM[c.code], c]));
  const maxCount = Math.max(...countries.map(c => c.count), 1);

  function countryColor(numericId: number, hover = false): string {
    const stat = numToStat.get(numericId);
    if (!stat) return hover ? '#c0c0bc' : 'var(--color-code-bg)';
    const intensity = Math.log(stat.count + 1) / Math.log(maxCount + 1);
    const alpha = hover ? Math.min(intensity * 0.65 + 0.55, 1) : intensity * 0.65 + 0.2;
    return `rgba(79,124,172,${alpha.toFixed(2)})`;
  }

  const topCountries = [...countries].sort((a, b) => b.count - a.count).slice(0, 10);

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
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
          Could not load analytics ({error}).
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Summary */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Page views', value: totalViews.toLocaleString() },
          { label: 'Visitors', value: totalVisitors.toLocaleString() },
          { label: 'Countries', value: countries.length.toString() },
        ].map(item => (
          <div key={item.label} style={{ background: 'var(--color-code-bg)', borderRadius: '0.75rem', padding: '0.875rem 1.25rem', minWidth: '110px' }}>
            <div style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>{item.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* World map */}
      <div style={{ background: 'var(--color-code-bg)', borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem' }}>
        <ComposableMap projectionConfig={{ scale: 147, center: [10, 10] }} style={{ width: '100%', height: 'auto', display: 'block' }}>
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: { id: string; rsmKey: string; [k: string]: unknown }[] }) =>
              geographies.map((geo: { id: string; rsmKey: string; [k: string]: unknown }) => {
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
              <div key={c.code} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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

      {countries.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem', padding: '2rem' }}>
          No visitor data yet.
        </p>
      )}

      {tooltip && (
        <div style={{ position: 'fixed', left: tooltip.x + 14, top: tooltip.y - 36, background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '0.5rem', padding: '0.4rem 0.875rem', fontSize: '0.8125rem', pointerEvents: 'none', zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{tooltip.name}</span>
          <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.625rem' }}>{tooltip.count.toLocaleString()} views</span>
        </div>
      )}
    </div>
  );
}
