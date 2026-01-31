import { useState, useEffect } from 'react';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Car, Clock, Users, MessageCircle, X, Trash2, Search } from 'lucide-react'; // Added Search icon

// Firebase Imports
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

export default function Carpooling() {
  const [rides, setRides] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form States
  const [newRide, setNewRide] = useState({
    from: '',
    to: 'BMSIT Campus',
    time: '',
    seats: '1',
    price: '',
    contact: ''
  });

  // 1. REAL-TIME DATA LISTENER
  useEffect(() => {
    const q = query(collection(db, "rides"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRides(data);
    });
    return () => unsubscribe();
  }, []);

  // 2. FILTER RIDES BASED ON SEARCH
  // This filters the list if the 'from' or 'to' matches what the user typed
  const filteredRides = rides.filter(ride => 
    ride.from.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ride.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. PUBLISH RIDE
  const handlePublishRide = async () => {
    if (!newRide.from || !newRide.to || !newRide.time || !newRide.contact) {
      alert("Please fill in all ride details.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "rides"), {
        ...newRide,
        createdAt: new Date()
      });

      setLoading(false);
      setIsModalOpen(false);
      setNewRide({ from: '', to: 'BMSIT Campus', time: '', seats: '1', price: '', contact: '' });
      alert("Ride Offered Successfully!");

    } catch (error) {
      console.error("Error publishing ride:", error);
      alert("Failed to save. Check console.");
      setLoading(false);
    }
  };

  // 4. DELETE RIDE
  const handleDelete = async (id) => {
    if (window.confirm("Remove this ride offer?")) {
      await deleteDoc(doc(db, "rides", id));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Carpooling</h1>
          <p className="text-slate-500">Find a ride or fill your empty seats.</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* SEARCH BAR */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search location (e.g. Yelahanka)" 
              className="pl-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 whitespace-nowrap">
            <Car className="w-4 h-4" /> Offer Ride
          </Button>
        </div>
      </div>

      {/* Rides List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRides.length > 0 ? (
          filteredRides.map((ride) => (
            <Card key={ride.id} className="group hover:shadow-lg transition-all border-l-4 border-l-blue-500 bg-white relative">
              
              <button 
                onClick={() => handleDelete(ride.id)}
                className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                    <div className="w-0.5 h-8 bg-slate-200" />
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">From</p>
                      <p className="font-semibold text-slate-900">{ride.from}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">To</p>
                      <p className="font-semibold text-slate-900">{ride.to}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <div className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ride.time}
                  </div>
                  <div className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <Users className="w-3 h-3" /> {ride.seats} Seats
                  </div>
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                    {ride.price ? `₹${ride.price}` : "Free"}
                  </div>
                </div>

                <a 
                  href={`https://wa.me/91${ride.contact}?text=Hi, can I join your ride from ${ride.from} to ${ride.to} at ${ride.time}?`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center w-full gap-2 bg-blue-50 text-blue-700 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Request Ride
                </a>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">
            <p>No rides found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* OFFER RIDE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold">Offer a Ride</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-slate-400" /></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">From</label>
                <Input placeholder="e.g. Yelahanka" value={newRide.from} onChange={(e) => setNewRide({...newRide, from: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">To</label>
                <Input placeholder="e.g. BMSIT" value={newRide.to} onChange={(e) => setNewRide({...newRide, to: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Time</label>
                <Input type="time" value={newRide.time} onChange={(e) => setNewRide({...newRide, time: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Available Seats</label>
                <Input type="number" min="1" max="6" value={newRide.seats} onChange={(e) => setNewRide({...newRide, seats: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Price (Optional)</label>
              <Input placeholder="e.g. 50 (Leave empty for Free)" value={newRide.price} onChange={(e) => setNewRide({...newRide, price: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">WhatsApp Number</label>
              <Input type="tel" maxLength="10" placeholder="So riders can message you" value={newRide.contact} 
                onChange={(e) => {
                   const val = e.target.value;
                   if (val === '' || /^\d+$/.test(val)) setNewRide({...newRide, contact: val});
                }} 
              />
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handlePublishRide} disabled={loading}>
              {loading ? "Publishing..." : "Publish Ride"}
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}