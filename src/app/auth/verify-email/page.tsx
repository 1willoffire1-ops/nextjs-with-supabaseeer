"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, CheckCircle, RefreshCw } from "lucide-react";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    // Get email from localStorage if available
    const storedEmail = localStorage.getItem("pendingVerificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;

    try {
      const { supabase } = await import("@/lib/supabase/client");
      
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        console.error("Resend error:", error);
        return;
      }

      setResendSuccess(true);
      setResendCooldown(60);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (error) {
      console.error("Resend exception:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(0,217,180,0.15)_0%,transparent_50%),radial-gradient(circle_at_85%_75%,rgba(20,241,149,0.15)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(0,217,180,0.08)_0%,transparent_50%)] animate-gradient" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Glass Card */}
          <div className="bg-[#1A1F2E]/80 backdrop-blur-xl border border-[#00D9B4]/20 rounded-3xl p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-center">
            {/* Icon */}
            <div className="inline-flex p-6 bg-[#00D9B4]/10 rounded-full mb-6 animate-pulse">
              <Mail className="w-16 h-16 text-[#00D9B4]" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00D9B4] to-[#14F195] bg-clip-text text-transparent mb-4">
              Verify Your Email
            </h1>

            {/* Message */}
            <div className="space-y-4 mb-8">
              <p className="text-lg text-gray-300">
                We've sent a verification link to:
              </p>
              <p className="text-xl font-semibold text-white">
                {email || "your email address"}
              </p>
              <p className="text-gray-400">
                Click the link in the email to activate your account
              </p>
            </div>

            {/* Resend Success Message */}
            {resendSuccess && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-sm text-green-400">Email sent successfully!</p>
              </div>
            )}

            {/* Resend Email Button */}
            <button
              onClick={handleResendEmail}
              disabled={resendCooldown > 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1F2E]/60 border border-[#00D9B4]/20 rounded-xl text-white font-medium hover:bg-[#00D9B4]/10 hover:border-[#00D9B4]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-4"
            >
              <RefreshCw className={`w-5 h-5 ${resendCooldown > 0 ? "animate-spin" : ""}`} />
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend Verification Email"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#00D9B4]/10" />
              <span className="text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-[#00D9B4]/10" />
            </div>

            {/* Instructions */}
            <div className="text-left p-4 bg-[#0A0E1A]/50 rounded-lg mb-6">
              <p className="text-sm text-gray-400 mb-3">
                <strong className="text-white">Didn't receive the email?</strong>
              </p>
              <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                <li>Check your spam or junk folder</li>
                <li>Make sure you entered the correct email</li>
                <li>Wait a few minutes and try again</li>
              </ul>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-[#00D9B4] hover:underline"
              >
                ← Back to Sign In
              </Link>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-500">
              <CheckCircle className="w-4 h-4 text-[#00D9B4]" />
              Secure email verification
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
      `}</style>
    </div>
  );
}
