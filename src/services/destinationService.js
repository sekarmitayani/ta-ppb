// src/services/destinationService.js
import { supabase } from "../config/supabase";

/**
 * Ambil semua destinasi (untuk Beranda / Kategori)
 * Tabel: destinations
 */
export async function getDestinations(category = "Semua") {
  let query = supabase.from("destinations").select("*");

  if (category && category !== "Semua") {
    query = query.eq("category", category);
  }

  const { data, error } = await query.order("id", { ascending: true });

  if (error) {
    console.error("Gagal ambil destinasi:", error);
    throw error;
  }

  return data || [];
}

/**
 * Ambil detail 1 destinasi
 * Tabel: destinations
 */
export async function getDestinationDetail(id) {
  if (!id) return null;

  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Gagal ambil detail destinasi:", error);
    throw error;
  }

  return data || null;
}

/**
 * Ambil daftar favorit user tertentu.
 *
 * Struktur tabel favorites (dari screenshot):
 * - id             int8
 * - user_id        uuid
 * - destination_id int8
 * - name           text
 * - location       text
 * - price          text
 * - imageUrl       text
 */
export async function getFavorites(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("favorites")
    .select(`
      id,
      user_id,
      destination_id,
      name,
      location,
      price,
      imageUrl
    `)
    .eq("user_id", userId)
    .order("id", { ascending: false });

  if (error) {
    console.error("Gagal ambil favorit:", error);
    throw error;
  }

  return (data || []).map((row) => ({
    id: row.id,
    user_id: row.user_id,
    destination_id: row.destination_id,
    name: row.name,
    location: row.location,
    price: row.price,
    imageUrl: row.imageUrl,
  }));
}

/**
 * Toggle favorit:
 *  - kalau sudah ada (user_id + destination_id) → hapus
 *  - kalau belum ada → insert
 *
 * Saat insert, kita sekalian simpan:
 *  - name, location, price, imageUrl
 * supaya halaman Favorit bisa tampil tanpa join ke tabel destinations.
 */
export async function toggleFavorite(userId, destination) {
  if (!userId) throw new Error("User belum login");
  if (!destination || !destination.id) {
    throw new Error("Data destinasi tidak valid.");
  }

  const destId = destination.id;

  // Cek apakah sudah ada di favorites
  const { data: existing, error: checkError } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("destination_id", destId)
    .maybeSingle();

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Gagal cek favorit:", checkError);
    throw checkError;
  }

  // Kalau sudah ada → hapus
  if (existing && existing.id) {
    const { error: delError } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);

    if (delError) {
      console.error("Gagal menghapus favorit:", delError);
      throw delError;
    }

    return { status: "removed" };
  }

  // Kalau belum ada → insert baris baru
  const payload = {
    user_id: userId,
    destination_id: destId,
    name: destination.name ?? null,
    location: destination.location ?? null,
    price: destination.price ?? null,
    imageUrl: destination.imageUrl ?? null,
  };

  const { error: insertError } = await supabase.from("favorites").insert(payload);

  if (insertError) {
    console.error("Gagal menambah favorit:", insertError);
    throw insertError;
  }

  return { status: "added" };
}
