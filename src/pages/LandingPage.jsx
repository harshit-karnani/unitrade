import { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { ShoppingBag, Search, Car, Handshake, ArrowRight, TrendingUp, Users, Shield, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardContent } from "../components/ui/card";

// Firebase Imports
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

export default function LandingPage({ onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    lostFound: 0,
    rides: 0,
    skills: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    // 1. Listen to MARKETPLACE (Get Count + Top 3 Items)
    const qProducts = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(3));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      // Get the full count (Note: in production you'd use getCountFromServer, but this is fine for now)
      // We need a separate listener for total count if we limit the query, 
      // but for this prototype, let's just use a separate simple listener for counts or 
      // just assume the size represents recent activity. 
      
      // Let's do it the proper way for counts:
      // Actually, for a small student app, listening to the whole collection to get size is okay.
      // But to be efficient, let's just get the recent items here.
      
      setRecentProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 2. Listen to COUNTS (Separate listeners for the "Stats Grid")
    const unsubCountProducts = onSnapshot(collection(db, "products"), snap => 
      setStats(prev => ({ ...prev, products: snap.size }))
    );
    const unsubCountLost = onSnapshot(collection(db, "lost_found"), snap => 
      setStats(prev => ({ ...prev, lostFound: snap.size }))
    );
    const unsubCountRides = onSnapshot(collection(db, "rides"), snap => 
      setStats(prev => ({ ...prev, rides: snap.size }))
    );
    const unsubCountSkills = onSnapshot(collection(db, "skills"), snap => 
      setStats(prev => ({ ...prev, skills: snap.size }))
    );

    setLoading(false);

    // Cleanup listeners when page closes
    return () => {
      unsubProducts();
      unsubCountProducts();
      unsubCountLost();
      unsubCountRides();
      unsubCountSkills();
    };
  }, []);

  return (
    <div className="space-y-8 pb-12">
      
      {/* HERO SECTION */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-1 text-sm text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Live • Real-Time Data
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            One Portal for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
              Student Life
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-lg">
            Connect instantly. Buy gear, find lost items, and share rides with real-time updates from your campus.
          </p>
        </div>
      </div>

      {/* REAL-TIME STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Items for Sale", val: stats.products, icon: ShoppingBag, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Lost Reports", val: stats.lostFound, icon: Search, color: "text-red-600", bg: "bg-red-50" },
          { label: "Active Rides", val: stats.rides, icon: Car, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Skills Listed", val: stats.skills, icon: Handshake, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2 transition-transform hover:-translate-y-1">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.val}</p>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* FRESH ARRIVALS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Fresh in Marketplace</h2>
          <span className="text-sm text-slate-500">Latest listings from students</span>
        </div>
        
        {recentProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-slate-100 hover:shadow-lg transition-all">
                <div className="h-32 w-full overflow-hidden bg-gray-100 relative">
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-slate-700 shadow-sm">
                    NEW
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-slate-900 truncate">{product.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="font-bold text-emerald-600">{product.price}</p>
                    <a href={`https://wa.me/91${product.contact}`} target="_blank" className="text-slate-400 hover:text-emerald-600">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">
            No items listed yet. Be the first!
          </div>
        )}
      </div>

    </div>
  );
}