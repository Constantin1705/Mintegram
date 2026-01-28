'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, User, LockKeyhole, CheckCircle2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-30 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
        />
        <div className="relative space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">M</div>
            <div>
              <p className="text-xs text-gray-500">Creează cont</p>
              <h1 className="text-xl font-bold text-gray-900">Alătură-te Mintegram</h1>
            </div>
          </div>

          <Input label="Nume utilizator" placeholder="mintegramer" icon={<User size={18} />} />
          <Input label="Email" type="email" placeholder="you@example.com" icon={<Mail size={18} />} />
          <Input label="Parolă" type="password" placeholder="••••••••" icon={<LockKeyhole size={18} />} />
          <Input label="Confirmă parola" type="password" placeholder="••••••••" icon={<CheckCircle2 size={18} />} />

          <Button variant="primary" size="md" className="w-full">
            Creează cont
          </Button>
          <p className="text-sm text-gray-600 text-center">
            Ai deja cont? <Link href="/login" className="text-purple-600 font-semibold">Autentifică-te</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
