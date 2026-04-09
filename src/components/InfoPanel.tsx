import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import type { MountainData } from '../data/mountains';

Chart.register(...registerables);

// Fixed scale shared by all mountains so charts are comparable
const CHART_Y_MAX = 9000; // metres — just above Everest's 8,849 m

interface Props {
  mountain: MountainData;
  elevations: Float32Array | null;
}

export default function InfoPanel({ mountain, elevations }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !elevations) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Cross-section through the middle row (passes through the peak for procedural terrain)
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
            backgroundColor: mountain.accentColor + '25',
            fill: {
              target: 'origin', // fill down to sea level (y = 0)
              above: mountain.accentColor + '25',
            },
            pointRadius: 0,
            borderWidth: 1.5,
            tension: 0.3,
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
            min: 0,
            max: CHART_Y_MAX,
            display: true,
            ticks: {
              color: 'rgba(255,255,255,0.35)',
              font: { size: 9 },
              // Show ticks every 2 km
              stepSize: 2000,
              callback: (v: number | string) => `${Number(v) / 1000}km`,
            },
            grid: { color: 'rgba(255,255,255,0.06)' },
          },
        },
        animation: { duration: 400 },
      },
    });

    return () => {
      chartInstance.current?.destroy();
      chartInstance.current = null;
    };
  }, [elevations, mountain.accentColor]);

  const prominencePercent = Math.round((mountain.prominence / mountain.elevation) * 100);

  return (
    <div className="glass-panel p-4 w-[280px] animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: mountain.accentColor }}
        />
        <h3 className="text-sm font-bold tracking-wide">{mountain.name}</h3>
      </div>

      {/* Stats */}
      <div className="space-y-2 text-xs mb-4">
        <div className="flex justify-between items-baseline gap-2">
          <span className="text-[var(--text-secondary)] flex-shrink-0">Elevation</span>
          <span className="text-[var(--text-primary)] font-mono text-right">
            {mountain.elevation.toLocaleString()} m
          </span>
        </div>
        <div className="flex justify-between items-baseline gap-2">
          <span className="text-[var(--text-secondary)] flex-shrink-0">Prominence</span>
          <span className="text-[var(--text-primary)] font-mono text-right">
            {mountain.prominence.toLocaleString()} m{' '}
            <span className="text-[var(--text-secondary)]">({prominencePercent}%)</span>
          </span>
        </div>
        <div className="flex justify-between items-baseline gap-2">
          <span className="text-[var(--text-secondary)] flex-shrink-0">Country</span>
          <span className="text-[var(--text-primary)] text-right">{mountain.country}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[rgba(255,255,255,0.08)] mb-3" />

      {/* Elevation profile */}
      <div className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">
        Elevation profile
      </div>
      <div className="h-[120px]">
        {elevations ? (
          <canvas ref={chartRef} />
        ) : (
          <div className="w-full h-full bg-[rgba(255,255,255,0.03)] rounded loading-pulse" />
        )}
      </div>
      <div className="flex justify-between text-[9px] text-[var(--text-secondary)] mt-1 opacity-60">
        <span>West</span>
        <span>East</span>
      </div>
    </div>
  );
}
