import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { KeyRound, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.message || 'If an account exists, a password reset link has been dispatched.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit reset request. Please check email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orbit-lavender text-orbit-purple flex items-center justify-center mx-auto shadow-soft mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-plum">Reset your password</h2>
          <p className="text-sm text-plum/70 font-normal">
            Enter your registered email address and we will dispatch password recovery instructions.
          </p>
        </div>

        <Card padding="p-8">
          {error && <Alert type="error" message={error} className="mb-6" onDismiss={() => setError('')} />}
          {message && (
            <div className="mb-6 p-4 rounded-xl bg-orbit-mint/40 border border-orbit-mint text-[#123E24] text-sm flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-plum/80 mb-2">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-plum/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@university.edu"
                  className="w-full pl-11 pr-4 py-3 bg-cream/50 rounded-xl border border-plum/15 text-sm text-plum focus:outline-none focus:border-orbit-purple focus:ring-1 focus:ring-orbit-purple transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full shadow-soft"
            >
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-plum/10 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-plum/70 hover:text-plum transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};
