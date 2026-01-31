import { useState, useEffect } from 'react';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, ShoppingBag, X, Camera, MessageCircle, Phone } from 'lucide-react'; // Added Icons

// Firebase Imports
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form States: Added 'contact'
  const [newItem, setNewItem] = useState({ title: '', price: '', category: '', contact: '' });
  const [imageBase64, setImageBase64] = useState(null); 

  // 1. REAL-TIME DATA LISTENER
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
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

  // 3. HANDLE SELLING AN ITEM
  const handleSellItem = async () => {
    // Validate everything
    if (!newItem.title || !newItem.price || !newItem.contact || !imageBase64) {
      alert("Please fill all fields, including Contact Number!");
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        title: newItem.title,
        price: "₹" + newItem.price,
        category: newItem.category || "General",
        contact: newItem.contact, // <--- SAVING PHONE NUMBER
        image: imageBase64, 
        createdAt: new Date()
      });

      setLoading(false);
      setIsSellModalOpen(false);
      setNewItem({ title: '', price: '', category: '', contact: '' });
      setImageBase64(null);
      alert("Item Listed Successfully!");

    } catch (error) {
      console.error("Error listing item:", error);
      alert("Failed to save. Check console.");
      setLoading(false);
    }
  };

  // 4. DELETE ITEM FUNCTION (Cleanup)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteDoc(doc(db, "products", id));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
        <Button onClick={() => setIsSellModalOpen(true)} className="bg-slate-900 text-white">
          <ShoppingBag className="w-4 h-4 mr-2" /> Sell Item
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden group hover:shadow-xl transition-all border border-slate-100 bg-white flex flex-col justify-between">
            
            {/* Image Section */}
            <div className="h-48 w-full overflow-hidden relative bg-gray-100">
              <button 
                onClick={() => handleDelete(product.id)}
                className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Delete Item"
              >
                <X className="w-3 h-3" />
              </button>

              {product.image ? (
                <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
              )}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">
                {product.category}
              </div>
            </div>

            {/* Info Section */}
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 truncate">{product.title}</h3>
                <p className="text-lg font-bold text-green-600">{product.price}</p>
              </div>

              {/* WHATSAPP BUTTON */}
              <a 
                href={`https://wa.me/91${product.contact}?text=Hi, I am interested in buying your ${product.title} listed on UniTrade.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-full gap-2 bg-green-100 text-green-700 py-2 rounded-lg font-medium hover:bg-green-200 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat to Buy
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SELL ITEM MODAL */}
      {isSellModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold">Sell an Item</h2>
              <button onClick={() => setIsSellModalOpen(false)}><X className="w-6 h-6 text-slate-400" /></button>
            </div>

            <Input placeholder="Item Name (e.g. Drafter)" value={newItem.title}
              onChange={(e) => setNewItem({...newItem, title: e.target.value})} />
            
            <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Price (₹)" value={newItem.price}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^\d+$/.test(val)) setNewItem({...newItem, price: val});
              }} />

            <Input placeholder="Category (e.g. Books)" value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})} />

            {/* NEW CONTACT FIELD */}
            <Input 
              type="tel" 
              maxLength="10"
              placeholder="Your WhatsApp Number (10 digits)" 
              value={newItem.contact}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^\d+$/.test(val)) setNewItem({...newItem, contact: val});
              }} 
            />

            {/* Image Upload */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 relative hover:bg-slate-50 overflow-hidden">
              <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} />
              {imageBase64 ? (
                <img src={imageBase64} alt="Preview" className="h-32 object-contain" />
              ) : (
                <><Camera className="w-8 h-8 text-slate-400" /><p className="text-sm text-slate-500">Click to Upload Photo</p></>
              )}
            </div>

            <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleSellItem} disabled={loading}>
              {loading ? "Listing..." : "List Item Now"}
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}