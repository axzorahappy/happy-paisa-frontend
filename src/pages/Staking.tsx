import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { httpSupabaseAPI, StakingPosition } from '../services/httpSupabaseAPI';

export default function Staking() {
  const [positions, setPositions] = useState<StakingPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(7);
  const [apy, setApy] = useState(5);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      httpSupabaseAPI.getStakingPositions(user.id)
        .then(setPositions)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await httpSupabaseAPI.createStakingPosition(user.id, parseInt(amount), duration, apy);
      setAmount('');
      // Refresh positions
      httpSupabaseAPI.getStakingPositions(user.id).then(setPositions);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Staking</h1>
      <div className="mt-8">
          <h2 className="text-2xl font-bold">Create a New Staking Position</h2>
          <form onSubmit={handleStake} className="mt-4 flex items-end gap-4">
            <div>
                <label htmlFor="amount">Amount (HC)</label>
                <input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input" />
            </div>
            <div>
                <label htmlFor="duration">Duration (days)</label>
                <select id="duration" value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="input">
                    <option value={7}>7</option>
                    <option value={30}>30</option>
                    <option value={90}>90</option>
                </select>
            </div>
            <div>
                <label htmlFor="apy">APY (%)</label>
                <input id="apy" type="number" value={apy} onChange={e => setApy(parseInt(e.target.value))} className="input" readOnly />
            </div>
            <button type="submit" className="btn btn-primary">Stake</button>
          </form>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Your Staking Positions</h2>
        <table className="w-full mt-4">
          <thead>
            <tr>
              <th className="text-left">Amount</th>
              <th className="text-left">APY</th>
              <th className="text-left">Duration</th>
              <th className="text-left">Matures At</th>
              <th className="text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {positions.map(position => (
              <tr key={position.id}>
                <td>{position.happy_coins}</td>
                <td>{position.apy_rate}%</td>
                <td>{position.duration_days} days</td>
                <td>{new Date(position.matures_at).toLocaleDateString()}</td>
                <td>{position.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
