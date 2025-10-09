"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Authenticate with Supabase
      const { supabase } = await import('@/lib/supabase/client');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('Login error:', error);
        setErrors({ 
          general: error.message === 'Invalid login credentials' 
            ? 'Invalid email or password. Please try again.'
            : error.message 
        });
        setIsSubmitting(false);
        return;
      }

      // Check if user exists in database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user?.id)
        .single();

      if (userError || !userData) {
        console.error('User data error:', userError);
        setErrors({ general: 'Account not found. Please contact support.' });
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to dashboard
      console.log('Login successful:', userData);
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Login exception:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
    try {
      const { supabase } = await import('@/lib/supabase/client');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'microsoft' ? 'azure' : provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Social login error:', error);
        setErrors({ general: `Failed to sign in with ${provider}. Please try again.` });
      }
    } catch (error) {
      console.error('Social login exception:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(0,217,180,0.15)_0%,transparent_50%),radial-gradient(circle_at_85%_75%,rgba(20,241,149,0.15)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(0,217,180,0.08)_0%,transparent_50%)] animate-gradient" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Panel - Branding (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
          {/* Logo Area */}
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00D9B4] to-[#14F195] bg-clip-text text-transparent mb-2">
              VATANA
            </h1>
            <p className="text-lg text-gray-400">AI-Powered VAT Compliance</p>
          </div>

          {/* Hero Illustration */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D9B4]/20 to-[#14F195]/20 rounded-full blur-3xl" />
              <div className="relative bg-[#1A1F2E]/40 backdrop-blur-xl border border-[#00D9B4]/20 rounded-3xl p-12 text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#00D9B4] to-[#14F195] rounded-2xl flex items-center justify-center">
                  <Shield className="w-16 h-16 text-[#0A0E1A]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Welcome Back
                </h2>
                <p className="text-gray-400">
                  Continue managing your VAT compliance with confidence
                </p>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            {[
              "✓ AI-Powered Validation",
              "✓ Real-Time Compliance",
              "✓ Secure & Encrypted",
              "✓ Multi-Country Support",
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-gray-300 animate-fadeIn"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <span className="text-[#00D9B4]">{feature}</span>
              </div>
            ))}

            <div className="mt-8 pt-8 border-t border-[#00D9B4]/10">
              <p className="text-sm text-gray-500">
                Trusted by 5,000+ businesses worldwide
              </p>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-yellow-400">
                    ★
                  </span>
                ))}
                <span className="text-sm text-gray-400 ml-2">4.9/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00D9B4] to-[#14F195] bg-clip-text text-transparent mb-2">
                VATANA
              </h1>
              <p className="text-gray-400">AI-Powered VAT Compliance</p>
            </div>

            {/* Glass Card */}
            <div className="bg-[#1A1F2E]/80 backdrop-blur-xl border border-[#00D9B4]/20 rounded-3xl p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#00D9B4] to-[#14F195] bg-clip-text text-transparent mb-2">
                  Welcome Back
                </h2>
                <p className="text-lg text-gray-400">
                  Sign in to continue to VATANA
                </p>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleSocialLogin("google")}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-[#1A1F2E]/60 border border-[#00D9B4]/20 rounded-xl text-white font-medium hover:bg-[#00D9B4]/10 hover:border-[#00D9B4]/40 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,217,180,0.2)] transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => handleSocialLogin("microsoft")}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-[#1A1F2E]/60 border border-[#00D9B4]/20 rounded-xl text-white font-medium hover:bg-[#00D9B4]/10 hover:border-[#00D9B4]/40 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,217,180,0.2)] transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#f25022" d="M1 1h10v10H1z" />
                    <path fill="#00a4ef" d="M13 1h10v10H13z" />
                    <path fill="#7fba00" d="M1 13h10v10H1z" />
                    <path fill="#ffb900" d="M13 13h10v10H13z" />
                  </svg>
                  Continue with Microsoft
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-[#00D9B4]/10" />
                <span className="text-sm text-gray-400">OR</span>
                <div className="flex-1 h-px bg-[#00D9B4]/10" />
              </div>

              {/* Error Banner */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">{errors.general}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                      className={`w-full pl-12 pr-4 py-3.5 bg-[#1A1F2E]/60 border ${
                        errors.email
                          ? "border-red-500"
                          : "border-[#00D9B4]/20 focus:border-[#00D9B4]"
                      } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#00D9B4]/10 transition-all`}
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-[#00D9B4] hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="••••••••••"
                      className={`w-full pl-12 pr-12 py-3.5 bg-[#1A1F2E]/60 border ${
                        errors.password
                          ? "border-red-500"
                          : "border-[#00D9B4]/20 focus:border-[#00D9B4]"
                      } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#00D9B4]/10 transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                    className="w-4 h-4 rounded border-[#00D9B4]/30 bg-[#1A1F2E]/60 text-[#00D9B4] focus:ring-2 focus:ring-[#00D9B4]/20"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 text-sm text-gray-400"
                  >
                    Remember me for 30 days
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#00D9B4] to-[#14F195] rounded-xl text-[#0A0E1A] font-semibold hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,217,180,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-500">
                <Shield className="w-4 h-4 text-[#00D9B4]" />
                Your data is encrypted and secure
              </div>

              {/* Sign Up Link */}
              <div className="text-center mt-8">
                <p className="text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="text-[#00D9B4] font-semibold hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              {/* Footer Links */}
              <div className="flex items-center justify-center gap-3 mt-8 text-xs text-gray-500">
                <a href="#" className="hover:text-[#00D9B4] transition-colors">
                  Terms of Service
                </a>
                <span>•</span>
                <a href="#" className="hover:text-[#00D9B4] transition-colors">
                  Privacy Policy
                </a>
                <span>•</span>
                <a href="#" className="hover:text-[#00D9B4] transition-colors">
                  Help
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          animation: gradient 20s ease infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
