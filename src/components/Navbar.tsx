"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "Student Workspace", href: "/student" },
    { name: "Faculty Workspace", href: "/faculty" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-surface/95 shadow-md border-b border-outline-variant/40"
            : "bg-surface/80 border-b border-outline-variant/20"
        } backdrop-blur-md`}
      >
        <div className="flex justify-between items-center h-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              alt="LENS Brand Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
              src="/logo.svg"
            />
            <span className="text-2xl font-bold text-primary tracking-tight font-headline-md">LENS</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-primary border-b-2 border-primary pb-1 font-bold"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/role-selection">
              <button className="px-5 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors">
                Login
              </button>
            </Link>
            <Link href="/role-selection">
              <button className="px-5 py-2 text-sm font-semibold bg-primary text-on-primary rounded-xl shadow-sm hover:shadow-md transition-all hover:opacity-90">
                Get Started
              </button>
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-on-surface p-2">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-surface/95 backdrop-blur-lg border-t border-outline-variant/30 animate-fade-in md:hidden">
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-semibold py-2 transition-colors ${
                  isActive(link.href) ? "text-primary font-bold" : "text-on-surface-variant"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-outline-variant/30 flex flex-col gap-3">
              <Link href="/role-selection" onClick={() => setIsOpen(false)}>
                <button className="w-full py-3 text-center text-sm font-semibold text-on-surface-variant hover:bg-surface-variant rounded-xl transition-colors border border-outline-variant/30">
                  Login
                </button>
              </Link>
              <Link href="/role-selection" onClick={() => setIsOpen(false)}>
                <button className="w-full py-3 text-center text-sm font-semibold bg-primary text-on-primary rounded-xl shadow-sm transition-all hover:opacity-90">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
