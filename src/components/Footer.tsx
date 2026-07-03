import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest dark:bg-surface-dim border-t border-outline-variant/50 w-full mt-auto">
      <div className="py-12 px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto w-full">
        {/* Brand Column */}
        <div className="col-span-1 flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              alt="LENS Brand Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
              src="/logo.svg"
            />
            <span className="text-xl font-bold text-on-surface font-headline-sm">LENS</span>
          </Link>
          <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed font-body-sm">
            Empowering the next generation of independent thinkers with responsible AI.
          </p>
          <div className="mt-4 md:mt-auto text-xs text-on-surface-variant">
            © 2026 LENS AI Education. All rights reserved.
          </div>
        </div>

        {/* Links Columns */}
        <div className="col-span-1 flex flex-col gap-2 font-body-sm">
          <h4 className="text-sm font-semibold text-on-surface mb-2 font-label-md">Product</h4>
          <Link href="/#info" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
            Product Info
          </Link>
          <Link href="/#features" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/student" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
            Workspace
          </Link>
        </div>

        <div className="col-span-1 flex flex-col gap-2 font-body-sm">
          <h4 className="text-sm font-semibold text-on-surface mb-2 font-label-md">Resources</h4>
          <Link href="/#docs" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
            Documentation
          </Link>
          <Link href="https://github.com" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
            Github
          </Link>
          <Link href="/#community" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
            Community
          </Link>
        </div>

        <div className="col-span-1 flex flex-col gap-2 font-body-sm">
          <h4 className="text-sm font-semibold text-on-surface mb-2 font-label-md">Legal</h4>
          <Link href="/#privacy" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/#terms" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="/#cookies" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
