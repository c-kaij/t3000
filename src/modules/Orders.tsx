import { useState } from 'react';
import Icon from '../components/Icon';
import { colors, card, btn } from '../tokens';
import { stores } from '../data/stores';
import { products } from '../data/products';

type Quantities = Record<number, number>;

export default function Orders() {
  const [selStore, setSelStore] = useState(stores[0]);
  const [qtys, setQtys] = useState<Quantities>({});

  const total = products.reduce((s, p) => s + (qtys[p.id] ?? 0) * p.price, 0);
  const count = Object.values(qtys).reduce((s, v) => s + v, 0);

  const adj = (id: number, delta: number) =>
    setQtys((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + delta) }));

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ margin: '0 0 16px', fontSize: 26, fontWeight: 700, color: colors.text }}>Ordermodul</h1>

      {/* Store selector */}
      <div style={{ ...card({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: 16 }) }}>
        <div>
          <div style={{ fontSize: 11, color: colors.soft, marginBottom: 3 }}>Butik</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: colors.text }}>{selStore.name}</div>
          <div style={{ fontSize: 12, color: colors.mid, marginTop: 1 }}>{selStore.chain}</div>
        </div>
        {/* Simple store picker — cycles through stores */}
        <button
          onClick={() => {
            const idx = stores.indexOf(selStore);
            setSelStore(stores[(idx + 1) % stores.length]);
            setQtys({});
          }}
          style={{ ...btn(colors.blueBg, colors.blue, { padding: '7px 14px', fontSize: 13, fontWeight: 600, borderRadius: 8, minHeight: 44 }) }}
        >
          Byt butik
        </button>
      </div>

      {/* Product list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: count > 0 ? 80 : 0 }}>
        {products.map((p) => (
          <div key={p.id} style={{ ...card({ opacity: p.inStock ? 1 : 0.55, padding: 16 }) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, marginRight: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: colors.text }}>{p.name}</span>
                  {p.rec && (
                    <span style={{ background: colors.blueBg, color: colors.blue, fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20 }}>
                      Rek.
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: colors.soft }}>
                  {p.sku} · {p.cat}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginTop: 4 }}>
                  {p.price.toFixed(2)} kr/st
                </div>
              </div>

              {/* Quantity control */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => adj(p.id, -1)}
                  style={{
                    width: 32, height: 32, borderRadius: 16,
                    background: colors.bgMuted, border: `1px solid ${colors.border}`,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon name="minus" size={14} color={colors.mid} />
                </button>
                <span style={{ width: 24, textAlign: 'center', fontWeight: 700, fontSize: 16, color: colors.text }}>
                  {qtys[p.id] ?? 0}
                </span>
                <button
                  onClick={() => p.inStock && adj(p.id, 1)}
                  disabled={!p.inStock}
                  style={{
                    width: 32, height: 32, borderRadius: 16,
                    background: p.inStock ? colors.blue : colors.bgMuted,
                    border: 'none',
                    cursor: p.inStock ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon name="plus" size={14} color={p.inStock ? '#fff' : colors.soft} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky order summary */}
      {count > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 76,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 768,
            padding: '12px 20px',
            boxSizing: 'border-box',
            background: colors.bg,
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              background: colors.blue,
              borderRadius: 14,
              padding: '14px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{count} produkter</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{total.toFixed(2)} kr</div>
            </div>
            <button style={{ ...btn('#fff', colors.blue, { padding: '10px 20px', fontWeight: 700, fontSize: 15, borderRadius: 10, minHeight: 44 }) }}>
              Lägg order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
