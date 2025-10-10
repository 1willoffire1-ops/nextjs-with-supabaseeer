
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-primary to-primary-light text-white
      hover:from-primary-light hover:to-primary shadow-lg shadow-primary/25
      border border-primary/20
    `,
    secondary: `
      bg-gray-600 text-white hover:bg-gray-700
      border border-gray-500/30
    `,
    outline: `
      bg-transparent text-primary border border-primary/30
      hover:bg-primary/10
    `,
    ghost: `
      bg-transparent text-gray-400 hover:text-white hover:bg-white/5
      border border-transparent
    `,
    glass: `
      bg-white/5 text-white border border-white/10
      hover:bg-white/10 backdrop-blur-sm
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 text-white
      hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25
      border border-red-500/20
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer';

  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 
        font-medium rounded-lg transition-all duration-200
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;