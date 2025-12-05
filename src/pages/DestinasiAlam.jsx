import React, { useState, useMemo, useEffect } from 'react';
import { useDestinations } from '../hooks/useDestination';
import { Link } from 'react-router-dom';
import { MapPin, Search, Star, Filter, X } from 'lucide-react';

export default function DestinasiAlam() {
  const { destinations, loading } = useDestinations('Alam');

  // State untuk Search & Sort
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating-desc');

  // State untuk Filter Harga
  const [showFilter, setShowFilter] = useState(false); // Toggle tampilan filter
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000); // Default max 5 juta
  const [limitMax, setLimitMax] = useState(10000000); // Batas atas slider (dinamis)

  // Helper: Parsing Harga "Rp 30.000" -> 30000 (Number)
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const num = String(priceStr).replace(/[^0-9]/g, '');
    return parseInt(num, 10) || 0;
  };

  // Effect: Set batas slider otomatis berdasarkan harga termahal di database
  useEffect(() => {
    if (destinations && destinations.length > 0) {
      const prices = destinations.map(d => parsePrice(d.price));
      const highest = Math.max(...prices);
      setLimitMax(highest > 0 ? highest : 5000000);
      setMaxPrice(highest > 0 ? highest : 5000000); // Set default filter ke max
    }
  }, [destinations]);

  // Logic Filtering & Sorting
  const visibleDestinations = useMemo(() => {
    if (!destinations) return [];

    let data = [...destinations];
    const q = searchTerm.trim().toLowerCase();

    // 1. Filter Search
    if (q) {
      data = data.filter((item) =>
        (item.name || '').toLowerCase().includes(q) ||
        (item.location || '').toLowerCase().includes(q)
      );
    }

    // 2. Filter Harga (Range)
    data = data.filter((item) => {
      const price = parsePrice(item.price);
      return price >= minPrice && price <= maxPrice;
    });

    // 3. Sorting Logic
    data.sort((a, b) => {
      const priceA = parsePrice(a.price);
      const priceB = parsePrice(b.price);

      switch (sortBy) {
        case 'rating-desc': return (b.rating || 0) - (a.rating || 0);
        case 'price-asc': return priceA - priceB;
        case 'price-desc': return priceB - priceA;
        case 'name-asc': default: return (a.name || '').localeCompare(b.name || '');
      }
    });

    return data;
  }, [destinations, searchTerm, sortBy, minPrice, maxPrice]);

  // Formatter Rupiah untuk tampilan label
  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header + Controls */}
      <div className="bg-white top-0 z-10 px-4 py-4 mb-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Title Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 border-b-2 border-teal-100 pb-2 inline-block">
              Destinasi Alam
            </h1>
            
            {/* Search & Filter Toggle */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari lokasi..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition ${showFilter ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                <Filter size={16} /> Filter Harga
              </button>
            </div>
          </div>

          {/* AREA FILTER HARGA (Expandable) */}
          {showFilter && (
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-700 text-sm">Rentang Harga (Budget)</h3>
                <button onClick={() => setShowFilter(false)}><X size={16} className="text-gray-400 hover:text-red-500" /></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Manual Inputs */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Min (Rp)</label>
                    <input 
                      type="number" 
                      value={minPrice} 
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <span className="text-gray-400 mt-4">-</span>
                  <div className="flex-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Max (Rp)</label>
                    <input 
                      type="number" 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Slider Control */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>Rp 0</span>
                    <span>Max: {formatRupiah(maxPrice)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max={limitMax} 
                    step="50000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <p className="text-[10px] text-gray-400 text-right">Geser untuk set batas atas</p>
                </div>
              </div>
            </div>
          )}

          {/* Sort Dropdown (Pindah ke bawah filter agar rapi) */}
          <div className="flex justify-end mt-2">
             <select
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none text-gray-600"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating-desc">⭐ Rating Tertinggi</option>
                <option value="price-asc">💰 Harga Termurah</option>
                <option value="price-desc">💎 Harga Termahal</option>
                <option value="name-asc">🔤 Nama A-Z</option>
              </select>
          </div>
        </div>
      </div>

      {/* List Content */}
      <div className="px-4 max-w-7xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            <div className="text-center mt-10 col-span-full">Loading data...</div>
          ) : (
            visibleDestinations.map((item) => (
              <Link
                to={`/detail/${item.id}`}
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 block hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                   <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-gray-800 text-lg leading-tight truncate flex-1">{item.name}</h3>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md border shrink-0 ${Number(item.rating) > 0 ? "bg-yellow-50 border-yellow-100" : "bg-teal-50 border-teal-100"}`}>
                       {Number(item.rating) > 0 ? (
                        <>
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-bold text-yellow-700">{item.rating}</span>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wide">Baru</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-3"><MapPin size={14} className="mr-1 text-teal-500" /> <span className="truncate">{item.location}</span></div>
                   <div className="pt-3 border-t border-dashed border-gray-100 flex justify-between items-center"><span className="text-xs text-gray-400">Tiket Masuk</span><span className="font-bold text-teal-600">{item.price}</span></div>
                </div>
              </Link>
            ))
          )}

          {!loading && visibleDestinations.length === 0 && (
            <div className="text-center text-gray-500 mt-10 col-span-full py-10 bg-white rounded-xl border border-dashed border-gray-300">
              <p>Tidak menemukan destinasi dengan kriteria ini.</p>
              <button onClick={() => {setMinPrice(0); setMaxPrice(limitMax);}} className="text-teal-600 text-sm font-bold mt-2 hover:underline">Reset Filter</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}