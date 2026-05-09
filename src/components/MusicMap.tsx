import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

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

export interface MapCountry {
  countryCode: string;
  country: string;
  flag: string;
  totalCount: number;
  filteredCount: number;
}

interface Props {
  countries: MapCountry[];
  selectedCountries: Set<string>;
  onToggleCountry: (code: string) => void;
}

export default function MusicMap({ countries, selectedCountries, onToggleCountry }: Props) {
  const [open, setOpen] = useState(false);
  const [tooltip, setTooltip] = useState<{
    country: string; flag: string; total: number; filtered: number; x: number; y: number;
  } | null>(null);

  const byCode = new Map(countries.map(c => [c.countryCode, c]));

  const numToCode = new Map<number, string>(
    Object.entries(A2_TO_NUM).map(([code, num]) => [num, code])
  );

  function fillColor(numericId: number, hover = false) {
    const code = numToCode.get(numericId);
    if (!code) return 'var(--color-code-bg)';
    const info = byCode.get(code);
    if (!info) return hover ? '#b0b0b0' : 'var(--color-code-bg)';

    const isSelected = selectedCountries.has(code);
    const hasFiltered = info.filteredCount > 0;

    if (isSelected)   return hover ? 'rgba(79,124,172,0.95)' : 'rgba(79,124,172,0.85)';
    if (hasFiltered)  return hover ? 'rgba(79,124,172,0.65)' : 'rgba(79,124,172,0.45)';
    // Has reviews but none match current filter — dimmed
    return hover ? 'rgba(79,124,172,0.25)' : 'rgba(79,124,172,0.12)';
  }

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {/* Header / toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
          background: 'var(--color-code-bg)', border: '1px solid var(--color-border)',
          borderRadius: open ? '0.75rem 0.75rem 0 0' : '0.75rem',
          padding: '0.625rem 1rem', cursor: 'pointer', transition: 'border-radius 0.2s',
          marginBottom: open ? 0 : undefined,
        }}
      >
        <svg
          width="14" height="14" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={2}
          style={{ color: 'var(--color-text-muted)', transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          World Map
        </span>
        {selectedCountries.size > 0 && (
          <span style={{ fontSize: '0.75rem', background: 'rgba(79,124,172,0.15)', color: 'var(--color-accent)', padding: '0.1rem 0.5rem', borderRadius: '9999px', fontWeight: 500 }}>
            {selectedCountries.size} selected
          </span>
        )}
      </button>

      {open && (
        <>
          <div style={{
            background: 'var(--color-code-bg)', borderRadius: '0 0 0.75rem 0.75rem',
            overflow: 'hidden', borderTop: '1px solid var(--color-border)',
            '--map-stroke': 'rgba(140,140,140,0.4)',
          } as React.CSSProperties}>
            <ComposableMap
              projectionConfig={{ scale: 147, center: [10, 10] }}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }: { geographies: { id: string; rsmKey: string; [k: string]: unknown }[] }) =>
                  geographies.map((geo: { id: string; rsmKey: string; [k: string]: unknown }) => {
                    const numId = parseInt(geo.id);
                    const code = numToCode.get(numId);
                    const info = code ? byCode.get(code) : undefined;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillColor(numId)}
                        stroke="var(--map-stroke)"
                        strokeWidth={0.6}
                        onClick={() => { if (info) onToggleCountry(info.countryCode); }}
                        onMouseEnter={(e: React.MouseEvent) => {
                          if (info) setTooltip({ country: info.country, flag: info.flag, total: info.totalCount, filtered: info.filteredCount, x: e.clientX, y: e.clientY });
                        }}
                        onMouseMove={(e: React.MouseEvent) => {
                          if (info) setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null);
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        style={{
                          default: { outline: 'none' },
                          hover: { fill: fillColor(numId, true), outline: 'none', cursor: info ? 'pointer' : 'default' },
                          pressed: { outline: 'none' },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(79,124,172,0.85)', display: 'inline-block' }} />
              Selected
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(79,124,172,0.45)', display: 'inline-block' }} />
              Matches filter
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(79,124,172,0.12)', display: 'inline-block' }} />
              Filtered out
            </span>
          </div>
        </>
      )}

      {tooltip && (
        <div style={{
          position: 'fixed', left: tooltip.x + 14, top: tooltip.y - 40,
          background: 'var(--color-card)', border: '1px solid var(--color-border)',
          borderRadius: '0.5rem', padding: '0.4rem 0.875rem', fontSize: '0.8125rem',
          pointerEvents: 'none', zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', whiteSpace: 'nowrap',
        }}>
          <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{tooltip.flag} {tooltip.country}</span>
          <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>
            {tooltip.filtered === tooltip.total
              ? `${tooltip.total} review${tooltip.total !== 1 ? 's' : ''}`
              : `${tooltip.filtered} / ${tooltip.total} match`}
          </span>
        </div>
      )}
    </div>
  );
}
