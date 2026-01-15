import { CheckCircle, Clock, Zap, XCircle, User } from 'lucide-react'
import Badge from './Badge'

const StatusBadge = ({ status }) => {
  const config = {
    'Processed': { variant: 'success', icon: CheckCircle },
    'Pending': { variant: 'warning', icon: Clock },
    'Auto-Approved': { variant: 'success', icon: Zap },
    'Auto-Rejected': { variant: 'danger', icon: XCircle },
    'Human Review': { variant: 'purple', icon: User },
  }

  const { variant, icon: Icon } = config[status] || config['Pending']

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon size={10} />
      {status}
    </Badge>
  )
}

export default StatusBadge
