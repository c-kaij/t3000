import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { colors, card, btn } from '../tokens';
import { stores, weekMeetings, type Meeting, type Store } from '../data/stores';
import { computeRecommendations } from '../utils/geoUtils';

// ── Standard visit purposes ───────────────────────────────────────────────────

const PURPOSES = [
  'Ordergenomgång',
  'Kampanjpresentation',
  'Hyllplacering',
  'Uppföljning',
  'Smakprovning',
  'Relationsbesök',
  'Ny produkt',
  'POS-material',
];

// ── Icon factories ────────────────────────────────────────────────────────────

function numberedIcon(label: string | number, bg: string): L.DivIcon {
  return L.divIcon({
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -36],
    html: `<div style="
      width:34px;height:34px;border-radius:50%;
      background:${bg};color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-weight:700;font-size:13px;
      box-shadow:0 2px 8px rgba(0,0,0,0.28);
      border:2.5px solid rgba(255,255,255,0.95);
      font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif;
    ">${label}</div>`,
  });
}

function dotIcon(bg: string): L.DivIcon {
  return L.divIcon({
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
    html: `<div style="
      width:20px;height:20px;border-radius:50%;
      background:${bg};
      box-shadow:0 1px 4px rgba(0,0,0,0.22);
      border:2px solid rgba(255,255,255,0.9);
    "></div>`,
  });
}

// ── Bounds fitter ─────────────────────────────────────────────────────────────

function BoundsFitter({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) return;
    map.fitBounds(L.latLngBounds(positions), { padding: [48, 48], maxZoom: 14 });
  }, [map, positions]);
  return null;
}

// ── Priority colours ──────────────────────────────────────────────────────────

const priorityColor: Record<Store['priority'], string> = {
  high:   colors.red,
  medium: colors.amber,
  low:    colors.soft,
};

// ── Visit card with editable time + purposes ──────────────────────────────────

interface VisitCardProps {
  meeting: Meeting;
  index: number;
  total: number;
  store?: Store;
  time: string;
  purposes: string[];
  onTimeChange: (t: string) => void;
  onPurposeToggle: (p: string) => void;
  onMove: (dir: -1 | 1) => void;
}

