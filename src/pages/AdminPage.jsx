import React, { useState, useEffect } from "react";
import { getDestinations, createDestination, updateDestination, deleteDestination } from "../services/destinationService";
import { Plus, Edit, Trash2, X, Save, MapPin } from "lucide-react";

export default function AdminPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // State Form
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category: "Alam",
    location: "",
    price: "",
    imageUrl: "",
    description: "",
    rating: 0 // Default rating awal
  });

  // Load Data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getDestinations('Semua');
      // Urutkan dari yang terbaru (ID terbesar biasanya terbaru)
      data.sort((a, b) => b.id - a.id);
      setDestinations(data);
    } catch (error) {
      alert("Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Form Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Buka Modal Tambah
  const openAddModal = () => {
    setFormData({ id: null, name: "", category: "Alam", location: "", price: "", imageUrl: "", description: "", rating: 0 });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Buka Modal Edit
  const openEditModal = (item) => {
    setFormData(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Simpan Data (Create / Update)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Hapus properti yang tidak perlu dikirim ke DB (seperti array reviews jika ada)
        const { reviews, reviewCount, ...updateData } = formData;
        await updateDestination(formData.id, updateData);
        alert("Berhasil diperbarui!");
      } else {
        await createDestination({
            name: formData.name,
            category: formData.category,
            location: formData.location,
            price: formData.price,
            imageUrl: formData.imageUrl,
            description: formData.description,
            rating: 0 // Rating awal 0
        });
        alert("Destinasi berhasil ditambahkan!");
      }
      setIsModalOpen(false);
      fetchData(); // Refresh list
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan.");
    }
  };

  // Hapus Data
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus destinasi ini? Data tidak bisa dikembalikan.")) {
      try {
        await deleteDestination(id);
        fetchData();
      } catch (error) {
        alert("Gagal menghapus.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-gray-500">Kelola data destinasi wisata.</p>
          </div>
          <button 
            onClick={openAddModal} 
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition transform hover:-translate-y-1"
          >
            <Plus size={20} /> Tambah Destinasi
          </button>
        </div>

        {/* Tabel Data */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Foto</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Nama & Lokasi</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Kategori</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Harga</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">Memuat data...</td></tr>
                ) : destinations.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">Belum ada data destinasi.</td></tr>
                ) : (
                  destinations.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 w-24">
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-12 object-cover rounded-lg border border-gray-200 bg-gray-100" />
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-gray-800">{item.name}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin size={12} className="mr-1" /> {item.location}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.category === 'Alam' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-600">{item.price}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => openEditModal(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition" title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">{isEditing ? "Edit Destinasi" : "Tambah Destinasi Baru"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm transition"><X size={18} /></button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Destinasi</label>
                <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="Contoh: Pantai Kuta" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kategori</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white">
                    <option value="Alam">Alam</option>
                    <option value="Budaya">Budaya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Harga Tiket</label>
                  <input required name="price" value={formData.price} onChange={handleChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="Rp 50.000" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lokasi</label>
                <input required name="location" value={formData.location} onChange={handleChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="Kota / Provinsi" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Link Gambar (URL)</label>
                <input required name="imageUrl" value={formData.imageUrl} onChange={handleChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="https://..." />
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Preview" className="mt-3 w-full h-32 object-cover rounded-xl border border-gray-200" onError={(e) => e.target.style.display = 'none'} />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deskripsi</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="Jelaskan keindahan tempat ini..." />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg transition transform active:scale-95">
                  <Save size={20} /> {isEditing ? "Simpan Perubahan" : "Simpan Data"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}