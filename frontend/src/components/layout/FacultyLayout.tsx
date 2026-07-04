import { ReactNode } from 'react';
import FacultySidebar from './FacultySidebar';
import Navbar from './Navbar';

interface FacultyLayoutProps {
  children: ReactNode;
}

export default function FacultyLayout({ children }: FacultyLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <FacultySidebar />
      <div className="ml-64">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
