export const landingData = {
  // Hero Section
  hero: {
    headline: "Simplify VAT Compliance with AI",
    subheadline: "Automated VAT filing, real-time validation, and comprehensive reporting for modern businesses",
    cta: [
      {
        id: "cta-primary",
        label: "Start Free Trial",
        href: "/auth/signup",
        variant: "primary",
        icon: "ArrowRight"
      },
      {
        id: "cta-secondary",
        label: "Watch Demo",
        href: "#demo",
        variant: "glass",
        icon: "Play"
      }
    ],
    socialProof: {
      text: "Trusted by 5,000+ businesses across Europe",
      rating: {
        stars: 5,
        score: 4.9,
        reviews: 1200
      }
    }
  },

  // Features Section
  features: [
    {
      id: "feature-1",
      icon: "Sparkles",
      title: "AI-Powered Validation",
      description: "Intelligent VAT number validation with real-time verification across all EU countries",
      color: "primary"
    },
    {
      id: "feature-2",
      icon: "FileText",
      title: "Automated Filing",
      description: "Automatic VAT return generation and submission to tax authorities",
      color: "primary-light"
    },
    {
      id: "feature-3",
      icon: "BarChart3",
      title: "Real-Time Reporting",
      description: "Live dashboards with comprehensive analytics and compliance tracking",
      color: "primary"
    },
    {
      id: "feature-4",
      icon: "Globe",
      title: "Multi-Country Support",
      description: "Support for all EU member states with localized compliance rules",
      color: "primary-light"
    },
    {
      id: "feature-5",
      icon: "Shield",
      title: "Secure & Compliant",
      description: "Bank-level security with GDPR compliance and encrypted data storage",
      color: "primary"
    },
    {
      id: "feature-6",
      icon: "Zap",
      title: "Easy Integration",
      description: "Seamless integration with popular accounting software and ERPs",
      color: "primary-light"
    }
  ],

  // How It Works Section
  howItWorks: {
    title: "Get Started in 3 Simple Steps",
    steps: [
      {
        id: "step-1",
        number: "01",
        icon: "Upload",
        title: "Upload Your Data",
        description: "Import invoices and transactions from your accounting system"
      },
      {
        id: "step-2",
        number: "02",
        icon: "CheckCircle",
        title: "AI Validation",
        description: "Our AI automatically validates VAT numbers and categorizes transactions"
      },
      {
        id: "step-3",
        number: "03",
        icon: "Send",
        title: "File & Comply",
        description: "Generate reports and file directly to tax authorities"
      }
    ]
  },

  // Stats Section
  stats: [
    {
      id: "stat-1",
      value: "5,000+",
      label: "Active Users",
      description: "Businesses using VATANA"
    },
    {
      id: "stat-2",
      value: "€2.5B+",
      label: "VAT Processed",
      description: "Total VAT amount handled"
    },
    {
      id: "stat-3",
      value: "99.9%",
      label: "Accuracy Rate",
      description: "AI validation accuracy"
    },
    {
      id: "stat-4",
      value: "24/7",
      label: "Support",
      description: "Always available"
    }
  ],

  // Pricing Section
  pricing: {
    title: "Simple, Transparent Pricing",
    subtitle: "Choose the plan that's right for your business",
    billingToggle: true,
    annualDiscount: 20,
    plans: [
      {
        id: "starter",
        name: "Starter",
        description: "Perfect for small businesses",
        monthlyPrice: 49,
        annualPrice: 39,
        currency: "€",
        popular: false,
        features: [
          "1,000 transactions/month",
          "10 GB storage",
          "3 team members",
          "Email support",
          "Basic reporting",
          "5 countries"
        ],
        cta: {
          label: "Get Started",
          href: "/auth/signup?plan=starter"
        }
      },
      {
        id: "professional",
        name: "Professional",
        description: "For growing businesses",
        monthlyPrice: 149,
        annualPrice: 119,
        currency: "€",
        popular: true,
        badge: "MOST POPULAR",
        features: [
          "5,000 transactions/month",
          "50 GB storage",
          "15 team members",
          "Priority support",
          "Advanced reporting",
          "API access",
          "Unlimited countries",
          "Custom integrations"
        ],
        cta: {
          label: "Get Started",
          href: "/auth/signup?plan=professional"
        }
      },
      {
        id: "enterprise",
        name: "Enterprise",
        description: "For large organizations",
        monthlyPrice: null,
        annualPrice: null,
        currency: "€",
        priceLabel: "Custom",
        popular: false,
        features: [
          "Unlimited transactions",
          "Unlimited storage",
          "Unlimited team members",
          "24/7 dedicated support",
          "Custom reporting",
          "Advanced API",
          "SLA guarantee",
          "Dedicated account manager",
          "On-premise option"
        ],
        cta: {
          label: "Contact Sales",
          href: "/contact"
        }
      }
    ]
  },

  // CTA Section
  cta: {
    title: "Ready to Simplify Your VAT Compliance?",
    subtitle: "Join thousands of businesses automating their VAT processes",
    button: {
      label: "Start Free Trial",
      href: "/auth/signup",
      icon: "ArrowRight"
    },
    features: [
      "No credit card required",
      "14-day free trial",
      "Cancel anytime"
    ]
  }
};