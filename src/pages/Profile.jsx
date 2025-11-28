import React, { useState, useEffect, useContext } from "react";
import { User as UserIcon, Settings, LogOut, Info, ChevronRight, Shield, RefreshCw } from "lucide-react";
import { UserContext } from "../App";

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState(user?.name || "Tamu");
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("info");

  useEffect(() => {
    setName(user?.name || "Tamu");
  }, [user]);

  const showMessage = (msg, type = "info") => {
    setStatusMessage(msg);
    setStatusType(type);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  // --- FUNGSI GENERATOR UUID VALID (Fix Error Database) ---
  const createUUID = () => {
    // Coba pakai crypto bawaan browser (HP Modern)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback manual (HP Lama) - menghasilkan format xxxxxxxx-xxxx-4xxx...
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleSaveName = (e) => {
    if (e) e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      showMessage("Nama tidak boleh kosong.", "error");
      return;
    }

    let currentUid = user?.uid;
    
    // Cek apakah UID invalid (format lama 'user-...') atau kosong/guest
    const isInvalidId = !currentUid || String(currentUid).startsWith("user-") || String(currentUid).includes("guest");

    if (isInvalidId) {
        // Generate UUID baru yang valid formatnya
        currentUid = createUUID(); 
    }

    const updatedUser = { uid: currentUid, name: trimmed };
    setUser(updatedUser);

    try {
      localStorage.setItem("app_user", JSON.stringify(updatedUser));
      localStorage.removeItem("guest_user_id");
      localStorage.removeItem("guest_user_name");
    } catch (e) { console.error(e); }

    showMessage("Profil aktif! Sekarang kamu bisa simpan favorit.", "success");
    setShowAccountSettings(false);
  };

  const handleResetToGuest = () => {
    if (window.confirm("Yakin ingin kembali ke Mode Tamu?")) {
       handleLogout();
       setShowAccountSettings(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("app_user"); 
      localStorage.removeItem("guest_user_id");
      localStorage.removeItem("guest_user_name");
    } catch {}

    setUser({ uid: null, name: "Tamu" });
    setName("Tamu");
    showMessage("Mode Tamu diaktifkan.", "success");
  };

  const handleSecurityClick = () => showMessage("Fitur keamanan & privasi aman terkendali.", "info");
  const handleAboutClick = () => showMessage("ExploreNusa v1.0 - Jelajahi Keindahan Indonesia.", "info");

  const statusBg = statusType === "error" ? "bg-red-50 text-red-700 border-red-200" : statusType === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-teal-50 text-teal-700 border-teal-200";

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      {/* Header Profil */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-teal-50 border border-teal-50 text-center relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-teal-500 to-green-400" />
        <div className="relative z-10">
          <div className="w-28 h-28 bg-white rounded-full p-2 mx-auto mb-4 shadow-lg">
            <div className="w-full h-full bg-teal-50 rounded-full flex items-center justify-center text-teal-600 overflow-hidden">
              <UserIcon size={48} />
            </div>
          </div>
          <h2 className="font-bold text-2xl text-gray-900">{user?.name || "Tamu"}</h2>
          <p className="text-gray-500 text-sm mt-1 mb-4">{user?.uid ? `ID: ${String(user.uid).slice(0, 8)}...` : "Mode Tamu (Read Only)"}</p>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${user?.uid ? 'bg-teal-50 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>{user?.uid ? "Member Aktif" : "Tamu"}</span>
        </div>
      </div>

      {statusMessage && <div className={`mb-6 text-sm rounded-2xl px-4 py-3 border ${statusBg}`}>{statusMessage}</div>}

      {/* Menu */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 px-2">Pengaturan Umum</h3>
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <button onClick={() => setShowAccountSettings(!showAccountSettings)} className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition border-b border-gray-50">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Settings size={20} /></div>
              <span className="text-gray-700 font-medium">{user?.uid ? "Ubah Profil" : "Login / Ubah Nama"}</span>
            </div>
            <ChevronRight size={18} className={`text-gray-300 transition ${showAccountSettings ? "rotate-90" : ""}`} />
          </button>

          {showAccountSettings && (
            <div className="px-5 pb-5 pt-3 border-b border-gray-50 bg-gray-50/40">
              <p className="text-sm text-gray-500 mb-3">{user?.uid ? "Atur profil atau reset akun." : "Masukkan nama untuk akses fitur."}</p>
              
              <form onSubmit={handleSaveName} className="flex flex-col gap-3">
                <input 
                    type="text" 
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    placeholder="Nama..." 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition">
                    {user?.uid ? "Simpan" : "Masuk"}
                  </button>
                  
                  {user?.uid && (
                    <button type="button" onClick={handleResetToGuest} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition">
                      <RefreshCw size={14} /> Reset ke Tamu
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          <button onClick={handleSecurityClick} className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition group">
            <div className="flex items-center gap-4"><div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Shield size={20} /></div><span className="text-gray-700 font-medium">Keamanan & Privasi</span></div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-gray-900 px-2 mt-6">Lainnya</h3>
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <button onClick={handleAboutClick} className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition border-b border-gray-50 group">
            <div className="flex items-center gap-4"><div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><Info size={20} /></div><span className="text-gray-700 font-medium">Tentang Aplikasi</span></div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
          <button onClick={handleLogout} className="w-full p-5 flex items-center justify-between hover:bg-red-50 transition group">
            <div className="flex items-center gap-4"><div className="p-2 bg-red-100 text-red-600 rounded-xl"><LogOut size={20} /></div><span className="text-red-600 font-medium">Keluar</span></div>
          </button>
        </div>
      </div>
      <p className="text-center text-gray-300 text-xs mt-12 mb-4">ExploreNusa v1.0.0</p>
    </div>
  );
}