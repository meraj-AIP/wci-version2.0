import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Clock, Cpu, User, ChevronRight, Search, Filter, TrendingUp, TrendingDown, Activity, Zap, Shield, Eye, Send, FileText, RefreshCw, AlertOctagon, MessageSquare, BarChart3, ArrowUpRight, ArrowDownRight, Loader2, Check, X, RotateCcw, ExternalLink } from 'lucide-react';

// Mock Data Generation
const vendors = [
  { name: 'Apex Materials Inc.', category: 'Strategic', trustScore: 92 },
  { name: 'GlobalTech Supplies', category: 'Strategic', trustScore: 88 },
  { name: 'QuickSource Ltd.', category: 'Non-Strategic', trustScore: 75 },
  { name: 'Premier Components', category: 'Strategic', trustScore: 95 },
  { name: 'Unknown Sender', category: 'Unknown', trustScore: 0 },
  { name: 'FastTrack Logistics', category: 'Non-Strategic', trustScore: 68 },
  { name: 'Innovate Materials', category: 'Non-Strategic', trustScore: 72 },
  { name: 'CoreSupply Partners', category: 'Strategic', trustScore: 85 },
  { name: 'NewVendor Co.', category: 'Unknown', trustScore: 45 },
  { name: 'TrustWorth Industries', category: 'Non-Strategic', trustScore: 82 },
];

const generateRequests = () => {
  const statuses = ['Processed', 'Pending', 'Auto-Approved', 'Auto-Rejected', 'Human Review'];
  const requests = [];
  
  for (let i = 1; i <= 24; i++) {
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const priceChange = (Math.random() * 25 - 5).toFixed(1);
    const marginImpact = (parseFloat(priceChange) * (0.3 + Math.random() * 0.4)).toFixed(2);
    const confidence = Math.floor(60 + Math.random() * 40);
    
    let status;
    let decisionOwner = 'AI Agent';
    const triggers = [];
    
    // Apply HITL trigger logic
    if (vendor.category === 'Unknown' || vendor.trustScore < 50) {
      triggers.push('Unknown Vendor');
    }
    if (vendor.category === 'Strategic') {
      triggers.push('Strategic Vendor');
    }
    if (Math.abs(parseFloat(marginImpact)) > 3) {
      triggers.push('High Margin Impact');
    }
    if (parseFloat(priceChange) > 10) {
      triggers.push('Significant Price Increase');
    }
    
    if (triggers.length > 0 && Math.random() > 0.3) {
      status = 'Human Review';
      decisionOwner = 'Pending Human';
    } else if (confidence > 85 && parseFloat(priceChange) < 5) {
      status = Math.random() > 0.3 ? 'Auto-Approved' : 'Processed';
    } else if (confidence < 70 || parseFloat(priceChange) > 15) {
      status = Math.random() > 0.5 ? 'Auto-Rejected' : 'Pending';
    } else {
      status = statuses[Math.floor(Math.random() * 3)];
    }
    
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    const receivedDate = new Date();
    receivedDate.setDate(receivedDate.getDate() - daysAgo);
    receivedDate.setHours(receivedDate.getHours() - hoursAgo);
    
    requests.push({
      id: `PCR-2024-${String(i).padStart(4, '0')}`,
      vendor: vendor.name,
      vendorCategory: vendor.category,
      vendorTrustScore: vendor.trustScore,
      source: 'Email',
      receivedDate: receivedDate.toISOString(),
      priceChange: parseFloat(priceChange),
      marginImpact: parseFloat(marginImpact),
      confidence,
      status,
      decisionOwner,
      slaHours: Math.floor(Math.random() * 48) + 1,
      triggers,
      rationale: generateRationale(vendor, parseFloat(priceChange), parseFloat(marginImpact), confidence),
      actions: generateActions(status),
      assignedReviewer: status === 'Human Review' ? ['Sarah Chen', 'Michael Torres', 'Emily Watson'][Math.floor(Math.random() * 3)] : null,
    });
  }
  
  return requests.sort((a, b) => new Date(b.receivedDate) - new Date(a.receivedDate));
};

