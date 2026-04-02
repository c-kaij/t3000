import type { MountainData } from '../data/mountains';

interface Props {
  mountains: MountainData[];
  onFocus: (index: number) => void;
  onReset: () => void;
}

export default function SceneControls({ mountains, onFocus, onReset }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {mountains.map((m, i) => (
        <button
          key={m.id}
          onClick={() => onFocus(i)}
          className="glass-panel px-3 py-1.5 text-xs font-medium hover:bg-[rgba(255,255,255,0.1)] transition-colors flex items-center gap-2"
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: m.accentColor }}
          />
          Focus {m.name}
        </button>
      ))}
      <button
        onClick={onReset}
        className="glass-panel px-3 py-1.5 text-xs font-medium hover:bg-[rgba(255,255,255,0.1)] transition-colors"
      >
        Reset View
      </button>
    </div>
  );
}
