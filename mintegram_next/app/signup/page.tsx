'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, User, LockKeyhole, CheckCircle2, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';

export default function SignUpPage() {
  const router = useRouter();
  const { login, user } = useAuthStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push('/integrame');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Completează toate câmpurile');
      return;
    }

    if (password !== confirmPassword) {
      setError('Parolele nu se potrivesc');
      return;
    }

    if (password.length < 6) {
      setError('Parola trebuie să aibă cel puțin 6 caractere');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/api/auth/register/', {
        username,
        email,
        password,
      });

      // Auto-login după înregistrare
      await login(email, password);
      router.push('/integrame');
    } catch (err: any) {
      let errorMessage = 'Eroare la înregistrare';
      
      if (err.response?.data) {
        const data = err.response.data;
        
        // Dacă sunt erori de validare (dict cu field names)
        if (typeof data === 'object' && !Array.isArray(data)) {
          const errorKeys = Object.keys(data);
          if (errorKeys.length > 0) {
            const firstField = errorKeys[0];
            const firstError = data[firstField];
            errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          }
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-30 bg-linear-to-br from-blue-200 via-purple-200 to-pink-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
        />
        <div className="relative space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">M</div>
            <div>
              <p className="text-xs text-gray-500">Creează cont</p>
              <h1 className="text-xl font-bold text-gray-900">Alătură-te Mintegram</h1>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-gap-2"
            >
              <AlertCircle className="text-red-600 shrink-0" size={18} />
              <p className="text-sm text-red-600 ml-2">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Nume utilizator" 
              placeholder="mintegramer" 
              icon={<User size={18} />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
            <Input 
              label="Confirmă parola" 
              type="password" 
              placeholder="••••••••" 
              icon={<CheckCircle2 size={18} />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button 
              variant="primary" 
              size="md" 
              className="w-full"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Se creează cont...' : 'Creează cont'}
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Ai deja cont? <Link href="/login" className="text-purple-600 font-semibold">Autentifică-te</Link>
            </p>
          </form>
        </div>
      </Card>
    </div>
  );
}
