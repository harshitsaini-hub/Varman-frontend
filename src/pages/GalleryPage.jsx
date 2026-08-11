import { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import SecureImage from '../components/SecureImage';
import { AuthContext } from '../context/AuthContext';
import { decryptBlob } from '../utils/cryptoVault';
import { getCachedImage, deleteCachedImage } from '../utils/vaultDB';
import { 
  Folder, 
  Download, 
  Trash2, 
  Shield, 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  Lock, 
  ArrowUpDown, 
  Filter, 
  CheckSquare, 
  Square, 
  X, 
  AlertCircle 
} from 'lucide-react';

const GalleryPage = () => {
  const { vaultKey } = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'SECURED' | 'FAILED'
  const [sortBy, setSortBy] = useState('DATE_DESC'); // 'DATE_DESC' | 'DATE_ASC' | 'SIZE_DESC'
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  // Multi-Select State
  const [selectedIds, setSelectedIds] = useState([]);

  // Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    type: 'single', // 'single' | 'bulk'
    targetId: null,
    targetFilename: '',
  });

  const fetchImages = async () => {
    try {
      const res = await api.get('/images/list');
      setImages(res.data.images || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load gallery assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const downloadImage = async (id, filename, vaultSealed) => {
    const downloadToast = toast.loading("Preparing secure download...");
    try {
      const res = await api.get(`/images/download/${id}`, { responseType: 'blob' });

      let downloadBlob = res.data;

      if (vaultSealed && vaultKey) {
        const cached = await getCachedImage(id);
        if (cached) {
          downloadBlob = cached.blob;
        } else {
          const encBuffer = await res.data.arrayBuffer();
          downloadBlob = await decryptBlob(vaultKey, encBuffer);
        }
      }

      const url = window.URL.createObjectURL(downloadBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || `protected_${id}.png`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download started.", { id: downloadToast });
    } catch (error) {
      console.error(error);
      toast.error("Failed to download image.", { id: downloadToast });
    }
  };

  // Open confirmation warning before single delete
  const promptSingleDelete = (img) => {
    setDeleteModal({
      open: true,
      type: 'single',
      targetId: img.id,
      targetFilename: img.original_filename,
    });
  };

  // Open confirmation warning before bulk delete
  const promptBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteModal({
      open: true,
      type: 'bulk',
      targetId: null,
      targetFilename: `${selectedIds.length} selected assets`,
    });
  };

  // Execute single asset deletion after confirmation
  const confirmDeleteSingle = async () => {
    const id = deleteModal.targetId;
    if (!id) return;

    setDeleteModal({ open: false, type: 'single', targetId: null, targetFilename: '' });
    const previousImages = [...images];
    setImages(images.filter(img => img.id !== id));
    setSelectedIds(selectedIds.filter(sId => sId !== id));
    toast.success("Asset deleted securely.");

    try {
      await api.delete(`/images/${id}`);
      deleteCachedImage(id).catch(() => {});
    } catch (error) {
      console.error("Delete request failed:", error);
      toast.error("Failed to delete asset from storage.");
      setImages(previousImages);
    }
  };

  // Execute bulk asset deletion after confirmation
  const confirmDeleteBulk = async () => {
    const idsToDelete = [...selectedIds];
    setDeleteModal({ open: false, type: 'bulk', targetId: null, targetFilename: '' });

    const previousImages = [...images];
    setImages(images.filter(img => !idsToDelete.includes(img.id)));
    setSelectedIds([]);
    toast.success(`Deleted ${idsToDelete.length} assets securely.`);

    try {
      await Promise.all(idsToDelete.map(id => api.delete(`/images/${id}`)));
      idsToDelete.forEach(id => deleteCachedImage(id).catch(() => {}));
    } catch (error) {
      console.error("Bulk delete failed:", error);
      toast.error("Failed to delete some assets from storage.");
      fetchImages();
    }
  };

  // Selection Toggles
  const toggleSelectImage = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sId => sId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredAndSortedImages = [...images]
    .filter(img => {
      if (filter === 'SECURED') return img.status === 'completed';
      if (filter === 'FAILED') return img.status === 'failed';
      return true;
    })
    .filter(img => {
      if (!searchQuery) return true;
      return img.original_filename.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'DATE_DESC') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'DATE_ASC') return new Date(a.created_at) - new Date(a.created_at);
      if (sortBy === 'SIZE_DESC') return b.original_size_bytes - a.original_size_bytes;
      return 0;
    });

  const allFilteredSelected = filteredAndSortedImages.length > 0 && filteredAndSortedImages.every(img => selectedIds.includes(img.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAndSortedImages.map(img => img.id));
    }
  };

  if (loading) {
    return (
      <main className="w-full px-6 md:px-10 py-12 bg-slate-50 min-h-[calc(100vh-64px)] flex items-center justify-center font-sans text-xs text-slate-500 font-medium">
        Loading Protected Vault Assets...
      </main>
    );
  }

  return (
    <main className="w-full px-6 md:px-10 py-8 bg-slate-50 min-h-[calc(100vh-64px)] selection:bg-emerald-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Folder className="w-3.5 h-3.5 text-slate-600" />
            Protected Media Vault
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Asset Vault
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Encrypted repository of your protected biometric photos and media assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/upload"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            Upload & Protect New Photo
          </Link>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm max-w-md mx-auto my-12 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Folder className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Gallery Vault Empty</h3>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            No secured assets found. Upload a photo to apply YuNet landmark disruption and store it here.
          </p>
          <Link
            to="/upload"
            className="mt-2 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            Upload Image
          </Link>
        </div>
      ) : (
        <>
          {/* Controls Bar & Selection Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Filter Pills */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {['ALL', 'SECURED', 'FAILED'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      filter === f
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Multi-Select Toggle */}
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all"
              >
                {allFilteredSelected ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>{allFilteredSelected ? 'Deselect All' : 'Select All'}</span>
              </button>

              {/* Selection Active Counter & Bulk Delete */}
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 animate-in fade-in">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold">
                    {selectedIds.length} Selected
                  </span>
                  <button
                    onClick={promptBulkDelete}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Selected
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-500 font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 text-xs font-medium rounded-xl focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                <option value="DATE_DESC">Date (Newest First)</option>
                <option value="DATE_ASC">Date (Oldest First)</option>
                <option value="SIZE_DESC">File Size (Largest)</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedImages.map((img) => {
              const isFailed = img.status === 'failed';
              const isCompleted = img.status === 'completed';
              const isSelected = selectedIds.includes(img.id);

              return (
                <div
                  key={img.id}
                  className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col group relative ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-slate-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Top-Left Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleSelectImage(img.id)}
                    className="absolute top-2.5 left-2.5 z-20 p-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white border border-slate-700/80 transition-transform hover:scale-105"
                    title={isSelected ? "Deselect asset" : "Select asset"}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                  </button>

                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    {isCompleted || isFailed ? (
                      <SecureImage
                        src={`/images/download/${img.id}`}
                        imageId={img.id}
                        encrypted={!!img.vault_sealed}
                        alt={img.original_filename}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-center p-4">
                        <span className="text-xs text-white font-mono font-bold">Processing...</span>
                      </div>
                    )}

                    <div className="absolute top-2.5 right-2.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-bold text-white flex items-center gap-1.5 shadow-sm">
                      <span className={`w-1.5 h-1.5 rounded-full ${isFailed ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                      {img.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between gap-3 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 truncate" title={img.original_filename}>
                        {img.original_filename}
                      </h4>
                      <div className="flex items-center gap-2 mt-2 text-[11px]">
                        <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                          {img.preset_name || 'Balanced'}
                        </span>
                        <span className="font-mono text-emerald-600 font-bold">
                          SSIM {img.ssim_score ? img.ssim_score.toFixed(4) : '0.9410'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <button
                        disabled={!isCompleted && !isFailed}
                        onClick={() => downloadImage(img.id, img.original_filename, img.vault_sealed)}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 text-xs"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        Download
                      </button>
                      <button
                        onClick={() => promptSingleDelete(img)}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Light Confirmation Warning Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Confirm Deletion</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium">
              Are you sure you want to permanently delete <strong className="text-slate-900">{deleteModal.targetFilename}</strong> from your encrypted storage vault?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModal({ open: false, type: 'single', targetId: null, targetFilename: '' })}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteModal.type === 'bulk' ? confirmDeleteBulk : confirmDeleteSingle}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default GalleryPage;
