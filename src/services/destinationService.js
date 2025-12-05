// src/services/destinationService.js
import { supabase } from '../config/supabase';

// --- HELPER: Hitung Rata-rata Rating ---
const calculateRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  return (total / reviews.length).toFixed(1);
};

// 1. Ambil Semua Destinasi
export const getDestinations = async (category) => {
  let query = supabase
    .from('destinations')
    .select('*, reviews(rating)');

  if (category && category !== 'Semua') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data.map((item) => ({
    ...item,
    rating: calculateRating(item.reviews),
    reviewCount: item.reviews ? item.reviews.length : 0
  }));
};

// 2. Ambil Detail Destinasi
export const getDestinationDetail = async (id) => {
  const { data, error } = await supabase
    .from('destinations')
    .select('*, reviews(rating)')
    .eq('id', id)
    .single();

  if (error) throw error;

  return {
    ...data,
    rating: calculateRating(data.reviews),
    reviewCount: data.reviews ? data.reviews.length : 0
  };
};

// 3. Ambil Destinasi Favorit (PERBAIKAN UTAMA DI SINI)
export const getFavorites = async (userId) => {
  // A. Ambil Data Favorit
  const { data: favs, error } = await supabase
    .from('favorites')
    .select(`
      id,
      user_id,
      destination_id,
      destinations (*)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  if (!favs || favs.length === 0) return [];

  // B. Ambil Semua Review terkait
  const destIds = favs.map(f => f.destination_id);
  
  const { data: reviews } = await supabase
    .from('reviews')
    .select('destination_id, rating')
    .in('destination_id', destIds);

  // C. Gabungkan (Match)
  return favs.map((item) => {
    const realDest = item.destinations;
    
    // PERBAIKAN: Gunakan Number() agar "4" (string) dianggap sama dengan 4 (number)
    const relatedReviews = reviews 
      ? reviews.filter(r => Number(r.destination_id) === Number(item.destination_id)) 
      : [];

    const dynamicRating = realDest ? calculateRating(relatedReviews) : 0;

    return {
      id: item.id,
      destination_id: item.destination_id,
      name: realDest ? realDest.name : "Destinasi Tidak Ditemukan",
      location: realDest ? realDest.location : "-",
      price: realDest ? realDest.price : "-",
      imageUrl: realDest ? realDest.imageUrl : "",
      category: realDest ? realDest.category : "",
      rating: dynamicRating // Rating sekarang pasti terisi
    };
  });
};

// 4. Toggle Favorite
export const toggleFavorite = async (userId, destination) => {
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('destination_id', destination.id)
    .single();

  if (existing) {
    const { error } = await supabase.from('favorites').delete().eq('id', existing.id);
    if (error) throw error;
    return 'removed';
  } else {
    const { error } = await supabase.from('favorites').insert([
      {
        user_id: userId,
        destination_id: destination.id,
        name: destination.name,
        location: destination.location,
        price: destination.price,
        imageUrl: destination.imageUrl,
      },
    ]);
    if (error) throw error;
    return 'added';
  }
};

// --- FITUR REVIEW ---

// 5. Ambil List Review
export const getReviewsByDestination = async (destinationId) => {
  const destId = Number(destinationId);
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('destination_id', destId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// 6. Kirim Review Baru
export const addReview = async (reviewData) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([
      {
        destination_id: Number(reviewData.destination_id),
        user_id: reviewData.user_id,
        user_name: reviewData.user_name,
        rating: reviewData.rating,
        comment: reviewData.comment
      }
    ])
    .select();

  if (error) throw error;
  return data;
};

// 7. Hapus Review
export const deleteReview = async (reviewId) => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) throw error;
};
// ... (kode sebelumnya tetap ada) ...

// --- FITUR ADMIN (CRUD) ---

// 8. Tambah Destinasi Baru
export const createDestination = async (data) => {
  const { error } = await supabase
    .from('destinations')
    .insert([data]);
  if (error) throw error;
};

// 9. Update Destinasi
export const updateDestination = async (id, data) => {
  const { error } = await supabase
    .from('destinations')
    .update(data)
    .eq('id', id);
  if (error) throw error;
};

// 10. Hapus Destinasi
export const deleteDestination = async (id) => {
  const { error } = await supabase
    .from('destinations')
    .delete()
    .eq('id', id);
  if (error) throw error;
};