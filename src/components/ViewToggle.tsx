interface Props {
  mode: 'satellite' | 'topographic';
  onToggle: (mode: 'satellite' | 'topographic') => void;
}

export default function ViewToggle({ mode, onToggle }: Props) {
  return (
    <div className="glass-panel inline-flex overflow-hidden">
      <button
        onClick={() => onToggle('satellite')}
        className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
          mode === 'satellite'
            ? 'bg-[rgba(255,255,255,0.1)] text-white'
            : 'text-[var(--text-secondary)] hover:text-white'
        }`}
      >
        Satellite
      </button>
      <button
        onClick={() => onToggle('topographic')}
        className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
          mode === 'topographic'
            ? 'bg-[rgba(255,255,255,0.1)] text-white'
            : 'text-[var(--text-secondary)] hover:text-white'
        }`}
      >
        Topographic
      </button>
    </div>
  );
}
