import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { Activity, Compass, MessageSquareText, Plus, Store, UserRound } from 'lucide-react'
import { AppProvider, useAppState } from './context/AppContext'
import {
  ActivityPage, CatalogPage, ConfirmationPage, CreateRequestPage, HomePage, InboxPage, LoginPage,
  NegotiationPage, ProfilePage, OrderChatPage, OrderDetailPage, PaymentPage, ServiceDetailPage,
  WaitingPage, ChooseTimePage,
} from './pages/CustomerPages'
import { RunnerCatalogPage, RunnerDashboardPage, RunnerOfferDetailPage, RunnerOffersPage } from './pages/RunnerPages'
import './App.css'

function PhoneShell() {
  const location = useLocation()
  const { role } = useAppState()
  const isRunnerRoute = location.pathname.startsWith('/runner')
  const isSharedRoute = location.pathname === '/profil' || location.pathname === '/pesan' || location.pathname.endsWith('/chat')
  const runnerMode = isRunnerRoute || (isSharedRoute && role === 'runner')
  const tabs = runnerMode
    ? [
        { label: 'Dasbor', to: '/runner', Icon: Compass },
        { label: 'Tawaran', to: '/runner/tawaran', Icon: Store },
        { label: 'Katalog', to: '/runner/katalog', Icon: UserRound },
        { label: 'Kotak Masuk', to: '/pesan', Icon: MessageSquareText },
        { label: 'Profil', to: '/profil', Icon: UserRound },
      ]
    : [
        { label: 'Beranda', to: '/', Icon: Compass },
        { label: 'Aktivitas', to: '/aktivitas', Icon: Activity },
        { label: 'Buat', to: '/buat', Icon: Plus },
        { label: 'Kotak Masuk', to: '/pesan', Icon: MessageSquareText },
        { label: 'Profil', to: '/profil', Icon: UserRound },
      ]

  return (
    <div className="device-stage">
      <div className="phone-frame">
        <main className="app-content">
          <Routes>
            <Route path="/masuk" element={<LoginPage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/aktivitas" element={<ActivityPage />} />
            <Route path="/pesan" element={<InboxPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/buat" element={<CreateRequestPage />} />
            <Route path="/buat/waktu" element={<ChooseTimePage />} />
            <Route path="/buat/bayaran" element={<PaymentPage />} />
            <Route path="/pesanan/:id/menunggu" element={<WaitingPage />} />
            <Route path="/pesanan/:id/negosiasi" element={<NegotiationPage />} />
            <Route path="/pesanan/:id/chat" element={<OrderChatPage />} />
            <Route path="/katalog" element={<CatalogPage />} />
            <Route path="/katalog/:id" element={<ServiceDetailPage />} />
            <Route path="/pesanan" element={<ActivityPage />} />
            <Route path="/pesanan/:id/konfirmasi" element={<ConfirmationPage />} />
            <Route path="/pesanan/:id" element={<OrderDetailPage />} />
            <Route path="/runner" element={<RunnerDashboardPage />} />
            <Route path="/runner/tawaran" element={<RunnerOffersPage />} />
            <Route path="/runner/tawaran/:id" element={<RunnerOfferDetailPage />} />
            <Route path="/runner/katalog" element={<RunnerCatalogPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <nav className="bottom-nav" aria-label="Navigasi utama">
          {tabs.map(({ label, to, Icon }) => (
            <Link key={label} to={to} className={`nav-item ${location.pathname === to ? 'is-active' : ''}`}>
              <Icon size={20} strokeWidth={2} /><span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default function App() {
  return <AppProvider><BrowserRouter basename={import.meta.env.BASE_URL}><PhoneShell /></BrowserRouter></AppProvider>
}
