import { useState, useEffect } from 'react';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
// REMOVED the broken Textarea import
import { Search, MapPin, Calendar, X, Camera, MessageCircle, AlertTriangle, CheckCircle } from 'lucide-react';

// Firebase Imports
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

export default function LostFound() {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form States
  const [newItem, setNewItem] = useState({ 
    type: 'Lost', // Default to 'Lost'
    title: '', 
    location: '', 
    date: '', 
    contact: '', 
    description: '' 
  });
  const [imageBase64, setImageBase64] = useState(null); 

  // 1. REAL-TIME DATA LISTENER
  useEffect(() => {
    const q = query(collection(db, "lost_found"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    });
    return () => unsubscribe();
  }, []);

  // 2. IMAGE COMPRESSOR
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = document.createElement('img');
    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        setImageBase64(compressedBase64);
      };
    };
    reader.readAsDataURL(file);
  };

  // 3. SUBMIT NEW REPORT
  const handleSubmit = async () => {
    // Basic validation
    if (!newItem.title || !newItem.location || !newItem.contact || !imageBase64) {
      alert("Please fill in the Item Name, Location, Contact, and Photo.");
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(db, "lost_found"), {
        ...newItem,
        image: imageBase64, 
        createdAt: new Date()
      });

      setLoading(false);
      setIsModalOpen(false);
      // Reset form
      setNewItem({ type: 'Lost', title: '', location: '', date: '', contact: '', description: '' });
      setImageBase64(null);
      alert("Report Posted Successfully!");

    } catch (error) {
      console.error("Error posting:", error);
      alert("Failed to save. Check console.");
      setLoading(false);
    }
  };

  // 4. DELETE FUNCTION
  const handleDelete = async (id) => {
    if (window.confirm("Delete this report?")) {
      await deleteDoc(doc(db, "lost_found", id));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Lost & Found</h1>
          <p className="text-slate-500">Report lost items or help return found ones.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white gap-2">
          <AlertTriangle className="w-4 h-4" /> Report Item
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden group hover:shadow-xl transition-all border border-slate-100 bg-white flex flex-col justify-between">
            
            {/* Image Section */}
            <div className="h-48 w-full overflow-hidden relative bg-gray-100">
              <button 
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 left-2 bg-slate-900 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="w-3 h-3" />
              </button>

              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
              )}
              
              {/* STATUS BADGE */}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-white shadow-sm flex items-center gap-1 ${item.type === 'Lost' ? 'bg-red-500' : 'bg-green-500'}`}>
                {item.type === 'Lost' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                {item.type.toUpperCase()}
              </div>
            </div>

            {/* Info Section */}
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 truncate text-lg">{item.title}</h3>
                <div className="flex items-center text-sm text-slate-500 gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {item.location}
                </div>
                <div className="flex items-center text-sm text-slate-500 gap-1">
                  <Calendar className="w-3 h-3" /> {item.date || "Date unknown"}
                </div>
                {/* Show description if it exists */}
                {item.description && (
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{item.description}</p>
                )}
              </div>

              {/* WHATSAPP BUTTON */}
              <a 
                href={`https://wa.me/91${item.contact}?text=Hi, I saw your post about the ${item.title} on UniTrade Lost & Found.`}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center justify-center w-full gap-2 py-2 rounded-lg font-medium transition-colors ${item.type === 'Lost' ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
              >
                <MessageCircle className="w-4 h-4" />
                {item.type === 'Lost' ? 'I Found It!' : 'That is Mine!'}
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* REPORT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold">Report an Item</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-slate-400" /></button>
            </div>

            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                className={`p-2 rounded-lg font-bold border-2 ${newItem.type === 'Lost' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-100 text-slate-400'}`}
                onClick={() => setNewItem({...newItem, type: 'Lost'})}
              >
                LOST SOMETHING
              </button>
              <button 
                className={`p-2 rounded-lg font-bold border-2 ${newItem.type === 'Found' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-100 text-slate-400'}`}
                onClick={() => setNewItem({...newItem, type: 'Found'})}
              >
                FOUND SOMETHING
              </button>
            </div>

            <Input placeholder="Item Name (e.g. Blue Water Bottle)" value={newItem.title}
              onChange={(e) => setNewItem({...newItem, title: e.target.value})} />
            
            <Input placeholder="Location (e.g. Library, 2nd Floor)" value={newItem.location}
              onChange={(e) => setNewItem({...newItem, location: e.target.value})} />

            <Input type="date" value={newItem.date}
              onChange={(e) => setNewItem({...newItem, date: e.target.value})} />

            <Input type="tel" maxLength="10" placeholder="Your WhatsApp Number" value={newItem.contact}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^\d+$/.test(val)) setNewItem({...newItem, contact: val});
              }} />

            {/* Replaced broken Textarea component with standard HTML textarea */}
            <textarea
              className="w-full rounded-md border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              rows="3"
              placeholder="Description (Optional details...)"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            />

            {/* Image Upload */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 relative hover:bg-slate-50">
              <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} />
              {imageBase64 ? (
                <img src={imageBase64} alt="Preview" className="h-32 object-contain" />
              ) : (
                <><Camera className="w-8 h-8 text-slate-400" /><p className="text-sm text-slate-500">Upload Photo</p></>
              )}
            </div>

            <Button className="w-full bg-slate-900 text-white" onClick={handleSubmit} disabled={loading}>
              {loading ? "Posting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}