// src/pages/DetailPage.jsx
import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDestinationDetail, useFavorites } from "../hooks/useDestination";
import { toggleFavorite } from "../services/destinationService";
import { ChevronLeft, MapPin, Star, Heart } from "lucide-react";
import { UserContext } from "../App";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const userId = user?.uid || null;

  const { destination, loading } = useDestinationDetail(id);
  const { favorites, refresh: refreshFavorites } = useFavorites(userId);

  const [isFav, setIsFav] = useState(false);

  // Sync icon favorit dengan data favorites dari Supabase
  useEffect(() => {
    if (!destination || !favorites) return;

    // Convert destination.id to integer for comparison with int8 destination_id
    const destIdInt = typeof destination.id === 'number' ? destination.id : parseInt(destination.id) || 0;

    const match = favorites.some((fav) => {
      const favId = fav.destination_id;
      return favId === destIdInt || favId === destination.destination_id;
    });

    setIsFav(match);
  }, [favorites, destination]);

  const handleFavorite = async () => {
    // Cegah tamu menambah favorit
    if (!userId) {
      alert(
        "Untuk menyimpan favorit, buka menu Profil lalu isi nama kamu terlebih dahulu."
      );
      return;
    }

    if (!destination) return;

    const wasFav = isFav;
    const nextFav = !wasFav;

    // Optimistic UI
    setIsFav(nextFav);

    try {
      await toggleFavorite(userId, destination);
      await refreshFavorites();
      alert(nextFav ? "Disimpan ke Favorit" : "Dihapus dari Favorit");
    } catch (error) {
      console.error(error);
      setIsFav(wasFav);

      const msg =
        (error && (error.message || error.error_description)) || String(error);
      alert("Gagal mengubah favorit: " + msg);
    }
  };

  if (loading) return <div className="p-10 text-center">Memuat...</div>;
  if (!destination)
    return <div className="p-10 text-center">Data tidak ditemukan</div>;

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="relative h-96">
        <img
          src={destination.imageUrl}
          className="w-full h-full object-cover"
          alt={destination.name}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/30 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/50 transition"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 -mt-20 relative bg-white rounded-t-[2.5rem] shadow-xl">
        <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>

        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="bg-teal-50 text-teal-700 text-sm px-3 py-1 rounded-full font-bold mb-3 inline-block tracking-wide uppercase">
              {destination.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              {destination.name}
            </h1>
            <div className="flex items-center text-gray-500 text-base">
              <MapPin size={18} className="mr-2 text-teal-500" />{" "}
              {destination.location}
            </div>
          </div>
          <div className="flex flex-col items-end bg-yellow-50 p-3 rounded-2xl border border-yellow-100">
            <div className="flex items-center text-yellow-500 text-lg font-bold">
              <Star size={20} className="fill-current mr-1" />{" "}
              {destination.rating}
            </div>
            <span className="text-xs text-yellow-700 font-medium">Rating</span>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-200 py-6 mb-6 flex justify-between items-center">
          <div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">
              Tiket Masuk
            </span>
            <div className="text-teal-600 font-bold text-2xl">
              {destination.price}
            </div>
          </div>
          <button
            onClick={handleFavorite}
            className={`p-3 rounded-full border-2 transition ${
              isFav
                ? "bg-red-50 border-red-200 text-red-500"
                : "bg-gray-50 border-gray-100 text-gray-400 hover:text-red-500"
            }`}
          >
            <Heart size={24} className={isFav ? "fill-current" : ""} />
          </button>
        </div>

        <h3 className="font-bold text-gray-900 text-lg mb-4">
          Tentang Destinasi
        </h3>
        <p className="text-gray-600 leading-relaxed mb-10 text-lg">
          {destination.description}
        </p>

        <button className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-teal-200 hover:bg-teal-700 hover:scale-[1.01] transition text-lg">
          Booking Sekarang
        </button>
      </div>
    </div>
  );
}
