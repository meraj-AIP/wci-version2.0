import { useState } from 'react'
import {
  Shield, User, CheckCircle, Eye, Check, X, Loader2,
  AlertTriangle, TrendingDown, UserX, Package, DollarSign, AlertOctagon,
  Mail, Clock, RefreshCw, Send, FileText, CheckSquare, Square, Copy,
  AlertCircle, Info
} from 'lucide-react'
import { Badge, SLATimer } from '../ui'
import { MARGIN_EROSION_THRESHOLD } from '../../data/mockData'

// Required items checklist for vendor emails
const REQUIRED_EMAIL_ITEMS = [
  { id: 'item_name', label: 'Item Name', field: 'itemName' },
  { id: 'item_number', label: 'Item/Part Number', field: 'itemNumber' },
  { id: 'quantity', label: 'Quantity', field: 'quantity' },
  { id: 'unit_price', label: 'Unit Price', field: 'unitPrice' },
  { id: 'total_price', label: 'Total Price', field: 'totalPrice' },
  { id: 'effective_date', label: 'Effective Date', field: 'effectiveDate' },
  { id: 'validity_period', label: 'Validity Period', field: 'validityPeriod' },
  { id: 'payment_terms', label: 'Payment Terms', field: 'paymentTerms' },
]

// Helper to check if request has missing information
const checkMissingInfo = (request) => {
  // Generate deterministic "missing items" based on request ID
  const hash = request.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const missingCount = REQUIRED_EMAIL_ITEMS.filter((_, idx) => (hash + idx) % 3 === 0).length
  return missingCount > 0
}

// Get HITL reason based on request data
const getHITLReason = (request) => {
  // Priority 1: Unknown Sender
  if (request.vendorCategory === 'Unknown' || request.triggers.includes('Unknown Vendor')) {
    return {
      type: 'unknown',
      title: 'Unknown Sender',
      description: 'Sender not in approved vendor list. Manual verification required.',
      icon: UserX,
      color: 'amber'
    }
  }

  // Priority 2: Margin Threshold Breach
  if (request.triggers.includes('High Margin Impact') || request.triggers.includes('Significant Price Increase')) {
    return {
      type: 'margin',
      title: 'Margin Threshold Breach',
      description: `Price change exceeds ${MARGIN_EROSION_THRESHOLD}% margin impact threshold.`,
      icon: TrendingDown,
      color: 'rose'
    }
  }

  // Priority 3: Missing Information (known vendor, no margin breach)
  if (checkMissingInfo(request)) {
    return {
      type: 'missing',
      title: 'Missing Information',
      description: 'Required documentation incomplete. Additional details needed from vendor.',
      icon: FileText,
      color: 'orange'
    }
  }

  // Default: Other manual review
  return {
    type: 'other',
    title: 'Manual Review Required',
    description: 'This request requires human review.',
    icon: AlertCircle,
    color: 'violet'
  }
}

