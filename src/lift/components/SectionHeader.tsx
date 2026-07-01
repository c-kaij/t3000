import type { ReactNode } from 'react';
import { colors } from '../theme';

export default function SectionHeader({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <h3
        style={{
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          color: colors.text,
          margin: 0,
        }}
      >
        {title}
      </h3>
    </div>
  );
}
