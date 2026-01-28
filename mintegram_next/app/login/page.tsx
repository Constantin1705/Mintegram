'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push('/integrame');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Completează toate câmpurile');
      return;
    }

    try {
      await login(email, password);
      router.push('/integrame');
    } catch (err) {
      setLocalError(error || 'Eroare la conectare');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-40 bg-linear-to-br from-purple-200 via-pink-200 to-orange-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">M</div>
            <div>
              <p className="text-xs text-gray-500">Bine ai revenit</p>
              <h1 className="text-xl font-bold text-gray-900">Autentificare</h1>
            </div>
          </div>

          {(localError || error) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-gap-2"
            >
              <AlertCircle className="text-red-600 shrink-0" size={18} />
              <p className="text-sm text-red-600 ml-2">{localError || error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Email" 
              type="email" 
              placeholder="you@example.com" 
              icon={<Mail size={18} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              label="Parolă" 
              type="password" 
              placeholder="••••••••" 
              icon={<LockKeyhole size={18} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                Ține-mă minte
              </label>
              <Link href="#" className="text-purple-600 font-semibold">Am uitat parola</Link>
            </div>
            <Button 
              variant="primary" 
              size="md" 
              className="w-full" 
              icon={<ArrowRight size={18} />}
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Se conectează...' : 'Conectează-te'}
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Nu ai cont? <Link href="/signup" className="text-purple-600 font-semibold">Creează cont</Link>
            </p>
          </form>
        </div>
      </Card>
    </div>
  );
}
