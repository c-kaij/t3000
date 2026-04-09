import { useState } from 'react';
import { colors, card, btn } from '../tokens';
import {
  calendarEvents, ROW_LABELS, ROW_ORDER, MONTHS,
  type CalendarEvent, type CalendarRow,
} from '../data/calendar';

// ── Layout constants ──────────────────────────────────────────────────────────

const LABEL_W = 120; // px for row label column
const MONTH_W = 62;  // px per month column

// ── Tooltip / detail popover ──────────────────────────────────────────────────

function EventDetail({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          ...card({ padding: 20 }),
          width: '100%', maxWidth: 500,
          borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
          borderRadius: '16px 16px 0 0',
          marginBottom: 0,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div
              style={{
                display: 'inline-block',
                background: event.color, color: event.textColor,
                fontSize: 10, fontWeight: 700, padding: '3px 8px',
                borderRadius: 20, marginBottom: 8,
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}
            >
              {ROW_LABELS[event.row]}
            </div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: colors.text }}>{event.label}</h3>
            {event.note && (
              <p style={{ margin: '4px 0 0', fontSize: 13, color: colors.mid }}>{event.note}</p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ ...btn('none', colors.mid, { fontSize: 20, lineHeight: 1, padding: 4 }) }}
          >
            ×
          </button>
        </div>
        <div style={{ fontSize: 13, color: colors.soft }}>
          {MONTHS[event.startMonth]}
          {event.endMonth !== event.startMonth ? ` – ${MONTHS[event.endMonth]}` : ''}
        </div>
      </div>
    </div>
  );
}

// ── Single event block ────────────────────────────────────────────────────────

