import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, ArrowRight, Brain, Target, BookOpen, TrendingUp, Shield, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../state/authStore';
import toast from 'react-hot-toast';
import api from '../../api/client';

const benefits = [
  { icon: Brain, text: 'AI-powered concept analysis' },
  { icon: Target, text: 'Adaptive learning validation' },
  { icon: BookOpen, text: 'Personal reflection notebook' },
  { icon: TrendingUp, text: 'Long-term growth tracking' },
  { icon: Shield, text: 'Build genuine understanding' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      const user = useAuthStore.getState().user;
      if (user) {
        toast.success(`Welcome back, ${user.firstName || 'Learner'}!`);
        if (user.role === 'faculty') {
          navigate('/faculty/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lens-navy flex">
      {/* Left Panel — Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-coral-600/20 via-violet-600/20 to-lens-navy" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-coral-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col justify-center px-12 xl:px-20">
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">LENS</span>
          </Link>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-4">
            Welcome to Your{' '}
            <span className="gradient-text">Learning Workspace</span>
          </h2>
          <p className="text-stone-400 mb-10 max-w-md">
            Sign in to continue your personalized AI-assisted learning journey.
          </p>

          <div className="space-y-4">
            {benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-coral-500" />
                </div>
                <span className="text-sm text-stone-300">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Auth Card */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">LENS</span>
            </Link>
          </div>

          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Sign In</h1>
              <p className="text-sm text-stone-400">Enter your credentials to access your workspace</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">Email Address</label>
                <input
                  type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field"
                  placeholder="you@institution.edu"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-stone-400">Password</label>
                  <a href="#" className="text-xs text-coral-500 hover:text-coral-400">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="input-field pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.remember}
                  onChange={(e) => setFormData(prev => ({ ...prev, remember: e.target.checked }))}
                  className="w-4 h-4 rounded border-stone-600 bg-lens-surface text-coral-500 focus:ring-coral-500/30" />
                <span className="text-xs text-stone-400">Remember this session</span>
              </label>

              <button type="submit" disabled={isLoading}
                className="btn-primary w-full justify-center !py-3 disabled:opacity-50">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-stone-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-coral-500 hover:text-coral-400 font-medium">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
