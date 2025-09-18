import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { httpSupabaseAPI } from '../services/httpSupabaseAPI';

export default function Booking() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { item, type } = location.state; // type can be 'flight' or 'bus'

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            const form = e.target as HTMLFormElement;
            const name = form.elements.namedItem('name') as HTMLInputElement;
            const email = form.elements.namedItem('email') as HTMLInputElement;
            const phone = form.elements.namedItem('phone') as HTMLInputElement;
            await httpSupabaseAPI.createBooking(user.id, type, item.id, name.value, email.value, phone.value);
            navigate('/confirmation');
        }
    }

  return (
    <div>
      <h1 className="text-3xl font-bold">Booking</h1>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Confirm Your Booking</h2>
        <div className="mt-4">
            <p>You are booking a {type} from {item.from_city} to {item.to_city} for {item.price}.</p>
        </div>
        <form onSubmit={handleBooking} className="mt-8">
            <h3 className="text-xl font-bold">Passenger Details</h3>
            <div className="mt-4 flex flex-col gap-4">
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" className="input" />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" className="input" />
                </div>
                <div>
                    <label htmlFor="phone">Phone</label>
                    <input id="phone" type="tel" className="input" />
                </div>
            </div>
            <button type="submit" className="btn btn-primary mt-8">Confirm Booking</button>
        </form>
      </div>
    </div>
  );
}
