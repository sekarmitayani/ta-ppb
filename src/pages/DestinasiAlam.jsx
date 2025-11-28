import React, { useState, useMemo } from 'react';
import { useDestinations } from '../hooks/useDestination';
import { Link } from 'react-router-dom';
import { MapPin, Search, Star } from 'lucide-react'; // Added Star

export default function DestinasiAlam() {
  const { destinations, loading } = useDestinations('Alam');

  const [searchTerm, setSearchTerm] = useState('');
  // Default sort bisa diubah ke rating-desc jika ingin rating tertinggi duluan
  const [sortBy, setSortBy] = useState('rating-desc'); 

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

    // Helper untuk parsing harga
    const parsePrice = (price) => {
      if (!price) return 0;
      const num = String(price).replace(/[^0-9]/g, '');
      return Number(num) || 0;
    };

    // 2. Sorting Logic
    data.sort((a, b) => {
      switch (sortBy) {
        case 'rating-desc': // Logika baru: Rating Tertinggi
          return (b.rating || 0) - (a.rating || 0);
        case 'price-asc':
          return parsePrice(a.price) - parsePrice(b.price);
        case 'price-desc':
          return parsePrice(b.price) - parsePrice(a.price);
        case 'name-asc':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

    return data;
  }, [destinations, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header + Search + Sort */}
      <div className="bg-white top-0 z-10 px-4 py-4 mb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 inline-block border-b-2 border-teal-100 pb-2">
              Destinasi Alam
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Cari nama atau lokasi..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Dropdown Sort */}
            <select
              className="sm:w-48 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating-desc">Rating Tertinggi</option> {/* Added Option */}
              <option value="name-asc">Nama A-Z</option>
              <option value="price-asc">Harga Termurah</option>
              <option value="price-desc">Harga Termahal</option>
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
                {/* Image Wrapper */}
                <div className="relative h-48 overflow-hidden">
                   <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {/* Title & Rating Row */}
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-gray-800 text-lg leading-tight truncate flex-1">
                      {item.name}
                    </h3>
                    {/* Rating Badge */}
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100 shrink-0">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-yellow-700">{item.rating}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin size={14} className="mr-1 text-teal-500" /> 
                    <span className="truncate">{item.location}</span>
                  </div>

                  {/* Price */}
                  <div className="pt-3 border-t border-dashed border-gray-100 flex justify-between items-center">
                     <span className="text-xs text-gray-400">Tiket Masuk</span>
                     <span className="font-bold text-teal-600">{item.price}</span>
                  </div>
                </div>
              </Link>
            ))
          )}

          {!loading && visibleDestinations.length === 0 && (
            <div className="text-center text-gray-500 mt-10 col-span-full py-10 bg-white rounded-xl border border-dashed border-gray-300">
              <p>Tidak menemukan wisata alam yang cocok.</p>
              <p className="text-sm mt-1">Coba ubah kata kunci atau urutan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}