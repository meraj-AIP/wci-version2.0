const ConfidenceBar = ({ score }) => {
  const getColor = (s) => {
    if (s >= 85) return 'bg-emerald-500'
    if (s >= 70) return 'bg-amber-500'
    return 'bg-rose-500'
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(score)} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-slate-400 font-mono">{score}%</span>
    </div>
  )
}

export default ConfidenceBar
