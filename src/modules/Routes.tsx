import { useState } from 'react';
import Icon from '../components/Icon';
import { colors, card } from '../tokens';
import { weekMeetings, type Meeting } from '../data/stores';
import KartaView from './KartaView';

const DAYS = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre'];
const DATES = [6, 7, 8, 9, 10];
const DAY_NAMES = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag'];
const TODAY = 8;

type ViewMode = 'day' | 'week' | 'map';
const VIEW_LABELS: Record<ViewMode, string> = { day: 'Dagsvy', week: 'Veckovy', map: 'Karta' };

function MeetingCard({ meeting, isLast }: { meeting: Meeting; isLast: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 52, flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: colors.mid }}>{meeting.time}</span>
        {!isLast && <div style={{ flex: 1, width: 1, background: colors.border, marginTop: 6 }} />}
      </div>
      <div style={{ ...card({ flex: 1 }), marginBottom: isLast ? 0 : 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: colors.text }}>{meeting.store}</div>
            <div style={{ fontSize: 12, color: colors.soft, marginTop: 2 }}>{meeting.type}</div>
          </div>
          <span style={{ background: colors.blueBg, color: colors.blue, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
            {meeting.duration} min
          </span>
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: colors.mid }}>
          <Icon name="users" size={13} color={colors.soft} /> {meeting.contact}
        </div>
      </div>
    </div>
  );
}

export default function Routes() {
  const [selDay, setSelDay] = useState(TODAY);
  const [view, setView] = useState<ViewMode>('day');

  const shown: Meeting[] = weekMeetings[selDay] ?? [];
  const dayIndex = DATES.indexOf(selDay);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ margin: '0 0 16px', fontSize: 26, fontWeight: 700, color: colors.text }}>Rutter & Möten</h1>

      {/* Week strip */}
      <div style={{ ...card({ padding: '14px 12px', marginBottom: 16 }) }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {DAYS.map((d, i) => {
            const hasMeet = (weekMeetings[DATES[i]] ?? []).length > 0;
            const isSel = DATES[i] === selDay;
            return (
              <button
                key={d}
                onClick={() => setSelDay(DATES[i])}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 5, background: 'none', border: 'none', cursor: 'pointer',
                  padding: '4px 0', minHeight: 44, justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 11, color: colors.soft, fontWeight: 500 }}>{d}</span>
                <div
                  style={{
                    width: 36, height: 36, borderRadius: 18,
                    background: isSel ? colors.blue : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: isSel ? 700 : 500, color: isSel ? '#fff' : colors.text }}>
                    {DATES[i]}
                  </span>
                </div>
                <div style={{ width: 5, height: 5, borderRadius: 3, background: hasMeet ? colors.blue : 'transparent' }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Day / week / map toggle */}
      <div style={{ display: 'flex', background: colors.bgMuted, borderRadius: 10, padding: 3, marginBottom: 20 }}>
        {(['day', 'week', 'map'] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
              background: view === v ? colors.bg : 'transparent',
              color: view === v ? colors.text : colors.mid,
              fontWeight: view === v ? 600 : 400,
              fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              minHeight: 44,
            }}
          >
            {VIEW_LABELS[v]}
          </button>
        ))}
      </div>

      {/* Map view */}
      {view === 'map' && (
        <KartaView
          selDay={selDay}
          dayName={`${DAY_NAMES[dayIndex]} ${selDay} april`}
        />
      )}

      {/* Day / week views */}
      {view !== 'map' && (
        <>
          <div style={{ marginBottom: 10, fontSize: 13, color: colors.mid, fontWeight: 500 }}>
            {DAY_NAMES[dayIndex]} {selDay} april · {shown.length} besök
          </div>
          {shown.length === 0 ? (
            <div style={{ ...card({ textAlign: 'center', padding: 32, color: colors.soft }) }}>
              Inga möten inplanerade
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {shown.map((m, i) => (
                <MeetingCard key={m.id} meeting={m} isLast={i === shown.length - 1} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
