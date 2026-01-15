import { Cpu, BarChart3, Zap, Shield, Search, Sun, Moon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const Navbar = ({
  searchQuery,
  setSearchQuery,
  hitlCount,
  onTabChange
}) => {
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()

  // Derive activeTab from URL path
  const getActiveTab = () => {
    const path = location.pathname
    if (path === '/decisions') return 'decisions'
    if (path === '/hitl') return 'hitl'
    return 'dashboard'
  }

  const activeTab = getActiveTab()

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/' },
    { id: 'decisions', label: 'Decisions & Actions', icon: Zap, path: '/decisions' },
    { id: 'hitl', label: 'Human-in-the-Loop', icon: Shield, badge: hitlCount, path: '/hitl' },
  ]

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center pulse-glow">
                <Cpu size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">WCI Co-Pilot</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Agentic Intelligence</p>
              </div>
            </div>

            <div className="flex gap-1">
              {tabs.map(tab => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  onClick={() => onTabChange && onTabChange()}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  {tab.badge > 0 && (
                    <span className="px-1.5 py-0.5 text-xs bg-rose-500/20 text-rose-500 dark:text-rose-400 rounded-full font-mono">
                      {tab.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Agent Active</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
