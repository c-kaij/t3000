import type { MountainData } from '../data/mountains';

interface Props {
  mountains: MountainData[];
}

export default function Legend({ mountains }: Props) {
  return (
    <div className="glass-panel px-4 py-2 flex flex-wrap items-center gap-4">
      {mountains.map((m) => (
        <div key={m.id} className="flex items-center gap-2 text-xs">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: m.accentColor }}
          />
          <span className="font-medium">{m.name}</span>
          <span className="text-[var(--text-secondary)] font-mono">
            {m.elevation.toLocaleString()}m
          </span>
        </div>
      ))}
    </div>
  );
}
