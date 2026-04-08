import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import TabBar from './components/TabBar';
import Dashboard from './modules/Dashboard';
import CRM from './modules/CRM';
import RoutesModule from './modules/Routes';
import Orders from './modules/Orders';
import Campaigns from './modules/Campaigns';
import AIAdvisory from './modules/AIAdvisory';
import { colors, maxWidth } from './tokens';

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
          background: colors.bgSoft,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: maxWidth,
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <Header />

        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 76 }}>
          <Routes>
            <Route path="/"        element={<Dashboard />} />
            <Route path="/crm"     element={<CRM />} />
            <Route path="/rutter"  element={<RoutesModule />} />
            <Route path="/order"   element={<Orders />} />
            <Route path="/kampanj" element={<Campaigns />} />
            <Route path="/ai"      element={<AIAdvisory />} />
          </Routes>
        </main>

        <TabBar />
      </div>
    </BrowserRouter>
  );
}
