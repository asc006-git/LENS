import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  Lightbulb,
  FileText,
  Settings,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { to: '/faculty/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/faculty/courses', label: 'Courses', icon: BookOpen },
  { to: '/faculty/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/faculty/interventions', label: 'Interventions', icon: Lightbulb },
  { to: '/faculty/reports', label: 'Reports', icon: FileText },
  { to: '/faculty/settings', label: 'Settings', icon: Settings },
];

export default function FacultySidebar() {
  const { user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-secondary-100 flex flex-col z-30">
      <div className="p-6 border-b border-secondary-100">
        <NavLink to="/faculty/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary-900 rounded-xl flex items-center justify-center">
            <GraduationCap size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-secondary-900">LENS</h1>
            <p className="text-xs text-secondary-500">Faculty Portal</p>
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
                    ? 'bg-secondary-900 text-white'
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
          <div className="w-8 h-8 rounded-full bg-secondary-200 flex items-center justify-center text-secondary-700 font-medium text-sm">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-secondary-500 truncate">{user?.department}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
