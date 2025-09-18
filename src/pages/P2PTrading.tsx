import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { httpSupabaseAPI, P2POffer } from '../services/httpSupabaseAPI';

export default function P2PTrading() {
  const [offers, setOffers] = useState<P2POffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    httpSupabaseAPI.getP2POffers()
      .then(setOffers)
      .finally(() => setLoading(false));
  }, []);

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await httpSupabaseAPI.createP2POffer(user.id, type as 'buy' | 'sell', parseInt(amount), parseFloat(price));
      setAmount('');
      setPrice('');
      // Refresh offers
      httpSupabaseAPI.getP2POffers().then(setOffers);
    }
  }

  const handleAcceptOffer = async (offerId: string) => {
      if (user) {
          await httpSupabaseAPI.acceptP2POffer(offerId, user.id);
          // Refresh offers
          httpSupabaseAPI.getP2POffers().then(setOffers);
      }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">P2P Trading</h1>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Create a New Offer</h2>
        <form onSubmit={handleCreateOffer} className="mt-4 flex items-end gap-4">
            <div>
                <label htmlFor="type">Type</label>
                <select id="type" value={type} onChange={e => setType(e.target.value)} className="input">
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                </select>
            </div>
            <div>
                <label htmlFor="amount">Amount (HC)</label>
                <input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input" />
            </div>
            <div>
                <label htmlFor="price">Price (USD/HC)</label>
                <input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} className="input" />
            </div>
            <button type="submit" className="btn btn-primary">Create Offer</button>
        </form>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Open Offers</h2>
        <table className="w-full mt-4">
          <thead>
            <tr>
              <th className="text-left">Type</th>
              <th className="text-left">Amount (HC)</th>
              <th className="text-left">Price (USD/HC)</th>
              <th className="text-left">User</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(offer => (
              <tr key={offer.id}>
                <td>{offer.type}</td>
                <td>{offer.amount}</td>
                <td>{offer.price}</td>
                <td>{offer.user_id}</td>
                <td>
                  <button onClick={() => handleAcceptOffer(offer.id)} className="btn btn-primary">{offer.type === 'buy' ? 'Sell' : 'Buy'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
