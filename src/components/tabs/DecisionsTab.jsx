import { useState } from 'react'
import {
  Zap, Activity, User, Users, Check, Loader2,
  CheckCircle, XCircle, Bot, Clock,
  Package, RefreshCw, TrendingUp,
  TrendingDown, Sparkles, CircleDot, FileText,
  AlertTriangle, Building2, ChevronRight, ArrowLeft
} from 'lucide-react'
import { StatusBadge, Badge, Pagination } from '../ui'

// Helper to format vendor category display labels
const getCategoryLabel = (category) => {
  switch (category) {
    case 'Strategic': return 'Strategic Vendor'
    case 'Unknown': return 'Unknown Sender'
    case 'Non-Strategic': return 'Non-Strategic'
    default: return category
  }
}

const DecisionsTab = ({ processedRequests, allRequests = [] }) => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)
  const itemsPerPage = 15

  // Only include completed requests (not pending or human review) - this is history only
  const completedRequests = allRequests.filter(r =>
    r.status === 'Auto-Approved' ||
    r.status === 'Processed' ||
    r.status === 'Auto-Rejected'
  )

  // Calculate summary statistics - only for completed items
  const totalDecisions = completedRequests.length
  const aiDecisions = completedRequests.filter(r => r.decisionOwner === 'AI Agent').length
  const humanDecisions = completedRequests.filter(r => r.decisionOwner === 'Human').length
  const autoApproved = completedRequests.filter(r => r.status === 'Auto-Approved' || r.status === 'Processed').length
  const autoRejected = completedRequests.filter(r => r.status === 'Auto-Rejected').length

  // Generate combined decision/action log - only for completed requests
  const generateDecisionLog = () => {
    const log = []

    completedRequests.forEach(request => {
      // AI decision: decided by AI Agent
      const isAiDecision = request.decisionOwner === 'AI Agent'
      // Human decision: decided by Human
      const isHumanDecision = request.decisionOwner === 'Human'

      log.push({
        id: `${request.id}-decision`,
        requestId: request.id,
        type: 'decision',
        vendor: request.vendor,
        vendorCategory: request.vendorCategory,
        vendorTrustScore: request.vendorTrustScore,
        action: request.status === 'Auto-Approved' || request.status === 'Processed'
          ? 'Synced to Epicor'
          : 'Rejected',
        decisionOwner: request.decisionOwner,
        isAi: isAiDecision,
        isHuman: isHumanDecision,
        confidence: request.confidence,
        priceChange: request.priceChange,
        marginImpact: request.marginImpact,
        triggers: request.triggers,
        rationale: request.rationale,
        rejectionReason: request.rejectionReason,
        timestamp: new Date(request.receivedDate),
        status: request.status,
        assignedReviewer: request.assignedReviewer,
        bomAnalysis: request.bomAnalysis,
        actions: request.actions
      })

      // Add action entries - only completed actions
      request.actions.filter(a => a.status === 'Completed').forEach((action, idx) => {
        log.push({
          id: `${request.id}-action-${idx}`,
          requestId: request.id,
          type: 'action',
          vendor: request.vendor,
          vendorCategory: request.vendorCategory,
          vendorTrustScore: request.vendorTrustScore,
          actionName: action.name,
          executor: action.executor,
          isAi: action.executor === 'AI Agent',
          isHuman: action.executor === 'Human',
          actionStatus: action.status,
          priceChange: request.priceChange,
          marginImpact: request.marginImpact,
          confidence: request.confidence,
          triggers: request.triggers,
          rationale: request.rationale,
          timestamp: new Date(action.timestamp),
          status: request.status,
          bomAnalysis: request.bomAnalysis,
          actions: request.actions
        })
      })
    })

    return log.sort((a, b) => b.timestamp - a.timestamp)
  }

  const fullLog = generateDecisionLog()

  // Filter log based on active filter
  const filteredLog = fullLog.filter(entry => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'ai') return entry.isAi
    if (activeFilter === 'human') return entry.isHuman
    if (activeFilter === 'rejected') return entry.action === 'Rejected'
    return true
  })

  // Paginate
  const totalPages = Math.ceil(filteredLog.length / itemsPerPage)
  const paginatedLog = filteredLog.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  // Get display status - only Synced to Epicor or Rejected (no pending in history)
  const getActionDisplayStatus = (entry) => {
    if (entry.actionStatus === 'Completed') {
      return { label: 'Synced to Epicor', variant: 'success' }
    }
    return { label: 'Rejected', variant: 'danger' }
  }

  // Auto-select first item if none selected
  const currentSelection = selectedEntry || paginatedLog[0]

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Summary Cards - Compact */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 sm:p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-primary-500 dark:text-secondary-400" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Total</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{totalDecisions}</span>
        </div>
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-500/10 dark:to-primary-500/5 border border-primary-200 dark:border-primary-500/20 rounded-xl p-2.5 sm:p-3">
          <div className="flex items-center gap-2 mb-1">
            <Bot size={14} className="text-primary-500 dark:text-secondary-400" />
            <span className="text-[10px] text-primary-700 dark:text-secondary-300 uppercase tracking-wider">AI Auto</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-primary-700 dark:text-secondary-300">{aiDecisions}</span>
        </div>
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-500/10 dark:to-purple-500/10 border border-violet-200 dark:border-violet-500/20 rounded-xl p-2.5 sm:p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users size={14} className="text-violet-600 dark:text-violet-400" />
            <span className="text-[10px] text-violet-700 dark:text-violet-300 uppercase tracking-wider">Human</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-violet-700 dark:text-violet-300">{humanDecisions}</span>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-2.5 sm:p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Synced</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-300">{autoApproved}</span>
        </div>
        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-2.5 sm:p-3 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <XCircle size={14} className="text-rose-600 dark:text-rose-400" />
            <span className="text-[10px] text-rose-700 dark:text-rose-300 uppercase tracking-wider">Rejected</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-rose-700 dark:text-rose-300">{autoRejected}</span>
        </div>
      </div>

      {/* Filter Tabs - Compact */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { id: 'all', label: 'All Activity', shortLabel: 'All', icon: Activity, count: fullLog.length },
          { id: 'ai', label: 'AI Decisions', shortLabel: 'AI', icon: Bot, count: fullLog.filter(e => e.isAi).length },
          { id: 'human', label: 'Human Decisions', shortLabel: 'Human', icon: User, count: fullLog.filter(e => e.isHuman).length },
          { id: 'rejected', label: 'Rejected', shortLabel: 'Rejected', icon: XCircle, count: fullLog.filter(e => e.action === 'Rejected').length },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterChange(filter.id)}
            className={`px-2 sm:px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 sm:gap-1.5 transition-all flex-shrink-0 ${
              activeFilter === filter.id
                ? 'bg-primary-100 dark:bg-primary-500/20 border-primary-300 dark:border-secondary-500/30 text-primary-700 dark:text-secondary-400'
                : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <filter.icon size={12} />
            <span className="hidden sm:inline">{filter.label}</span>
            <span className="sm:hidden">{filter.shortLabel}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
              activeFilter === filter.id
                ? 'bg-primary-200 dark:bg-secondary-500/30'
                : 'bg-slate-100 dark:bg-slate-800'
            }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content - 30/70 Split on Desktop, Full width list on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 h-auto lg:h-[calc(100vh-320px)] lg:min-h-[500px]">
        {/* Left Panel - Activity List (30% on desktop, full on mobile) */}
        <div className={`lg:col-span-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col ${mobileDetailOpen ? 'hidden lg:flex' : 'flex'}`}>
          {/* List Header */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary-500 dark:text-secondary-400" />
                <span className="font-medium text-sm text-slate-800 dark:text-slate-200">Activity Stream</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 rounded-full">
                <CircleDot size={10} className="text-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Live</span>
              </div>
            </div>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto max-h-[400px] lg:max-h-none">
            {paginatedLog.map((entry, idx) => {
              const isSelected = currentSelection?.id === entry.id
              const actionDisplay = entry.type === 'action' ? getActionDisplayStatus(entry) : null

              return (
                <div
                  key={entry.id}
                  onClick={() => {
                    setSelectedEntry(entry)
                    setMobileDetailOpen(true)
                  }}
                  className={`px-3 py-3 border-b border-slate-100 dark:border-slate-800/50 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-primary-50 dark:bg-secondary-500/10 border-l-2 border-l-secondary-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/30 border-l-2 border-l-transparent'
                  }`}
                >
                  {entry.type === 'decision' ? (
                    // Decision Item
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            entry.isAi
                              ? 'bg-gradient-to-br from-primary-400 to-primary-600'
                              : 'bg-gradient-to-br from-violet-400 to-purple-500'
                          }`}>
                            {entry.isAi ? (
                              <Bot size={16} className="text-white" />
                            ) : (
                              <User size={16} className="text-white" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-mono text-sm text-primary-500 dark:text-secondary-400 block">{entry.requestId}</span>
                            <span className="text-sm text-slate-700 dark:text-slate-300 truncate block">{entry.vendor}</span>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded flex-shrink-0 ${
                          entry.action === 'Synced to Epicor' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                          entry.action === 'Rejected' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400' :
                          'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                        }`}>
                          {entry.action}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono ${
                          entry.priceChange > 0 ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          <span className="text-slate-400 font-sans text-[10px] hidden sm:inline">Price</span>
                          {entry.priceChange > 0 ? '+' : ''}{entry.priceChange}%
                        </div>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono ${
                          entry.marginImpact < 0 ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          <span className="text-slate-400 font-sans text-[10px] hidden sm:inline">Margin</span>
                          {entry.marginImpact > 0 ? '+' : ''}{entry.marginImpact}%
                        </div>
                        <span className="text-xs text-slate-400 ml-auto hidden sm:inline">
                          {entry.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <ChevronRight size={16} className="text-slate-400 lg:hidden ml-auto sm:ml-0" />
                      </div>
                    </div>
                  ) : (
                    // Action Item
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                        entry.actionStatus === 'Completed'
                          ? 'bg-emerald-100 dark:bg-emerald-500/20'
                          : 'bg-amber-100 dark:bg-amber-500/20'
                      }`}>
                        {entry.actionStatus === 'Completed' ? (
                          <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Loader2 size={14} className="text-amber-600 dark:text-amber-400 animate-spin" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-slate-700 dark:text-slate-300 block truncate">{entry.actionName}</span>
                        <span className="text-xs text-slate-400 font-mono">{entry.requestId}</span>
                      </div>
                      <Badge variant={actionDisplay.variant} className="text-xs flex-shrink-0 hidden sm:inline-flex">{actionDisplay.label}</Badge>
                      <ChevronRight size={16} className="text-slate-400 lg:hidden flex-shrink-0" />
                    </div>
                  )}
                </div>
              )
            })}

            {filteredLog.length === 0 && (
              <div className="p-8 text-center">
                <Activity size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No activity found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredLog.length)} of {filteredLog.length}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-40 transition-colors"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Detail View (70% on desktop, full on mobile when open) */}
        <div className={`lg:col-span-7 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col ${mobileDetailOpen ? 'flex' : 'hidden lg:flex'}`}>
          {currentSelection ? (
            <>
              {/* Detail Header */}
              <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900/50">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setMobileDetailOpen(false)}
                  className="lg:hidden flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-3 text-sm"
                >
                  <ArrowLeft size={16} />
                  Back to list
                </button>
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                      currentSelection.isAi
                        ? 'bg-gradient-to-br from-primary-400 to-primary-600 shadow-primary-500/20'
                        : 'bg-gradient-to-br from-violet-400 to-purple-500 shadow-violet-500/20'
                    }`}>
                      {currentSelection.isAi ? (
                        <Bot size={20} className="text-white sm:w-6 sm:h-6" />
                      ) : (
                        <User size={20} className="text-white sm:w-6 sm:h-6" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-base sm:text-lg font-semibold text-primary-500 dark:text-secondary-400">{currentSelection.requestId}</span>
                        {currentSelection.type === 'decision' && currentSelection.action === 'Synced to Epicor' && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-full">
                            <RefreshCw size={10} className="text-emerald-600 dark:text-emerald-400" />
                            <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300 hidden sm:inline">Synced to Epicor</span>
                            <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300 sm:hidden">Synced</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                        <Building2 size={14} className="text-slate-400 hidden sm:block" />
                        <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 truncate max-w-[150px] sm:max-w-none">{currentSelection.vendor}</span>
                        <Badge variant={currentSelection.vendorCategory === 'Strategic' ? 'purple' : currentSelection.vendorCategory === 'Unknown' ? 'danger' : 'neutral'}>
                          {getCategoryLabel(currentSelection.vendorCategory)}
                        </Badge>
                        {currentSelection.vendorTrustScore && (
                          <span className="text-xs text-slate-500 hidden md:inline">Trust: {currentSelection.vendorTrustScore}/100</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <StatusBadge status={currentSelection.status} />
                    <span className="text-[10px] sm:text-xs text-slate-500">
                      {currentSelection.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 sm:space-y-5">
                {/* Action Context (if action entry) */}
                {currentSelection.type === 'action' && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:p-4 bg-primary-50 dark:bg-secondary-500/10 border border-primary-200 dark:border-secondary-500/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Activity size={18} className="text-primary-500 dark:text-secondary-400 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-primary-700 dark:text-secondary-300">Action:</span>
                        <span className="ml-2 font-semibold text-primary-800 dark:text-secondary-200">{currentSelection.actionName}</span>
                      </div>
                    </div>
                    <Badge variant={getActionDisplayStatus(currentSelection).variant}>
                      {getActionDisplayStatus(currentSelection).label}
                    </Badge>
                  </div>
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                  <div className={`rounded-xl p-3 sm:p-4 ${currentSelection.priceChange > 0 ? 'bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20'}`}>
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      {currentSelection.priceChange > 0 ? (
                        <TrendingUp size={14} className="text-rose-500 sm:w-4 sm:h-4" />
                      ) : (
                        <TrendingDown size={14} className="text-emerald-500 sm:w-4 sm:h-4" />
                      )}
                      <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">Price</span>
                    </div>
                    <span className={`text-xl sm:text-2xl font-mono font-bold ${currentSelection.priceChange > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {currentSelection.priceChange > 0 ? '+' : ''}{currentSelection.priceChange}%
                    </span>
                  </div>
                  <div className={`rounded-xl p-3 sm:p-4 ${currentSelection.marginImpact < 0 ? 'bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20'}`}>
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      {currentSelection.marginImpact < 0 ? (
                        <TrendingDown size={14} className="text-rose-500 sm:w-4 sm:h-4" />
                      ) : (
                        <TrendingUp size={14} className="text-emerald-500 sm:w-4 sm:h-4" />
                      )}
                      <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">Margin</span>
                    </div>
                    <span className={`text-xl sm:text-2xl font-mono font-bold ${currentSelection.marginImpact < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {currentSelection.marginImpact > 0 ? '+' : ''}{currentSelection.marginImpact}%
                    </span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <Sparkles size={14} className="text-violet-500 sm:w-4 sm:h-4" />
                      <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">Confidence</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{currentSelection.confidence}%</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      {currentSelection.isAi ? <Bot size={14} className="text-primary-500 dark:text-secondary-400 sm:w-4 sm:h-4" /> : <User size={14} className="text-violet-500 sm:w-4 sm:h-4" />}
                      <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">Decision</span>
                    </div>
                    <span className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white truncate block">
                      {currentSelection.isAi ? 'AI Agent' : currentSelection.assignedReviewer || 'Human'}
                    </span>
                  </div>
                </div>

                {/* Decision Status */}
                {currentSelection.type === 'decision' && (
                  <div className={`flex items-center justify-between p-4 rounded-xl ${
                    currentSelection.action === 'Synced to Epicor' ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20' :
                    currentSelection.action === 'Rejected' ? 'bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20' :
                    'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      {currentSelection.action === 'Synced to Epicor' && <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" />}
                      {currentSelection.action === 'Rejected' && <XCircle size={20} className="text-rose-600 dark:text-rose-400" />}
                      {currentSelection.action === 'Pending' && <Clock size={20} className="text-amber-600 dark:text-amber-400" />}
                      <span className={`text-lg font-semibold ${
                        currentSelection.action === 'Synced to Epicor' ? 'text-emerald-700 dark:text-emerald-300' :
                        currentSelection.action === 'Rejected' ? 'text-rose-700 dark:text-rose-300' :
                        'text-amber-700 dark:text-amber-300'
                      }`}>
                        {currentSelection.action}
                      </span>
                    </div>
                  </div>
                )}

                {/* Triggers */}
                {currentSelection.triggers && currentSelection.triggers.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider block mb-2">Triggered Rules</span>
                    <div className="flex flex-wrap gap-2">
                      {currentSelection.triggers.map((trigger, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-sm rounded-lg flex items-center gap-1.5">
                          <AlertTriangle size={12} />
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Rationale */}
                {currentSelection.rationale && (
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider block mb-2">AI Analysis & Rationale</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                      {currentSelection.rationale}
                    </p>
                  </div>
                )}

                {/* Rejection Reason */}
                {currentSelection.rejectionReason && (
                  <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle size={16} className="text-rose-600 dark:text-rose-400" />
                      <span className="text-xs text-rose-600 dark:text-rose-400 uppercase tracking-wider font-medium">Rejection Reason</span>
                    </div>
                    <p className="text-sm text-rose-700 dark:text-rose-300">
                      {currentSelection.rejectionReason}
                    </p>
                  </div>
                )}

                {/* BOM Analysis */}
                {currentSelection.bomAnalysis && (
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 flex-wrap">
                      <Package size={16} className="text-primary-500 dark:text-secondary-400" />
                      <h4 className="font-medium text-sm sm:text-base text-slate-800 dark:text-slate-200">BOM Impact Analysis</h4>
                      <span className="ml-auto text-xs text-slate-500">{currentSelection.bomAnalysis.summary.totalProductsAffected} products</span>
                    </div>
                    <div className="p-3 sm:p-4 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                      <div className="bg-slate-100 dark:bg-slate-800/30 rounded-lg p-2.5 sm:p-3">
                        <span className="text-[10px] sm:text-xs text-slate-500 block">Products</span>
                        <span className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">{currentSelection.bomAnalysis.summary.totalProductsAffected}</span>
                      </div>
                      <div className={`rounded-lg p-2.5 sm:p-3 ${currentSelection.priceChange > 0 ? 'bg-rose-50 dark:bg-rose-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
                        <span className="text-[10px] sm:text-xs text-slate-500 block">Annual Impact</span>
                        <span className={`text-base sm:text-xl font-semibold font-mono ${currentSelection.priceChange > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {currentSelection.priceChange > 0 ? '+' : '-'}${Math.abs(parseFloat(currentSelection.bomAnalysis.summary.totalAnnualImpact)).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800/30 rounded-lg p-2.5 sm:p-3">
                        <span className="text-[10px] sm:text-xs text-slate-500 block">Avg/Product</span>
                        <span className="text-base sm:text-xl font-semibold font-mono text-slate-900 dark:text-white">
                          ${parseFloat(currentSelection.bomAnalysis.summary.avgImpactPerProduct).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-500/10 rounded-lg p-2.5 sm:p-3">
                        <span className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 block">Highest Impact</span>
                        <span className="text-sm sm:text-lg font-mono text-amber-700 dark:text-amber-300 truncate block">{currentSelection.bomAnalysis.summary.highestImpactProduct}</span>
                      </div>
                    </div>

                    {/* Affected Products */}
                    <div className="border-t border-slate-200 dark:border-slate-700">
                      <div className="overflow-x-auto max-h-48">
                        <table className="w-full text-sm">
                          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Product ID</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Usage</th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Annual Vol</th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Impact</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {currentSelection.bomAnalysis.affectedProducts.map((product, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                                <td className="px-4 py-2">
                                  <span className="font-mono text-primary-500 dark:text-secondary-400">{product.productId}</span>
                                </td>
                                <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{product.category}</td>
                                <td className="px-4 py-2 text-right font-mono text-slate-700 dark:text-slate-300">{product.usageQty}</td>
                                <td className="px-4 py-2 text-right font-mono text-slate-700 dark:text-slate-300">{product.annualVolume.toLocaleString()}</td>
                                <td className={`px-4 py-2 text-right font-mono font-medium ${currentSelection.priceChange > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                  {currentSelection.priceChange > 0 ? '+' : '-'}${Math.abs(product.annualImpact).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions Executed */}
                {currentSelection.actions && currentSelection.actions.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider block mb-2">Actions Executed</span>
                    <div className="space-y-2">
                      {currentSelection.actions.map((action, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            currentSelection.type === 'action' && currentSelection.actionName === action.name
                              ? 'bg-primary-100 dark:bg-secondary-500/20 border border-primary-300 dark:border-secondary-500/30'
                              : 'bg-slate-100 dark:bg-slate-800/30'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {action.status === 'Completed' ? (
                              <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Loader2 size={14} className="text-amber-600 dark:text-amber-400 animate-spin" />
                            )}
                            <span className="text-sm text-slate-700 dark:text-slate-300">{action.name}</span>
                            {currentSelection.type === 'action' && currentSelection.actionName === action.name && (
                              <span className="text-xs text-primary-500 dark:text-secondary-400">(Current)</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">{action.executor}</span>
                            <Badge variant={action.status === 'Completed' ? 'success' : 'warning'}>
                              {action.status === 'Completed' ? 'Synced to Epicor' : 'Pending'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Empty State
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Select an item to view details</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Click on any activity from the list</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DecisionsTab
