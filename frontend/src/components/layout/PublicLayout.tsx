import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { Sparkles, Github, Linkedin, Mail, Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-lens-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-coral-500 to-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LENS</span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed mb-6">
              Learning Evaluation & Navigation System — AI-powered learning intelligence that transforms education.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/asc006-git/LENS" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="mailto:contact@lens-platform.app" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10 transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3">
              {[
                { to: '/features', label: 'Features' },
                { to: '/about', label: 'About LENS' },
                { to: '/contact', label: 'Contact' },
                { to: '/login', label: 'Student Login' },
                { to: '/login', label: 'Faculty Login' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-stone-400 hover:text-coral-500 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              {['Documentation', 'API Reference', 'Research Paper', 'Privacy Policy', 'Terms of Service'].map((label) => (
                <li key={label}>
                  <a href="#" className="text-sm text-stone-400 hover:text-coral-500 transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Built With</h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'Node.js', 'MongoDB', 'Gemini AI', 'TypeScript', 'TailwindCSS'].map((tech) => (
                <span key={tech} className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/5 text-stone-400 border border-white/5">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} LENS Platform. All rights reserved.
          </p>
          <p className="text-xs text-stone-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500" /> for better education
          </p>
          <p className="text-xs text-stone-500">v1.0.0</p>
        </div>
      </div>
    </footer>
  );
}

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-lens-navy">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