const generateRationale = (vendor, priceChange, marginImpact, confidence) => {
  const reasons = [];
  
  if (vendor.category === 'Strategic') {
    reasons.push(`Vendor "${vendor.name}" is classified as Strategic with trust score ${vendor.trustScore}/100.`);
  } else if (vendor.category === 'Unknown') {
    reasons.push(`Sender not recognized in vendor database. Manual verification recommended.`);
  } else {
    reasons.push(`Non-strategic vendor with trust score ${vendor.trustScore}/100.`);
  }
  
  if (priceChange > 0) {
    reasons.push(`Requested price increase of ${priceChange}% detected.`);
  } else {
    reasons.push(`Price reduction of ${Math.abs(priceChange)}% benefits margin.`);
  }
  
  if (Math.abs(marginImpact) > 3) {
    reasons.push(`Significant margin impact of ${marginImpact}% flagged for review.`);
  } else {
    reasons.push(`Margin impact of ${marginImpact}% within acceptable threshold.`);
  }
  
  reasons.push(`Agent confidence: ${confidence}% based on historical patterns and policy alignment.`);
  
  return reasons.join(' ');
};

const generateActions = (status) => {
  const actions = [];
  const timestamp = new Date().toISOString();
  
  if (status === 'Auto-Approved' || status === 'Processed') {
    actions.push({ name: 'ERP Price Update Triggered', executor: 'AI Agent', status: 'Completed', timestamp });
    actions.push({ name: 'Supplier Notification Sent', executor: 'AI Agent', status: 'Completed', timestamp });
  } else if (status === 'Auto-Rejected') {
    actions.push({ name: 'Counter-Offer Generated', executor: 'AI Agent', status: 'Completed', timestamp });
    actions.push({ name: 'Supplier Notification Sent', executor: 'AI Agent', status: 'Completed', timestamp });
  } else if (status === 'Human Review') {
    actions.push({ name: 'Escalation Triggered', executor: 'AI Agent', status: 'Completed', timestamp });
    actions.push({ name: 'Request Parked for Review', executor: 'AI Agent', status: 'Pending', timestamp });
  }
  
  return actions;
};

// Utility Components
const Badge = ({ variant, children, className = '' }) => {
  const variants = {
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    info: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    neutral: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    purple: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  };
  
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    'Processed': { variant: 'success', icon: CheckCircle },
    'Pending': { variant: 'warning', icon: Clock },
    'Auto-Approved': { variant: 'success', icon: Zap },
    'Auto-Rejected': { variant: 'danger', icon: XCircle },
    'Human Review': { variant: 'purple', icon: User },
  };
  
  const { variant, icon: Icon } = config[status] || config['Pending'];
  
  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon size={10} />
      {status}
    </Badge>
  );
};

