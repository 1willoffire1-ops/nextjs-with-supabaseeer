import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-background gradient-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Orbs Background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-tertiary/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-32">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-turquoise rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-background font-bold text-xl">V</span>
              </div>
              <span className="text-2xl font-bold gradient-text">VATANA</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-foreground-secondary hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="text-foreground-secondary hover:text-primary transition-colors">Pricing</a>
              <a href="#about" className="text-foreground-secondary hover:text-primary transition-colors">About</a>
              <Link to="/login" className="text-foreground-secondary hover:text-primary transition-colors">Sign In</Link>
              <Link to="/dashboard" className="btn-primary glow-pulse">
                Get Started
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto fade-in-up">
            <div className="badge mb-8">
              AI-Powered VAT Compliance Platform
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Simplify VAT Compliance
              <span className="block gradient-text">
                Across Europe
              </span>
            </h1>
            
            <p className="text-xl text-foreground-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
              Automate VAT calculations, submissions, and compliance monitoring for 27+ EU countries. Save time, reduce errors, and never miss a deadline.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard" className="btn-primary px-8 py-4">
                Start Free Trial
              </Link>
              <button className="glass-button px-8 py-4">
                Watch Demo
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-foreground-tertiary">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="glass-card hover-lift shimmer overflow-hidden">
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'VAT Saved', value: '€127,450', change: '+12.5%', positive: true },
                    { label: 'Compliance Score', value: '98.2%', change: '+2.1%', positive: true },
                    { label: 'Active Integrations', value: '6/27', change: 'EU Countries', positive: true },
                  ].map((stat, i) => (
                    <div key={i} className="glass-card p-6">
                      <div className="text-sm text-foreground-tertiary mb-2">{stat.label}</div>
                      <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                      <div className={`text-sm ${stat.positive ? 'text-success' : 'text-error'}`}>
                        {stat.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl font-bold text-foreground mb-4">Everything you need for VAT compliance</h2>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">Powerful features designed to simplify cross-border tax management</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI-Powered Analysis',
                description: 'Automatically detect VAT errors and get instant fix recommendations with 99.9% accuracy.'
              },
              {
                icon: '🌍',
                title: '27+ EU Countries',
                description: 'Direct integration with tax authorities across Europe for seamless filing and validation.'
              },
              {
                icon: '📊',
                title: 'Real-Time Analytics',
                description: 'Track VAT savings, compliance scores, and risk forecasts with interactive dashboards.'
              },
              {
                icon: '🔐',
                title: 'Bank-Level Security',
                description: 'ISO 27001, SOC 2 Type II certified with end-to-end encryption for all your data.'
              },
              {
                icon: '⚡',
                title: 'Instant Submissions',
                description: 'File VAT returns directly to government systems with real-time status tracking.'
              },
              {
                icon: '👥',
                title: 'Team Collaboration',
                description: 'Role-based access control, audit trails, and collaborative workflows for your team.'
              },
            ].map((feature, i) => (
              <div key={i} className="glass-card hover-lift p-8">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-foreground-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-6 bg-background-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '€50M+', label: 'VAT Processed' },
              { value: '27', label: 'EU Countries' },
              { value: '99.9%', label: 'Uptime SLA' },
            ].map((stat, i) => (
              <div key={i} className="fade-in-up">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-foreground-tertiary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 glow-pulse">
            <h2 className="text-4xl font-bold text-foreground mb-4">Ready to simplify your VAT compliance?</h2>
            <p className="text-xl text-foreground-secondary mb-8">Join thousands of businesses automating their VAT processes</p>
            <Link to="/dashboard" className="btn-primary px-8 py-4 inline-block">
              Start Your Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-foreground font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-foreground-tertiary">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-foreground-tertiary">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-foreground-tertiary">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-foreground-tertiary">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between">
            <p className="text-foreground-tertiary text-sm">© 2025 VATANA. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-foreground-tertiary hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="text-foreground-tertiary hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="text-foreground-tertiary hover:text-primary transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}