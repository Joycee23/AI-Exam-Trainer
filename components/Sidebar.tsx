'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Zap,
  ClipboardCheck,
  XCircle,
  FileText,
  BarChart3,
  Menu,
  X,
  Brain,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/modules', label: 'Modules', icon: BookOpen },
  { href: '/quick-practice', label: 'Quick Practice', icon: Zap },
  { href: '/data-track', label: 'Data Track', icon: BookOpen },
  { href: '/ai-thuc-chien', label: 'AI Thực Chiến · Chọn track', icon: Brain },
  { href: '/exam', label: 'Exam Mode', icon: ClipboardCheck },
  { href: '/midterm', label: 'Midterm · 90 phút', icon: FileText },
  { href: '/mistakes', label: 'Mistakes', icon: XCircle },
  { href: '/cheatsheet', label: 'Cheat Sheet', icon: FileText },
  { href: '/statistics', label: 'Statistics', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-4 py-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
          <Brain size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-none">AI Exam Trainer</h1>
          <p className="text-[10px] text-gray-500 mt-0.5">Luyện thi Kỹ sư AI</p>
        </div>
      </Link>

      {/* Nav Items */}
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  active
                    ? 'bg-white/[0.08] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }
              `}
            >
              <Icon size={18} className={active ? 'text-violet-400' : ''} />
              {item.label}
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <p className="text-[10px] text-gray-600 text-center">
          © 2026 AI Exam Trainer
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-[#0a0b0f]/95
        border-r border-white/[0.06] backdrop-blur-xl z-40">
        <NavContent />
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a0b0f]/95
        border-b border-white/[0.06] backdrop-blur-xl z-40 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Brain size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold text-white">AI Exam Trainer</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center text-gray-400
            hover:text-white transition-colors"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 w-64 bg-[#0a0b0f] border-l border-white/[0.06]
          z-50 flex flex-col transform transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-end p-3">
          <button
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center text-gray-400
              hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <NavContent />
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0b0f]/95 border-t border-white/[0.06]
        backdrop-blur-xl z-30 flex items-center justify-around px-1 py-1.5 safe-area-bottom">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg min-w-0 transition-colors
                ${active ? 'text-violet-400' : 'text-gray-500 hover:text-gray-300'}
              `}
            >
              <Icon size={18} />
              <span className="text-[9px] font-medium truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
