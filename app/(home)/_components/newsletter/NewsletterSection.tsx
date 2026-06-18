'use client';

import { useState } from 'react';
import { Email, Send } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      setSuccess(false);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Thank you for subscribing! Check your email for confirmation.');
      setSuccess(true);
      setEmail('');
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-xl overflow-hidden">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Email className="text-white" fontSize="large" />
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          
          <p className="text-white/90 text-lg mb-8">
            Get exclusive deals, new product announcements, and shopping tips delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <CircularProgress size={20} className="text-blue-600" />
                ) : (
                  <>
                    Subscribe
                    <Send fontSize="small" />
                  </>
                )}
              </button>
            </div>
            
            {message && (
              <p className={`mt-4 text-sm ${success ? 'text-green-200' : 'text-red-200'}`}>
                {message}
              </p>
            )}
          </form>

          <p className="text-white/70 text-sm mt-6">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from us.
          </p>
        </div>
      </div>
    </div>
  );
}
