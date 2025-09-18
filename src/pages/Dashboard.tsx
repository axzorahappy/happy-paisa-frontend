import { DollarSign, Percent, ArrowDown, ArrowUp, Phone, Receipt, Utensils, Plane } from 'lucide-react'

function StatCard({ title, amount, change, icon: Icon, changeType }: { title: string; amount: string; change?: string; icon: any; changeType?: 'increase' | 'decrease' }) {
  return (
    <div className="bg-[#2c2c2c] p-6 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold">{amount}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gray-700`}>
          <Icon className="text-white" />
        </div>
      </div>
      {change && (
        <div className={`flex items-center text-sm mt-4 ${changeType === 'increase' ? 'text-green-400' : 'text-red-400'}`}>
          {changeType === 'increase' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span>{change}</span>
        </div>
      )}
    </div>
  )
}

function QuickAction({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="bg-[#2c2c2c] p-6 rounded-lg text-center hover:bg-gray-700 cursor-pointer">
      <Icon className="mx-auto mb-4" size={32} />
      <p>{label}</p>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Balance" amount="₹12,450.75" change="+2.5% this month" icon={DollarSign} changeType="increase" />
        <StatCard title="Happy Paisa" amount="2,450 HP" change="From gaming" icon={Percent} />
        <StatCard title="Cashback" amount="₹180.50" change="This week" icon={DollarSign} />
        <StatCard title="This Month" amount="₹8,240" change="Spent" icon={ArrowDown} changeType="decrease" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <QuickAction icon={Phone} label="Recharge" />
          <QuickAction icon={Receipt} label="Pay Bills" />
          <QuickAction icon={Utensils} label="Food" />
          <QuickAction icon={Plane} label="Travel" />
        </div>
      </div>
    </div>
  )
}
