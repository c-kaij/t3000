import { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { colors, card, btn } from '../tokens';
import { stores } from '../data/stores';

// ── Remote product shape (Shopify JSON) ─────────────────────────────────────

interface RemoteVariant {
  id: number;
  price: string;
  sku: string;
  available: boolean;
}

interface RemoteImage {
  src: string;
  width: number;
  height: number;
}

interface RemoteProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  tags: string[];
  variants: RemoteVariant[];
  images: RemoteImage[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const PACK_SIZE = 6; // units per distribution pack

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

type Quantities = Record<number, number>;

// ── Product card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  qty,
  onAdj,
}: {
  product: RemoteProduct;
  qty: number;
  onAdj: (delta: number) => void;
}) {
  const variant = product.variants[0];
  const available = variant?.available ?? false;
  const price = variant ? parseFloat(variant.price) : 0;
  const imageSrc = product.images[0]?.src;
  const description = stripHtml(product.body_html);

  return (
    <div
      style={{
        ...card({ padding: 12, opacity: available ? 1 : 0.5 }),
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      {/* Thumbnail */}
      {imageSrc && (
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 10,
            background: colors.bgMuted,
            overflow: 'hidden',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <img
            src={imageSrc}
            alt={product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {!available && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: '#fff', fontSize: 9, fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>
                Ej i{'\n'}lager
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title + pack badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: colors.text, flex: 1 }}>
            {product.title}
          </div>
          <span
            style={{
              background: colors.tealBg,
              color: colors.teal,
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: 20,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            {PACK_SIZE} st/förp.
          </span>
        </div>

        {description && (
          <p
            style={{
              fontSize: 12,
              color: colors.mid,
              lineHeight: 1.5,
              margin: '0 0 8px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          {/* Pricing block */}
          <div>
            {variant?.sku && (
              <div style={{ fontSize: 10, color: colors.soft, marginBottom: 2 }}>SKU: {variant.sku}</div>
            )}
            <div style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>
              {(price * PACK_SIZE).toFixed(2)}{' '}
              <span style={{ fontSize: 11, fontWeight: 400, color: colors.mid }}>kr/förp.</span>
            </div>
            <div style={{ fontSize: 11, color: colors.soft, marginTop: 1 }}>
              {price.toFixed(2)} kr/st
            </div>
          </div>

          {/* Pack stepper */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => onAdj(-1)}
                style={{
                  width: 32, height: 32, borderRadius: 16,
                  background: qty > 0 ? colors.bgMuted : colors.bgSoft,
                  border: `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon name="minus" size={14} color={qty > 0 ? colors.text : colors.soft} />
              </button>

              <span style={{ minWidth: 22, textAlign: 'center', fontWeight: 700, fontSize: 16, color: qty > 0 ? colors.blue : colors.text }}>
                {qty}
              </span>

              <button
                onClick={() => available && onAdj(1)}
                disabled={!available}
                style={{
                  width: 32, height: 32, borderRadius: 16,
                  background: available ? colors.blue : colors.bgMuted,
                  border: 'none',
                  cursor: available ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon name="plus" size={14} color={available ? '#fff' : colors.soft} />
              </button>
            </div>
            {/* Unit count under stepper */}
            <div style={{ fontSize: 10, color: qty > 0 ? colors.blue : colors.soft, fontWeight: 600 }}>
              {qty > 0 ? `${qty * PACK_SIZE} st` : 'förp.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main module ───────────────────────────────────────────────────────────────

export default function Orders() {
  const [selStore, setSelStore] = useState(stores[0]);
  const [qtys, setQtys] = useState<Quantities>({});
  const [products, setProducts] = useState<RemoteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch + filter on mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('https://rscued.se/products.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ products: RemoteProduct[] }>;
      })
      .then((data) => {
        const juiceProducts = data.products.filter((p) =>
          p.tags.some((t) => t.toLowerCase() === 'juice')
        );
        setProducts(juiceProducts);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const adj = (id: number, delta: number) =>
    setQtys((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + delta) }));

  const packCount = Object.values(qtys).reduce((s, v) => s + v, 0);
  const unitCount = packCount * PACK_SIZE;
  const total = products.reduce((s, p) => {
    const price = parseFloat(p.variants[0]?.price ?? '0');
    return s + (qtys[p.id] ?? 0) * price * PACK_SIZE;
  }, 0);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ margin: '0 0 16px', fontSize: 26, fontWeight: 700, color: colors.text }}>
        Ordermodul
      </h1>

      {/* Store selector */}
      <div
        style={{
          ...card({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, padding: 16 }),
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: colors.soft, marginBottom: 3 }}>Butik</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: colors.text }}>{selStore.name}</div>
          <div style={{ fontSize: 12, color: colors.mid, marginTop: 1 }}>{selStore.chain}</div>
        </div>
        <button
          onClick={() => {
            const idx = stores.indexOf(selStore);
            setSelStore(stores[(idx + 1) % stores.length]);
            setQtys({});
          }}
          style={{
            ...btn(colors.blueBg, colors.blue, {
              padding: '7px 14px',
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 8,
              minHeight: 44,
            }),
          }}
        >
          Byt butik
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                ...card({ padding: 0, overflow: 'hidden' }),
                animation: 'pulse 1.4s ease-in-out infinite',
              }}
            >
              <div style={{ width: '100%', aspectRatio: '16/9', background: colors.bgMuted }} />
              <div style={{ padding: 16 }}>
                <div style={{ height: 16, background: colors.bgMuted, borderRadius: 6, width: '60%', marginBottom: 10 }} />
                <div style={{ height: 12, background: colors.bgMuted, borderRadius: 6, width: '90%', marginBottom: 6 }} />
                <div style={{ height: 12, background: colors.bgMuted, borderRadius: 6, width: '75%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            ...card({ padding: 20, textAlign: 'center', background: colors.redBg, border: `1px solid ${colors.red}` }),
          }}
        >
          <div style={{ fontSize: 14, color: colors.red, fontWeight: 600, marginBottom: 4 }}>
            Kunde inte hämta produkter
          </div>
          <div style={{ fontSize: 12, color: colors.mid }}>{error}</div>
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && (
        <>
          <div style={{ fontSize: 12, color: colors.mid, marginBottom: 12 }}>
            {products.length} juiceprodukter
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              marginBottom: packCount > 0 ? 96 : 0,
            }}
          >
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                qty={qtys[p.id] ?? 0}
                onAdj={(delta) => adj(p.id, delta)}
              />
            ))}
          </div>
        </>
      )}

      {/* Sticky order summary */}
      {packCount > 0 && (
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
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
                {packCount} förp. · {unitCount} st totalt
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
                {total.toFixed(2)} kr
              </div>
            </div>
            <button
              style={{
                ...btn('#fff', colors.blue, {
                  padding: '10px 20px',
                  fontWeight: 700,
                  fontSize: 15,
                  borderRadius: 10,
                  minHeight: 44,
                }),
              }}
            >
              Lägg order
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
