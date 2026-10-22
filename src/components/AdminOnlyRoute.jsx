import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function AdminOnlyRoute() {
  const [state, setState] = useState('loading');
  useEffect(() => {
    base44.auth.me().then((u) => setState(u?.role === 'admin' ? 'ok' : 'no')).catch(() => setState('no'));
  }, []);
  if (state === 'loading') return <div className="min-h-[50vh]" />;
  return state === 'ok' ? <Outlet /> : <Navigate to="/" replace />;
}