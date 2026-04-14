/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { CurrencyProvider } from './context/CurrencyContext';
import Navbar from './components/layout/Navbar';
import Chatbot from './components/chat/Chatbot';
import AdminDashboard from './components/admin/AdminDashboard';
import Home from './pages/Home';
import RoomDetails from './pages/RoomDetails';
import { Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';

function AppContent() {
  const [isAdminView, setIsAdminView] = useState(false);
  const { isAdmin } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      
      <footer className="bg-luxury-black text-white/40 py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-xl font-serif font-bold tracking-tighter text-white">
            DAR <span className="text-gold">ALI</span>
          </span>
          <div className="flex gap-8 text-sm uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.cookies')}</a>
          </div>
          <p className="text-sm">© 2024 Dar Ali. {t('footer.rights')}</p>
        </div>
      </footer>

      <Chatbot />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CurrencyProvider>
          <AppContent />
        </CurrencyProvider>
      </AuthProvider>
    </Router>
  );
}
