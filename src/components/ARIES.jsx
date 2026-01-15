import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { generateRequests, initialAgentActivities } from '../data/mockData'
import { Navbar } from './layout'
import { DashboardTab, DecisionsTab, HITLTab, SettingsTab } from './tabs'
import { RequestDetailModal } from './modals'

const ARIES = () => {
  const location = useLocation()

  // Derive activeTab from URL path
  const getActiveTab = () => {
    const path = location.pathname
    if (path === '/decisions') return 'decisions'
    if (path === '/hitl') return 'hitl'
    if (path === '/settings') return 'settings'
    return 'dashboard'
  }

  const activeTab = getActiveTab()
  const [requests, setRequests] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [agentActivity, setAgentActivity] = useState([])

  useEffect(() => {
    setRequests(generateRequests())
    setAgentActivity(initialAgentActivities)
  }, [])

  const filteredRequests = requests.filter(req =>
    req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const hitlRequests = requests.filter(req => req.status === 'Human Review')
  const processedRequests = requests.filter(req => ['Processed', 'Auto-Approved', 'Auto-Rejected'].includes(req.status))

  const kpis = {
    total: requests.length,
    processed: processedRequests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    humanReview: hitlRequests.length,
    autoApproved: requests.filter(r => r.status === 'Auto-Approved').length,
    rejected: requests.filter(r => r.status === 'Auto-Rejected').length,
    avgProcessingTime: '2.4h',
    marginImpact: requests.length > 0
      ? (requests.reduce((sum, r) => sum + r.marginImpact, 0) / requests.length).toFixed(2)
      : '0.00',
  }

  const handleHumanDecision = (requestId, decision, comment = '', rejectionReason = '') => {
    setIsProcessing(true)
    setTimeout(() => {
      setRequests(prev => prev.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: decision === 'approve' ? 'Processed' : decision === 'reject' ? 'Auto-Rejected' : 'Pending',
            decisionOwner: 'Human',
            humanComment: comment,
            rejectionReason: decision === 'reject' ? rejectionReason : '',
            actions: [
              ...req.actions,
              { name: `Human ${decision.charAt(0).toUpperCase() + decision.slice(1)}`, executor: 'Human', status: 'Completed', timestamp: new Date().toISOString() }
            ]
          }
        }
        return req
      }))
      setSelectedRequest(null)
      setIsProcessing(false)
    }, 1500)
  }

  // Clear selected request when switching tabs to prevent modal from showing
  const handleTabChange = () => {
    setSelectedRequest(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hitlCount={hitlRequests.length}
        onTabChange={handleTabChange}
      />

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        <Routes>
          <Route
            path="/"
            element={
              <DashboardTab
                kpis={kpis}
                agentActivity={agentActivity}
                filteredRequests={filteredRequests}
                setSelectedRequest={setSelectedRequest}
              />
            }
          />
          <Route
            path="/decisions"
            element={<DecisionsTab processedRequests={processedRequests} allRequests={requests} />}
          />
          <Route
            path="/hitl"
            element={
              <HITLTab
                hitlRequests={hitlRequests}
                selectedRequest={selectedRequest}
                setSelectedRequest={setSelectedRequest}
                isProcessing={isProcessing}
                handleHumanDecision={handleHumanDecision}
              />
            }
          />
          <Route path="/settings" element={<SettingsTab />} />
        </Routes>
      </main>

      {/* Request Detail Modal (only for dashboard tab) */}
      {selectedRequest && activeTab === 'dashboard' && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  )
}

export default ARIES
