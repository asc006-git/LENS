import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  PenTool,
  BarChart3,
  FolderOpen,
  Trophy,
  Settings,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/learning/new', label: 'New Session', icon: BookOpen },
  { to: '/student/mentor', label: 'AI Mentor', icon: Bot },
  { to: '/student/reports', label: 'Reports', icon: BarChart3 },
  { to: '/student/portfolio', label: 'Portfolio', icon: FolderOpen },
  { to: '/student/achievements', label: 'Achievements', icon: Trophy },
  { to: '/student/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-secondary-100 flex flex-col z-30">
      <div className="p-6 border-b border-secondary-100">
        <NavLink to="/student/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <GraduationCap size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-secondary-900">LENS</h1>
            <p className="text-xs text-secondary-500">Learn with AI</p>
          </div>
        </NavLink>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-button text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-secondary-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-secondary-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
