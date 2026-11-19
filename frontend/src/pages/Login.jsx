import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { LogIn, ArrowRight, Sparkles, Lock, Mail } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to sign in. Please verify your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('demo.candidate@preporbit.ai');
    setPassword('DemoPass123!');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-9 h-9 rounded-full bg-orbit-purple flex items-center justify-center shadow-soft">
              <img src="/logo.svg" alt="PrepOrbit Logo" className="w-7 h-7" />
            </div>
            <span className="font-serif text-2xl font-bold text-plum">PrepOrbit</span>
          </Link>
          <h2 className="font-serif text-3xl font-bold text-plum">Welcome back</h2>
          <p className="text-sm text-plum/70 font-normal">
            Sign in to access your interview studios and performance analytics.
          </p>
        </div>

        {/* Form Card */}
        <Card padding="p-8">
          {error && <Alert type="error" message={error} className="mb-6" onDismiss={() => setError('')} />}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-plum/80 mb-2">
                Email Address
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-plum/80">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-orbit-purple hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-plum/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              icon={LogIn}
            >
              Sign In to PrepOrbit
            </Button>
          </form>

          {/* Quick Demo Fill Option for Reviewers / Evaluators */}
          <div className="mt-6 pt-5 border-t border-plum/10 text-center">
            <button
              type="button"
              onClick={handleDemoFill}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orbit-purple hover:text-plum bg-orbit-lavender/40 px-3 py-1.5 rounded-full transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-orbit-purple" />
              <span>Fill Quick Demo Credentials</span>
            </button>
          </div>
        </Card>

        {/* Footer Link */}
        <p className="text-center text-sm text-plum/70 font-medium">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-orbit-purple hover:underline">
            Create account free
          </Link>
        </p>

      </div>
    </div>
  );
};
