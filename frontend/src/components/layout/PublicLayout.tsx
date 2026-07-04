import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="h-16 border-b border-secondary-100 flex items-center justify-between px-6 lg:px-12 sticky top-0 bg-white/80 backdrop-blur-lg z-30">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-secondary-900">LENS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/about" className="text-sm font-medium text-secondary-600 hover:text-secondary-900 transition-colors">About</Link>
          <Link to="/features" className="text-sm font-medium text-secondary-600 hover:text-secondary-900 transition-colors">Features</Link>
          <Link to="/contact" className="text-sm font-medium text-secondary-600 hover:text-secondary-900 transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-secondary-900 transition-colors">
            Log in
          </Link>
          <Link to="/register" className="px-5 py-2.5 bg-primary-500 text-white text-sm font-medium rounded-button hover:bg-primary-600 transition-colors">
            Get Started
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
