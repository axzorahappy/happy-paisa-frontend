import React, { useState } from 'react';
import { httpSupabaseAPI, Flight, Bus } from '../services/httpSupabaseAPI';

export default function Travel() {
    const [activeTab, setActiveTab] = useState('flights');
    const [flights, setFlights] = useState<Flight[]>([]);
    const [buses, setBuses] = useState<Bus[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFlightSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target as HTMLFormElement;
        const from = form.elements.namedItem('from') as HTMLInputElement;
        const to = form.elements.namedItem('to') as HTMLInputElement;
        const departure = form.elements.namedItem('departure') as HTMLInputElement;
        const returnDate = form.elements.namedItem('return') as HTMLInputElement;
        const results = await httpSupabaseAPI.searchFlights(from.value, to.value, departure.value, returnDate.value);
        setFlights(results);
        setLoading(false);
    }

    const handleBusSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target as HTMLFormElement;
        const from = form.elements.namedItem('from') as HTMLInputElement;
        const to = form.elements.namedItem('to') as HTMLInputElement;
        const date = form.elements.namedItem('date') as HTMLInputElement;
        const results = await httpSupabaseAPI.searchBuses(from.value, to.value, date.value);
        setBuses(results);
        setLoading(false);
    }

  return (
    <div>
      <h1 className="text-3xl font-bold">Travel</h1>
        <div className="mt-8">
            <div className="flex border-b">
                <button onClick={() => setActiveTab('flights')} className={`p-4 ${activeTab === 'flights' ? 'border-b-2 border-brand-500' : ''}`}>Flights</button>
                <button onClick={() => setActiveTab('buses')} className={`p-4 ${activeTab === 'buses' ? 'border-b-2 border-brand-500' : ''}`}>Buses</button>
            </div>
            <div className="mt-8">
                {activeTab === 'flights' && (
                    <div>
                        <h2 className="text-2xl font-bold">Search for Flights</h2>
                        <form onSubmit={handleFlightSearch} className="mt-4 flex items-end gap-4">
                            <div>
                                <label htmlFor="from">From</label>
                                <input id="from" type="text" className="input" />
                            </div>
                            <div>
                                <label htmlFor="to">To</label>
                                <input id="to" type="text" className="input" />
                            </div>
                            <div>
                                <label htmlFor="departure">Departure</label>
                                <input id="departure" type="date" className="input" />
                            </div>
                            <div>
                                <label htmlFor="return">Return</label>
                                <input id="return" type="date" className="input" />
                            </div>
                            <button type="submit" className="btn btn-primary">Search Flights</button>
                        </form>
                        <div className="mt-8">
                            {loading ? <div>Loading...</div> : (
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left">Airline</th>
                                            <th className="text-left">Price</th>
                                            <th className="text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {flights.map(flight => (
                                            <tr key={flight.id}>
                                                <td>{flight.airline}</td>
                                                <td>{flight.price}</td>
                                                <td><button className="btn btn-primary">Book</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
                {activeTab === 'buses' && (
                    <div>
                        <h2 className="text-2xl font-bold">Search for Buses</h2>
                        <form onSubmit={handleBusSearch} className="mt-4 flex items-end gap-4">
                            <div>
                                <label htmlFor="from">From</label>
                                <input id="from" type="text" className="input" />
                            </div>
                            <div>
                                <label htmlFor="to">To</label>
                                <input id="to" type="text" className="input" />
                            </div>
                            <div>
                                <label htmlFor="date">Date</label>
                                <input id="date" type="date" className="input" />
                            </div>
                            <button type="submit" className="btn btn-primary">Search Buses</button>
                        </form>
                        <div className="mt-8">
                            {loading ? <div>Loading...</div> : (
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left">Operator</th>
                                            <th className="text-left">Price</th>
                                            <th className="text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {buses.map(bus => (
                                            <tr key={bus.id}>
                                                <td>{bus.bus_operator}</td>
                                                <td>{bus.price}</td>
                                                <td><button className="btn btn-primary">Book</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
