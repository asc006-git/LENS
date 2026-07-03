"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import type { UserRole } from "@/lib/types";
import { SIDEBAR_STUDENT_LINKS, SIDEBAR_FACULTY_LINKS } from "@/lib/constants";

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard: Icons.LayoutDashboard,
  BookOpen: Icons.BookOpen,
  PlusCircle: Icons.PlusCircle,
  Bot: Icons.Bot,
  NotebookPen: Icons.NotebookPen,
  BarChart3: Icons.BarChart3,
  TrendingUp: Icons.TrendingUp,
  Award: Icons.Award,
  Settings: Icons.Settings,
  User: Icons.User,
  Users: Icons.Users,
  FileText: Icons.FileText,
  Shield: Icons.Shield,
};

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const links = role === "faculty" ? SIDEBAR_FACULTY_LINKS : SIDEBAR_STUDENT_LINKS;
  const workspaceLabel = role === "faculty" ? "Faculty Workspace" : "Student Workspace";

  const isActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/student") return pathname === "/student";
    if (href === "/faculty") return pathname === "/faculty";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8 px-2">
        <Image alt="LENS logo" src="/logo.svg" width={32} height={32} />
        <div>
          <h1 className="text-xl font-bold text-primary font-headline-sm">LENS</h1>
          <p className="text-xs text-on-surface-variant font-label-sm">{workspaceLabel}</p>
        </div>
      </div>

      <ul className="flex flex-col gap-1 flex-grow">
        {links.map((link, idx) => {
          const IconComp = iconMap[link.icon];
          const active = isActive(link.href);

          if (link.name === "Settings" || link.name === "Profile") {
            return (
              <li key={idx} className={link.name === "Profile" ? "mt-auto pt-4 border-t border-outline-variant/20" : ""}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm active:scale-95 duration-150 ${
                    active
                      ? "text-primary bg-primary-container/10 font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {IconComp && <IconComp className="w-5 h-5" />}
                  <span>{link.name}</span>
                </Link>
              </li>
            );
          }

          return (
            <li key={idx}>
              <Link
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm active:scale-95 duration-150 ${
                  active
                    ? "text-primary bg-primary-container/10 font-bold"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {IconComp && <IconComp className="w-5 h-5" />}
                <span>{link.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="bg-surface-container-lowest h-screen w-72 fixed left-0 top-0 border-r border-outline-variant shadow-sm flex flex-col p-6 z-40 hidden md:flex">
        {sidebarContent}
      </nav>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <div className="relative flex flex-col w-72 max-w-sm bg-surface h-full p-6 border-r border-outline-variant shadow-xl animate-slide-in">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Image alt="LENS logo" src="/logo.svg" width={32} height={32} />
                <div>
                  <h1 className="text-xl font-bold text-primary font-headline-sm">LENS</h1>
                  <p className="text-xs text-on-surface-variant font-label-sm">{workspaceLabel}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center"
              >
                <Icons.X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>
            <ul className="flex flex-col gap-1 flex-grow">
              {links.map((link, idx) => {
                const IconComp = iconMap[link.icon];
                const active = isActive(link.href);

                const item = (
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                      active
                        ? "text-primary bg-primary-container/10 font-bold"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {IconComp && <IconComp className="w-5 h-5" />}
                    <span>{link.name}</span>
                  </Link>
                );

                if (link.name === "Profile") {
                  return (
                    <li key={idx} className="mt-auto pt-4 border-t border-outline-variant/20">
                      {item}
                    </li>
                  );
                }
                return <li key={idx}>{item}</li>;
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
