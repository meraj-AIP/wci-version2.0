import { Clock } from 'lucide-react'

const SLATimer = ({ hours }) => {
  const isUrgent = hours < 8
  const isWarning = hours < 24

  return (
    <div className={`flex items-center gap-1 text-xs font-mono ${isUrgent ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-slate-400'}`}>
      <Clock size={12} className={isUrgent ? 'animate-pulse' : ''} />
      {hours}h
    </div>
  )
}

export default SLATimer
