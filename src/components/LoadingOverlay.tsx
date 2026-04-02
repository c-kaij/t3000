interface Props {
  loading: boolean;
  progress: string;
}

export default function LoadingOverlay({ loading, progress }: Props) {
  if (!loading) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[rgba(8,12,20,0.9)] backdrop-blur-sm">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-2 border-[rgba(255,255,255,0.1)] rounded-full" />
        <div className="absolute inset-0 border-2 border-t-blue-400 rounded-full animate-spin" />
      </div>
      <p className="text-sm text-[var(--text-secondary)] animate-pulse">{progress}</p>
    </div>
  );
}
