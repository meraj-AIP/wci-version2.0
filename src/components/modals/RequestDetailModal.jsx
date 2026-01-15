import { Check, Loader2, Cpu, User, Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react'
import { StatusBadge } from '../ui'

const RequestDetailModal = ({ request, onClose }) => {
  if (!request) return null

  const { bomAnalysis } = request
  const isNegativeImpact = request.priceChange > 0

  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="font-mono text-lg text-cyan-600 dark:text-cyan-400">{request.id}</span>
            <p className="text-sm text-slate-600 dark:text-slate-400">{request.vendor}</p>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* Price & Margin Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3">
              <span className="text-xs text-slate-500 block mb-1">Price Change</span>
              <span className={`text-2xl font-mono ${request.priceChange > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {request.priceChange > 0 ? '+' : ''}{request.priceChange}%
              </span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3">
              <span className="text-xs text-slate-500 block mb-1">Margin Impact</span>
              <span className={`text-2xl font-mono ${request.marginImpact < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {request.marginImpact > 0 ? '+' : ''}{request.marginImpact}%
              </span>
            </div>
          </div>

          {/* BOM Analysis Section */}
          {bomAnalysis && (
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Package size={16} className="text-cyan-600 dark:text-cyan-400" />
                <h3 className="font-medium text-slate-800 dark:text-slate-200">BOM Impact Analysis</h3>
              </div>

              {/* BOM Summary Cards */}
              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-slate-200 dark:border-slate-700">
                <div className="bg-slate-100 dark:bg-slate-800/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Package size={12} className="text-slate-500" />
                    <span className="text-xs text-slate-500">Products Affected</span>
                  </div>
                  <span className="text-xl font-semibold text-slate-900 dark:text-white">{bomAnalysis.summary.totalProductsAffected}</span>
                </div>
                <div className={`rounded-lg p-3 ${isNegativeImpact ? 'bg-rose-50 dark:bg-rose-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign size={12} className={isNegativeImpact ? 'text-rose-500' : 'text-emerald-500'} />
                    <span className={`text-xs ${isNegativeImpact ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>Annual Impact</span>
                  </div>
                  <span className={`text-xl font-semibold font-mono ${isNegativeImpact ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {isNegativeImpact ? '+' : '-'}${Math.abs(parseFloat(bomAnalysis.summary.totalAnnualImpact)).toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={12} className="text-slate-500" />
                    <span className="text-xs text-slate-500">Avg. Per Product</span>
                  </div>
                  <span className="text-xl font-semibold font-mono text-slate-900 dark:text-white">
                    ${parseFloat(bomAnalysis.summary.avgImpactPerProduct).toLocaleString()}
                  </span>
                </div>
                <div className="bg-amber-50 dark:bg-amber-500/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={12} className="text-amber-500" />
                    <span className="text-xs text-amber-600 dark:text-amber-400">Highest Impact</span>
                  </div>
                  <span className="text-sm font-mono text-amber-700 dark:text-amber-300">{bomAnalysis.summary.highestImpactProduct}</span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 block">${parseFloat(bomAnalysis.summary.highestImpactAmount).toLocaleString()}</span>
                </div>
              </div>

              {/* Affected Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/30">
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Product ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Component Cost</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Usage Qty</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Annual Vol.</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Cost Impact</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Annual Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {bomAnalysis.affectedProducts.map((product, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                        <td className="px-4 py-2">
                          <span className="font-mono text-cyan-600 dark:text-cyan-400">{product.productId}</span>
                        </td>
                        <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{product.category}</td>
                        <td className="px-4 py-2 text-right font-mono text-slate-700 dark:text-slate-300">${product.componentCost.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right font-mono text-slate-700 dark:text-slate-300">{product.usageQty}</td>
                        <td className="px-4 py-2 text-right font-mono text-slate-700 dark:text-slate-300">{product.annualVolume.toLocaleString()}</td>
                        <td className={`px-4 py-2 text-right font-mono ${isNegativeImpact ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {isNegativeImpact ? '+' : '-'}${Math.abs(product.costImpact).toFixed(2)}
                        </td>
                        <td className={`px-4 py-2 text-right font-mono font-medium ${isNegativeImpact ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {isNegativeImpact ? '+' : '-'}${Math.abs(product.annualImpact).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Agent Analysis */}
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block mb-2">Agent Analysis</span>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-100 dark:bg-slate-800/30 p-4 rounded-lg border border-slate-200 dark:border-slate-700/30">
              {request.rationale}
            </p>
          </div>

          {/* Confidence Score */}
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block mb-2">Confidence Score</span>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${request.confidence >= 85 ? 'bg-emerald-500' : request.confidence >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${request.confidence}%` }}
                />
              </div>
              <span className="text-lg font-mono text-slate-900 dark:text-white">{request.confidence}%</span>
            </div>
          </div>

          {/* Actions Taken */}
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block mb-2">Actions Taken</span>
            <div className="space-y-2">
              {request.actions.map((action, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700/30">
                  <div className="flex items-center gap-2">
                    {action.status === 'Completed' ? (
                      <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Loader2 size={14} className="text-amber-600 dark:text-amber-400 animate-spin" />
                    )}
                    <span className="text-sm text-slate-700 dark:text-slate-300">{action.name}</span>
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

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default RequestDetailModal
