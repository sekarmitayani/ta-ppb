// src/pages/DetailPage.jsx
import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDestinationDetail, useFavorites } from "../hooks/useDestination";
import { toggleFavorite, getReviewsByDestination, addReview, deleteReview } from "../services/destinationService";
import { ChevronLeft, MapPin, Star, Heart, Share2, Ticket, Map, Send, Trash } from "lucide-react";
import { UserContext } from "../App";

// PERBAIKAN UTAMA: Pastikan ada kata 'export default' di sini
export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const userId = user?.uid || null;

  const { destination, loading } = useDestinationDetail(id);
  const { favorites, refresh: refreshFavorites } = useFavorites(userId);

  const [isFav, setIsFav] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [inputRating, setInputRating] = useState(5);
  const [inputComment, setInputComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Sync Status Favorit
  useEffect(() => {
    if (!destination || !favorites) return;
    const destIdInt = typeof destination.id === 'number' ? destination.id : parseInt(destination.id) || 0;
    const match = favorites.some((fav) => fav.destination_id === destIdInt || fav.destination_id === destination.destination_id);
    setIsFav(match);
  }, [favorites, destination]);

  // 2. Load Reviews saat halaman dibuka
  useEffect(() => {
    if (id) fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const data = await getReviewsByDestination(id);
      setReviews(data || []);
    } catch (error) {
      console.error("Gagal ambil review:", error);
    }
  };

  const handleFavorite = async () => {
    if (!userId) return alert("Silakan isi nama di Profil dulu.");
    const wasFav = isFav;
    setIsFav(!wasFav);
    try {
      await toggleFavorite(userId, destination);
      await refreshFavorites();
    } catch (error) {
      setIsFav(wasFav);
      alert("Gagal mengubah favorit.");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: destination.name, url: window.location.href }).catch(console.error);
    } else {
      alert("Link disalin!");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleOpenMaps = () => {
    if (!destination) return;
    const query = encodeURIComponent(`${destination.name} ${destination.location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userId) return alert("Isi nama di profil dulu!");
    if (!inputComment.trim()) return alert("Tuliskan komentar.");

    setIsSubmitting(true);
    try {
      await addReview({
        destination_id: id,
        user_id: user.uid,
        user_name: user.name,
        rating: inputRating,
        comment: inputComment
      });
      setInputComment("");
      setInputRating(5);
      await fetchReviews();
      window.location.reload(); // Refresh agar rating di header terupdate
    } catch (error) {
      console.error(error);
      alert("Gagal kirim review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Hapus ulasan ini?")) {
      try {
        await deleteReview(reviewId);
        await fetchReviews();
        // window.location.reload(); // Opsional jika ingin update rating header langsung
      } catch (error) {
        alert("Gagal menghapus review.");
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Memuat...</div>;
  if (!destination) return <div className="min-h-screen flex items-center justify-center text-gray-500">Data tidak ditemukan</div>;

  const hasRating = Number(destination.rating) > 0;

  return (
    <div className="bg-white min-h-screen pb-6">
      {/* HERO IMAGE */}
      <div className="relative h-80 md:h-96 w-full">
        <img src={destination.imageUrl} className="w-full h-full object-cover" alt={destination.name} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-10">
          <button onClick={() => navigate(-1)} className="bg-black/20 backdrop-blur-md p-3 rounded-full text-white border border-white/10"><ChevronLeft size={24} /></button>
          <button onClick={handleShare} className="bg-black/20 backdrop-blur-md p-3 rounded-full text-white border border-white/10"><Share2 size={20} /></button>
        </div>
      </div>

      {/* CONTENT (Full Width) */}
      <div className="relative -mt-12 z-10 w-full">
        <div className="bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-6 md:p-10 max-w-5xl mx-auto min-h-[50vh]">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:mb-8 opacity-60"></div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div className="flex-1">
              <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase mb-3 inline-block">{destination.category}</span>
              <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">{destination.name}</h1>
              <div className="flex items-center text-gray-500 text-sm md:text-base"><MapPin size={16} className="mr-1.5 text-teal-500" /> {destination.location}</div>
            </div>
            
            {/* Rating Box */}
            <div className="flex items-center gap-3 bg-yellow-50 px-4 py-3 rounded-2xl border border-yellow-100 self-start">
              {hasRating ? (
                 <div className="bg-yellow-400 text-white p-1.5 rounded-lg"><Star size={18} fill="currentColor" /></div>
              ) : (
                 <div className="bg-teal-100 text-teal-600 p-1.5 rounded-lg font-bold text-xs">NEW</div>
              )}
              <div>
                <div className="text-lg font-bold text-gray-800 leading-none">
                  {hasRating ? destination.rating : "Baru"}
                </div>
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
                  {hasRating ? `(${destination.reviewCount || reviews.length} Ulasan)` : "Belum ada ulasan"}
                </div>
              </div>
            </div>
          </div>

          {/* Info Bar */}
          <div className="flex items-center justify-between py-5 border-t border-b border-dashed border-gray-100 mb-6">
             <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl"><Ticket size={24} /></div>
              <div><p className="text-gray-400 text-[10px] font-bold uppercase">Tiket Masuk</p><p className="text-teal-700 font-bold text-xl">{destination.price}</p></div>
            </div>
            <button onClick={handleFavorite} className={`p-3 md:p-4 rounded-full border transition-all ${isFav ? "bg-red-50 border-red-100 text-red-500 scale-110" : "bg-gray-50 text-gray-400"}`}><Heart size={24} className={isFav ? "fill-current" : ""} /></button>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-gray-900 text-lg mb-3">Tentang Destinasi</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base text-justify">{destination.description}</p>
          </div>

          {/* Maps Button */}
          <button onClick={handleOpenMaps} className="
              w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg
              flex items-center justify-center gap-2 mb-10
              border-2 border-transparent
              hover:bg-white hover:text-teal-600 hover:border-teal-600
              transition-all duration-200
            ">
            <Map size={20} /> Lihat di Google Maps</button>

          {/* REVIEW SECTION */}
          <div className="border-t border-gray-100 pt-8">
            <h3 className="font-bold text-gray-900 text-xl mb-6">Ulasan Pengunjung</h3>

            {/* Form Input */}
            <div className="bg-gray-50 p-5 rounded-2xl mb-8 border border-gray-100">
              <h4 className="font-bold text-gray-700 mb-3 text-sm">Bagikan pengalamanmu</h4>
              <form onSubmit={handleSubmitReview}>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setInputRating(star)} className="focus:outline-none transition hover:scale-110">
                      <Star size={24} className={star <= inputRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                    </button>
                  ))}
                </div>
                <textarea value={inputComment} onChange={(e) => setInputComment(e.target.value)} placeholder="Tulis komentar..." className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3 h-24 resize-none" />
                <button disabled={isSubmitting} type="submit" className="bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-teal-700 disabled:opacity-50"><Send size={16} /> {isSubmitting ? "Mengirim..." : "Kirim"}</button>
              </form>
            </div>

            {/* List Reviews */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-400 text-center py-4 text-sm italic">Belum ada ulasan. Jadilah yang pertama!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="border-b border-gray-50 pb-4 last:border-0 group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-xs">{rev.user_name.charAt(0).toUpperCase()}</div>
                        <span className="font-bold text-gray-800 text-sm">{rev.user_name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md">
                          <Star size={10} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-bold text-yellow-700">{rev.rating}.0</span>
                        </div>
                        
                        {/* Tombol Hapus (Hanya muncul untuk pemilik review) */}
                        {user?.uid === rev.user_id && (
                          <button 
                            onClick={() => handleDeleteReview(rev.id)}
                            className="text-gray-300 hover:text-red-500 p-1 transition"
                            title="Hapus ulasan"
                          >
                            <Trash size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed pl-10">{rev.comment}</p>
                    <p className="text-gray-300 text-[10px] pl-10 mt-1">{new Date(rev.created_at).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}