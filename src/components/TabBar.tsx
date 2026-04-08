import { NavLink } from 'react-router-dom';
import Icon, { type IconName } from './Icon';
import { colors } from '../tokens';

interface Tab {
  path: string;
  label: string;
  icon: IconName;
}

const tabs: Tab[] = [
  { path: '/',         label: 'Hem',     icon: 'home'  },
  { path: '/crm',      label: 'CRM',     icon: 'users' },
  { path: '/rutter',   label: 'Rutter',  icon: 'map'   },
  { path: '/order',    label: 'Order',   icon: 'cart'  },
  { path: '/kampanj',  label: 'Kampanj', icon: 'tag'   },
  { path: '/ai',       label: 'AI',      icon: 'spark' },
];

export default function TabBar() {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 768,
        background: colors.bg,
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        padding: '8px 0 env(safe-area-inset-bottom, 14px)',
        zIndex: 100,
      }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.path === '/'}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            padding: '4px 0',
            textDecoration: 'none',
            color: isActive ? colors.blue : colors.soft,
            minHeight: 44,
            justifyContent: 'center',
          })}
        >
          {({ isActive }) => (
            <>
              <Icon name={tab.icon} size={22} color={isActive ? colors.blue : colors.soft} />
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400 }}>{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
