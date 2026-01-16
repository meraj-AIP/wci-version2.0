const Badge = ({ variant, children, className = '' }) => {
  const variants = {
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    danger: 'bg-secondary-500/20 text-secondary-400 border-secondary-500/30',
    info: 'bg-primary-500/20 text-primary-400 dark:text-primary-300 border-primary-500/30',
    neutral: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    purple: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    primary: 'bg-primary-500/20 text-primary-500 dark:text-primary-300 border-primary-500/30',
    secondary: 'bg-secondary-500/20 text-secondary-500 dark:text-secondary-400 border-secondary-500/30',
  }

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
