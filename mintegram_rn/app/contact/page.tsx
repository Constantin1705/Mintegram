'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Contact și Feedback</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formular */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Trimite-ne un Mesaj</h2>
          
          {submitted && (
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
              ✓ Mulțumim! Mesajul tău a fost trimis cu succes.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Nume</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Subiect</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Mesaj</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Se trimite...' : 'Trimite Mesaj'}
            </button>
          </form>
        </div>

        {/* Informații Contact */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📧 Email</h3>
            <p className="text-gray-600">
              <a href="mailto:support@mintegram.com" className="text-indigo-600 hover:underline">
                support@mintegram.com
              </a>
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🌐 Social Media</h3>
            <div className="space-y-2">
              <p><a href="https://facebook.com/mintegram" target="_blank" className="text-indigo-600 hover:underline">Facebook</a></p>
              <p><a href="https://twitter.com/mintegram" target="_blank" className="text-indigo-600 hover:underline">Twitter</a></p>
              <p><a href="https://instagram.com/mintegram" target="_blank" className="text-indigo-600 hover:underline">Instagram</a></p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Informații</h3>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-indigo-600 hover:underline">Politica de Confidențialitate</Link>
              <Link href="/terms" className="block text-indigo-600 hover:underline">Termeni și Condiții</Link>
              <Link href="/about" className="block text-indigo-600 hover:underline">Despre Noi</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
