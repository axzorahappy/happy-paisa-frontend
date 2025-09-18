import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from './Card';
import { Chip } from './Chip';

export function StatCard({ title, amount, change, icon: Icon, changeType }: { title: string; amount: string; change?: string; icon: any; changeType?: 'increase' | 'decrease' }) {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-text-secondary text-sm">{title}</p>
          <p className="text-3xl font-bold">{amount}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gray-700`}>
          <Icon className="text-white" />
        </div>
      </div>
      {change && (
        <div className={`flex items-center text-sm mt-4 ${changeType === 'increase' ? 'text-green-400' : 'text-red-400'}`}>
          {changeType === 'increase' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <Chip>{change}</Chip>
        </div>
      )}
    </Card>
  )
}