import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, ArrowRight, GraduationCap, Users, CheckCircle2, Brain, Target, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../state/authStore';
import toast from 'react-hot-toast';
import api from '../../api/client';

const benefits = [
  { icon: Brain, text: 'AI-powered learning intelligence' },
  { icon: Target, text: 'Adaptive concept validation' },
  { icon: BookOpen, text: 'Personalized growth tracking' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'student' as 'student' | 'faculty',
    institution: '', department: '',
  });

  const passwordStrength = (() => {
    const p = formData.password;
    if (!p) return { level: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const levels = [
      { level: 1, label: 'Weak', color: 'bg-rose-500' },
      { level: 2, label: 'Fair', color: 'bg-amber-500' },
      { level: 3, label: 'Good', color: 'bg-emerald-400' },
      { level: 4, label: 'Strong', color: 'bg-emerald-500' },
    ];
    return levels[score - 1] || { level: 0, label: '', color: '' };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setIsLoading(true);
    try {
      const nameParts = formData.name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await register({
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        institution: formData.institution,
        department: formData.department,
      });

      const user = useAuthStore.getState().user;
      if (user) {
        toast.success('Account created! Welcome to LENS.');
        if (user.role === 'faculty') {
          navigate('/faculty/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lens-navy flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-cyan-600/15 to-lens-navy" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-sage-500/15 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col justify-center px-12 xl:px-16">
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">LENS</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
            Begin Your{' '}
            <span className="gradient-text-success">Learning Journey</span>
          </h2>
          <p className="text-stone-400 mb-10 max-w-md">
            Create your account and start building authentic understanding with AI-guided learning.
          </p>

          <div className="space-y-4">
            {benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-sage-500 shrink-0" />
                <span className="text-sm text-stone-300">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-lg">
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">LENS</span>
            </Link>
          </div>

          <div className="glass-card p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-sm text-stone-400">Join the LENS learning ecosystem</p>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { role: 'student' as const, icon: GraduationCap, label: 'Student', desc: 'Learning workspace' },
                { role: 'faculty' as const, icon: Users, label: 'Faculty', desc: 'Teaching intelligence' },
              ].map(({ role, icon: Icon, label, desc }) => (
                <button key={role} type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role }))}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    formData.role === role
                      ? 'border-coral-500/50 bg-coral-500/10'
                      : 'border-white/5 bg-white/2 hover:border-white/15'
                  }`}>
                  <Icon className={`w-6 h-6 mb-2 ${formData.role === role ? 'text-coral-500' : 'text-stone-500'}`} />
                  <p className={`text-sm font-semibold ${formData.role === role ? 'text-white' : 'text-stone-300'}`}>{label}</p>
                  <p className="text-xs text-stone-500">{desc}</p>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">Full Name</label>
                <input type="text" required value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field" placeholder="Your full name" />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">Email Address</label>
                <input type="email" required value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field" placeholder="you@institution.edu" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">Institution</label>
                  <input type="text" value={formData.institution}
                    onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                    className="input-field" placeholder="University" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">Department</label>
                  <input type="text" value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="input-field" placeholder="CS, ECE..." />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="input-field pr-10" placeholder="Min 8 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-lens-surface overflow-hidden">
                      <div className={`h-full ${passwordStrength.color} transition-all`}
                        style={{ width: `${passwordStrength.level * 25}%` }} />
                    </div>
                    <span className="text-xs text-stone-500">{passwordStrength.label}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">Confirm Password</label>
                <input type="password" required value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="input-field" placeholder="Re-enter password" />
              </div>

              <button type="submit" disabled={isLoading}
                className="btn-primary w-full justify-center !py-3 disabled:opacity-50">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Account <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-stone-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-coral-500 hover:text-coral-400 font-medium">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
