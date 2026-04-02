import mountains from '../data/mountains';

interface Props {
  selected: [string, string, string];
  onChange: (index: number, id: string) => void;
}

export default function MountainSelector({ selected, onChange }: Props) {
  return (
    <div className="glass-panel px-4 py-3 flex flex-wrap gap-3 items-center">
      <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
        Compare
      </span>
      {selected.map((sel, idx) => {
        const mountain = mountains.find((m) => m.id === sel);
        return (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: mountain?.accentColor || '#666' }}
            />
            <select
              value={sel}
              onChange={(e) => onChange(idx, e.target.value)}
              className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-[rgba(255,255,255,0.3)] cursor-pointer transition-colors"
            >
              {mountains.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#0c1220]">
                  {m.name} ({m.elevation.toLocaleString()}m)
                </option>
              ))}
            </select>
            {idx < 2 && (
              <span className="text-[var(--text-secondary)] text-xs mx-1">vs</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
