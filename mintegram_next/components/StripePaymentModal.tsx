'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Check } from 'lucide-react';

interface PaymentModalProps {
  product: {
    id: number;
    name: string;
    priceDisplay: string;
    price: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function StripePaymentModal({ product, onClose, onSuccess }: PaymentModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe nu este inițializat');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Crează Payment Intent pe backend
      const response = await fetch('/api/payments/create-payment-intent/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          product_id: product.id,
          amount: Math.round(product.price * 100), // Stripe folosește cenți
          email: email,
          product_name: product.name
        })
      });

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error('Nu s-a putut crea Payment Intent');
      }

      // 2. Confirmă plata cu Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            email: email
          }
        }
      });

      if (stripeError) {
        setError(stripeError.message || 'Eroare la plată');
      } else if (paymentIntent?.status === 'succeeded') {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare neprevăzută');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Plăți Secure</h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>

          {success ? (
            // Ecran de succes
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Plată Reușită!</h3>
              <p className="text-gray-600">
                Ai cumpărat {product.name} cu succes. Merci!
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-4">
              {/* Rezumat Produs */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-600 text-sm">Produs</p>
                <p className="text-lg font-bold text-gray-900">{product.name}</p>
                <p className="text-2xl font-bold text-purple-600 mt-2">{product.priceDisplay}</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:bg-gray-100"
                  placeholder="user@example.com"
                />
              </div>

              {/* Card Details */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <CreditCard size={18} />
                  Detalii Card
                </label>
                <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-purple-600">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Eroare */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm"
                >
                  ❌ {error}
                </motion.div>
              )}

              {/* Buton Plată */}
              <button
                type="submit"
                disabled={loading || !stripe || !elements || !email}
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                  loading
                    ? 'bg-gray-400 text-white cursor-wait'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                } disabled:opacity-50`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Se procesează...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Plătește {product.priceDisplay}
                  </>
                )}
              </button>

              {/* Notă de Securitate */}
              <p className="text-xs text-gray-500 text-center">
                🔒 Plata este securizată de Stripe. Informațiile tale de card nu sunt stocate.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
