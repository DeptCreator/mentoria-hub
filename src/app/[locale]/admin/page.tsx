'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabaseBrowser } from '@/lib/supabase';
import { CATEGORIES, FORMATS, LEVELS } from '@/lib/constants';
import { Plus, Pencil, Trash2, X, Users, BookOpen, Award, Search } from 'lucide-react';

export default function AdminPage() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'courses' | 'opportunities' | 'users'>('courses');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ courses: 0, opportunities: 0, users: 0 });

  useEffect(() => {
    if (!isLoading && !isAdmin) router.push('/');
  }, [isLoading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
      fetchStats();
    }
  }, [isAdmin, activeTab]);

  const fetchStats = async () => {
    const [c, o, u] = await Promise.all([
      supabaseBrowser.from('courses').select('id', { count: 'exact', head: true }),
      supabaseBrowser.from('opportunities').select('id', { count: 'exact', head: true }),
      supabaseBrowser.from('profiles').select('id', { count: 'exact', head: true }),
    ]);
    setStats({
      courses: c.count || 0,
      opportunities: o.count || 0,
      users: u.count || 0,
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseBrowser.from(activeTab).select('*');
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const { error } = await supabaseBrowser.from(activeTab).delete().eq('id', id);
      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
      fetchStats();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete item');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleSave = async (formData: any) => {
    try {
      if (editingItem) {
        const { error } = await supabaseBrowser.from(activeTab).update(formData).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabaseBrowser.from(activeTab).insert(formData);
        if (error) throw error;
      }
      setModalOpen(false);
      fetchData();
      fetchStats();
    } catch (error: any) {
      console.error('Error saving:', error);
      alert('Failed to save: ' + error.message);
    }
  };

  const filteredItems = items.filter(item => {
    const text = `${item.title || ''} ${item.email || ''} ${item.category || ''}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <p style={{ color: 'var(--fg-dim)' }}>Loading...</p>
    </div>
  );
  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="min-h-screen pt-[100px] px-6 pb-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-7">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--accent)' }}>Management</div>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold" style={{ color: 'var(--fg)' }}>Admin Panel</h2>
          </div>
          <button onClick={handleAdd} className="btn-gold inline-flex items-center gap-2 active-press">
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="glass p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-[14px] flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.15)' }}>
              <BookOpen className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="text-[24px] font-bold" style={{ color: 'var(--fg)' }}>{stats.courses}</p>
              <p className="text-[13px]" style={{ color: 'var(--muted)' }}>Courses</p>
            </div>
          </div>
          <div className="glass p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-[14px] flex items-center justify-center" style={{ background: 'rgba(99,179,136,0.15)' }}>
              <Award className="w-5 h-5" style={{ color: '#63b388' }} />
            </div>
            <div>
              <p className="text-[24px] font-bold" style={{ color: 'var(--fg)' }}>{stats.opportunities}</p>
              <p className="text-[13px]" style={{ color: 'var(--muted)' }}>Opportunities</p>
            </div>
          </div>
          <div className="glass p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-[14px] flex items-center justify-center" style={{ background: 'rgba(130,160,220,0.15)' }}>
              <Users className="w-5 h-5" style={{ color: '#82a0dc' }} />
            </div>
            <div>
              <p className="text-[24px] font-bold" style={{ color: 'var(--fg)' }}>{stats.users}</p>
              <p className="text-[13px]" style={{ color: 'var(--muted)' }}>Users</p>
            </div>
          </div>
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex gap-1 flex-wrap">
            {(['courses', 'opportunities', 'users'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-[20px] text-sm font-medium cursor-pointer transition-all font-sans"
                style={{
                  background: activeTab === tab ? 'var(--surface)' : 'transparent',
                  color: activeTab === tab ? 'var(--accent)' : 'var(--fg-dim)',
                  fontWeight: activeTab === tab ? 600 : 500,
                }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
            ))}
          </div>
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-9 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="glass overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
          <div className="overflow-x-auto">
            <table className="admin-table w-full border-collapse">
              <thead>
                <tr style={{ background: 'var(--surface)' }}>
                  <th className="text-left px-5 py-3.5 text-[12px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Title</th>
                  <th className="text-left px-5 py-3.5 text-[12px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Category</th>
                  <th className="text-left px-5 py-3.5 text-[12px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Status</th>
                  <th className="text-right px-5 py-3.5 text-[12px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="px-5 py-10 text-center" style={{ color: 'var(--muted)' }}>Loading...</td></tr>
                ) : filteredItems.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-10 text-center" style={{ color: 'var(--muted)' }}>No data found.</td></tr>
                ) : (
                  filteredItems.map(item => (
                    <tr key={item.id} className="table-row-card">
                      <td className="px-5 py-4 text-[14px] font-medium" style={{ color: 'var(--fg)' }}>{item.title || item.email || 'Untitled'}</td>
                      <td className="px-5 py-4 text-[14px]">
                        {activeTab !== 'users' ? (
                          <LevelBadge level={item.level || item.category || 'beginner'} />
                        ) : (
                          <LevelBadge level={item.is_admin ? 'advanced' : 'beginner'} label={item.is_admin ? 'Admin' : 'Student'} />
                        )}
                      </td>
                      <td className="px-5 py-4 text-[14px]" style={{ color: '#63b388' }}>
                        {activeTab === 'opportunities' ? 'Active' : (item.is_published !== false ? 'Active' : 'Draft')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => handleEdit(item)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium mr-2 transition-all"
                          style={{ background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-strong)' }}>
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all"
                          style={{ background: 'transparent', color: '#dc7864', border: '1px solid rgba(220,120,100,0.3)' }}>
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalOpen && (
        <AdminModal
          type={activeTab}
          item={editingItem}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function LevelBadge({ level, label }: { level: string; label?: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    beginner: { bg: 'rgba(99,179,136,0.18)', color: '#63b388' },
    intermediate: { bg: 'rgba(201,169,110,0.18)', color: '#c9a96e' },
    advanced: { bg: 'rgba(220,120,100,0.18)', color: '#dc7864' },
  };
  const c = colors[level.toLowerCase()] || colors.beginner;
  return <span className="inline-block rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-wide" style={{ background: c.bg, color: c.color }}>{label || level}</span>;
}

function AdminModal({ type, item, onClose, onSave }: { type: string; item: any; onClose: () => void; onSave: (data: any) => void }) {
  const [formData, setFormData] = useState<any>(() => {
    if (item) return { ...item };
    return type === 'courses'
      ? { title: '', description: '', category: CATEGORIES[0], level: 'beginner', duration_hours: 1, is_published: true }
      : { title: '', description: '', category: CATEGORIES[0], format: 'online', grade_min: 9, grade_max: 12, requirements: [], benefits: [], is_published: true };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = { ...formData };
    if (type === 'opportunities') {
      delete data.is_published;
      data.requirements = Array.isArray(data.requirements) ? data.requirements : (data.requirements || '').split(',').filter(Boolean);
      data.benefits = Array.isArray(data.benefits) ? data.benefits : (data.benefits || '').split(',').filter(Boolean);
    }
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="glass glass-xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto p-6" style={{ borderRadius: 'var(--radius-lg)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-[22px] font-bold" style={{ color: 'var(--fg)' }}>
            {item ? 'Edit' : 'Add'} {type.slice(0, -1)}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{ background: 'var(--surface)' }}>
            <X className="w-4 h-4" style={{ color: 'var(--fg-dim)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-semibold mb-1.5" style={{ color: 'var(--fg-secondary)' }}>Title</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="glass-input w-full"
              placeholder="Enter title"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold mb-1.5" style={{ color: 'var(--fg-secondary)' }}>Description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="glass-input w-full resize-none"
              placeholder="Enter description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold mb-1.5" style={{ color: 'var(--fg-secondary)' }}>Category</label>
              <select
                value={formData.category || CATEGORIES[0]}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="glass-input w-full appearance-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {type === 'courses' ? (
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: 'var(--fg-secondary)' }}>Level</label>
                <select
                  value={formData.level || 'beginner'}
                  onChange={e => setFormData({ ...formData, level: e.target.value })}
                  className="glass-input w-full appearance-none"
                >
                  {LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: 'var(--fg-secondary)' }}>Format</label>
                <select
                  value={formData.format || 'online'}
                  onChange={e => setFormData({ ...formData, format: e.target.value })}
                  className="glass-input w-full appearance-none"
                >
                  {FORMATS.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
                </select>
              </div>
            )}
          </div>

          {type === 'courses' && (
            <div>
              <label className="block text-[13px] font-semibold mb-1.5" style={{ color: 'var(--fg-secondary)' }}>Duration (hours)</label>
              <input
                type="number"
                min={1}
                value={formData.duration_hours || 1}
                onChange={e => setFormData({ ...formData, duration_hours: parseInt(e.target.value) })}
                className="glass-input w-full"
              />
            </div>
          )}

          {type === 'opportunities' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold mb-1.5" style={{ color: 'var(--fg-secondary)' }}>Min Grade</label>
                  <input
                    type="number"
                    min={8}
                    max={12}
                    value={formData.grade_min || 9}
                    onChange={e => setFormData({ ...formData, grade_min: parseInt(e.target.value) })}
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold mb-1.5" style={{ color: 'var(--fg-secondary)' }}>Max Grade</label>
                  <input
                    type="number"
                    min={8}
                    max={12}
                    value={formData.grade_max || 12}
                    onChange={e => setFormData({ ...formData, grade_max: parseInt(e.target.value) })}
                    className="glass-input w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: 'var(--fg-secondary)' }}>Requirements (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(formData.requirements) ? formData.requirements.join(', ') : formData.requirements || ''}
                  onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                  className="glass-input w-full"
                  placeholder="e.g. Grade 10+, Essay, Recommendation"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: 'var(--fg-secondary)' }}>Application Link</label>
                <input
                  type="url"
                  value={formData.link || ''}
                  onChange={e => setFormData({ ...formData, link: e.target.value })}
                  className="glass-input w-full"
                  placeholder="https://..."
                />
              </div>
            </>
          )}

          {type !== 'users' && (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.is_published !== false}
                onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 accent-[var(--accent)]"
              />
              <label htmlFor="published" className="text-[14px]" style={{ color: 'var(--fg-dim)' }}>Published</label>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all"
              style={{ background: 'transparent', color: 'var(--fg)', border: '1.5px solid var(--border-strong)' }}>
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-gold">
              {item ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