// Email Modal Component
const EmailModal = ({ isOpen, onClose, request, missingItems, onSend, isSending, isSent }) => {
  if (!isOpen || !request) return null

  const vendorName = request?.vendor || 'Vendor'
  const requestId = request?.id || 'N/A'
  const vendorEmail = request?.unknownVendorDetails?.emailDomain || 'vendor@example.com'

  const emailSubject = `Request for Missing Information - Price Change Request ${requestId}`
  const emailBody = `Dear ${vendorName} Team,

We are processing your price change request (Reference: ${requestId}) and require additional information to proceed.

Please provide the following missing details:

${missingItems.map((item, idx) => `${idx + 1}. ${item.label}`).join('\n')}

Please reply to this email with the requested information at your earliest convenience.

Required Format:
- Item Name: [Full product/component name]
- Item/Part Number: [Your internal SKU or part number]
- Quantity: [Number of units]
- Unit Price: [Price per unit in USD]
- Total Price: [Total amount]
- Effective Date: [Date when new price takes effect]
- Validity Period: [How long this price will be valid]
- Payment Terms: [Net 30, Net 60, etc.]

Thank you for your cooperation.

Best regards,
WCI Procurement Team
WCI Co-Pilot Automated System`

  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 dark:bg-violet-500/20 rounded-lg">
              <Mail size={20} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Draft Email to Vendor</h3>
              <p className="text-xs text-slate-500">Review and send request for missing information</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(85vh-180px)]">
          <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-rose-600 dark:text-rose-400" />
              <span className="font-medium text-rose-800 dark:text-rose-300">Missing Information ({missingItems.length} items)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {missingItems.map((item) => (
                <span key={item.id} className="px-2 py-1 bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs rounded-lg">
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">To</label>
              <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg text-sm text-slate-700 dark:text-slate-300 font-mono">
                {vendorEmail}
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Subject</label>
              <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                {emailSubject}
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Message</label>
              <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">
                {emailBody}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => navigator.clipboard.writeText(`Subject: ${emailSubject}\n\n${emailBody}`)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Copy size={14} />
            Copy to Clipboard
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </button>
            <button
              onClick={onSend}
              disabled={isSending || isSent}
              className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                isSent ? 'bg-emerald-500 text-white' : 'bg-violet-600 hover:bg-violet-700 text-white'
              } disabled:opacity-50`}
            >
              {isSending ? <><Loader2 size={16} className="animate-spin" /> Sending...</> :
               isSent ? <><Check size={16} /> Sent Successfully!</> :
               <><Send size={16} /> Review & Send</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Rejection Reason Modal Component
const RejectionModal = ({ isOpen, onClose, onConfirm, isProcessing, requestId }) => {
  const [reason, setReason] = useState('')
  const [selectedReason, setSelectedReason] = useState('')

  const predefinedReasons = [
    'Price increase exceeds acceptable threshold',
    'Insufficient justification provided',
    'Alternative supplier available at better price',
    'Contract terms not acceptable',
    'Vendor not approved for this category',
    'Missing required documentation',
    'Other'
  ]

  const handleSubmit = () => {
    const finalReason = selectedReason === 'Other' ? reason : selectedReason
    if (finalReason.trim()) {
      onConfirm(requestId, 'reject', finalReason)
    }
  }

  const handleClose = () => {
    setReason('')
    setSelectedReason('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
              <X size={20} className="text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Reject Request</h3>
              <p className="text-xs text-slate-500">{requestId}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Select rejection reason</label>
            <div className="space-y-2">
              {predefinedReasons.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedReason === r
                      ? 'border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <input type="radio" name="rejectionReason" value={r} checked={selectedReason === r} onChange={(e) => setSelectedReason(e.target.value)} className="w-4 h-4 text-rose-600 focus:ring-rose-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{r}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === 'Other' && (
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Specify reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all resize-none"
              />
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || (selectedReason === 'Other' && !reason.trim()) || isProcessing}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Rejecting...</> : <><X size={16} /> Confirm Rejection</>}
          </button>
        </div>
      </div>
    </div>
  )
}

const HITLTab = ({
  hitlRequests,
  selectedRequest,
  setSelectedRequest,
  isProcessing,
  handleHumanDecision
}) => {
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailSending, setEmailSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [rejectionReasons, setRejectionReasons] = useState({})

  // Generate mock email data status for the selected request
  const getEmailDataStatus = (request) => {
    if (!request) return []
    const hash = request.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    return REQUIRED_EMAIL_ITEMS.map((item, idx) => ({
      ...item,
      present: (hash + idx) % 3 !== 0,
      value: (hash + idx) % 3 !== 0 ? `Sample ${item.label}` : null
    }))
  }

  const handleSendEmail = () => {
    setEmailSending(true)
    setTimeout(() => {
      setEmailSending(false)
      setEmailSent(true)
      setTimeout(() => {
        setEmailSent(false)
        setShowEmailModal(false)
      }, 2000)
    }, 1500)
  }

  const handleOpenEmailModal = () => {
    setEmailSent(false)
    setEmailSending(false)
    setShowEmailModal(true)
  }

  const handleOpenRejectionModal = () => {
    setShowRejectionModal(true)
  }

  const handleRejectWithReason = (requestId, action, reason) => {
    setRejectionReasons(prev => ({ ...prev, [requestId]: reason }))
    handleHumanDecision(requestId, action, '', reason)
    setShowRejectionModal(false)
  }

  const [activeFilter, setActiveFilter] = useState('all')

  const emailDataStatus = getEmailDataStatus(selectedRequest)
  const missingItems = emailDataStatus.filter(item => !item.present)
  const hasAllItems = missingItems.length === 0

  // Categorize requests by HITL reason
  const categorizedCounts = {
    all: hitlRequests.length,
    unknown: hitlRequests.filter(r => getHITLReason(r).type === 'unknown').length,
    margin: hitlRequests.filter(r => getHITLReason(r).type === 'margin').length,
    missing: hitlRequests.filter(r => getHITLReason(r).type === 'missing').length,
    other: hitlRequests.filter(r => getHITLReason(r).type === 'other').length,
  }

  // Filter requests based on active filter
  const filteredHitlRequests = activeFilter === 'all'
    ? hitlRequests
    : hitlRequests.filter(r => getHITLReason(r).type === activeFilter)

  // Sort by SLA urgency
  const sortedRequests = [...filteredHitlRequests].sort((a, b) => a.slaHours - b.slaHours)

  // Filter tabs configuration
  const filterTabs = [
    { id: 'all', label: 'All Requests', icon: Shield, count: categorizedCounts.all, color: 'slate' },
    { id: 'unknown', label: 'Unknown Sender', icon: UserX, count: categorizedCounts.unknown, color: 'amber' },
    { id: 'margin', label: 'Margin Breach', icon: TrendingDown, count: categorizedCounts.margin, color: 'rose' },
    { id: 'missing', label: 'Missing Info', icon: FileText, count: categorizedCounts.missing, color: 'orange' },
  ]

  // Only show 'other' tab if there are any
  if (categorizedCounts.other > 0) {
    filterTabs.push({ id: 'other', label: 'Other', icon: AlertCircle, count: categorizedCounts.other, color: 'violet' })
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl shadow-lg shadow-rose-500/20">
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Human Review Queue</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Requests requiring manual approval</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl">
          <AlertCircle size={18} className="text-rose-600 dark:text-rose-400" />
          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{hitlRequests.length}</span>
          <span className="text-sm text-rose-600 dark:text-rose-400">Pending</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => {
          const TabIcon = tab.icon
          const isActive = activeFilter === tab.id
          const colorStyles = {
            slate: isActive ? 'bg-slate-100 dark:bg-slate-500/20 border-slate-300 dark:border-slate-500/30 text-slate-700 dark:text-slate-300' : '',
            amber: isActive ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400' : '',
            rose: isActive ? 'bg-rose-100 dark:bg-rose-500/20 border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-400' : '',
            orange: isActive ? 'bg-orange-100 dark:bg-orange-500/20 border-orange-300 dark:border-orange-500/30 text-orange-700 dark:text-orange-400' : '',
            violet: isActive ? 'bg-violet-100 dark:bg-violet-500/20 border-violet-300 dark:border-violet-500/30 text-violet-700 dark:text-violet-400' : '',
          }
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                isActive
                  ? colorStyles[tab.color]
                  : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <TabIcon size={14} />
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                isActive ? 'bg-white/50 dark:bg-black/20' : 'bg-slate-100 dark:bg-slate-800'
              }`}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Request Cards List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {activeFilter === 'all' ? 'All Requests' : filterTabs.find(t => t.id === activeFilter)?.label}
            </span>
            <span className="text-xs text-slate-500">Sorted by SLA urgency</span>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {sortedRequests.map((request) => {
              const hitlReason = getHITLReason(request)
              const ReasonIcon = hitlReason.icon
              const isSelected = selectedRequest?.id === request.id
              const colorClasses = {
                amber: {
                  bg: 'bg-amber-50 dark:bg-amber-500/10',
                  border: 'border-amber-200 dark:border-amber-500/30',
                  iconBg: 'bg-amber-100 dark:bg-amber-500/20',
                  iconText: 'text-amber-600 dark:text-amber-400',
                  text: 'text-amber-700 dark:text-amber-300',
                  selectedBorder: 'border-amber-400 dark:border-amber-500'
                },
                rose: {
                  bg: 'bg-rose-50 dark:bg-rose-500/10',
                  border: 'border-rose-200 dark:border-rose-500/30',
                  iconBg: 'bg-rose-100 dark:bg-rose-500/20',
                  iconText: 'text-rose-600 dark:text-rose-400',
                  text: 'text-rose-700 dark:text-rose-300',
                  selectedBorder: 'border-rose-400 dark:border-rose-500'
                },
                orange: {
                  bg: 'bg-orange-50 dark:bg-orange-500/10',
                  border: 'border-orange-200 dark:border-orange-500/30',
                  iconBg: 'bg-orange-100 dark:bg-orange-500/20',
                  iconText: 'text-orange-600 dark:text-orange-400',
                  text: 'text-orange-700 dark:text-orange-300',
                  selectedBorder: 'border-orange-400 dark:border-orange-500'
                },
                violet: {
                  bg: 'bg-violet-50 dark:bg-violet-500/10',
                  border: 'border-violet-200 dark:border-violet-500/30',
                  iconBg: 'bg-violet-100 dark:bg-violet-500/20',
                  iconText: 'text-violet-600 dark:text-violet-400',
                  text: 'text-violet-700 dark:text-violet-300',
                  selectedBorder: 'border-violet-400 dark:border-violet-500'
                }
              }
              const colors = colorClasses[hitlReason.color]

              return (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? `${colors.bg} ${colors.selectedBorder} shadow-lg`
                      : `bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md`
                  }`}
                >
                  {/* HITL Reason Banner */}
                  <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg ${colors.bg} ${colors.border} border`}>
                    <div className={`p-1 rounded ${colors.iconBg}`}>
                      <ReasonIcon size={14} className={colors.iconText} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-semibold ${colors.text}`}>{hitlReason.title}</span>
                      <p className={`text-[10px] ${colors.text} opacity-80 truncate`}>{hitlReason.description}</p>
                    </div>
                  </div>

                  {/* Request Info */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="font-mono text-sm font-semibold text-cyan-600 dark:text-cyan-400">{request.id}</span>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5">{request.vendor}</p>
                    </div>
                    <SLATimer hours={request.slaHours} />
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                      <span className="text-[10px] uppercase text-slate-500 font-medium">Price</span>
                      <span className={`text-xs font-mono font-bold ${request.priceChange > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {request.priceChange > 0 ? '+' : ''}{request.priceChange}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                      <span className="text-[10px] uppercase text-slate-500 font-medium">Margin</span>
                      <span className={`text-xs font-mono font-bold ${request.marginImpact < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {request.marginImpact > 0 ? '+' : ''}{request.marginImpact}%
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 ml-auto">{request.confidence}% conf.</span>
                  </div>
                </div>
              )
            })}

            {sortedRequests.length === 0 && hitlRequests.length > 0 && (
              <div className="p-12 text-center bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <FileText size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">No Matching Requests</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">No requests match the selected filter.</p>
                <button
                  onClick={() => setActiveFilter('all')}
                  className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium transition-colors"
                >
                  Show All Requests
                </button>
              </div>
            )}

            {hitlRequests.length === 0 && (
              <div className="p-12 text-center bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <CheckCircle size={48} className="text-emerald-500 dark:text-emerald-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">All Clear!</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">No pending reviews at this time.</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          {selectedRequest ? (
            <>
              {/* Detail Header */}
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900/50">
                {/* HITL Reason Alert */}
                {(() => {
                  const hitlReason = getHITLReason(selectedRequest)
                  const ReasonIcon = hitlReason.icon
                  const colorClasses = {
                    amber: 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-200',
                    rose: 'bg-rose-100 dark:bg-rose-500/20 border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-200',
                    orange: 'bg-orange-100 dark:bg-orange-500/20 border-orange-300 dark:border-orange-500/30 text-orange-800 dark:text-orange-200',
                    violet: 'bg-violet-100 dark:bg-violet-500/20 border-violet-300 dark:border-violet-500/30 text-violet-800 dark:text-violet-200'
                  }
                  return (
                    <div className={`flex items-center gap-3 p-3 rounded-xl border mb-4 ${colorClasses[hitlReason.color]}`}>
                      <ReasonIcon size={20} />
                      <div>
                        <span className="font-semibold text-sm">{hitlReason.title}</span>
                        <p className="text-xs opacity-80">{hitlReason.description}</p>
                      </div>
                    </div>
                  )
                })()}

                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-lg font-bold text-cyan-600 dark:text-cyan-400">{selectedRequest.id}</span>
                    <p className="text-slate-700 dark:text-slate-300">{selectedRequest.vendor}</p>
                  </div>
                  <SLATimer hours={selectedRequest.slaHours} />
                </div>
              </div>

              {/* Detail Content */}
              <div className="p-5 space-y-5 max-h-[calc(100vh-380px)] overflow-y-auto">
                {/* Unknown Vendor Details */}
                {selectedRequest.vendorCategory === 'Unknown' && selectedRequest.unknownVendorDetails && (
                  <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertOctagon size={16} className="text-amber-600 dark:text-amber-400" />
                      <h4 className="font-medium text-amber-800 dark:text-amber-300">Vendor Risk Assessment</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white dark:bg-slate-800/50 rounded-lg p-3">
                        <span className="text-xs text-slate-500 block">Risk Score</span>
                        <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
                          {selectedRequest.unknownVendorDetails.riskScore}/100
                        </span>
                      </div>
                      <div className="bg-white dark:bg-slate-800/50 rounded-lg p-3">
                        <span className="text-xs text-slate-500 block">Previous Requests</span>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                          {selectedRequest.unknownVendorDetails.previousRequests}
                        </span>
                      </div>
                    </div>
                    {selectedRequest.unknownVendorDetails.flaggedReasons?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-500/20">
                        <span className="text-xs text-slate-500 block mb-2">Flagged Reasons:</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedRequest.unknownVendorDetails.flaggedReasons.map((reason, idx) => (
                            <span key={idx} className="px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs rounded-lg">
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Email Checklist for Unknown Vendors or Missing Information */}
                {(selectedRequest.vendorCategory === 'Unknown' || getHITLReason(selectedRequest).type === 'missing') && (
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-violet-600 dark:text-violet-400" />
                        <h4 className="font-medium text-slate-800 dark:text-slate-200">Email Documentation</h4>
                      </div>
                      {hasAllItems ? <Badge variant="success">Complete</Badge> : <Badge variant="danger">{missingItems.length} Missing</Badge>}
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {emailDataStatus.map((item) => (
                          <div key={item.id} className={`flex items-center gap-2 p-2 rounded-lg ${item.present ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-rose-50 dark:bg-rose-500/10'}`}>
                            {item.present ? <CheckSquare size={16} className="text-emerald-600 dark:text-emerald-400" /> : <Square size={16} className="text-rose-600 dark:text-rose-400" />}
                            <span className={`text-sm ${item.present ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{item.label}</span>
                          </div>
                        ))}
                      </div>
                      {!hasAllItems && (
                        <button onClick={handleOpenEmailModal} className="w-full px-4 py-3 bg-violet-100 dark:bg-violet-500/20 hover:bg-violet-200 dark:hover:bg-violet-500/30 border border-violet-300 dark:border-violet-500/30 text-violet-700 dark:text-violet-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all">
                          <Mail size={16} />
                          Request Missing Information
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Price Impact */}
                <div className="grid grid-cols-4 gap-3">
                  <div className={`rounded-xl p-3 ${selectedRequest.priceChange > 0 ? 'bg-rose-50 dark:bg-rose-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
                    <span className="text-xs text-slate-500 block">Price Change</span>
                    <span className={`text-xl font-mono font-bold ${selectedRequest.priceChange > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {selectedRequest.priceChange > 0 ? '+' : ''}{selectedRequest.priceChange}%
                    </span>
                  </div>
                  <div className={`rounded-xl p-3 ${selectedRequest.marginImpact < 0 ? 'bg-rose-50 dark:bg-rose-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
                    <span className="text-xs text-slate-500 block">Margin Impact</span>
                    <span className={`text-xl font-mono font-bold ${selectedRequest.marginImpact < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {selectedRequest.marginImpact > 0 ? '+' : ''}{selectedRequest.marginImpact}%
                    </span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-3">
                    <span className="text-xs text-slate-500 block">Threshold</span>
                    <span className="text-xl font-mono font-bold text-slate-900 dark:text-white">{MARGIN_EROSION_THRESHOLD}%</span>
                  </div>
                  <div className="bg-violet-50 dark:bg-violet-500/10 rounded-xl p-3">
                    <span className="text-xs text-slate-500 block">Confidence</span>
                    <span className="text-xl font-bold text-violet-600 dark:text-violet-400">{selectedRequest.confidence}%</span>
                  </div>
                </div>

                {/* BOM Impact */}
                {selectedRequest.bomAnalysis && (
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                      <Package size={16} className="text-cyan-600 dark:text-cyan-400" />
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">BOM Impact</h4>
                      <span className="ml-auto text-xs text-slate-500">{selectedRequest.bomAnalysis.summary.totalProductsAffected} products</span>
                    </div>
                    <div className="p-4 grid grid-cols-3 gap-3">
                      <div className={`rounded-lg p-3 ${selectedRequest.priceChange > 0 ? 'bg-rose-50 dark:bg-rose-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
                        <span className="text-xs text-slate-500 block">Annual Impact</span>
                        <span className={`text-lg font-mono font-bold ${selectedRequest.priceChange > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {selectedRequest.priceChange > 0 ? '+' : '-'}${Math.abs(parseFloat(selectedRequest.bomAnalysis.summary.totalAnnualImpact)).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800/30 rounded-lg p-3">
                        <span className="text-xs text-slate-500 block">Assemblies</span>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">{selectedRequest.bomAnalysis.summary.totalProductsAffected}</span>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-500/10 rounded-lg p-3">
                        <span className="text-xs text-amber-600 dark:text-amber-400 block">Highest Impact</span>
                        <span className="text-lg font-mono font-bold text-amber-700 dark:text-amber-300">{selectedRequest.bomAnalysis.summary.highestImpactProduct}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Rationale */}
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider block mb-2">AI Analysis</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-100 dark:bg-slate-800/30 p-3 rounded-lg">
                    {selectedRequest.rationale}
                  </p>
                </div>

                {/* Rejection Reason Display */}
                {(rejectionReasons[selectedRequest.id] || selectedRequest.rejectionReason) && (
                  <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <X size={16} className="text-rose-600 dark:text-rose-400" />
                      <span className="text-xs text-rose-600 dark:text-rose-400 uppercase tracking-wider font-medium">Rejection Reason</span>
                    </div>
                    <p className="text-sm text-rose-700 dark:text-rose-300">
                      {rejectionReasons[selectedRequest.id] || selectedRequest.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleHumanDecision(selectedRequest.id, 'approve')}
                    disabled={isProcessing}
                    className="px-4 py-3 bg-emerald-100 dark:bg-emerald-500/20 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    Approve
                  </button>
                  <button
                    onClick={handleOpenRejectionModal}
                    disabled={isProcessing}
                    className="px-4 py-3 bg-rose-100 dark:bg-rose-500/20 hover:bg-rose-200 dark:hover:bg-rose-500/30 border border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                    Reject
                  </button>
                  <button
                    onClick={() => handleHumanDecision(selectedRequest.id, 'approve')}
                    disabled={isProcessing}
                    className="px-4 py-3 bg-cyan-100 dark:bg-cyan-500/20 hover:bg-cyan-200 dark:hover:bg-cyan-500/30 border border-cyan-300 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    Sync to Epicor
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-16 text-center">
              <Eye size={56} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Select a Request</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Click on a card to review details</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        request={selectedRequest}
        missingItems={missingItems}
        onSend={handleSendEmail}
        isSending={emailSending}
        isSent={emailSent}
      />
      <RejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onConfirm={handleRejectWithReason}
        isProcessing={isProcessing}
        requestId={selectedRequest?.id}
      />
    </div>
  )
}

export default HITLTab
