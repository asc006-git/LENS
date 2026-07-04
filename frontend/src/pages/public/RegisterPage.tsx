import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', role: 'student' as 'student' | 'faculty',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await register({
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      toast.success('Account created successfully!');
      navigate(form.role === 'faculty' ? '/faculty/dashboard' : '/student/dashboard');
    } catch (error) {
      toast.error('Registration failed');
    }
  };

  const updateForm = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-secondary-900">LENS</span>
        </div>

        <h1 className="text-2xl font-bold text-secondary-900 mb-2 text-center">Create your account</h1>
        <p className="text-secondary-500 mb-8 text-center">Start your authentic learning journey.</p>

        <div className="flex bg-secondary-100 rounded-button p-1 mb-6">
          {(['student', 'faculty'] as const).map((role) => (
            <button key={role} onClick={() => updateForm('role', role)} className={`flex-1 py-2 text-sm font-medium rounded-[10px] transition-colors ${form.role === role ? 'bg-white text-secondary-900 shadow-sm' : 'text-secondary-500 hover:text-secondary-700'}`}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">First name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                <input type="text" value={form.firstName} onChange={(e) => updateForm('firstName', e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Last name</label>
              <input type="text" value={form.lastName} onChange={(e) => updateForm('lastName', e.target.value)} required className="w-full px-4 py-3 border border-secondary-200 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
              <input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
              <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => updateForm('password', e.target.value)} required className="w-full pl-10 pr-12 py-3 border border-secondary-200 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1.5">Confirm password</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => updateForm('confirmPassword', e.target.value)} required className="w-full px-4 py-3 border border-secondary-200 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-3 bg-primary-500 text-white font-medium rounded-button hover:bg-primary-600 transition-colors disabled:opacity-50">
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-secondary-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
