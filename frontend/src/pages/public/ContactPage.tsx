import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-4">Contact Us</h1>
          <p className="text-lg text-secondary-500">Have questions? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-6">
            {[
              { icon: Mail, title: 'Email', value: 'hello@lens.edu' },
              { icon: MapPin, title: 'Location', value: 'San Francisco, CA' },
              { icon: Phone, title: 'Phone', value: '+1 (555) 123-4567' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-card border border-secondary-100">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-primary-600" />
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">{item.title}</h4>
                  <p className="text-sm text-secondary-500">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white rounded-card border border-secondary-100 p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-3 border border-secondary-200 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-3 border border-secondary-200 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Subject</label>
              <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="w-full px-4 py-3 border border-secondary-200 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Message</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} className="w-full px-4 py-3 border border-secondary-200 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
            </div>
            <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-medium rounded-button hover:bg-primary-600 transition-colors">
              <Send size={16} />
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
