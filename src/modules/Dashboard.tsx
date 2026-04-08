import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { colors, card, btn } from '../tokens';
import { meetings } from '../data/stores';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <p style={{ margin: '0 0 2px', fontSize: 14, color: colors.mid }}>God morgon 👋</p>
      <h1 style={{ margin: '0 0 20px', fontSize: 26, fontWeight: 700, color: colors.text }}>
        Erik Lindström
      </h1>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
        {(
          [
            ['4', 'Butiker idag', colors.blue, colors.blueBg],
            ['7', 'Öppna orders', colors.green, colors.greenBg],
            ['2', 'Kampanjer', colors.amber, colors.amberBg],
          ] as [string, string, string, string][]
        ).map(([v, l, c, bg]) => (
          <div key={l} style={{ background: bg, borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: c }}>{v}</div>
            <div style={{ fontSize: 11, color: c, marginTop: 2, fontWeight: 500 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* AI insight card */}
      <div
        onClick={() => navigate('/ai')}
        style={{
          background: colors.blue,
          borderRadius: 16,
          padding: 18,
          marginBottom: 20,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.75)',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: 6,
          }}
        >
          AI Rådgivning
        </div>
        <p style={{ margin: 0, fontSize: 14, color: '#fff', lineHeight: 1.55 }}>
          Willys Södermalm har lågt lager på Produkt Alpha. Rekommenderar orderläggning idag för att
          inte missa Sommarkampanjen.
        </p>
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 13,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          Visa rekommendationer <Icon name="chevR" size={16} color="#fff" />
        </div>
      </div>

      {/* Today's visits */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: colors.text }}>Dagens besök</h2>
          <button onClick={() => navigate('/rutter')} style={btn('none', colors.blue, { fontSize: 13, fontWeight: 600, padding: 0 })}>
            Se alla
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {meetings.slice(0, 3).map((m) => (
            <div key={m.id} style={{ ...card(), display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  background: colors.blueBg,
                  borderRadius: 10,
                  padding: '8px 10px',
                  textAlign: 'center',
                  minWidth: 52,
                  flexShrink: 0,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.blue }}>{m.time}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: colors.text }}>{m.store}</div>
                <div style={{ fontSize: 12, color: colors.soft, marginTop: 1 }}>
                  {m.type} · {m.duration} min
                </div>
              </div>
              <Icon name="chevR" size={16} color={colors.soft} />
            </div>
          ))}
        </div>
      </div>

      {/* Module shortcuts */}
      <h2 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700, color: colors.text }}>Moduler</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {(
          [
            ['CRM', '5 butiker', 'users', '/crm', colors.purple, colors.purpleBg],
            ['Ordermodul', 'Lägg order', 'cart', '/order', colors.green, colors.greenBg],
            ['Kampanjstöd', '2 aktiva', 'tag', '/kampanj', colors.amber, colors.amberBg],
            ['Rapportering', 'Veckostatus', 'trend', '/', colors.teal, colors.tealBg],
          ] as [string, string, string, string, string, string][]
        ).map(([l, sub, ic, path, c, bg]) => (
          <div
            key={l}
            onClick={() => navigate(path)}
            style={{
              ...card({ cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16 }),
            }}
          >
            <div style={{ background: bg, borderRadius: 10, padding: 10, flexShrink: 0 }}>
              <Icon name={ic as any} size={20} color={c} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: colors.text }}>{l}</div>
              <div style={{ fontSize: 12, color: colors.soft, marginTop: 2 }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
