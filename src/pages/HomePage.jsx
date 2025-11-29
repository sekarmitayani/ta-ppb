import React, { useState, useMemo } from 'react';
import { useDestination } from '../hooks/useDestination.js';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, Search } from 'lucide-react';

export default function HomePage() {
  const { destinations, loading } = useDestination('Semua');

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating-desc');

  const visibleDestinations = useMemo(() => {
    if (!destinations) return [];

    let data = [...destinations];

    const q = searchTerm.trim().toLowerCase();
    if (q) {
      data = data.filter((item) => {
        return (
          (item.name && item.name.toLowerCase().includes(q)) ||
          (item.location && item.location.toLowerCase().includes(q))
        );
      });
    }

    const parsePrice = (price) => {
      if (!price) return 0;
      const num = String(price).replace(/[^0-9]/g, '');
      return Number(num) || 0;
    };

    data.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': return (a.name || '').localeCompare(b.name || '');
        case 'price-asc': return parsePrice(a.price) - parsePrice(b.price);
        case 'price-desc': return parsePrice(b.price) - parsePrice(a.price);
        case 'rating-asc': return (a.rating || 0) - (b.rating || 0);
        case 'rating-desc': default: return (b.rating || 0) - (a.rating || 0);
      }
    });

    return data;
  }, [destinations, searchTerm, sortBy]);

  return (
    <div>
      {/* --- HERO SECTION --- */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-16 mb-12 md:mb-20 mt-2 md:mt-10">
        
        {/* Kolom Kiri: Teks */}
        <div className="flex-1 text-center md:text-left">
          <span className="text-teal-600 font-bold tracking-wide text-xs md:text-sm uppercase bg-teal-50 px-3 py-1 rounded-full mb-3 mt-6 inline-block shadow-sm">
            Wonderful Indonesia
          </span>
          
          <h1 className="text-3xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-4 md:mb-6">
            Jelajahi Surga <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">Tersembunyi</span>
          </h1>
          
          <p className="text-gray-500 mb-6 leading-relaxed max-w-lg mx-auto md:mx-0 text-sm md:text-lg px-2 md:px-0">
            Temukan ribuan destinasi autentik dari seluruh Nusantara. 
            Mulai petualanganmu sekarang dan ciptakan kenangan tak terlupakan.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={() => document.getElementById('explore').scrollIntoView({behavior: 'smooth'})} 
              className="bg-teal-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-base shadow-xl shadow-teal-200 hover:bg-teal-700 hover:-translate-y-1 transition transform flex items-center justify-center gap-2"
            >
              Mulai Jelajah <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Gambar */}
        {/* PERBAIKAN: Ditambahkan 'pb-10' agar gambar yang diturunkan (translate-y-6) tidak kepotong bawahnya */}
        <div className="flex-1 w-full relative overflow-hidden rounded-3xl p-2 md:p-0 pb-10">
          <div className="grid grid-cols-2 gap-3 relative z-10">
            {/* Kolom Gambar 1 (Turun ke bawah) */}
            <div className="space-y-3 transform translate-y-6">
               <img 
                 src="https://images.pexels.com/photos/19160388/pexels-photo-19160388.jpeg" 
                 className="w-full h-44 md:h-56 object-cover rounded-2xl shadow-lg hover:scale-105 transition duration-500" 
                 alt="Labuan Bajo" 
               />
               <img 
                 src="https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=600&q=80" 
                 className="w-full h-44 md:h-56 object-cover rounded-2xl shadow-lg hover:scale-105 transition duration-500" 
                 alt="Raja Ampat" 
               />
            </div>
            
            {/* Kolom Gambar 2 (Normal) */}
            <div className="space-y-3">
               <img 
                 src="https://images.unsplash.com/photo-1643785879506-ec3e637a9f2d?q=80" 
                 className="w-full h-44 md:h-56 object-cover rounded-2xl shadow-lg hover:scale-105 transition duration-500" 
                 alt="Waerebo" 
               />
               <img 
                 src="https://images.unsplash.com/photo-1620549146396-9024d914cd99?q=80" 
                 className="w-full h-44 md:h-56 object-cover rounded-2xl shadow-lg hover:scale-105 transition duration-500" 
                 alt="Borobudur" 
               />
            </div>
          </div>
          
          {/* Background Blur Effect */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-teal-50 rounded-full blur-3xl opacity-50"></div>
        </div>
      </section>

      {/* --- LIST WISATA --- */}
      <div id="explore" className="pt-4 px-2">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-gray-900">Destinasi Populer</h2>
            <p className="text-gray-500 mt-1 text-sm md:text-base">Pilihan favorit traveler bulan ini.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari destinasi..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="sm:w-48 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating-desc">Rating tertinggi</option>
              <option value="rating-asc">Rating terendah</option>
              <option value="price-asc">Harga termurah</option>
              <option value="price-desc">Harga termahal</option>
              <option value="name-asc">Nama A-Z</option>
            </select>
          </div>
        </div>

        {/* Grid Card */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
             {[1,2,3,4].map(i => <div key={i} className="bg-gray-100 h-64 rounded-3xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleDestinations.map((item) => (
              <Link to={`/detail/${item.id}`} key={item.id} className="group bg-white rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden block">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-md text-teal-800 text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-sm">{item.category}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-lg mb-0.5 leading-tight truncate">{item.name}</h3>
                    <div className="flex items-center text-[10px] font-medium text-gray-200">
                      <MapPin size={12} className="mr-1" /> {item.location}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" /> 
                      <span className="text-xs font-bold text-yellow-700">{item.rating}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">/ 5.0</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-200">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Tiket</p>
                      <span className="text-teal-600 font-bold text-sm">{item.price}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && visibleDestinations.length === 0 && (
          <div className="py-20 text-center text-gray-500">
             <p>Tidak ada destinasi ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}