import { useState } from 'react';
import { Mail, Phone, Linkedin, Github, MapPin, Send, Sparkles, Calendar, Building, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const contactMethods = [
  { icon: Mail, label: 'Email', value: 'contact@lens-platform.app', href: 'mailto:contact@lens-platform.app' },
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: Linkedin, label: 'LinkedIn', value: 'LENS Platform', href: '#' },
  { icon: Github, label: 'GitHub', value: 'asc006-git/LENS', href: 'https://github.com/asc006-git/LENS' },
  { icon: MapPin, label: 'Location', value: 'India', href: '#' },
];

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'demo' | 'partnership'>('general');
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-500/10 border border-sage-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-sage-500" />
            <span className="text-sm font-medium text-sage-400">Get in Touch</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Let's Build Better{' '}
            <span className="gradient-text-success">Learning Together</span>
          </h1>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto">
            Whether you're a student, educator, researcher, or institution — we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {contactMethods.map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="glass-card p-4 text-center group hover:border-emerald-500/30 transition-all">
                <Icon className="w-6 h-6 text-sage-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs text-stone-500 mb-1">{label}</p>
                <p className="text-xs font-medium text-stone-300 truncate">{value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Forms */}
      <section className="py-16 bg-lens-navy-light/50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 p-1 bg-lens-surface rounded-xl">
            {[
              { key: 'general' as const, label: 'General Inquiry', icon: Mail },
              { key: 'demo' as const, label: 'Faculty Demo', icon: Calendar },
              { key: 'partnership' as const, label: 'Partnership', icon: Building },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === key
                    ? 'bg-sage-500/15 text-sage-500'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">Name *</label>
                <input name="name" value={formData.name || ''} onChange={handleChange} required
                  className="input-field" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">Email *</label>
                <input name="email" type="email" value={formData.email || ''} onChange={handleChange} required
                  className="input-field" placeholder="your@email.com" />
              </div>
            </div>

            {activeTab === 'partnership' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">Institution *</label>
                  <input name="institution" value={formData.institution || ''} onChange={handleChange}
                    className="input-field" placeholder="University name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">Department</label>
                  <input name="department" value={formData.department || ''} onChange={handleChange}
                    className="input-field" placeholder="Department" />
                </div>
              </div>
            )}

            {activeTab === 'demo' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">Institution *</label>
                  <input name="institution" value={formData.institution || ''} onChange={handleChange}
                    className="input-field" placeholder="University name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">Preferred Date</label>
                  <input name="demoDate" type="date" value={formData.demoDate || ''} onChange={handleChange}
                    className="input-field" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">Message *</label>
              <textarea name="message" value={formData.message || ''} onChange={handleChange} required
                rows={5} className="input-field resize-none" placeholder="How can we help?" />
            </div>

            <button type="submit" className="btn-primary w-full justify-center">
              <Send className="w-4 h-4" />
              {activeTab === 'demo' ? 'Book Demo' : activeTab === 'partnership' ? 'Request Partnership' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
