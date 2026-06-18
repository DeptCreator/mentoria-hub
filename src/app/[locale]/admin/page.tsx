'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';

export default function AdminPage() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !isAdmin) router.push('/');
  }, [isLoading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin, activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'courses') {
        const { data } = await supabaseBrowser.from('courses').select('*');
        setCourses(data || []);
      } else if (activeTab === 'opportunities') {
        const { data } = await supabaseBrowser.from('opportunities').select('*');
        setOpportunities(data || []);
      } else if (activeTab === 'users') {
        const { data } = await supabaseBrowser.from('profiles').select('*');
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}><p style={{ color: 'var(--fg-dim)' }}>Loading...</p></div>;
  if (!isAuthenticated || !isAdmin) return null;

  const Badge = ({ level }: { level: string }) => {
    const colors: Record<string, { bg: string; color: string }> = {
      beginner: { bg: 'rgba(99,179,136,0.18)', color: '#63b388' },
      intermediate: { bg: 'rgba(201,169,110,0.18)', color: '#c9a96e' },
      advanced: { bg: 'rgba(220,120,100,0.18)', color: '#dc7864' },
    };
    const c = colors[level] || colors.beginner;
    return <span className="inline-block rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-wide" style={{ background: c.bg, color: c.color }}>{level}</span>;
  };

  return (
    <div className="min-h-screen pt-[100px] px-6 pb-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-7">
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold" style={{ color: 'var(--fg)' }}>Admin Panel</h2>
          <button className="rounded-full px-5 py-2.5 text-[14px] font-semibold cursor-pointer font-sans transition-all"
            style={{ background: 'var(--accent)', color: '#0a0a0f', boxShadow: '0 0 40px var(--accent-glow)' }}
            onClick={() => alert('Add new item dialog')}>+ Add New</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 flex-wrap">
          {['courses', 'opportunities', 'users'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-[20px] text-sm font-medium cursor-pointer transition-all font-sans"
              style={{
                background: activeTab === tab ? 'var(--surface)' : 'transparent',
                color: activeTab === tab ? 'var(--accent)' : 'var(--fg-dim)',
                fontWeight: activeTab === tab ? 600 : 500,
                border: 'none',
              }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
          ))}
        </div>

        {/* Table */}
        <div className="glass overflow-x-auto" style={{ borderRadius: 'var(--radius-lg)' }}>
          <table className="admin-table w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-[12px] uppercase tracking-wider" style={{ color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>Title</th>
                <th className="text-left px-4 py-3 text-[12px] uppercase tracking-wider" style={{ color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>Category</th>
                <th className="text-left px-4 py-3 text-[12px] uppercase tracking-wider" style={{ color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>Status</th>
                <th className="text-right px-4 py-3 text-[12px] uppercase tracking-wider" style={{ color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'courses' && courses.map(c => (
                <tr key={c.id}>
                  <td className="px-4 py-3.5 text-[14px]" style={{ color: 'var(--fg)', borderBottom: '1px solid var(--border)' }}>{c.title}</td>
                  <td className="px-4 py-3.5 text-[14px]" style={{ borderBottom: '1px solid var(--border)' }}><Badge level={c.level} /></td>
                  <td className="px-4 py-3.5 text-[14px]" style={{ color: '#63b388', borderBottom: '1px solid var(--border)' }}>Active</td>
                  <td className="px-4 py-3.5 text-right" style={{ borderBottom: '1px solid var(--border)' }}>
                    <button className="rounded-full px-3 py-1 text-[12px] font-medium cursor-pointer mr-2 transition-all font-sans" style={{ background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-strong)' }}>Edit</button>
                    <button className="rounded-full px-3 py-1 text-[12px] font-medium cursor-pointer transition-all font-sans" style={{ background: 'transparent', color: '#dc7864', border: '1px solid rgba(220,120,100,0.3)' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {activeTab === 'opportunities' && opportunities.map(o => (
                <tr key={o.id}>
                  <td className="px-4 py-3.5 text-[14px]" style={{ color: 'var(--fg)', borderBottom: '1px solid var(--border)' }}>{o.title}</td>
                  <td className="px-4 py-3.5 text-[14px]" style={{ color: 'var(--fg-dim)', borderBottom: '1px solid var(--border)' }}>{o.category}</td>
                  <td className="px-4 py-3.5 text-[14px]" style={{ color: '#63b388', borderBottom: '1px solid var(--border)' }}>Active</td>
                  <td className="px-4 py-3.5 text-right" style={{ borderBottom: '1px solid var(--border)' }}>
                    <button className="rounded-full px-3 py-1 text-[12px] font-medium cursor-pointer mr-2 transition-all font-sans" style={{ background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-strong)' }}>Edit</button>
                    <button className="rounded-full px-3 py-1 text-[12px] font-medium cursor-pointer transition-all font-sans" style={{ background: 'transparent', color: '#dc7864', border: '1px solid rgba(220,120,100,0.3)' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {activeTab === 'users' && users.map(u => (
                <tr key={u.id}>
                  <td className="px-4 py-3.5 text-[14px]" style={{ color: 'var(--fg)', borderBottom: '1px solid var(--border)' }}>{u.email}</td>
                  <td className="px-4 py-3.5 text-[14px]" style={{ color: 'var(--fg-dim)', borderBottom: '1px solid var(--border)' }}><Badge level={u.is_admin ? 'advanced' : 'beginner'} /></td>
                  <td className="px-4 py-3.5 text-[14px]" style={{ color: u.is_admin ? '#c9a96e' : '#63b388', borderBottom: '1px solid var(--border)' }}>{u.is_admin ? 'Admin' : 'Active'}</td>
                  <td className="px-4 py-3.5 text-right" style={{ borderBottom: '1px solid var(--border)' }}>
                    <button className="rounded-full px-3 py-1 text-[12px] font-medium cursor-pointer mr-2 transition-all font-sans" style={{ background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-strong)' }}>Edit</button>
                    <button className="rounded-full px-3 py-1 text-[12px] font-medium cursor-pointer transition-all font-sans" style={{ background: 'transparent', color: '#dc7864', border: '1px solid rgba(220,120,100,0.3)' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {activeTab === 'courses' && courses.length === 0 && <tr><td colSpan={4} className="px-4 py-10 text-center text-[14px]" style={{ color: 'var(--muted)' }}>No data yet. Run Supabase migrations first.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
