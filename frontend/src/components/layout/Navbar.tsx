import { useState } from 'react';
import { Search, Bell, HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-white border-b border-secondary-100 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
          <input
            type="text"
            placeholder="Search sessions, reports, concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary-50 border border-secondary-100 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50 transition-colors">
          <HelpCircle size={20} />
        </button>
        <button className="relative p-2 rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-button hover:bg-secondary-50 transition-colors"
          >
            <Avatar name={user ? `${user.firstName} ${user.lastName}` : ''} size="sm" />
            <ChevronDown size={14} className="text-secondary-400" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-card shadow-elevated border border-secondary-100 py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-secondary-100">
                  <p className="text-sm font-medium text-secondary-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-secondary-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => { setShowProfile(false); logout(); }}
                  className="w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                >
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
