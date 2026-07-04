import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, BookOpen, Bot, Shield, Eye, Save } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function StudentSettings() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    learningStyle: 'visual',
    difficulty: 'intermediate',
    emailNotifications: true,
    sessionReminders: true,
    weeklyDigest: false,
    aiSuggestions: true,
    showProfile: true,
    shareAnalytics: false,
  });

  const handleSave = () => {
    updateUser({ firstName: form.firstName, lastName: form.lastName });
    toast.success('Settings saved');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'learning', label: 'Learning', icon: <BookOpen size={16} /> },
    { id: 'ai', label: 'AI Preferences', icon: <Bot size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    { id: 'privacy', label: 'Privacy', icon: <Eye size={16} /> },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: 'Settings' }]} />

      <h1 className="text-2xl font-bold text-secondary-900 mb-8">Settings</h1>

      <Card>
        <Tabs tabs={tabs} onChange={setActiveTab}>
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
                  {form.firstName[0]}{form.lastName[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">{form.firstName} {form.lastName}</h3>
                  <p className="text-sm text-secondary-500">{form.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                <Input label="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
              <Input label="Email" value={form.email} disabled />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates about your learning progress' },
                { key: 'sessionReminders', label: 'Session Reminders', desc: 'Get reminded to continue your learning sessions' },
                { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Receive a weekly summary of your learning activity' },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between p-4 bg-secondary-50 rounded-card cursor-pointer">
                  <div>
                    <span className="text-sm font-medium text-secondary-900">{item.label}</span>
                    <p className="text-xs text-secondary-500">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(form as any)[item.key]}
                    onChange={(e) => setForm({ ...form, [item.key]: e.target.checked })}
                    className="w-4 h-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                  />
                </label>
              ))}
            </div>
          )}

          {activeTab === 'learning' && (
            <div className="space-y-4">
              <Select label="Preferred Learning Style" value={form.learningStyle} onChange={(e) => setForm({ ...form, learningStyle: e.target.value })} options={[
                { value: 'visual', label: 'Visual' },
                { value: 'auditory', label: 'Auditory' },
                { value: 'reading', label: 'Reading/Writing' },
                { value: 'kinesthetic', label: 'Kinesthetic' },
              ]} />
              <Select label="Default Difficulty" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]} />
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-secondary-50 rounded-card cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-secondary-900">AI Learning Suggestions</span>
                  <p className="text-xs text-secondary-500">Allow AI to suggest personalized learning activities</p>
                </div>
                <input
                  type="checkbox"
                  checked={form.aiSuggestions}
                  onChange={(e) => setForm({ ...form, aiSuggestions: e.target.checked })}
                  className="w-4 h-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                />
              </label>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <Button variant="secondary">Change Password</Button>
              <Button variant="secondary">Enable Two-Factor Authentication</Button>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-secondary-50 rounded-card cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-secondary-900">Public Profile</span>
                  <p className="text-xs text-secondary-500">Allow others to see your learning achievements</p>
                </div>
                <input
                  type="checkbox"
                  checked={form.showProfile}
                  onChange={(e) => setForm({ ...form, showProfile: e.target.checked })}
                  className="w-4 h-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-secondary-50 rounded-card cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-secondary-900">Share Analytics</span>
                  <p className="text-xs text-secondary-500">Help improve LENS by sharing anonymized learning data</p>
                </div>
                <input
                  type="checkbox"
                  checked={form.shareAnalytics}
                  onChange={(e) => setForm({ ...form, shareAnalytics: e.target.checked })}
                  className="w-4 h-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                />
              </label>
            </div>
          )}

          <div className="flex justify-end mt-6 pt-6 border-t border-secondary-100">
            <Button onClick={handleSave} leftIcon={<Save size={16} />}>Save Changes</Button>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
