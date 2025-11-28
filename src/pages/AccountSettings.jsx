import React, { useContext, useState } from "react";
import { ChevronLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [name, setName] = useState(user?.name || "Tamu");
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const saveName = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setStatus({ type: "error", msg: "Nama tidak boleh kosong." });
      return;
    }

    setSaving(true);
    setUser({ ...user, name: trimmed });

    try {
      localStorage.setItem("guest_user_name", trimmed);
    } catch (_) {}

    setTimeout(() => {
      setSaving(false);
      setStatus({ type: "success", msg: "Nama berhasil diperbarui!" });
    }, 500);
  };

  const resetName = () => {
    setName("Tamu");
    setUser({ ...user, name: "Tamu" });

    try {
      localStorage.setItem("guest_user_name", "Tamu");
    } catch (_) {}

    setStatus({ type: "info", msg: 'Nama dikembalikan ke "Tamu".' });
  };

  return (
    <div className="max-w-xl mx-auto py-6 px-4">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-teal-600 font-medium mb-6"
      >
        <ChevronLeft size={20} />
        Kembali
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
          <User size={28} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pengaturan Akun</h1>
          <p className="text-sm text-gray-500">Ubah nama pengguna Anda</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
        <label className="text-sm text-gray-600 font-medium">
          Nama Tampilan
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-2 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={saveName}
            disabled={saving}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-4 py-2 rounded-xl transition disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>

          <button
            onClick={resetName}
            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium text-sm px-4 py-2 rounded-xl transition"
          >
            Reset
          </button>
        </div>

        {/* Status */}
        {status && (
          <div
            className={`mt-4 text-sm px-4 py-3 rounded-xl border ${
              status.type === "error"
                ? "bg-red-50 text-red-700 border-red-200"
                : status.type === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-teal-50 text-teal-700 border-teal-200"
            }`}
          >
            {status.msg}
          </div>
        )}
      </div>
    </div>
  );
}
