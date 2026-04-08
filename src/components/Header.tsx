import logo from '../assets/logo.svg';
import { colors } from '../tokens';

export default function Header() {
  const now = new Date();
  const time = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const dateCapitalised = date.charAt(0).toUpperCase() + date.slice(1);

  return (
    <header
      style={{
        background: colors.bg,
        padding: '10px 20px 8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${colors.border}`,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <img src={logo} alt="SäljTool" height={28} style={{ display: 'block' }} />
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{time}</div>
        <div style={{ fontSize: 11, color: colors.mid, marginTop: 1 }}>{dateCapitalised}</div>
      </div>
    </header>
  );
}
