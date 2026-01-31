import { useState, useEffect } from 'react';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Handshake, Search, MessageCircle, ArrowRightLeft, X, Trash2, Zap, GraduationCap, Banknote } from 'lucide-react';

// Firebase Imports
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

export default function SkillsExchange() {
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form States
  const [listingType, setListingType] = useState('swap'); // 'swap' or 'paid'
  const [newPost, setNewPost] = useState({
    name: '',
    offering: '', // What I can do/teach
    seeking: '',  // What I want (only for swap)
    price: '',    // Price (only for paid)
    contact: ''
  });

  // 1. REAL-TIME LISTENER
  useEffect(() => {
    const q = query(collection(db, "skills"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSkills(data);
    });
    return () => unsubscribe();
  }, []);

  // 2. SEARCH FILTER
  const filteredSkills = skills.filter(item => 
    item.offering.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.seeking && item.seeking.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 3. PUBLISH LISTING
  const handlePublish = async () => {
    // Validation
    if (!newPost.name || !newPost.offering || !newPost.contact) {
      alert("Please fill in Name, Offering, and Contact.");
      return;
    }
    if (listingType === 'swap' && !newPost.seeking) {
      alert("Please specify what you want to learn (Seeking).");
      return;
    }
    if (listingType === 'paid' && !newPost.price) {
      alert("Please specify a Price.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "skills"), {
        ...newPost,
        type: listingType, // Saves 'swap' or 'paid'
        seeking: listingType === 'swap' ? newPost.seeking : null,
        price: listingType === 'paid' ? newPost.price : null,
        createdAt: new Date()
      });

      setLoading(false);
      setIsModalOpen(false);
      setNewPost({ name: '', offering: '', seeking: '', price: '', contact: '' });
      alert("Posted Successfully!");

    } catch (error) {
      console.error("Error publishing:", error);
      alert("Failed to save.");
      setLoading(false);
    }
  };

  // 4. DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Delete this listing?")) {
      await deleteDoc(doc(db, "skills", id));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Skills & Services</h1>
          <p className="text-slate-500">Trade skills for free OR hire student freelancers.</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Find Python, Design, Guitar..." 
              className="pl-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white gap-2 whitespace-nowrap">
            <Handshake className="w-4 h-4" /> Post New
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((item) => (
          <Card key={item.id} className={`group hover:shadow-xl transition-all border-t-4 bg-white relative overflow-hidden ${item.type === 'paid' ? 'border-t-green-500' : 'border-t-purple-500'}`}>
            
            <button 
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <CardContent className="p-6 space-y-6">
              
              {/* Profile / Name */}
              <div className="flex items-center gap-3 border-b pb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${item.type === 'paid' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                  {item.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.type === 'paid' ? 'Freelancer' : 'Student Exchange'}
                  </p>
                </div>
              </div>

              {/* The Deal */}
              <div className="space-y-3">
                
                {/* OFFERING (Always visible) */}
                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="bg-slate-200 p-1.5 rounded-full mt-0.5">
                    <Zap className="w-4 h-4 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Offering</p>
                    <p className="font-medium text-slate-900">{item.offering}</p>
                  </div>
                </div>

                {/* SEEKING or PRICE (Conditional) */}
                {item.type === 'swap' ? (
                  // SWAP MODE
                  <div className="flex items-start gap-3 bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <div className="bg-purple-200 p-1.5 rounded-full mt-0.5">
                      <GraduationCap className="w-4 h-4 text-purple-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-purple-700 uppercase">Seeking in Return</p>
                      <p className="font-medium text-slate-800">{item.seeking}</p>
                    </div>
                  </div>
                ) : (
                  // PAID MODE
                  <div className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border border-green-100">
                    <div className="bg-green-200 p-1.5 rounded-full mt-0.5">
                      <Banknote className="w-4 h-4 text-green-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-700 uppercase">Service Price</p>
                      <p className="font-bold text-lg text-green-800">₹{item.price}</p>
                    </div>
                  </div>
                )}

              </div>

              {/* WhatsApp Action */}
              <a 
                href={item.type === 'swap' 
                  ? `https://wa.me/91${item.contact}?text=Hi ${item.name}, I want to trade skills! I can teach ${item.seeking} if you teach me ${item.offering}.`
                  : `https://wa.me/91${item.contact}?text=Hi ${item.name}, I am interested in your service (${item.offering}) for ₹${item.price}.`
                }
                target="_blank"
                rel="noreferrer"
                className={`flex items-center justify-center w-full gap-2 py-3 rounded-lg font-medium transition-colors text-white ${item.type === 'paid' ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                <MessageCircle className="w-4 h-4" />
                {item.type === 'paid' ? 'Hire Now' : 'Lets Swap'}
              </a>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold">Post a Listing</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-slate-400" /></button>
            </div>

            {/* Toggle Switch */}
            <div className="flex p-1 bg-slate-100 rounded-lg">
              <button 
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${listingType === 'swap' ? 'bg-white shadow text-purple-700' : 'text-slate-500'}`}
                onClick={() => setListingType('swap')}
              >
                Skill Swap (Free)
              </button>
              <button 
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${listingType === 'paid' ? 'bg-white shadow text-green-700' : 'text-slate-500'}`}
                onClick={() => setListingType('paid')}
              >
                Paid Service
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Your Name</label>
              <Input placeholder="e.g. Rahul Sharma" value={newPost.name} onChange={(e) => setNewPost({...newPost, name: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">I am Offering (Service/Skill)</label>
              <Input placeholder="e.g. Guitar Lessons, Project Help" value={newPost.offering} onChange={(e) => setNewPost({...newPost, offering: e.target.value})} />
            </div>

            {/* CONDITIONAL INPUTS */}
            {listingType === 'swap' ? (
              <div className="space-y-1">
                <label className="text-xs font-bold text-purple-600">I Want to Learn (Seeking)</label>
                <Input placeholder="e.g. Python, Math" value={newPost.seeking} onChange={(e) => setNewPost({...newPost, seeking: e.target.value})} />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-bold text-green-600">Price (₹)</label>
                <Input type="number" placeholder="e.g. 500" value={newPost.price} onChange={(e) => setNewPost({...newPost, price: e.target.value})} />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">WhatsApp Number</label>
              <Input type="tel" maxLength="10" placeholder="10-digit number" value={newPost.contact} 
                onChange={(e) => {
                   const val = e.target.value;
                   if (val === '' || /^\d+$/.test(val)) setNewPost({...newPost, contact: val});
                }} 
              />
            </div>

            <Button className={`w-full text-white ${listingType === 'paid' ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'}`} onClick={handlePublish} disabled={loading}>
              {loading ? "Posting..." : "Post Listing"}
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}