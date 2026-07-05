import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function StudentSettings() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    institution: user?.institution || '',
    department: user?.department || '',
  });
  const [preferences, setPreferences] = useState({
    learningStyle: 'visual',
    difficulty: 'intermediate',
    notifications: true,
    emailDigest: true,
    theme: 'dark',
  });

  const handleSaveProfile = () => {
    updateUser({ firstName: form.firstName, lastName: form.lastName });
    toast.success('Profile updated successfully');
  };

  const handleSavePreferences = () => {
    toast.success('Preferences saved');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-500/10 border border-slate-500/20 mb-2">
          <SettingsIcon className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-xs font-medium text-stone-300">Settings</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-stone-400">Manage your profile, preferences, and account settings.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/5 pb-0.5">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors ${
              activeTab === id
                ? 'bg-white/5 text-white border-b-2 border-coral-500'
                : 'text-stone-500 hover:text-stone-300'
            }`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="glass-card p-6 space-y-5 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-coral-500 to-amber-400 flex items-center justify-center text-white text-xl font-bold">
              {form.firstName[0]}{form.lastName[0]}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{form.firstName} {form.lastName}</h3>
              <p className="text-sm text-stone-400">{form.email}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">First Name</label>
              <input className="input-field" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">Last Name</label>
              <input className="input-field" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-1.5">Email</label>
            <input className="input-field opacity-50" value={form.email} disabled />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">Institution</label>
              <input className="input-field" value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">Department</label>
              <input className="input-field" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={handleSaveProfile} className="btn-primary text-sm">
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="glass-card p-6 space-y-5 animate-fade-in">
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-2">Learning Style</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['visual', 'auditory', 'reading', 'kinesthetic'].map(style => (
                <button key={style} onClick={() => setPreferences({ ...preferences, learningStyle: style })}
                  className={`p-3 rounded-xl border text-center capitalize text-sm font-medium transition-all ${
                    preferences.learningStyle === style
                      ? 'border-coral-500/50 bg-coral-500/10 text-coral-500'
                      : 'border-white/5 text-stone-400 hover:border-white/15'
                  }`}>{style}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-2">Default Difficulty</label>
            <div className="grid grid-cols-3 gap-3">
              {['beginner', 'intermediate', 'advanced'].map(level => (
                <button key={level} onClick={() => setPreferences({ ...preferences, difficulty: level })}
                  className={`p-3 rounded-xl border text-center capitalize text-sm font-medium transition-all ${
                    preferences.difficulty === level
                      ? 'border-coral-500/50 bg-coral-500/10 text-coral-500'
                      : 'border-white/5 text-stone-400 hover:border-white/15'
                  }`}>{level}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'system'].map(theme => (
                <button key={theme} onClick={() => setPreferences({ ...preferences, theme })}
                  className={`p-3 rounded-xl border text-center capitalize text-sm font-medium transition-all ${
                    preferences.theme === theme
                      ? 'border-coral-500/50 bg-coral-500/10 text-coral-500'
                      : 'border-white/5 text-stone-400 hover:border-white/15'
                  }`}>{theme}</button>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={handleSavePreferences} className="btn-primary text-sm">
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="glass-card p-6 space-y-4 animate-fade-in">
          {[
            { key: 'notifications', label: 'Push Notifications', desc: 'Receive in-app notifications for session updates' },
            { key: 'emailDigest', label: 'Email Digest', desc: 'Receive weekly learning progress emails' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-xl">
              <div>
                <p className="text-sm font-medium text-stone-200">{label}</p>
                <p className="text-xs text-stone-500">{desc}</p>
              </div>
              <button
                onClick={() => setPreferences({ ...preferences, [key]: !(preferences as any)[key] })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  (preferences as any)[key] ? 'bg-coral-500' : 'bg-white/10'
                }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  (preferences as any)[key] ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <div className="glass-card p-6 space-y-4 animate-fade-in">
          <div className="p-4 bg-white/2 border border-white/5 rounded-xl">
            <h3 className="text-sm font-semibold text-white mb-1">Data Privacy</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Your learning data is encrypted and stored securely. We never share your personal data with third parties.
              AI analysis is performed only to enhance your learning experience.
            </p>
          </div>
          <div className="p-4 bg-white/2 border border-white/5 rounded-xl">
            <h3 className="text-sm font-semibold text-white mb-1">Data Export</h3>
            <p className="text-xs text-stone-400 mb-3">Download all your learning data in JSON format.</p>
            <button className="btn-secondary text-xs">Export My Data</button>
          </div>
          <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl">
            <h3 className="text-sm font-semibold text-terracotta-500 mb-1">Delete Account</h3>
            <p className="text-xs text-stone-400 mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-terracotta-500/10 text-terracotta-500 hover:bg-rose-500/20 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
