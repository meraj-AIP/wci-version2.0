import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue, variant = 'default' }) => {
  const variants = {
    default: 'from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-900/50 border-slate-200 dark:border-slate-700/50',
    success: 'from-emerald-50 to-slate-50 dark:from-emerald-900/20 dark:to-slate-900/50 border-emerald-200 dark:border-emerald-500/20',
    warning: 'from-amber-50 to-slate-50 dark:from-amber-900/20 dark:to-slate-900/50 border-amber-200 dark:border-amber-500/20',
    danger: 'from-rose-50 to-slate-50 dark:from-rose-900/20 dark:to-slate-900/50 border-rose-200 dark:border-rose-500/20',
    info: 'from-cyan-50 to-slate-50 dark:from-cyan-900/20 dark:to-slate-900/50 border-cyan-200 dark:border-cyan-500/20',
  }

  return (
    <div className={`bg-gradient-to-br ${variants[variant]} border rounded-xl p-4 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white mb-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {trendValue}
            </div>
          )}
        </div>
        <div className="p-2 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg">
          <Icon size={20} className="text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
    </div>
  )
}

export default KPICard
