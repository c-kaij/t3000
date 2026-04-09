import { useState } from 'react';
import Icon from '../components/Icon';
import { colors, card, btn } from '../tokens';
import { campaigns, type Campaign, type CampaignKind } from '../data/campaigns';
import KalenderView from './KalenderView';

// ── Helpers ───────────────────────────────────────────────────────────────────

const kindLabel: Record<CampaignKind, string> = {
  sampling:   'Provsmakningskampanj',
  volume:     'Volymkampanj',
  multiprice: 'Multipris',
};

const kindColor: Record<CampaignKind, [string, string]> = {
  sampling:   [colors.purple, colors.purpleBg],
  volume:     [colors.blue,   colors.blueBg],
  multiprice: [colors.teal,   colors.tealBg],
};

const statusLabel = (s: Campaign['status']) =>
  s === 'active' ? 'Aktiv' : s === 'upcoming' ? 'Kommande' : 'Avslutad';
const statusColor = (s: Campaign['status']): [string, string] =>
  s === 'active'   ? [colors.green,  colors.greenBg] :
  s === 'upcoming' ? [colors.blue,   colors.blueBg]  :
                     [colors.mid,    colors.bgMuted];

// ── Section header helper ─────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ ...card({ marginBottom: 12, padding: 20 }) }}>
      <h3 style={{ margin: '0 0 14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: 11, color: colors.soft }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Detail view ───────────────────────────────────────────────────────────────

function CampaignDetail({ campaign: c, onBack }: { campaign: Campaign; onBack: () => void }) {
  const [kindC, kindBg] = kindColor[c.kind];
  const [statC, statBg] = statusColor(c.status);

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={onBack}
        style={btn('none', colors.blue, { fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, padding: 0, marginBottom: 20 })}
      >
        <Icon name="chevL" size={18} color={colors.blue} /> Kampanjer
      </button>

      {/* Header card */}
      <div style={{ ...card({ marginBottom: 12, padding: 20 }) }}>
        {/* Kind + status badges */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{ background: kindBg, color: kindC, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
            {kindLabel[c.kind]}
          </span>
          <span style={{ background: statBg, color: statC, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
            {statusLabel(c.status)}
          </span>
        </div>

        <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700, color: colors.text }}>{c.name}</h2>
        <p style={{ color: colors.mid, fontSize: 14, lineHeight: 1.6, margin: '0 0 16px' }}>{c.desc}</p>

        {/* Date / type / discount row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {([
            ['Start',    c.start],
            ['Slut',     c.end],
            ['Typ',      c.type],
            ['Butiksrab.', c.storeDiscount],
          ] as [string, string][]).map(([l, v]) => (
            <div key={l} style={{ background: colors.bgSoft, borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: colors.soft, marginBottom: 3 }}>{l}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: l === 'Butiksrab.' ? colors.amber : colors.text }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Purpose */}
      <Section title="Syfte">
        <p style={{ margin: 0, fontSize: 14, color: colors.text, lineHeight: 1.6 }}>{c.purpose}</p>
      </Section>

      {/* Shopper stimuli */}
      <Section title="Konsumentaktivering">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ background: colors.purpleBg, borderRadius: 8, padding: 8, flexShrink: 0 }}>
            <Icon name="spark" size={18} color={colors.purple} />
          </div>
          <p style={{ margin: 0, fontSize: 14, color: colors.text, lineHeight: 1.6 }}>{c.stimuli}</p>
        </div>
      </Section>

      {/* Included products */}
      <Section title="Ingående produkter">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {c.products.map((p) => (
            <div
              key={p.sku}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: colors.bgSoft,
                borderRadius: 10,
                padding: '10px 12px',
              }}
            >
              <div style={{ background: colors.blueBg, borderRadius: 6, padding: '4px 8px', flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: colors.blue }}>SKU {p.sku}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>{p.title}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Material */}
      <Section title="Kampanjmaterial">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {c.material.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div
                style={{
                  width: 6, height: 6, borderRadius: 3,
                  background: colors.blue, flexShrink: 0, marginTop: 5,
                }}
              />
              <span style={{ fontSize: 13, color: colors.text, lineHeight: 1.5 }}>{m}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Chains */}
      <div style={{ ...card({ padding: 20 }) }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: colors.soft, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Kedjor
        </h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {c.chains.map((ch) => (
            <span key={ch} style={{ background: colors.blueBg, color: colors.blue, padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 500 }}>
              {ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── List view ─────────────────────────────────────────────────────────────────

type TabMode = 'campaigns' | 'calendar';

export default function Campaigns() {
  const [tab, setTab]         = useState<TabMode>('campaigns');
  const [selected, setSelected] = useState<Campaign | null>(null);

  if (selected) return <CampaignDetail campaign={selected} onBack={() => setSelected(null)} />;

  if (tab === 'calendar') {
    return (
      <div>
        {/* Tab toggle at top */}
        <div style={{ display: 'flex', background: colors.bgMuted, borderRadius: 10, padding: 3, margin: '16px 20px 0' }}>
          {(['campaigns', 'calendar'] as TabMode[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
                background: tab === t ? colors.bg : 'transparent',
                color: tab === t ? colors.text : colors.mid,
                fontWeight: tab === t ? 600 : 400,
                fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                minHeight: 44,
              }}
            >
              {t === 'campaigns' ? 'Kampanjer' : 'Kalender'}
            </button>
          ))}
        </div>
        <KalenderView />
      </div>
    );
  }

  const active   = campaigns.filter((c) => c.status === 'active').length;
  const upcoming = campaigns.filter((c) => c.status === 'upcoming').length;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 700, color: colors.text }}>Kampanjstöd</h1>

      {/* Tab toggle */}
      <div style={{ display: 'flex', background: colors.bgMuted, borderRadius: 10, padding: 3, marginBottom: 16 }}>
        {(['campaigns', 'calendar'] as TabMode[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
              background: tab === t ? colors.bg : 'transparent',
              color: tab === t ? colors.text : colors.mid,
              fontWeight: tab === t ? 600 : 400,
              fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              minHeight: 44,
            }}
          >
            {t === 'campaigns' ? 'Kampanjer' : 'Kalender'}
          </button>
        ))}
      </div>

      {/* Commercial calendar header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #d97706, #f59e0b)',
          borderRadius: 16,
          padding: 18,
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>
          Kommersiell kalender
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>April–Maj 2026</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>
          {active} aktiva · {upcoming} kommande
        </div>
      </div>

      {/* Campaign list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {campaigns.map((c) => {
          const [kindC, kindBg] = kindColor[c.kind];
          const [statC, statBg] = statusColor(c.status);
          return (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              style={{ ...card({ cursor: 'pointer', padding: 16 }) }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ flex: 1, marginRight: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: colors.text, marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: colors.soft }}>{c.type} · {c.start} – {c.end}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                  <span style={{ background: statBg, color: statC, padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                    {statusLabel(c.status)}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 16, color: colors.amber }}>{c.storeDiscount}</span>
                </div>
              </div>

              {/* Kind badge + product count */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ background: kindBg, color: kindC, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                    {kindLabel[c.kind]}
                  </span>
                  {c.chains.map((ch) => (
                    <span key={ch} style={{ background: colors.bgMuted, color: colors.mid, padding: '2px 8px', borderRadius: 20, fontSize: 11 }}>
                      {ch}
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: 11, color: colors.soft, flexShrink: 0 }}>
                  {c.products.length} produkter →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