function EventBlock({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const spanMonths = event.endMonth - event.startMonth + 1;
  const left = event.startMonth * MONTH_W;
  const width = spanMonths * MONTH_W - 4;

  return (
    <div
      onClick={onClick}
      title={event.label}
      style={{
        position: 'absolute',
        left, width,
        top: 4, height: 28,
        background: event.color,
        color: event.textColor,
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 8,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        userSelect: 'none',
      }}
    >
      {event.label}
    </div>
  );
}

// ── Add event form ────────────────────────────────────────────────────────────

let nextId = 100;

const ROW_COLORS: Record<CalendarRow, { color: string; textColor: string }> = {
  theme:    { color: '#dbeafe', textColor: '#1d4ed8' },
  holiday:  { color: '#f3e8ff', textColor: '#7e22ce' },
  campaign: { color: '#e0f2fe', textColor: '#0369a1' },
  catman:   { color: '#f1f5f9', textColor: '#475569' },
  other:    { color: '#f5f5f5', textColor: '#737373' },
};

interface AddFormProps {
  onAdd: (e: CalendarEvent) => void;
  onClose: () => void;
}

function AddForm({ onAdd, onClose }: AddFormProps) {
  const [label, setLabel] = useState('');
  const [row, setRow]   = useState<CalendarRow>('campaign');
  const [start, setStart] = useState(0);
  const [end, setEnd]   = useState(0);
  const [note, setNote] = useState('');

  function submit() {
    if (!label.trim()) return;
    const colors_ = ROW_COLORS[row];
    onAdd({
      id: `custom-${nextId++}`,
      label: label.trim(),
      row,
      startMonth: start,
      endMonth: Math.max(start, end),
      color: colors_.color,
      textColor: colors_.textColor,
      note: note.trim() || undefined,
    });
    onClose();
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 10,
    border: `1px solid ${colors.border}`, fontSize: 14,
    fontFamily: 'inherit', color: colors.text,
    background: colors.bgSoft, outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: colors.soft,
    textTransform: 'uppercase', letterSpacing: '0.5px',
    display: 'block', marginBottom: 5,
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          ...card({ padding: 20 }),
          width: '100%', maxWidth: 500,
          borderRadius: '16px 16px 0 0',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: colors.text }}>Lägg till post</h3>
          <button onClick={onClose} style={{ ...btn('none', colors.mid, { fontSize: 20, padding: 4 }) }}>×</button>
        </div>

        <div>
          <label style={labelStyle}>Titel</label>
          <input style={inputStyle} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Namn på kampanj / högtid…" />
        </div>

        <div>
          <label style={labelStyle}>Rad</label>
          <select style={inputStyle} value={row} onChange={(e) => setRow(e.target.value as CalendarRow)}>
            {ROW_ORDER.map((r) => (
              <option key={r} value={r}>{ROW_LABELS[r]}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>Startmånad</label>
            <select style={inputStyle} value={start} onChange={(e) => setStart(Number(e.target.value))}>
              {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Slutmånad</label>
            <select style={inputStyle} value={end} onChange={(e) => setEnd(Number(e.target.value))}>
              {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Anteckning (valfritt)</label>
          <input style={inputStyle} value={note} onChange={(e) => setNote(e.target.value)} placeholder="T.ex. datum, detaljer…" />
        </div>

        <button
          onClick={submit}
          style={{
            ...btn(colors.blue, '#fff', {
              width: '100%', padding: '12px 0', borderRadius: 12,
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }),
          }}
        >
          Lägg till
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function KalenderView() {
  const [events, setEvents] = useState<CalendarEvent[]>(calendarEvents);
  const [detail, setDetail] = useState<CalendarEvent | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  function addEvent(e: CalendarEvent) {
    setEvents((prev) => [...prev, e]);
  }

  const totalW = MONTHS.length * MONTH_W;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: colors.text }}>Kommersiell kalender</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: colors.mid }}>Årsöversikt — teman, högtider & kampanjer</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            ...btn(colors.blue, '#fff', {
              fontSize: 13, fontWeight: 600, padding: '8px 14px',
              borderRadius: 10, cursor: 'pointer', flexShrink: 0,
            }),
          }}
        >
          + Lägg till
        </button>
      </div>

      {/* Scrollable grid */}
      <div style={{ overflowX: 'auto', marginTop: 20 }}>
        <div style={{ minWidth: LABEL_W + totalW + 16 }}>

          {/* Month header */}
          <div style={{ display: 'flex', marginLeft: LABEL_W, marginBottom: 6 }}>
            {MONTHS.map((m, i) => (
              <div
                key={i}
                style={{
                  width: MONTH_W, flexShrink: 0,
                  fontSize: 11, fontWeight: 600,
                  color: colors.mid, textAlign: 'center',
                }}
              >
                {m}
              </div>
            ))}
          </div>

          {/* Rows */}
          {ROW_ORDER.map((rowKey) => {
            const rowEvents = events.filter((e) => e.row === rowKey);
            return (
              <div key={rowKey} style={{ display: 'flex', marginBottom: 12, alignItems: 'flex-start' }}>
                {/* Row label */}
                <div
                  style={{
                    width: LABEL_W, flexShrink: 0, paddingRight: 10,
                    paddingTop: 10,
                    fontSize: 11, fontWeight: 600, color: colors.soft,
                    textTransform: 'uppercase', letterSpacing: '0.4px',
                    lineHeight: 1.3,
                  }}
                >
                  {ROW_LABELS[rowKey]}
                </div>

                {/* Events area */}
                <div
                  style={{
                    position: 'relative',
                    width: totalW,
                    minHeight: 36,
                    background: colors.bgSoft,
                    borderRadius: 8,
                  }}
                >
                  {/* Month grid lines */}
                  {MONTHS.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: i * MONTH_W,
                        top: 0, bottom: 0,
                        width: 1,
                        background: i === 0 ? 'transparent' : colors.border,
                        opacity: 0.6,
                      }}
                    />
                  ))}

                  {rowEvents.map((e) => (
                    <EventBlock key={e.id} event={e} onClick={() => setDetail(e)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
        {ROW_ORDER.map((r) => {
          const sample = ROW_COLORS[r];
          return (
            <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: sample.color, border: `1px solid ${sample.textColor}33` }} />
              <span style={{ fontSize: 11, color: colors.mid }}>{ROW_LABELS[r]}</span>
            </div>
          );
        })}
      </div>

      {detail && <EventDetail event={detail} onClose={() => setDetail(null)} />}
      {showAdd && <AddForm onAdd={addEvent} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
