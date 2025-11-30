// src/pages/Favorite.jsx
import React, { useContext, useEffect } from "react";
import { useFavorites } from "../hooks/useDestination";
import { Link } from "react-router-dom";
import { MapPin, Star, User as UserIcon } from "lucide-react";
import { UserContext } from "../App";

// Pastikan ada kata 'export default' di sini!
export default function Favorite() {
  const { user } = useContext(UserContext);

  // Guest = belum punya uid
  const isGuest = !user || !user.uid;

  // Ambil function 'refresh' dari hook
  const { favorites, loading, refresh } = useFavorites(isGuest ? null : user.uid);

  // --- AUTO REFRESH ---
  // Memaksa ambil data terbaru saat halaman dibuka agar Rating Bintang muncul
  useEffect(() => {
    if (!isGuest && refresh) {
      refresh();
    }
  }, [isGuest, refresh]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <div className="bg-white top-0 z-10 px-4 py-4 mb-6">
        <div className="flex flex-col gap-1 max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 border-b-2 border-teal-100 pb-2 inline-block w-fit">
            Destinasi Favorit
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            {isGuest
              ? "Mode Tamu (Read Only)"
              : `Menampilkan daftar keinginan ${user.name}`}
          </p>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="max-w-7xl mx-auto px-4"> 
        
        {/* View Tamu */}
        {isGuest && (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 mx-auto max-w-2xl">
            <div className="bg-white p-6 rounded-full shadow-sm mb-6">
              <UserIcon className="text-gray-300" size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Akses Terbatas
            </h3>
            <p className="text-gray-400 text-center max-w-md px-6 mb-6">
              Saat ini kamu dalam <b>Mode Tamu</b> sehingga tidak bisa menyimpan
              favorit. Silakan buka menu <b>Profil</b> dan ubah nama kamu untuk
              mengaktifkan fitur ini.
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-teal-200 hover:bg-teal-700 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <UserIcon size={18} />
              Buka Profil & Aktifkan
            </Link>
          </div>
        )}

        {/* Loading */}
        {!isGuest && loading && (
          <p className="text-center text-gray-500 py-10">Memuat...</p>
        )}

        {/* Kosong */}
        {!isGuest && favorites.length === 0 && !loading && (
          <div className="text-center py-24 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 mx-2">
            <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <MapPin className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-700">
              Belum ada favorit
            </h3>
            <p className="text-gray-400 mt-1 text-sm">
              Simpan destinasi impianmu di sini.
            </p>
            <Link
              to="/kategori/alam"
              className="mt-6 inline-block text-teal-600 font-bold hover:underline"
            >
              Jelajahi Wisata Alam →
            </Link>
          </div>
        )}

        {/* Grid Card Favorit */}
        {!isGuest && favorites.length > 0 && !loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((item) => {
              // Helper Rating
              const ratingVal = Number(item.rating);
              const hasRating = ratingVal > 0;

              return (
                <Link
                  to={`/detail/${item.destination_id}`} 
                  key={item.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 block hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    {/* Header: Title + Rating */}
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="font-bold text-gray-800 text-lg leading-tight truncate flex-1">
                        {item.name}
                      </h3>
                      
                      {/* RATING DINAMIS */}
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-md border shrink-0 ${hasRating ? "bg-yellow-50 border-yellow-100" : "bg-teal-50 border-teal-100"}`}>
                        {hasRating ? (
                          <>
                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold text-yellow-700">{item.rating}</span>
                          </>
                        ) : (
                          <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wide">Baru</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <MapPin size={14} className="mr-1 text-teal-500" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    <div className="pt-3 border-t border-dashed border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-400">Tiket Masuk</span>
                      <span className="font-bold text-teal-600">
                        {item.price}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}