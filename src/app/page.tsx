import Link from 'next/link';
import { ArrowRight, Sparkles, FileText, BarChart3, Globe, Shield, Zap } from 'lucide-react';
import { landingData } from '@/data/landingData';
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-primary via-dark-secondary to-dark-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-primary/95 backdrop-blur-md border-b border-primary/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold gradient-text">
            VATANA
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-gray-300 hover:text-primary transition-colors">
              Log In
            </Link>
            <Link 
              href="/auth/signup"
              className="px-6 py-2 bg-gradient-to-r from-primary to-primary-light text-dark-primary font-semibold rounded-xl hover:shadow-xl transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-32 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            {landingData.hero.headline}
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {landingData.hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-primary-light text-dark-primary font-semibold rounded-xl hover:shadow-xl hover:shadow-primary/40 transition-all"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary/30 text-primary rounded-xl hover:bg-primary/10 transition-all"
            >
              Sign In
            </Link>
          </div>
          <p className="mt-8 text-sm text-gray-400">
            {landingData.hero.socialProof.text}
          </p>
        </div>
      </section>
      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {landingData.features.map((feature) => {
            const IconComponent = { Sparkles, FileText, BarChart3, Globe, Shield, Zap }[feature.icon as keyof typeof import('lucide-react')] || Sparkles;
            
            return (
              <div
                key={feature.id}
                className="p-6 bg-dark-tertiary/50 backdrop-blur-sm border border-primary/10 rounded-xl hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>
      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {landingData.stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-lg font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-gray-400">{stat.description}</div>
            </div>
          ))}
        </div>
      </section>
      {/* Final CTA */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/10 to-primary-light/10 border border-primary/20 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            {landingData.cta.title}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {landingData.cta.subtitle}
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-primary-light text-dark-primary font-semibold rounded-xl hover:shadow-xl hover:shadow-primary/40 transition-all"
          >
            {landingData.cta.button.label}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-400">
            {landingData.cta.features.map((feature, index) => (
              <span key={index}>✓ {feature}</span>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>© 2025 VATANA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}