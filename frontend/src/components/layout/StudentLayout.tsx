import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface StudentLayoutProps {
  children: ReactNode;
}

function TopNav() {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Learning Workspace';
    if (path.includes('/learning/new')) return 'New Learning Session';
    if (path.includes('/analysis')) return 'AI Learning Analysis';
    if (path.includes('/blueprint')) return 'Learning Blueprint';
    if (path.includes('/validation')) return 'Adaptive Validation';
    if (path.includes('/reflection')) return 'Reflection Notebook';
    if (path.includes('/report')) return 'Learning Report';
    if (path.includes('/guided')) return 'Guided Learning';
    if (path.includes('/mentor')) return 'AI Mentor';
    if (path.includes('/portfolio')) return 'Growth Portfolio';
    if (path.includes('/achievements')) return 'Achievements';
    if (path.includes('/reports')) return 'Reports';
    if (path.includes('/settings')) return 'Settings';
    return 'LENS';
  };

  return (
    <header className="sticky top-0 z-20 h-14 border-b border-white/5 bg-lens-navy/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div>
        <h2 className="text-sm font-semibold text-white">{getPageTitle()}</h2>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral-500 rounded-full" />
        </button>
        <button className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors">
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="min-h-screen bg-lens-navy">
      <Sidebar />
      <div className="ml-64 transition-all duration-300">
        <TopNav />
        <main className="p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
