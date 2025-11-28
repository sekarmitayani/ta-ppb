// src/hooks/useDestination.js
import { useState, useEffect, useCallback } from "react";
import {
  getDestinations,
  getDestinationDetail,
  getFavorites,
} from "../services/destinationService";

/**
 * Ambil daftar destinasi (opsional filter kategori)
 */
export function useDestinations(category = "Semua") {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getDestinations(category)
      .then((data) => {
        if (!isMounted) return;
        setDestinations(data || []);
      })
      .catch((err) => {
        console.error("Gagal ambil data destinasi:", err);
        if (!isMounted) return;
        setDestinations([]);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [category]);

  return { destinations, loading };
}

/**
 * Ambil detail 1 destinasi
 */
export function useDestinationDetail(id) {
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setLoading(true);

    getDestinationDetail(id)
      .then((data) => {
        if (!isMounted) return;
        setDestination(data);
      })
      .catch((err) => {
        console.error("Gagal ambil detail destinasi:", err);
        if (!isMounted) return;
        setDestination(null);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { destination, loading };
}

/**
 * Ambil daftar favorit user dari Supabase
 */
export function useFavorites(userId) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getFavorites(userId)
      .then((data) => setFavorites(data || []))
      .catch((err) => {
        console.error("Gagal ambil favorit:", err);
        setFavorites([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { favorites, loading, refresh };
}

// OPTIONAL: kalau kamu ada import lama `useDestination` di HomePage:
export { useDestinations as useDestination };
