import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Home, Mountain, Landmark, Heart, User as UserIcon, Map } from "lucide-react";

// Import Halaman
import HomePage from "./pages/HomePage.jsx";
import DestinasiAlam from "./pages/DestinasiAlam.jsx";
import DestinasiBudaya from "./pages/DestinasiBudaya.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import Favorite from "./pages/Favorite.jsx";
import Profile from "./pages/Profile.jsx";
import AdminPage from "./pages/AdminPage.jsx";

// Context User
export const UserContext = React.createContext({
  user: null,
  setUser: () => {},
});

export default function App() {
  // Default: { uid: null, name: "Tamu" }
  // Kita tidak membuat ID sembarangan di awal agar database tidak error.
  const [user, setUser] = useState(() => {
    try {
      // Cek apakah ada data user tersimpan (format baru JSON)
      const savedUser = localStorage.getItem("app_user");
      if (savedUser) {
        return JSON.parse(savedUser);
      }

      // Jika tidak ada, kembalikan mode TAMU (uid null)
      return { uid: null, name: "Tamu" };
    } catch {
      return { uid: null, name: "Tamu" };
    }
  });

  const location = useLocation();

  // Helper Styling Desktop
  const isActive = (path) =>
    location.pathname === path
      ? "text-teal-600 font-bold border-b-2 border-teal-600"
      : "text-gray-500 hover:text-teal-600 font-medium";

  // Helper Styling Mobile
  const mobileLinkStyle = (path) =>
    [
      "flex flex-col items-center gap-1 transition-all duration-300",
      location.pathname === path
        ? "text-teal-600 scale-110 font-semibold"
        : "text-gray-400 hover:text-teal-500",
    ].join(" ");

  const hideNav = location.pathname.startsWith("/detail/");

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800">
        {/* --- NAVBAR DESKTOP --- */}
        {!hideNav && (
          <nav className="hidden md:block sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-teal-50 p-2 rounded-xl text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                  <Map size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold text-teal-800 leading-none tracking-tight">
                    Explore
                  </span>
                  <span className="text-sm font-semibold text-gray-400 leading-none tracking-widest">
                    NUSA
                  </span>
                </div>
              </Link>

              <div className="flex items-center space-x-8">
                <Link to="/" className={`py-6 transition-all ${isActive("/")}`}>
                  Beranda
                </Link>
                <Link
                  to="/kategori/alam"
                  className={`py-6 transition-all ${isActive("/kategori/alam")}`}
                >
                  Wisata Alam
                </Link>
                <Link
                  to="/kategori/budaya"
                  className={`py-6 transition-all ${isActive("/kategori/budaya")}`}
                >
                  Budaya
                </Link>
                <Link
                  to="/favorites"
                  className={`py-6 transition-all ${isActive("/favorites")}`}
                >
                  Favorit
                </Link>
              </div>

              <Link
                to="/profile"
                className="flex items-center gap-3 pl-6 border-l border-gray-200 hover:opacity-80 transition"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold text-gray-700">
                    Halo, {user?.name || "Tamu"}
                  </p>
                  <p className="text-xs text-teal-500 font-medium">
                    {user?.uid ? "Member Aktif" : "Mode Tamu"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-green-300 flex items-center justify-center text-white shadow-md">
                  <UserIcon size={20} />
                </div>
              </Link>
            </div>
          </nav>
        )}

        {/* --- KONTEN UTAMA --- */}
        <main
          className={[
            "flex-1 mx-auto w-full pt-6",
            hideNav
              ? "max-w-7xl px-4 sm:px-6 lg:px-8 pb-6"
              : "max-w-7xl px-4 sm:px-6 lg:px-8 pb-28 md:pb-12",
          ].join(" ")}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/kategori/alam" element={<DestinasiAlam />} />
            <Route path="/kategori/budaya" element={<DestinasiBudaya />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="/favorites" element={<Favorite />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminPage />}/>
          </Routes>
        </main>

        {/* --- NAVBAR MOBILE --- */}
        {!hideNav && (
          <div className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white/95 border-t border-gray-100 px-4 py-2 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center">
              <Link to="/" className={mobileLinkStyle("/")}>
                <Home size={24} />
                <span className="text-[10px]">Beranda</span>
              </Link>

              <Link
                to="/kategori/alam"
                className={mobileLinkStyle("/kategori/alam")}
              >
                <Mountain size={24} />
                <span className="text-[10px]">Alam</span>
              </Link>

              <Link
                to="/kategori/budaya"
                className={mobileLinkStyle("/kategori/budaya")}
              >
                <Landmark size={24} />
                <span className="text-[10px]">Budaya</span>
              </Link>

              <Link
                to="/favorites"
                className={mobileLinkStyle("/favorites")}
              >
                <Heart size={24} />
                <span className="text-[10px]">Favorit</span>
              </Link>

              <Link to="/profile" className={mobileLinkStyle("/profile")}>
                <UserIcon size={24} />
                <span className="text-[10px]">Profil</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </UserContext.Provider>
  );
}