const ConfidenceBar = ({ score }) => {
  const getColor = (s) => {
    if (s >= 85) return 'bg-emerald-500';
    if (s >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${getColor(score)} transition-all duration-500`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-slate-400 font-mono">{score}%</span>
    </div>
  );
};

const SLATimer = ({ hours }) => {
  const isUrgent = hours < 8;
  const isWarning = hours < 24;
  
  return (
    <div className={`flex items-center gap-1 text-xs font-mono ${isUrgent ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-slate-400'}`}>
      <Clock size={12} className={isUrgent ? 'animate-pulse' : ''} />
      {hours}h
    </div>
  );
};

const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue, variant = 'default' }) => {
  const variants = {
    default: 'from-slate-800/50 to-slate-900/50 border-slate-700/50',
    success: 'from-emerald-900/20 to-slate-900/50 border-emerald-500/20',
    warning: 'from-amber-900/20 to-slate-900/50 border-amber-500/20',
    danger: 'from-rose-900/20 to-slate-900/50 border-rose-500/20',
    info: 'from-cyan-900/20 to-slate-900/50 border-cyan-500/20',
  };
  
  return (
    <div className={`bg-gradient-to-br ${variants[variant]} border rounded-xl p-4 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-semibold text-white mb-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {trendValue}
            </div>
          )}
        </div>
        <div className="p-2 bg-slate-800/50 rounded-lg">
          <Icon size={20} className="text-cyan-400" />
        </div>
      </div>
    </div>
  );
};

// Main Application
const ARIES = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentActivity, setAgentActivity] = useState([]);
  
  useEffect(() => {
    setRequests(generateRequests());
    
    // Simulate agent activity
    const activities = [
      { message: 'Parsing incoming price change request...', timestamp: new Date() },
      { message: 'Vendor classification complete', timestamp: new Date() },
      { message: 'Margin impact analysis running...', timestamp: new Date() },
      { message: 'Policy threshold check passed', timestamp: new Date() },
    ];
    setAgentActivity(activities);
  }, []);
  
  const filteredRequests = requests.filter(req => 
    req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const hitlRequests = requests.filter(req => req.status === 'Human Review');
  const processedRequests = requests.filter(req => ['Processed', 'Auto-Approved', 'Auto-Rejected'].includes(req.status));
  
  const kpis = {
    total: requests.length,
    processed: processedRequests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    humanReview: hitlRequests.length,
    autoApproved: requests.filter(r => r.status === 'Auto-Approved').length,
    rejected: requests.filter(r => r.status === 'Auto-Rejected').length,
    avgProcessingTime: '2.4h',
    marginImpact: (requests.reduce((sum, r) => sum + r.marginImpact, 0) / requests.length).toFixed(2),
  };
  
  const handleHumanDecision = (requestId, decision, comment = '') => {
    setIsProcessing(true);
    setTimeout(() => {
      setRequests(prev => prev.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: decision === 'approve' ? 'Processed' : decision === 'reject' ? 'Auto-Rejected' : 'Pending',
            decisionOwner: 'Human',
            humanComment: comment,
            actions: [
              ...req.actions,
              { name: `Human ${decision.charAt(0).toUpperCase() + decision.slice(1)}`, executor: 'Human', status: 'Completed', timestamp: new Date().toISOString() }
            ]
          };
        }
        return req;
      }));
      setSelectedRequest(null);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        * { box-sizing: border-box; }
        
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4); }
          50% { box-shadow: 0 0 20px 4px rgba(34, 211, 238, 0.2); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .scan-line {
          animation: scan 2s linear infinite;
        }
      `}</style>
      
      {/* Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center pulse-glow">
                  <Cpu size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight">ARIES</h1>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Agentic Intelligence</p>
                </div>
              </div>
              
              <div className="flex gap-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'decisions', label: 'Decisions & Actions', icon: Zap },
                  { id: 'hitl', label: 'Human-in-the-Loop', icon: Shield, badge: hitlRequests.length },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                    {tab.badge > 0 && (
                      <span className="px-1.5 py-0.5 text-xs bg-rose-500/20 text-rose-400 rounded-full font-mono">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                />
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Agent Active</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-slide-up">
            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <KPICard title="Total Requests" value={kpis.total} icon={FileText} trend="up" trendValue="+12% vs last week" />
              <KPICard title="AI Processed" value={kpis.processed} icon={Cpu} variant="info" subtitle="Autonomous decisions" />
              <KPICard title="Pending" value={kpis.pending} icon={Clock} variant="warning" />
              <KPICard title="Human Review" value={kpis.humanReview} icon={User} variant="danger" subtitle="Requires attention" />
              <KPICard title="Auto-Approved" value={kpis.autoApproved} icon={CheckCircle} variant="success" />
              <KPICard title="Rejected" value={kpis.rejected} icon={XCircle} variant="danger" />
              <KPICard title="Avg. Time" value={kpis.avgProcessingTime} icon={Activity} subtitle="Per request" />
              <KPICard title="Margin Impact" value={`${kpis.marginImpact}%`} icon={TrendingDown} variant={parseFloat(kpis.marginImpact) < 0 ? 'danger' : 'success'} />
            </div>
            
            {/* Agent Activity Feed */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={16} className="text-cyan-400" />
                <h3 className="text-sm font-medium text-slate-300">Live Agent Activity</h3>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {agentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 whitespace-nowrap">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-400">{activity.message}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Requests Table */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-medium text-slate-200">Price Change Requests</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg flex items-center gap-1 transition-colors">
                    <Filter size={12} />
                    Filters
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg flex items-center gap-1 transition-colors">
                    <RefreshCw size={12} />
                    Refresh
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800/50">
                      {['Request ID', 'Vendor', 'Category', 'Source', 'Received', 'Price Δ', 'Margin', 'Confidence', 'Status', 'Owner', 'SLA'].map(header => (
                        <th key={header} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredRequests.map((request, idx) => (
                      <tr 
                        key={request.id} 
                        onClick={() => setSelectedRequest(request)}
                        className="hover:bg-slate-800/30 cursor-pointer transition-colors group"
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm text-cyan-400">{request.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-slate-200">{request.vendor}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={request.vendorCategory === 'Strategic' ? 'purple' : request.vendorCategory === 'Unknown' ? 'danger' : 'neutral'}>
                            {request.vendorCategory}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-slate-500">{request.source}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-slate-400">
                            {new Date(request.receivedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-mono ${request.priceChange > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {request.priceChange > 0 ? '+' : ''}{request.priceChange}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-mono ${request.marginImpact < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
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
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            {request.decisionOwner === 'AI Agent' ? <Cpu size={12} className="text-cyan-400" /> : <User size={12} className="text-violet-400" />}
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
            </div>
          </div>
        )}
        
        {/* Decisions & Actions Tab */}
        {activeTab === 'decisions' && (
          <div className="space-y-6 animate-slide-up">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Decision Log */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800">
                  <h3 className="font-medium text-slate-200 flex items-center gap-2">
                    <Zap size={16} className="text-cyan-400" />
                    Decision Log
                  </h3>
                </div>
                <div className="divide-y divide-slate-800/50 max-h-[600px] overflow-y-auto">
                  {processedRequests.map((request) => (
                    <div key={request.id} className="p-4 hover:bg-slate-800/20 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-mono text-sm text-cyan-400">{request.id}</span>
                          <span className="mx-2 text-slate-600">•</span>
                          <span className="text-sm text-slate-400">{request.vendor}</span>
                        </div>
                        <StatusBadge status={request.status} />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                        <div className="flex items-center gap-1">
                          {request.decisionOwner === 'AI Agent' ? <Cpu size={12} className="text-cyan-400" /> : <User size={12} className="text-violet-400" />}
                          {request.decisionOwner}
                        </div>
                        <span>Confidence: {request.confidence}%</span>
                        <span>{new Date(request.receivedDate).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed bg-slate-800/30 p-3 rounded-lg border border-slate-700/30">
                        {request.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Actions Executed */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800">
                  <h3 className="font-medium text-slate-200 flex items-center gap-2">
                    <Activity size={16} className="text-emerald-400" />
                    Actions Executed
                  </h3>
                </div>
                <div className="divide-y divide-slate-800/50 max-h-[600px] overflow-y-auto">
                  {processedRequests.flatMap(request => 
                    request.actions.map((action, idx) => (
                      <div key={`${request.id}-${idx}`} className="p-4 hover:bg-slate-800/20 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {action.status === 'Completed' ? (
                              <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <Check size={12} className="text-emerald-400" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                                <Loader2 size={12} className="text-amber-400 animate-spin" />
                              </div>
                            )}
                            <span className="text-sm text-slate-200">{action.name}</span>
                          </div>
                          <Badge variant={action.status === 'Completed' ? 'success' : 'warning'}>{action.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 ml-8">
                          <span className="font-mono text-cyan-400/70">{request.id}</span>
                          <div className="flex items-center gap-1">
                            {action.executor === 'AI Agent' ? <Cpu size={10} /> : <User size={10} />}
                            {action.executor}
                          </div>
                          <span>{new Date(action.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Human-in-the-Loop Tab */}
        {activeTab === 'hitl' && (
          <div className="space-y-6 animate-slide-up">
            {/* HITL Header */}
            <div className="bg-gradient-to-r from-rose-900/20 to-slate-900/50 border border-rose-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/20 rounded-lg">
                  <Shield size={20} className="text-rose-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-200">Human-in-the-Loop Review Queue</h2>
                  <p className="text-sm text-slate-400">Requests requiring human judgment due to policy or risk thresholds</p>
                </div>
                <div className="ml-auto px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                  <span className="text-2xl font-bold text-rose-400">{hitlRequests.length}</span>
                  <span className="text-xs text-slate-400 ml-2">pending reviews</span>
                </div>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Queue List */}
              <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-medium text-slate-200">Review Queue</h3>
                  <span className="text-xs text-slate-500">Sorted by SLA urgency</span>
                </div>
                <div className="divide-y divide-slate-800/50">
                  {hitlRequests.sort((a, b) => a.slaHours - b.slaHours).map((request) => (
                    <div 
                      key={request.id} 
                      onClick={() => setSelectedRequest(request)}
                      className={`p-4 cursor-pointer transition-all ${selectedRequest?.id === request.id ? 'bg-cyan-500/10 border-l-2 border-l-cyan-500' : 'hover:bg-slate-800/30'}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="font-mono text-sm text-cyan-400">{request.id}</span>
                          <p className="text-sm text-slate-200 mt-0.5">{request.vendor}</p>
                        </div>
                        <SLATimer hours={request.slaHours} />
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {request.triggers.map((trigger, idx) => (
                          <Badge key={idx} variant="danger">{trigger}</Badge>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-slate-500 block">Price Change</span>
                          <span className={`font-mono ${request.priceChange > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {request.priceChange > 0 ? '+' : ''}{request.priceChange}%
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Margin Impact</span>
                          <span className={`font-mono ${request.marginImpact < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {request.marginImpact > 0 ? '+' : ''}{request.marginImpact}%
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Agent Rec.</span>
                          <span className="text-violet-400">{request.confidence > 75 ? 'Approve' : request.confidence > 50 ? 'Review' : 'Reject'}</span>
                        </div>
                      </div>
                      
                      {request.assignedReviewer && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                          <User size={12} />
                          Assigned to: <span className="text-slate-300">{request.assignedReviewer}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {hitlRequests.length === 0 && (
                    <div className="p-8 text-center">
                      <CheckCircle size={40} className="text-emerald-400 mx-auto mb-3" />
                      <p className="text-slate-400">All caught up! No pending reviews.</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Decision Panel */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800">
                  <h3 className="font-medium text-slate-200 flex items-center gap-2">
                    <Eye size={16} className="text-violet-400" />
                    Review Panel
                  </h3>
                </div>
                
                {selectedRequest ? (
                  <div className="p-4 space-y-4">
                    <div>
                      <span className="text-xs text-slate-500 uppercase tracking-wider">Request</span>
                      <p className="font-mono text-cyan-400">{selectedRequest.id}</p>
                    </div>
                    
                    <div>
                      <span className="text-xs text-slate-500 uppercase tracking-wider">AI Agent Summary</span>
                      <p className="text-sm text-slate-300 mt-1 leading-relaxed">{selectedRequest.rationale}</p>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <span className="text-xs text-slate-500 uppercase tracking-wider block mb-2">Impact Analysis</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-slate-500">Price Change</span>
                          <p className={`text-lg font-mono ${selectedRequest.priceChange > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {selectedRequest.priceChange > 0 ? '+' : ''}{selectedRequest.priceChange}%
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500">Margin Impact</span>
                          <p className={`text-lg font-mono ${selectedRequest.marginImpact < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {selectedRequest.marginImpact > 0 ? '+' : ''}{selectedRequest.marginImpact}%
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs text-slate-500 uppercase tracking-wider block mb-2">Risk Flags</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedRequest.triggers.map((trigger, idx) => (
                          <Badge key={idx} variant="danger">{trigger}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
                      <span className="text-xs text-violet-400 uppercase tracking-wider block mb-1">Agent Recommendation</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-violet-300">
                          {selectedRequest.confidence > 75 ? 'APPROVE' : selectedRequest.confidence > 50 ? 'REVIEW FURTHER' : 'REJECT'}
                        </span>
                        <span className="text-xs text-slate-500">({selectedRequest.confidence}% confidence)</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-800 pt-4 space-y-2">
                      <span className="text-xs text-slate-500 uppercase tracking-wider block">Human Decision</span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleHumanDecision(selectedRequest.id, 'approve')}
                          disabled={isProcessing}
                          className="px-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                          {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                          Approve
                        </button>
                        <button 
                          onClick={() => handleHumanDecision(selectedRequest.id, 'reject')}
                          disabled={isProcessing}
                          className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                          {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                          Reject
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => handleHumanDecision(selectedRequest.id, 'renegotiate')}
                        disabled={isProcessing}
                        className="w-full px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        <MessageSquare size={14} />
                        Request Renegotiation
                      </button>
                      
                      <button 
                        disabled={isProcessing}
                        className="w-full px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        <RotateCcw size={14} />
                        Override Agent Decision
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Eye size={40} className="text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">Select a request to review</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Request Detail Modal */}
      {selectedRequest && activeTab === 'dashboard' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedRequest(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-mono text-lg text-cyan-400">{selectedRequest.id}</span>
                <p className="text-sm text-slate-400">{selectedRequest.vendor}</p>
              </div>
              <StatusBadge status={selectedRequest.status} />
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <span className="text-xs text-slate-500 block mb-1">Price Change</span>
                  <span className={`text-2xl font-mono ${selectedRequest.priceChange > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedRequest.priceChange > 0 ? '+' : ''}{selectedRequest.priceChange}%
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <span className="text-xs text-slate-500 block mb-1">Margin Impact</span>
                  <span className={`text-2xl font-mono ${selectedRequest.marginImpact < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedRequest.marginImpact > 0 ? '+' : ''}{selectedRequest.marginImpact}%
                  </span>
                </div>
              </div>
              
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-2">Agent Analysis</span>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/30 p-4 rounded-lg border border-slate-700/30">
                  {selectedRequest.rationale}
                </p>
              </div>
              
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-2">Confidence Score</span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${selectedRequest.confidence >= 85 ? 'bg-emerald-500' : selectedRequest.confidence >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${selectedRequest.confidence}%` }}
                    />
                  </div>
                  <span className="text-lg font-mono text-white">{selectedRequest.confidence}%</span>
                </div>
              </div>
              
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-2">Actions Taken</span>
                <div className="space-y-2">
                  {selectedRequest.actions.map((action, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                      <div className="flex items-center gap-2">
                        {action.status === 'Completed' ? (
                          <Check size={14} className="text-emerald-400" />
                        ) : (
                          <Loader2 size={14} className="text-amber-400 animate-spin" />
                        )}
                        <span className="text-sm text-slate-300">{action.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {action.executor === 'AI Agent' ? <Cpu size={12} /> : <User size={12} />}
                        {action.executor}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARIES;
