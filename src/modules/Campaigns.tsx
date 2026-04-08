import { useState } from 'react';
import Icon from '../components/Icon';
import { colors, card, btn } from '../tokens';
import { campaigns, type Campaign } from '../data/campaigns';

function CampaignDetail({ campaign, onBack }: { campaign: Campaign; onBack: () => void }) {
  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={onBack}
        style={btn('none', colors.blue, { fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, padding: 0, marginBottom: 20 })}
      >
        <Icon name="chevL" size={18} color={colors.blue} /> Kampanjer
      </button>

      <div style={{ ...card({ marginBottom: 12, padding: 20 }) }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: colors.text }}>{campaign.name}</h2>
            <span
              style={{
                background: campaign.status === 'active' ? colors.greenBg : colors.bgMuted,
                color: campaign.status === 'active' ? colors.green : colors.mid,
                padding: '3px 10px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {campaign.status === 'active' ? 'Aktiv' : 'Avslutad'}
            </span>
          </div>
          <div style={{ background: colors.amberBg, borderRadius: 12, padding: '10px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.amber }}>{campaign.discount}</div>
            <div style={{ fontSize: 10, color: colors.amber }}>Rabatt</div>
          </div>
        </div>

        <p style={{ color: colors.mid, fontSize: 14, lineHeight: 1.6, margin: '0 0 16px' }}>{campaign.desc}</p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {([
            ['Start', campaign.start],
            ['Slut', campaign.end],
            ['Typ', campaign.type],
          ] as [string, string][]).map(([l, v]) => (
            <div key={l} style={{ flex: 1, background: colors.bgSoft, borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 10, color: colors.soft, marginBottom: 2 }}>{l}</div>
              <div style={{ fontWeight: 600, fontSize: 13, color: colors.text }}>{v}</div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 12, color: colors.soft, marginBottom: 8 }}>Kedjor</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {campaign.chains.map((c) => (
              <span key={c} style={{ background: colors.blueBg, color: colors.blue, padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 500 }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Campaigns() {
  const [selected, setSelected] = useState<Campaign | null>(null);

  if (selected) return <CampaignDetail campaign={selected} onBack={() => setSelected(null)} />;

  const active = campaigns.filter((c) => c.status === 'active').length;
  const ended = campaigns.filter((c) => c.status === 'ended').length;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ margin: '0 0 16px', fontSize: 26, fontWeight: 700, color: colors.text }}>Kampanjstöd</h1>

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
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>April – Sommarstart</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>
          {active} aktiva kampanjer · {ended} avslutad
        </div>
      </div>

      {/* Campaign list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {campaigns.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelected(c)}
            style={{ ...card({ cursor: 'pointer', opacity: c.status === 'ended' ? 0.65 : 1, padding: 16 }) }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: colors.text, marginBottom: 3 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: colors.soft }}>
                  {c.type} · {c.start} – {c.end}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                <span
                  style={{
                    background: c.status === 'active' ? colors.greenBg : colors.bgMuted,
                    color: c.status === 'active' ? colors.green : colors.mid,
                    padding: '3px 8px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {c.status === 'active' ? 'Aktiv' : 'Avslutad'}
                </span>
                <span style={{ fontWeight: 700, fontSize: 16, color: colors.amber }}>{c.discount}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {c.chains.map((ch) => (
                <span key={ch} style={{ background: colors.bgMuted, color: colors.mid, padding: '2px 8px', borderRadius: 20, fontSize: 11 }}>
                  {ch}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
