import { useState } from 'react';
import Icon from '../components/Icon';
import { colors, card, btn } from '../tokens';
import { stores, type Store } from '../data/stores';

const chainColor: Record<string, [string, string]> = {
  ICA:    [colors.red,    colors.redBg],
  Willys: [colors.green,  colors.greenBg],
  Coop:   [colors.blue,   colors.blueBg],
  Hemköp: [colors.purple, colors.purpleBg],
};

function PriorityBadge({ priority }: { priority: Store['priority'] }) {
  const label = priority === 'high' ? 'Hög prio' : priority === 'medium' ? 'Medium' : 'Låg prio';
  const bg    = priority === 'high' ? colors.redBg : priority === 'medium' ? colors.amberBg : colors.bgMuted;
  const color = priority === 'high' ? colors.red   : priority === 'medium' ? colors.amber    : colors.mid;
  return (
    <span style={{ background: bg, color, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
      {label}
    </span>
  );
}

function StoreDetail({ store, onBack }: { store: Store; onBack: () => void }) {
  return (
    <div style={{ padding: 20 }}>
      <button onClick={onBack} style={btn('none', colors.blue, { fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, padding: 0, marginBottom: 20 })}>
        <Icon name="chevL" size={18} color={colors.blue} /> Butikslista
      </button>

      {/* Header card */}
      <div style={{ ...card({ marginBottom: 12, padding: 20 }) }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: colors.text }}>{store.name}</h2>
            <span style={{ fontSize: 13, color: colors.mid }}>{store.chain}</span>
          </div>
          <PriorityBadge priority={store.priority} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {([
            [String(store.orders), 'Orders'],
            [`${store.revenue} kr`, 'Omsättning'],
          ] as [string, string][]).map(([v, l]) => (
            <div key={l} style={{ flex: 1, background: colors.bgSoft, borderRadius: 10, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: v.length > 7 ? 14 : 18, fontWeight: 700, color: colors.text }}>{v}</div>
              <div style={{ fontSize: 11, color: colors.soft, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact card */}
      <div style={{ ...card({ marginBottom: 12, padding: 20 }) }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: colors.text }}>Kontakt</h3>
        {([
          [store.contact, 'Kontaktperson', 'users',  colors.purple, colors.purpleBg],
          [store.phone,   null,            'phone',  colors.green,  colors.greenBg],
          [store.email,   null,            'mail',   colors.amber,  colors.amberBg],
          [store.address, null,            'pin',    colors.mid,    colors.bgMuted],
        ] as [string, string | null, string, string, string][]).map(([v, l, ic, c, bg]) => (
          <div key={ic} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ background: bg, borderRadius: 8, padding: 8, flexShrink: 0 }}>
              <Icon name={ic as any} size={16} color={c} />
            </div>
            <div>
              <div style={{ fontSize: 14, color: colors.text }}>{v}</div>
              {l && <div style={{ fontSize: 11, color: colors.soft }}>{l}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Visit history */}
      <div style={card({ padding: 20 })}>
        <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: colors.text }}>Besökshistorik</h3>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, background: colors.bgSoft, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 11, color: colors.soft, marginBottom: 2 }}>Senaste</div>
            <div style={{ fontWeight: 600, fontSize: 14, color: colors.text }}>{store.lastVisit}</div>
          </div>
          <div style={{ flex: 1, background: colors.blueBg, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 11, color: colors.blue, marginBottom: 2 }}>Nästa</div>
            <div style={{ fontWeight: 600, fontSize: 14, color: colors.blue }}>{store.nextVisit}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CRM() {
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Store | null>(null);

  const filtered = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.chain.toLowerCase().includes(q.toLowerCase())
  );

  if (selected) return <StoreDetail store={selected} onBack={() => setSelected(null)} />;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ margin: '0 0 16px', fontSize: 26, fontWeight: 700, color: colors.text }}>Butiker</h1>

      {/* Search bar */}
      <div style={{ ...card({ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }) }}>
        <Icon name="search" size={18} color={colors.soft} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Sök butik eller kedja…"
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            fontSize: 15,
            color: colors.text,
            background: 'transparent',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Store list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((s) => {
          const [cc, cbg] = chainColor[s.chain] ?? [colors.mid, colors.bgMuted];
          return (
            <div
              key={s.id}
              onClick={() => setSelected(s)}
              style={{ ...card({ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }) }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: cbg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: cc }}>{s.chain.slice(0, 2)}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 12, color: colors.soft, marginTop: 2 }}>
                  {s.contact} · {s.lastVisit}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: s.priority === 'high' ? colors.red : s.priority === 'medium' ? colors.amber : colors.soft,
                  }}
                />
                <Icon name="chevR" size={16} color={colors.soft} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
