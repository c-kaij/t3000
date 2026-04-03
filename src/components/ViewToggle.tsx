interface Props {
  mode: 'satellite' | 'topographic';
  onToggle: (mode: 'satellite' | 'topographic') => void;
}

export default function ViewToggle({ mode, onToggle }: Props) {
  return (
    <div className="glass-panel inline-flex overflow-hidden rounded">
      <button
        onClick={() => onToggle('satellite')}
        className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-150 ${
          mode === 'satellite'
            ? 'bg-[rgba(255,255,255,0.15)] text-white'
            : 'text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.07)]'
        }`}
      >
        Satellite
      </button>
      <div className="w-px bg-[rgba(255,255,255,0.12)] self-stretch" />
      <button
        onClick={() => onToggle('topographic')}
        className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-150 ${
          mode === 'topographic'
            ? 'bg-[rgba(255,255,255,0.15)] text-white'
            : 'text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.07)]'
        }`}
      >
        Topo
      </button>
    </div>
  );
}
