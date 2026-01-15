import { useState } from 'react'
import {
  Settings, Sliders, Bell, Shield, Database, RefreshCw,
  CheckCircle, AlertTriangle, XCircle, Zap, Clock, Server,
  Wifi, WifiOff, Save, RotateCcw, ChevronRight, Info,
  ToggleLeft, ToggleRight, Activity
} from 'lucide-react'

const SettingsTab = () => {
  // Threshold settings
  const [thresholds, setThresholds] = useState({
    marginErosion: 5,
    priceIncrease: 15,
    confidenceLevel: 'medium'
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    slackIntegration: false,
    criticalOnly: false
  })

  // System status (mock data)
  const systemStatus = {
    aiAgent: { status: 'online', lastPing: '2 seconds ago', uptime: '99.97%' },
    epicorSync: { status: 'connected', lastSync: '5 minutes ago', pendingItems: 3 },
    database: { status: 'healthy', connections: 24, latency: '12ms' },
    apiGateway: { status: 'online', requestsPerMin: 156, errorRate: '0.02%' }
  }

  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleThresholdChange = (key, value) => {
    setThresholds(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    setHasChanges(true)
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setHasChanges(false)
    }, 1000)
  }

  const handleReset = () => {
    setThresholds({ marginErosion: 5, priceIncrease: 15, confidenceLevel: 'medium' })
    setNotifications({ emailAlerts: true, slackIntegration: false, criticalOnly: false })
    setHasChanges(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
      case 'connected':
      case 'healthy':
        return 'text-emerald-600 dark:text-emerald-400'
      case 'degraded':
        return 'text-amber-600 dark:text-amber-400'
      case 'offline':
      case 'disconnected':
        return 'text-rose-600 dark:text-rose-400'
      default:
        return 'text-slate-600 dark:text-slate-400'
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case 'online':
      case 'connected':
      case 'healthy':
        return 'bg-emerald-100 dark:bg-emerald-500/20'
      case 'degraded':
        return 'bg-amber-100 dark:bg-amber-500/20'
      case 'offline':
      case 'disconnected':
        return 'bg-rose-100 dark:bg-rose-500/20'
      default:
        return 'bg-slate-100 dark:bg-slate-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
      case 'connected':
      case 'healthy':
        return <CheckCircle size={16} />
      case 'degraded':
        return <AlertTriangle size={16} />
      case 'offline':
      case 'disconnected':
        return <XCircle size={16} />
      default:
        return <Info size={16} />
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl shadow-lg">
            <Settings size={20} className="text-white sm:w-[22px] sm:h-[22px]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">Settings</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Configure system preferences</p>
          </div>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1.5 text-xs sm:text-sm bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="space-y-4 sm:space-y-6">
          {/* Threshold Settings */}
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-cyan-600 dark:text-cyan-400" />
                <h3 className="font-medium text-sm sm:text-base text-slate-800 dark:text-slate-200">Threshold Limits</h3>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {/* Margin Erosion Threshold */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-slate-700 dark:text-slate-300">Margin Erosion Threshold</label>
                  <span className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400">{thresholds.marginErosion}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={thresholds.marginErosion}
                  onChange={(e) => handleThresholdChange('marginErosion', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1%</span>
                  <span>15%</span>
                </div>
              </div>

              {/* Price Increase Threshold */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-slate-700 dark:text-slate-300">Price Increase Threshold</label>
                  <span className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400">{thresholds.priceIncrease}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={thresholds.priceIncrease}
                  onChange={(e) => handleThresholdChange('priceIncrease', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>5%</span>
                  <span>30%</span>
                </div>
              </div>

              {/* Confidence Level */}
              <div>
                <label className="text-sm text-slate-700 dark:text-slate-300 block mb-2">AI Confidence Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['low', 'medium', 'high'].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleThresholdChange('confidenceLevel', level)}
                      className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-all ${
                        thresholds.confidenceLevel === level
                          ? level === 'low'
                            ? 'bg-amber-100 dark:bg-amber-500/20 border-2 border-amber-400 text-amber-700 dark:text-amber-400'
                            : level === 'medium'
                            ? 'bg-cyan-100 dark:bg-cyan-500/20 border-2 border-cyan-400 text-cyan-700 dark:text-cyan-400'
                            : 'bg-emerald-100 dark:bg-emerald-500/20 border-2 border-emerald-400 text-emerald-700 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 border-2 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-2">
                  {thresholds.confidenceLevel === 'low' && 'Requires 60%+ confidence for auto-approval'}
                  {thresholds.confidenceLevel === 'medium' && 'Requires 75%+ confidence for auto-approval'}
                  {thresholds.confidenceLevel === 'high' && 'Requires 90%+ confidence for auto-approval'}
                </p>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-violet-600 dark:text-violet-400" />
                <h3 className="font-medium text-sm sm:text-base text-slate-800 dark:text-slate-200">Notifications</h3>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {[
                { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive email notifications for HITL items' },
                { key: 'slackIntegration', label: 'Slack Integration', desc: 'Send alerts to Slack channel' },
                { key: 'criticalOnly', label: 'Critical Only', desc: 'Only notify for high-priority items' },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => handleNotificationChange(item.key)}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">{item.label}</span>
                    <span className="text-[10px] sm:text-xs text-slate-500">{item.desc}</span>
                  </div>
                  {notifications[item.key] ? (
                    <ToggleRight size={28} className="text-cyan-600 dark:text-cyan-400" />
                  ) : (
                    <ToggleLeft size={28} className="text-slate-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - System Status */}
        <div className="space-y-4 sm:space-y-6">
          {/* System Status */}
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-medium text-sm sm:text-base text-slate-800 dark:text-slate-200">System Status</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">All Systems Operational</span>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {/* AI Agent Status */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${getStatusBg(systemStatus.aiAgent.status)}`}>
                      <Zap size={14} className={getStatusColor(systemStatus.aiAgent.status)} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Agent</span>
                  </div>
                  <div className={`flex items-center gap-1 ${getStatusColor(systemStatus.aiAgent.status)}`}>
                    {getStatusIcon(systemStatus.aiAgent.status)}
                    <span className="text-xs capitalize">{systemStatus.aiAgent.status}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white dark:bg-slate-800/50 rounded-lg p-2">
                    <span className="text-slate-500 block">Last Ping</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{systemStatus.aiAgent.lastPing}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800/50 rounded-lg p-2">
                    <span className="text-slate-500 block">Uptime</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{systemStatus.aiAgent.uptime}</span>
                  </div>
                </div>
              </div>

              {/* Epicor Sync Status */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${getStatusBg(systemStatus.epicorSync.status)}`}>
                      <RefreshCw size={14} className={getStatusColor(systemStatus.epicorSync.status)} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Epicor Sync</span>
                  </div>
                  <div className={`flex items-center gap-1 ${getStatusColor(systemStatus.epicorSync.status)}`}>
                    {getStatusIcon(systemStatus.epicorSync.status)}
                    <span className="text-xs capitalize">{systemStatus.epicorSync.status}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white dark:bg-slate-800/50 rounded-lg p-2">
                    <span className="text-slate-500 block">Last Sync</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{systemStatus.epicorSync.lastSync}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800/50 rounded-lg p-2">
                    <span className="text-slate-500 block">Pending Items</span>
                    <span className="text-amber-600 dark:text-amber-400 font-medium">{systemStatus.epicorSync.pendingItems}</span>
                  </div>
                </div>
              </div>

              {/* Database Status */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${getStatusBg(systemStatus.database.status)}`}>
                      <Database size={14} className={getStatusColor(systemStatus.database.status)} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Database</span>
                  </div>
                  <div className={`flex items-center gap-1 ${getStatusColor(systemStatus.database.status)}`}>
                    {getStatusIcon(systemStatus.database.status)}
                    <span className="text-xs capitalize">{systemStatus.database.status}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white dark:bg-slate-800/50 rounded-lg p-2">
                    <span className="text-slate-500 block">Connections</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{systemStatus.database.connections}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800/50 rounded-lg p-2">
                    <span className="text-slate-500 block">Latency</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{systemStatus.database.latency}</span>
                  </div>
                </div>
              </div>

              {/* API Gateway Status */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${getStatusBg(systemStatus.apiGateway.status)}`}>
                      <Server size={14} className={getStatusColor(systemStatus.apiGateway.status)} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">API Gateway</span>
                  </div>
                  <div className={`flex items-center gap-1 ${getStatusColor(systemStatus.apiGateway.status)}`}>
                    {getStatusIcon(systemStatus.apiGateway.status)}
                    <span className="text-xs capitalize">{systemStatus.apiGateway.status}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white dark:bg-slate-800/50 rounded-lg p-2">
                    <span className="text-slate-500 block">Requests/min</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{systemStatus.apiGateway.requestsPerMin}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800/50 rounded-lg p-2">
                    <span className="text-slate-500 block">Error Rate</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{systemStatus.apiGateway.errorRate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-200 dark:border-cyan-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info size={16} className="text-cyan-600 dark:text-cyan-400" />
              <h3 className="font-medium text-sm text-cyan-800 dark:text-cyan-300">Quick Info</h3>
            </div>
            <div className="space-y-2 text-xs text-cyan-700 dark:text-cyan-400">
              <p><strong>Version:</strong> WCI Co-Pilot v2.0.1</p>
              <p><strong>Environment:</strong> Production</p>
              <p><strong>Last Updated:</strong> Jan 15, 2026</p>
              <p><strong>Support:</strong> support@wci-copilot.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsTab
