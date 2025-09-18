import { StatCard } from '../StatCard';
import { useStore } from '../../lib/useStore';
import { DollarSign } from 'lucide-react';

export function AccountBalanceWidget() {
  const store = useStore();
  const { accountBalance } = store;

  if (!accountBalance) {
    return <div>Loading...</div>;
  }

  return (
    <StatCard
      title="Total Balance"
      amount={`₹${accountBalance.balance.toFixed(2)}`}
      change={`${accountBalance.change}% this month`}
      icon={DollarSign}
      changeType={accountBalance.change > 0 ? 'increase' : 'decrease'}
    />
  );
}
