import { useState, useMemo } from 'react'
import { FileText, Cpu, Clock, User, CheckCircle, XCircle, TrendingDown, Filter, RefreshCw, Activity, X, ChevronDown } from 'lucide-react'
import { KPICard, StatusBadge, ConfidenceBar, SLATimer, Badge, Pagination } from '../ui'

// Helper to format vendor category display labels
const getCategoryLabel = (category) => {
  switch (category) {
    case 'Strategic': return 'Strategic Vendor'
    case 'Unknown': return 'Unknown Sender'
    case 'Non-Strategic': return 'Non-Strategic'
    default: return category
  }
}

// Filter options
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Human Review', label: 'Human Review' },
  { value: 'Auto-Approved', label: 'Auto-Approved' },
  { value: 'Processed', label: 'Processed' },
  { value: 'Auto-Rejected', label: 'Rejected' },
]

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'Strategic', label: 'Strategic Vendor' },
  { value: 'Non-Strategic', label: 'Non-Strategic' },
  { value: 'Unknown', label: 'Unknown Sender' },
]

const OWNER_OPTIONS = [
  { value: 'all', label: 'All Owners' },
  { value: 'AI Agent', label: 'AI Agent' },
  { value: 'Human', label: 'Human' },
]

const DashboardTab = ({
  kpis,
  agentActivity,
  filteredRequests,
  setSelectedRequest
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(15)
  const [showFilters, setShowFilters] = useState(false)

  // Filter state
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    owner: 'all',
  })

  // Apply filters to requests
  const displayRequests = useMemo(() => {
    return filteredRequests.filter(request => {
      // Status filter
      if (filters.status !== 'all' && request.status !== filters.status) {
        return false
      }
      // Category filter
      if (filters.category !== 'all' && request.vendorCategory !== filters.category) {
        return false
      }
      // Owner filter
      if (filters.owner !== 'all' && request.decisionOwner !== filters.owner) {
        return false
      }
      return true
    })
  }, [filteredRequests, filters])

  const totalPages = Math.ceil(displayRequests.length / itemsPerPage)
  const paginatedRequests = displayRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(v => v !== 'all').length

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const clearFilters = () => {
    setFilters({ status: 'all', category: 'all', owner: 'all' })
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (count) => {
    setItemsPerPage(count)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <KPICard title="Total Requests" value={kpis.total} icon={FileText} trend="up" trendValue="+12% vs last week" />
        <KPICard title="AI Processed" value={kpis.processed} icon={Cpu} variant="info" subtitle="Autonomous decisions" />
        <KPICard title="Pending" value={kpis.pending} icon={Clock} variant="warning" />
        <KPICard title="Human Review" value={kpis.humanReview} icon={User} variant="danger" subtitle="Requires attention" />
        <KPICard title="Auto-Approved" value={kpis.autoApproved} icon={CheckCircle} variant="success" />
        <KPICard title="Rejected" value={kpis.rejected} icon={XCircle} variant="danger" />
        <KPICard title="Margin Impact" value={`${kpis.marginImpact}%`} icon={TrendingDown} variant={parseFloat(kpis.marginImpact) < 0 ? 'danger' : 'success'} />
      </div>

      {/* Agent Activity Feed */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={16} className="text-cyan-600 dark:text-cyan-400" />
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Live Agent Activity</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {agentActivity.map((activity, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50 whitespace-nowrap">
              <div className="w-1.5 h-1.5 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-xs text-slate-600 dark:text-slate-400">{activity.message}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-slate-800 dark:text-slate-200">Price Change Requests</h3>
            <span className="text-xs text-slate-500">({displayRequests.length} items)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1.5 transition-colors ${
                showFilters || activeFilterCount > 0
                  ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Filter size={12} />
              Filters
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.5 bg-cyan-600 text-white text-[10px] rounded-full font-medium">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg flex items-center gap-1 transition-colors">
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Owner Filter */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Owner</label>
                <select
                  value={filters.owner}
                  onChange={(e) => handleFilterChange('owner', e.target.value)}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                >
                  {OWNER_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <X size={12} />
                  Clear All
                </button>
              )}
            </div>

            {/* Active Filter Tags */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500">Active:</span>
                {filters.status !== 'all' && (
                  <span className="px-2 py-1 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs rounded-lg flex items-center gap-1">
                    Status: {STATUS_OPTIONS.find(o => o.value === filters.status)?.label}
                    <button onClick={() => handleFilterChange('status', 'all')} className="hover:text-cyan-900 dark:hover:text-cyan-200">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {filters.category !== 'all' && (
                  <span className="px-2 py-1 bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 text-xs rounded-lg flex items-center gap-1">
                    Category: {CATEGORY_OPTIONS.find(o => o.value === filters.category)?.label}
                    <button onClick={() => handleFilterChange('category', 'all')} className="hover:text-violet-900 dark:hover:text-violet-200">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {filters.owner !== 'all' && (
                  <span className="px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs rounded-lg flex items-center gap-1">
                    Owner: {OWNER_OPTIONS.find(o => o.value === filters.owner)?.label}
                    <button onClick={() => handleFilterChange('owner', 'all')} className="hover:text-amber-900 dark:hover:text-amber-200">
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                {['Request ID', 'Vendor', 'Category', 'Source', 'Received', 'Price Δ', 'Margin', 'Confidence', 'Status', 'Owner', 'SLA'].map(header => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {paginatedRequests.map((request, idx) => (
                <tr
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors group"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-cyan-600 dark:text-cyan-400">{request.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-800 dark:text-slate-200">{request.vendor}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={request.vendorCategory === 'Strategic' ? 'purple' : request.vendorCategory === 'Unknown' ? 'danger' : 'neutral'}>
                      {getCategoryLabel(request.vendorCategory)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500">{request.source}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(request.receivedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-mono ${request.priceChange > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {request.priceChange > 0 ? '+' : ''}{request.priceChange}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-mono ${request.marginImpact < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {request.marginImpact > 0 ? '+' : ''}{request.marginImpact}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ConfidenceBar score={request.confidence} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      {request.decisionOwner === 'AI Agent' ? <Cpu size={12} className="text-cyan-600 dark:text-cyan-400" /> : <User size={12} className="text-violet-600 dark:text-violet-400" />}
                      {request.decisionOwner}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <SLATimer hours={request.slaHours} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={displayRequests.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  )
}

export default DashboardTab
