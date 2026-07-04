import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-secondary-500 mb-6">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          {index > 0 && <ChevronRight size={14} className="text-secondary-300" />}
          {item.to ? (
            <Link to={item.to} className="hover:text-secondary-900 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-secondary-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
