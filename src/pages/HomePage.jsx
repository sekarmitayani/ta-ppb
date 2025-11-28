import React, { useState, useMemo } from 'react';
import { useDestination } from '../hooks/useDestination.js';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, Compass, Search } from 'lucide-react';

export default function HomePage() {
  const { destinations, loading } = useDestination('Semua');

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating-desc'); // default: rating tertinggi

  const visibleDestinations = useMemo(() => {
    if (!destinations) return [];

    let data = [...destinations];

    // FILTER SEARCH: cek di nama & lokasi
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      data = data.filter((item) => {
        return (
          item.name?.toLowerCase().includes(q) ||
          item.location?.toLowerCase().includes(q)
        );
      });
    }

    // Helper parse harga (ambil angka saja)
    const parsePrice = (price) => {
      if (!price) return 0;
      const num = String(price).replace(/[^0-9]/g, '');
      return Number(num) || 0;
    };

    // SORT
    data.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'price-asc':
          return parsePrice(a.price) - parsePrice(b.price);
        case 'price-desc':
          return parsePrice(b.price) - parsePrice(a.price);
        case 'rating-asc':
          return (a.rating || 0) - (b.rating || 0);
        case 'rating-desc':
        default:
          return (b.rating || 0) - (a.rating || 0);
      }
    });

    return data;
  }, [destinations, searchTerm, sortBy]);

  return (
    <div>
      {/* --- HERO SECTION MODERN --- */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16 mb-20 mt-4 md:mt-10">
        
        {/* Kolom Kiri: Teks & Ajakan */}
        <div className="flex-1 text-center md:text-left">
          <span className="text-teal-600 font-bold tracking-wide text-sm uppercase bg-teal-50 px-3 py-1 rounded-full mb-4 mt-10 inline-block shadow-sm">
            Wonderful Indonesia
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Jelajahi Surga <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">Tersembunyi</span>
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0 text-base md:text-lg">
            Temukan ribuan destinasi autentik dari seluruh Nusantara. 
            Mulai petualanganmu sekarang dan ciptakan kenangan tak terlupakan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={() => document.getElementById('explore').scrollIntoView({behavior: 'smooth'})} 
              className="bg-teal-600 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-teal-200 hover:bg-teal-700 hover:-translate-y-1 transition transform flex items-center justify-center gap-2"
            >
              Mulai Jelajah <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Gambar Kolase Estetik */}
        <div className="flex-1 w-full relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 transform translate-y-8">
               <img src="https://images.pexels.com/photos/19160388/pexels-photo-19160388.jpeg" className="w-full h-40 md:h-56 object-cover rounded-3xl shadow-lg hover:scale-105 transition duration-500" alt="Labuan Bajo" />
               <img src="https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=600&q=80" className="w-full h-32 md:h-40 object-cover rounded-3xl shadow-lg hover:scale-105 transition duration-500" alt="Raja Ampat" />
            </div>
            <div className="space-y-4">
               <img src="https://images.unsplash.com/photo-1643785879506-ec3e637a9f2d?q=80" className="w-full h-32 md:h-40 object-cover rounded-3xl shadow-lg hover:scale-105 transition duration-500" alt="Waerebo" />
               <img src="https://images.unsplash.com/photo-1620549146396-9024d914cd99?q=80" className="w-full h-40 md:h-56 object-cover rounded-3xl shadow-lg hover:scale-105 transition duration-500" alt="Borobudur" />
            </div>
          </div>
          {/* Elemen Dekoratif Blob */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-50 rounded-full blur-3xl opacity-50"></div>
        </div>
      </section>

      {/* --- BAGIAN DAFTAR WISATA --- */}
      <div id="explore" className="pt-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Destinasi Populer</h2>
            <p className="text-gray-500 mt-2">Pilihan favorit para traveler bulan ini.</p>
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari destinasi atau lokasi..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="sm:w-48 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
             {[1,2,3,4].map(i => <div key={i} className="bg-gray-100 h-80 rounded-3xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {visibleDestinations.map((item) => (
              <Link to={`/detail/${item.id}`} key={item.id} className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                
                {/* Bagian Gambar Card */}
                <div className="relative h-64 overflow-hidden">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                  
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-teal-800 text-[10px] uppercase font-bold px-3 py-1.5 rounded-full shadow-sm">{item.category}</span>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-xl mb-1 drop-shadow-md leading-tight truncate">{item.name}</h3>
                    <div className="flex items-center text-xs font-medium text-gray-200">
                      <MapPin size={14} className="mr-1" /> {item.location}
                    </div>
                  </div>
                </div>

                {/* Bagian Info Card */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" /> 
                      <span className="text-sm font-bold text-yellow-700">{item.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">/ 5.0 Rating</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-200">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tiket Masuk</p>
                      <span className="text-teal-600 font-bold text-lg">{item.price}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Tampilan Jika Data Kosong */}
        {!loading && visibleDestinations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 text-center px-4">
            <div className="bg-white p-4 rounded-full mb-4 shadow-sm animate-bounce">
                <Compass size={40} className="text-teal-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Tidak menemukan destinasi</h3>
            <p className="text-gray-500 mb-2 font-medium max-w-md mx-auto leading-relaxed">
              Coba ubah kata kunci pencarian atau atur ulang opsi pengurutan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
