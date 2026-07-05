import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, BarChart3, Lightbulb, FileText,
  Settings, Sparkles, LogOut, ChevronLeft, ChevronRight, GraduationCap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

const navItems = [
  { to: '/faculty/dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
  { to: '/faculty/courses', label: 'Courses', icon: BookOpen },
  { to: '/faculty/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/faculty/interventions', label: 'Interventions', icon: Lightbulb },
  { to: '/faculty/reports', label: 'Reports', icon: FileText },
  { to: '/faculty/settings', label: 'Settings', icon: Settings },
];

export default function FacultySidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`fixed left-0 top-0 h-full bg-lens-navy border-r border-white/5 flex flex-col z-30 transition-all duration-300 ${
      collapsed ? 'w-[72px]' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="p-4 border-b border-white/5">
        <NavLink to="/faculty/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage-500 to-teal-500 flex items-center justify-center shrink-0 shadow-glow-emerald">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold text-white leading-tight">LENS</h1>
              <p className="text-[10px] text-stone-500 leading-tight">Faculty Portal</p>
            </div>
          )}
        </NavLink>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {({ isActive }) => (
              <div className={`sidebar-link ${isActive ? 'active !bg-emerald-500/12 !text-sage-500' : ''} ${collapsed ? 'justify-center !px-3' : ''}`}
                title={collapsed ? item.label : undefined}>
                <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? '!text-emerald-500' : ''}`} />
                {!collapsed && <span>{item.label}</span>}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-3 mb-2 p-2 rounded-lg text-stone-500 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* User Card */}
      <div className="p-3 border-t border-white/5">
        <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sage-500 to-teal-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-stone-500 truncate">{user?.department || 'Department'}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleLogout} className="p-1.5 rounded-lg text-stone-500 hover:text-terracotta-500 hover:bg-terracotta-500/10 transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
