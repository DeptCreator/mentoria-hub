'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminPage() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/');
    }
  }, [isLoading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
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
      console.error('Error fetching admin data:', error);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {['courses', 'opportunities', 'users'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'courses' && (
        <div>
          <div className="mb-4 flex justify-between">
            <h2 className="text-xl font-semibold">Courses</h2>
            <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Add Course
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full rounded-lg border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Level</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {courses.map((course: any) => (
                  <tr key={course.id}>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{course.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{course.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{course.level}</td>
                    <td className="px-4 py-3 text-sm">
                      <button className="mr-2 text-blue-600 hover:underline">Edit</button>
                      <button className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'opportunities' && (
        <div>
          <div className="mb-4 flex justify-between">
            <h2 className="text-xl font-semibold">Opportunities</h2>
            <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Add Opportunity
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full rounded-lg border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {opportunities.map((opp: any) => (
                  <tr key={opp.id}>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{opp.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{opp.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{opp.deadline || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      <button className="mr-2 text-blue-600 hover:underline">Edit</button>
                      <button className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full rounded-lg border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Grade</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user: any) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{user.full_name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{user.grade || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{user.is_admin ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
