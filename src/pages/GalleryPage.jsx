import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import SecureImage from '../components/SecureImage';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'SECURED' | 'FAILED'
  const [sortBy, setSortBy] = useState('DATE_DESC'); // 'DATE_DESC' | 'DATE_ASC' | 'SIZE_DESC'
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

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

  const downloadImage = async (id, filename) => {
    const downloadToast = toast.loading("Preparing secure download...");
    try {
      const res = await api.get(`/images/download/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
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

  const deleteImage = async (id) => {
    const previousImages = [...images];
    // Optimistic UI update
    setImages(images.filter(img => img.id !== id));
    toast.success("Asset deleted securely.");

    try {
      await api.delete(`/images/${id}`);
    } catch (error) {
      console.error("Delete request failed:", error);
      toast.error("Failed to delete asset from secure storage.");
      // Rollback
      setImages(previousImages);
    }
  };

  // Sort & Filter logic
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
      if (sortBy === 'DATE_ASC') return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'SIZE_DESC') return b.original_size_bytes - a.original_size_bytes;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex-1 p-6 md:p-8 flex items-center justify-center text-neon-cyan font-code-snippet">
        LOADING SECURE VAULT...
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto">
      {/* Header Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl text-neon-cyan mb-2 font-bold tracking-wider uppercase font-headline text-gradient">
            Protected Asset Vault
          </h1>
          <p className="text-xs text-neon-cyan/70 max-w-2xl tracking-wide uppercase font-code-snippet">
            ENCRYPTED GALLERY OF PERTURBATED MEDIA. ACCESS REQUIRES CLEARANCE LEVEL ALPHA-9.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-panel px-3 py-1.5 flex items-center gap-2 border-neon-cyan/50 rounded-none">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_5px_#00f0ff]"></span>
            <span className="text-neon-cyan text-[10px] font-bold tracking-widest font-code-snippet">SYS_STABLE</span>
          </div>
          <div className="glass-panel px-3 py-1.5 flex items-center gap-2 border-neon-cyan/20 rounded-none">
            <span className="text-neon-cyan/70 text-[10px] tracking-widest font-code-snippet">
              {images.length}_ASSETS
            </span>
          </div>
        </div>
      </header>

      {images.length === 0 ? (
        <div className="glass-panel text-center p-12 max-w-lg mx-auto mt-12 flex flex-col items-center">
          <span className="material-symbols-outlined text-[64px] text-neon-cyan/80 mb-4 animate-pulse">folder_open</span>
          <h3 className="mb-2 text-on-surface font-semibold tracking-wider font-code-snippet uppercase text-sm">Gallery Vault Empty</h3>
          <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
            No secured assets found. Upload an image to apply adversarial shielding and store it here.
          </p>
          <Link 
            to="/upload" 
            className="bg-neon-cyan/20 text-neon-cyan border border-neon-cyan py-2.5 px-6 hover:bg-neon-cyan hover:text-background transition-colors flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase font-code-snippet"
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            Upload Image
          </Link>
        </div>
      ) : (
        <>
          {/* Filters / Controls */}
          <div className="glass-panel p-4 mb-8 flex flex-wrap gap-4 items-center justify-between border-neon-cyan/30 rounded-none">
            <div className="flex gap-2">
              <button 
                onClick={() => setFilter('ALL')}
                className={`px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors border font-code-snippet ${
                  filter === 'ALL' 
                    ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan' 
                    : 'bg-transparent border-neon-cyan/40 text-neon-cyan/70 hover:border-neon-cyan hover:text-neon-cyan'
                }`}
              >
                ALL
              </button>
              <button 
                onClick={() => setFilter('SECURED')}
                className={`px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors border font-code-snippet ${
                  filter === 'SECURED' 
                    ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan' 
                    : 'bg-transparent border-neon-cyan/40 text-neon-cyan/70 hover:border-neon-cyan hover:text-neon-cyan'
                }`}
              >
                SECURED
              </button>
              <button 
                onClick={() => setFilter('FAILED')}
                className={`px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors border font-code-snippet ${
                  filter === 'FAILED' 
                    ? 'bg-neon-red/20 border-neon-red text-neon-red' 
                    : 'bg-transparent border-neon-red/40 text-neon-red/70 hover:border-neon-red hover:text-neon-red'
                }`}
              >
                FAILED
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-neon-cyan/70 text-[10px] tracking-widest font-code-snippet">SORT:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-background/85 border border-neon-cyan/40 text-neon-cyan px-3 py-1 text-[10px] tracking-widest focus:outline-none focus:border-neon-cyan cursor-pointer rounded-none font-code-snippet"
                >
                  <option value="DATE_DESC">DATE_DESC</option>
                  <option value="DATE_ASC">DATE_ASC</option>
                  <option value="SIZE_DESC">SIZE_DESC</option>
                </select>
              </div>
            </div>
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedImages.map(img => {
              const isFailed = img.status === 'failed';
              const isCompleted = img.status === 'completed';

              return (
                <div 
                  key={img.id} 
                  className={`glass-panel flex flex-col group transition-all duration-300 rounded-none ${
                    isFailed 
                      ? 'status-failed hover:shadow-[0_0_25px_rgba(255,0,85,0.2)]' 
                      : 'status-secured hover:shadow-[0_0_25px_rgba(0,240,255,0.2)]'
                  }`}
                >
                  <div className={`relative h-40 w-full bg-background overflow-hidden border-b ${
                    isFailed ? 'border-neon-red/40' : 'border-neon-cyan/40'
                  }`}>
                    {isCompleted || isFailed ? (
                      <SecureImage 
                        src={`/images/download/${img.id}`} 
                        alt={img.original_filename}
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-center p-4">
                        <span className="material-symbols-outlined text-neon-cyan text-2xl animate-spin">sync</span>
                        <span className="text-[10px] text-on-surface-variant font-code-snippet uppercase tracking-widest">INGESTING JOB...</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-neon-cyan/5 pointer-events-none"></div>
                    
                    <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-md border px-2 py-0.5 flex items-center gap-1.5 rounded-none border-neon-cyan/50">
                      <div className={`w-1.5 h-1.5 rounded-full ${isFailed ? 'led-failed' : 'led-secured'}`}></div>
                      <span className={`text-[10px] font-bold tracking-widest font-code-snippet ${isFailed ? 'text-neon-red' : 'text-neon-cyan'}`}>
                        {img.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-md px-1.5 py-0.5 border border-neon-cyan/30 text-[10px] font-code-snippet text-neon-cyan truncate max-w-[80%]">
                      {img.original_filename}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1 gap-4">
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-medium tracking-widest font-code-snippet">
                      <div className={`border p-2 flex flex-col justify-between ${
                        isFailed ? 'bg-neon-red/5 border-neon-red/20 text-neon-red/70' : 'bg-neon-cyan/5 border-neon-cyan/20 text-neon-cyan/70'
                      }`}>
                        <div className="opacity-60 mb-0.5">SSIM_IDX</div>
                        <div className="text-[11px] font-bold text-white flex items-center gap-0.5">
                          {img.ssim_score ? img.ssim_score.toFixed(4) : '0.0000'}
                          {isFailed && <span className="material-symbols-outlined text-[10px]">warning</span>}
                        </div>
                      </div>
                      <div className={`border p-2 flex flex-col justify-between ${
                        isFailed ? 'bg-neon-red/5 border-neon-red/20 text-neon-red/70' : 'bg-neon-cyan/5 border-neon-cyan/20 text-neon-cyan/70'
                      }`}>
                        <div className="opacity-60 mb-0.5">PSNR_VAL</div>
                        <div className="text-[11px] font-bold text-white flex items-center gap-0.5">
                          {img.psnr_score ? `${img.psnr_score.toFixed(1)}dB` : '0.0dB'}
                          {isFailed && <span className="material-symbols-outlined text-[10px]">warning</span>}
                        </div>
                      </div>
                    </div>

                    <div className={`flex gap-2 mt-auto pt-2 border-t ${
                      isFailed ? 'border-neon-red/20' : 'border-neon-cyan/20'
                    }`}>
                      <button 
                        disabled={!isCompleted && !isFailed}
                        onClick={() => downloadImage(img.id, img.original_filename)}
                        className={`flex-1 py-1.5 text-[10px] font-bold tracking-widest transition-colors flex items-center justify-center gap-1 uppercase border rounded-none font-code-snippet ${
                          isFailed 
                            ? 'bg-transparent text-neon-red/50 border-neon-red/30 cursor-not-allowed hover:bg-neon-red/10' 
                            : 'bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isFailed ? 'lock' : 'download'}
                        </span> 
                        {isFailed ? 'QUARANTINE' : 'EXTRACT'}
                      </button>
                      <button 
                        onClick={() => deleteImage(img.id)}
                        className="bg-transparent hover:bg-neon-red/20 text-neon-red border border-neon-red/50 px-3 transition-colors flex items-center justify-center rounded-none" 
                        title="Purge Secure Asset"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete_forever</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default GalleryPage;
