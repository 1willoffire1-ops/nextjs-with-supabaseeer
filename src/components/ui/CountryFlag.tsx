import React from 'react';

interface CountryFlagProps {
  countryCode: string;
  countryName?: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4 text-xs',
  md: 'w-6 h-6 text-sm',
  lg: 'w-8 h-8 text-base',
};

const countryCodeToFlag: Record<string, string> = {
  DE: '🇩🇪',
  FR: '🇫🇷',
  NL: '🇳🇱',
  IT: '🇮🇹',
  ES: '🇪🇸',
  AT: '🇦🇹',
  EU: '🇪🇺',
  GB: '🇬🇧',
  BE: '🇧🇪',
  PL: '🇵🇱',
  SE: '🇸🇪',
  DK: '🇩🇰',
};

const countryNames: Record<string, string> = {
  DE: 'Germany',
  FR: 'France',
  NL: 'Netherlands',
  IT: 'Italy',
  ES: 'Spain',
  AT: 'Austria',
  EU: 'European Union',
  GB: 'United Kingdom',
  BE: 'Belgium',
  PL: 'Poland',
  SE: 'Sweden',
  DK: 'Denmark',
};

export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryCode,
  countryName,
  size = 'md',
  showName = false,
  className = '',
}) => {
  const flag = countryCodeToFlag[countryCode.toUpperCase()] || '🏳️';
  const name = countryName || countryNames[countryCode.toUpperCase()] || countryCode;

  if (showName) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <span className={`${sizeStyles[size]}`}>{flag}</span>
        <span className="text-slate-300">{name}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center ${sizeStyles[size]} ${className}`} title={name}>
      {flag}
    </span>
  );
};
