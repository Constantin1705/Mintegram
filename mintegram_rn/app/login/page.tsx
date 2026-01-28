'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LockKeyhole, Mail, User, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-40 bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">M</div>
            <div>
              <p className="text-xs text-gray-500">Bine ai revenit</p>
              <h1 className="text-xl font-bold text-gray-900">Autentificare</h1>
            </div>
          </div>

          <div className="space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" icon={<Mail size={18} />} />
            <Input label="Parolă" type="password" placeholder="••••••••" icon={<LockKeyhole size={18} />} />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                Ține-mă minte
              </label>
              <Link href="#" className="text-purple-600 font-semibold">Am uitat parola</Link>
            </div>
            <Button variant="primary" size="md" className="w-full" icon={<ArrowRight size={18} />}>
              Conectează-te
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Nu ai cont? <Link href="/signup" className="text-purple-600 font-semibold">Creează cont</Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
