import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import type { MountainData } from '../data/mountains';

Chart.register(...registerables);

interface Props {
  mountain: MountainData;
  elevations: Float32Array | null;
  rank: { tallest: boolean; mostProminent: boolean };
}

export default function InfoPanel({ mountain, elevations, rank }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !elevations) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Extract a cross-section through the middle of the elevation grid
    const size = Math.sqrt(elevations.length);
    const midRow = Math.floor(size / 2);
    const profile: number[] = [];
    for (let x = 0; x < size; x++) {
      profile.push(elevations[midRow * size + x]);
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: profile.map((_, i) => i.toString()),
        datasets: [
          {
            data: profile,
            borderColor: mountain.accentColor,
            backgroundColor: mountain.accentColor + '20',
            fill: true,
            pointRadius: 0,
            borderWidth: 1.5,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: {
            display: true,
            ticks: {
              color: 'rgba(255,255,255,0.3)',
              font: { size: 9 },
              callback: (v) => `${v}m`,
              maxTicksLimit: 4,
            },
            grid: { color: 'rgba(255,255,255,0.05)' },
          },
        },
        animation: { duration: 500 },
      },
    });

    return () => {
      chartInstance.current?.destroy();
      chartInstance.current = null;
    };
  }, [elevations, mountain.accentColor]);

  return (
    <div className="glass-panel p-3 w-[220px] animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: mountain.accentColor }}
        />
        <h3 className="text-sm font-bold">{mountain.name}</h3>
      </div>

      <div className="space-y-1 text-xs text-[var(--text-secondary)]">
        <div className="flex justify-between">
          <span>Elevation</span>
          <span className="text-[var(--text-primary)] font-mono">
            {mountain.elevation.toLocaleString()}m
            {rank.tallest && (
              <span className="ml-1 text-amber-400 text-[10px]">TALLEST</span>
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Prominence</span>
          <span className="text-[var(--text-primary)] font-mono">
            {mountain.prominence.toLocaleString()}m
            {rank.mostProminent && (
              <span className="ml-1 text-blue-400 text-[10px]">TOP</span>
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Country</span>
          <span className="text-[var(--text-primary)]">{mountain.country}</span>
        </div>
      </div>

      <div className="mt-2 h-[60px]">
        {elevations ? (
          <canvas ref={chartRef} />
        ) : (
          <div className="w-full h-full bg-[rgba(255,255,255,0.03)] rounded loading-pulse" />
        )}
      </div>
    </div>
  );
}
