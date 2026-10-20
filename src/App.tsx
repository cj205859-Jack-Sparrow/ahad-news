import { useEffect, useState, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import Home from './pages/Home';
import AdminLogin from './pages/admin/AdminLogin';
import AdminSettings from './pages/admin/AdminSettings';
import { LoadingState } from './components/Layout';
import './ahad.css';

function RequireAuth({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  if (session === undefined) return <LoadingState />;
  return session ? <>{children}</> : <Navigate to="/admin/login" replace />;
}
export default function App() {
  return (
    <BrowserRouter><Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/settings" element={<RequireAuth><AdminSettings /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></BrowserRouter>
  );
}
