'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, Grid3x3, Trophy, Menu, X, Heart, Gem, Crown, Puzzle } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useEconomyStore } from '@/stores/economyStore';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const { hearts, diamonds, isSubscriber } = useEconomyStore();

  const navItems = [
    { href: '/', label: 'Acasă', icon: <Home size={24} /> },
    { href: '/integrame', label: 'Integrame', icon: <Grid3x3 size={24} /> },
    { href: '/rebusuri', label: 'Rebusuri', icon: <Puzzle size={24} /> },
    { href: '/leaderboard', label: 'Clasament', icon: <Trophy size={24} /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-linear-to-r from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                <Grid3x3 className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold gradient-text hidden sm:block">
                Mintegram
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-gray-800">{item.icon}</div>
                  <span className="font-semibold text-gray-900">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {/* Economy quick status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-1">
                <Heart className="text-rose-600" size={18} />
                <span className="font-semibold text-gray-800">{hearts}</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1">
                <Gem className="text-purple-600" size={18} />
                <span className="font-semibold text-gray-800">{diamonds}</span>
              </div>
              {isSubscriber && (
                <Link href="/subscriptions" className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-linear-to-r from-purple-100 to-pink-100 text-purple-700">
                  <Crown size={16} />
                  <span className="text-xs font-semibold">Pro</span>
                </Link>
              )}
            </div>
            {user ? (
              <Link href="/profile">
                <motion.div
                  className="flex items-center gap-3 px-4 py-2 bg-linear-to-r from-purple-100 to-pink-100 rounded-xl cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-600">Nivel {user.level}</p>
                  </div>
                </motion.div>
              </Link>
            ) : (
              <Link href="/login">
                <motion.button
                  className="px-6 py-2 bg-linear-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Conectare
                </motion.button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 pt-4 border-t border-gray-200"
          >
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="font-semibold text-gray-700">{item.label}</span>
                  </div>
                </Link>
              ))}
              {/* Mobile economy status */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-1">
                  <Heart className="text-rose-600" size={18} />
                  <span className="font-semibold text-gray-800">{hearts}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Gem className="text-purple-600" size={18} />
                  <span className="font-semibold text-gray-800">{diamonds}</span>
                </div>
                <Link href="/subscriptions" className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-linear-to-r from-purple-100 to-pink-100 text-purple-700">
                  <Crown size={16} />
                  <span className="text-xs font-semibold">Abonamente</span>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}