function VisitCard({
  meeting, index, total, store,
  time, purposes, onTimeChange, onPurposeToggle, onMove,
}: VisitCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingTime, setEditingTime] = useState(false);

  return (
    <div style={{ ...card({ padding: '10px 12px' }), display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Number badge */}
        <div
          style={{
            width: 28, height: 28, borderRadius: 14,
            background: colors.blue, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}
        >
          {index + 1}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {meeting.store}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            {/* Editable time */}
            {editingTime ? (
              <input
                type="time"
                defaultValue={time}
                autoFocus
                onBlur={(e) => { onTimeChange(e.target.value); setEditingTime(false); }}
                onChange={(e) => onTimeChange(e.target.value)}
                style={{
                  fontSize: 12, fontFamily: 'inherit', border: `1px solid ${colors.blue}`,
                  borderRadius: 6, padding: '1px 6px', color: colors.blue,
                  background: colors.blueBg, outline: 'none', width: 80,
                }}
              />
            ) : (
              <button
                onClick={() => setEditingTime(true)}
                style={{
                  ...btn('none', colors.blue, {
                    fontSize: 12, fontWeight: 600, padding: '1px 6px',
                    border: `1px solid ${colors.blueBg}`, borderRadius: 6,
                    background: colors.blueBg, cursor: 'pointer',
                  }),
                }}
              >
                {time}
              </button>
            )}
            <span style={{ fontSize: 11, color: colors.soft }}>
              · {meeting.duration} min{store && ` · ${store.chain}`}
            </span>
          </div>
        </div>

        {/* Expand purposes + up/down */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              ...btn(colors.bgMuted, purposes.length > 0 ? colors.blue : colors.mid, {
                fontSize: 11, fontWeight: 600, padding: '4px 8px',
                borderRadius: 6, cursor: 'pointer',
                border: purposes.length > 0 ? `1px solid ${colors.blueBg}` : 'none',
              }),
            }}
          >
            {purposes.length > 0 ? `${purposes.length} syfte${purposes.length > 1 ? 'n' : ''}` : 'Syfte'} {expanded ? '▲' : '▼'}
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <button
              onClick={() => onMove(-1)}
              disabled={index === 0}
              style={{
                ...btn(colors.bgMuted, colors.mid, {
                  width: 28, height: 28, borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, opacity: index === 0 ? 0.25 : 1,
                  cursor: index === 0 ? 'default' : 'pointer',
                }),
              }}
            >▲</button>
            <button
              onClick={() => onMove(1)}
              disabled={index === total - 1}
              style={{
                ...btn(colors.bgMuted, colors.mid, {
                  width: 28, height: 28, borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, opacity: index === total - 1 ? 0.25 : 1,
                  cursor: index === total - 1 ? 'default' : 'pointer',
                }),
              }}
            >▼</button>
          </div>
        </div>
      </div>

      {/* Purpose checkboxes */}
      {expanded && (
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: `1px solid ${colors.border}`,
            display: 'flex', flexWrap: 'wrap', gap: 7,
          }}
        >
          {PURPOSES.map((p) => {
            const checked = purposes.includes(p);
            return (
              <button
                key={p}
                onClick={() => onPurposeToggle(p)}
                style={{
                  ...btn(
                    checked ? colors.blueBg : colors.bgSoft,
                    checked ? colors.blue : colors.mid,
                    {
                      fontSize: 12, fontWeight: checked ? 600 : 400,
                      padding: '5px 10px', borderRadius: 20,
                      border: checked ? `1px solid ${colors.blue}` : `1px solid ${colors.border}`,
                      cursor: 'pointer',
                    }
                  ),
                }}
              >
                {checked ? '✓ ' : ''}{p}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  selDay: number;
  dayName: string;
}

export default function KartaView({ selDay, dayName }: Props) {
  const dayMeetings = weekMeetings[selDay] ?? [];
  const [orderedStops, setOrderedStops] = useState<Meeting[]>([...dayMeetings]);
  const [visitTimes, setVisitTimes] = useState<Record<number, string>>({});
  const [visitPurposes, setVisitPurposes] = useState<Record<number, string[]>>({});

  // Reset on day change
  useEffect(() => {
    setOrderedStops([...(weekMeetings[selDay] ?? [])]);
    setVisitTimes({});
    setVisitPurposes({});
  }, [selDay]);

  const storeByName = useMemo(
    () => Object.fromEntries(stores.map((s) => [s.name, s])),
    [],
  );

  const routeStores = useMemo(
    () => orderedStops.map((m) => storeByName[m.store]).filter((s): s is Store => s !== undefined),
    [orderedStops, storeByName],
  );

  const unscheduledStores = useMemo(
    () => stores.filter((s) => !orderedStops.some((m) => m.store === s.name)),
    [orderedStops],
  );

  const recommendations = useMemo(
    () => computeRecommendations(orderedStops, stores, storeByName),
    [orderedStops, storeByName],
  );

  const routePositions: [number, number][] = routeStores.map((s) => [s.lat, s.lng]);
  const allPositions: [number, number][] = stores.map((s) => [s.lat, s.lng]);
  const boundsPositions = routePositions.length > 0 ? routePositions : allPositions;

  function moveStop(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= orderedStops.length) return;
    setOrderedStops((prev) => {
      const arr = [...prev];
      [arr[index], arr[next]] = [arr[next], arr[index]];
      return arr;
    });
  }

  function setTime(id: number, t: string) {
    setVisitTimes((prev) => ({ ...prev, [id]: t }));
  }

  function togglePurpose(id: number, p: string) {
    setVisitPurposes((prev) => {
      const current = prev[id] ?? [];
      return {
        ...prev,
        [id]: current.includes(p) ? current.filter((x) => x !== p) : [...current, p],
      };
    });
  }

  return (
    <div>
      {/* Salesperson card */}
      <div style={{ ...card({ marginBottom: 16, padding: 16 }), display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 44, height: 44, borderRadius: 22,
            background: colors.blueBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 700, color: colors.blue, flexShrink: 0,
          }}
        >
          EL
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: colors.text }}>Erik Lindström</div>
          <div style={{ fontSize: 12, color: colors.mid, marginTop: 2 }}>Distrikt: Stockholm · {dayName}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.blue }}>{orderedStops.length}</div>
          <div style={{ fontSize: 11, color: colors.soft }}>besök</div>
        </div>
      </div>

      {/* Map */}
      <div
        key={selDay}
        style={{
          height: 300, borderRadius: 14, overflow: 'hidden',
          marginBottom: 20, border: `1px solid ${colors.border}`,
        }}
      >
        <MapContainer
          style={{ height: '100%', width: '100%' }}
          center={[59.325, 18.07]}
          zoom={11}
          scrollWheelZoom={false}
          zoomControl={true}
          attributionControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {routePositions.length > 1 && (
            <Polyline
              positions={routePositions}
              pathOptions={{ color: colors.blue, weight: 3, opacity: 0.75, dashArray: '7 5' }}
            />
          )}
          {orderedStops.map((m, i) => {
            const store = storeByName[m.store];
            if (!store) return null;
            return (
              <Marker key={m.id} position={[store.lat, store.lng]} icon={numberedIcon(i + 1, colors.blue)}>
                <Popup>
                  <strong>{store.name}</strong><br />
                  {visitTimes[m.id] ?? m.time} · {m.type}<br />
                  {m.duration} min
                </Popup>
              </Marker>
            );
          })}
          {unscheduledStores.map((s) => (
            <Marker key={s.id} position={[s.lat, s.lng]} icon={dotIcon(priorityColor[s.priority])}>
              <Popup>
                <strong>{s.name}</strong><br />
                {s.chain} · {s.priority === 'high' ? 'Hög prio' : s.priority === 'medium' ? 'Medium' : 'Låg prio'}
              </Popup>
            </Marker>
          ))}
          <BoundsFitter positions={boundsPositions} />
        </MapContainer>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          ['Planerat besök', colors.blue],
          ['Hög prio', colors.red],
          ['Medium prio', colors.amber],
          ['Låg prio', colors.soft],
        ].map(([label, color]) => (
          <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: color as string }} />
            <span style={{ fontSize: 11, color: colors.mid }}>{label as string}</span>
          </div>
        ))}
      </div>

      {/* Visit order list */}
      <h3 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: colors.text }}>
        Besöksordning
      </h3>
      <p style={{ fontSize: 11, color: colors.soft, margin: '0 0 10px' }}>
        Tryck på tid för att ändra · Tryck på Syfte för att välja besöksmål
      </p>

      {orderedStops.length === 0 ? (
        <div style={{ ...card({ padding: 24, textAlign: 'center', color: colors.soft, marginBottom: 20 }) }}>
          Inga besök planerade
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {orderedStops.map((m, i) => (
            <VisitCard
              key={m.id}
              meeting={m}
              index={i}
              total={orderedStops.length}
              store={storeByName[m.store]}
              time={visitTimes[m.id] ?? m.time}
              purposes={visitPurposes[m.id] ?? []}
              onTimeChange={(t) => setTime(m.id, t)}
              onPurposeToggle={(p) => togglePurpose(m.id, p)}
              onMove={(dir) => moveStop(i, dir)}
            />
          ))}
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ background: colors.tealBg, borderRadius: 8, padding: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: colors.text }}>
              Rekommenderade på vägen
            </h3>
          </div>
          <p style={{ fontSize: 12, color: colors.mid, margin: '0 0 10px' }}>
            Baserat på luckor i schemat och geografisk placering längs rutten.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recommendations.map((s) => (
              <div
                key={s.id}
                style={{
                  ...card({ padding: '10px 14px', border: `1px solid ${colors.tealBg}` }),
                  display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: 4, background: priorityColor[s.priority], flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: 11, color: colors.soft, marginTop: 1 }}>
                    {s.chain} · {s.address}
                  </div>
                </div>
                <span style={{ background: colors.tealBg, color: colors.teal, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, flexShrink: 0 }}>
                  På vägen
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
