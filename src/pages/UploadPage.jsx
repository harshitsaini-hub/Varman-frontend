import { useState, useEffect, useRef, useContext } from 'react';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/errorHandler';
import api from '../api';
import ImageCompare from '../components/ImageCompare';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { Shield, Upload, RefreshCw, CheckCircle2, AlertCircle, Sliders, Layers, Clock, Zap, FileImage, ArrowRight } from 'lucide-react';

const UploadPage = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [protectedUrl, setProtectedUrl] = useState(null);
  const [presetName, setPresetName] = useState('Balanced'); // 'Light' | 'Balanced' | 'Aggressive'
  const [enableGrid, setEnableGrid] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Task & Polling States
  const [status, setStatus] = useState(null); // 'pending' | 'processing' | 'completed' | 'failed'
  const [metrics, setMetrics] = useState(null);
  const [processingTimeMs, setProcessingTimeMs] = useState(null);
  const pollInterval = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (protectedUrl) URL.revokeObjectURL(protectedUrl);
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [previewUrl, protectedUrl]);

  const processSelectedFile = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      toast.error("Invalid file format. Please select an image.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (protectedUrl) URL.revokeObjectURL(protectedUrl);

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setProtectedUrl(null);
    setStatus(null);
    setMetrics(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const triggerReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (protectedUrl) URL.revokeObjectURL(protectedUrl);
    setFile(null);
    setPreviewUrl(null);
    setProtectedUrl(null);
    setStatus(null);
    setMetrics(null);
    if (pollInterval.current) clearInterval(pollInterval.current);
  };

  const pollImageStatus = (imageId) => {
    pollInterval.current = setInterval(async () => {
      try {
        const res = await api.get(`/images/status/${imageId}`);
        const data = res.data;
        setStatus(data.status);

        if (data.status === 'completed') {
          clearInterval(pollInterval.current);
          setUploading(false);
          setMetrics(data);
          setProcessingTimeMs(data.processing_time_ms);

          // Fetch protected image blob
          const imgRes = await api.get(`/images/download/${imageId}`, { responseType: 'blob' });
          const objectUrl = URL.createObjectURL(imgRes.data);
          setProtectedUrl(objectUrl);
          toast.success("Image protection pipeline completed!");
        } else if (data.status === 'failed') {
          clearInterval(pollInterval.current);
          setUploading(false);
          toast.error(getErrorMessage(data.error_message, "Protection task failed."));
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 1000);
  };

  const handleProtect = async () => {
    if (!file) {
      toast.error("Please select an image first.");
      return;
    }

    setUploading(true);
    setStatus('processing');
    setMetrics(null);

    const formData = new FormData();
    formData.append('files', file);
    formData.append('preset_name', presetName);
    formData.append('enable_grid', enableGrid ? 'true' : 'false');

    try {
      const res = await api.post('/images/protect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const queuedImage = res.data[0];
      if (queuedImage && queuedImage.id) {
        pollImageStatus(queuedImage.id);
      }
    } catch (err) {
      setUploading(false);
      setStatus('failed');
      console.error("Protection upload failed:", err);
      toast.error(getErrorMessage(err, "Failed to submit image protection task."));
    }
  };

  return (
    <main className="w-full px-6 md:px-10 py-8 bg-slate-50 min-h-[calc(100vh-64px)] selection:bg-emerald-100">
            {/* Header */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Varman Disruption Console
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Protect Photo Against AI Theft
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Upload a portrait photo to apply YuNet landmark micro-warping and Y-channel DCT frequency disruption before sharing online.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Upload Dropzone & Controls */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`bg-white rounded-3xl p-8 border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-sm min-h-[260px] ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                      : file
                      ? 'border-slate-300'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                  onClick={() => !file && document.getElementById('file-upload').click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="flex flex-col items-center gap-4 w-full">
                      <img
                        src={previewUrl}
                        alt="Selected Payload"
                        className="w-44 h-44 object-cover rounded-2xl border border-slate-200 shadow-md"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{file.name}</span>
                        <span className="text-[11px] text-slate-500 font-mono">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerReset();
                        }}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold underline underline-offset-4"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                        <Upload className="w-7 h-7" />
                      </div>
                      <div className="font-bold text-slate-900 text-base">Drop your photo here</div>
                      <p className="text-xs text-slate-500 max-w-xs">
                        Supports JPEG, PNG, WebP up to 25MB. High-resolution portrait photos recommended.
                      </p>
                    </div>
                  )}
                </div>

                {/* Preset Selector Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-600" /> Disruption Strength Preset
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600">{presetName} Mode</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-semibold">
                    {['Light', 'Balanced', 'Aggressive'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPresetName(p)}
                        className={`py-2.5 px-3 rounded-xl transition-all ${
                          presetName === p
                            ? 'bg-slate-900 text-white shadow-sm font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  {/* Preset Spec Description */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                    {presetName === 'Light' && (
                      <p><strong>Light (Quality Mode):</strong> SSIM Target ≥ 0.95. Sub-pixel landmark warp (0.5% face width). Maximum visual fidelity for clean portraits.</p>
                    )}
                    {presetName === 'Balanced' && (
                      <p><strong>Balanced Preset:</strong> SSIM Target ≥ 0.90. Inherits previous Aggressive baseline (1.5% face width warp). Optimal balance of visual quality & facial alignment disruption.</p>
                    )}
                    {presetName === 'Aggressive' && (
                      <p><strong>Aggressive Preset:</strong> SSIM Target Range 0.85 ≤ SSIM ≤ 0.90. Higher perturbation intensity (2.5% face width warp & high DCT shift) for maximum scraper defense.</p>
                    )}
                  </div>

                  {/* Optional Grid Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer select-none text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={enableGrid}
                      onChange={(e) => setEnableGrid(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    Enable optional spatial grid layer
                  </label>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleProtect}
                    disabled={!file || uploading}
                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                  >
                    {uploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                        Executing Disruption Pipeline...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 text-emerald-400" />
                        Run Protection Engine
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Processing Output & Inspection */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                {protectedUrl && previewUrl ? (
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Protection Complete
                      </span>
                      {processingTimeMs && (
                        <span className="text-xs font-mono font-bold text-slate-600">
                          {processingTimeMs} ms
                        </span>
                      )}
                    </div>

                    {/* Image Compare Component */}
                    <ImageCompare originalUrl={previewUrl} protectedUrl={protectedUrl} />

                    {/* Metrics Summary Chips */}
                    {metrics && (
                      <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">SSIM</div>
                          <div className="font-mono font-bold text-emerald-600">
                            {metrics.ssim_score?.toFixed(4) || 'N/A'}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">PSNR</div>
                          <div className="font-mono font-bold text-slate-900">
                            {metrics.psnr_score?.toFixed(1) || 'N/A'} dB
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Avg Y-NPR</div>
                          <div className="font-mono font-bold text-emerald-600">
                            {metrics.avg_y_npr?.toFixed(1) || 'N/A'}%
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Guardrail</div>
                          <div className="font-mono font-bold text-emerald-600">
                            {metrics.guardrail_satisfied ? 'Passed' : 'Adjusted'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center min-h-[480px] gap-4">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin"></div>
                        <h3 className="font-bold text-slate-900 text-lg">Processing Photo</h3>
                        <p className="text-xs text-slate-500 max-w-xs">
                          Executing YuNet detection, relative soft-masked warping, Y-channel DCT perturbation, and SSIM guardrail verification...
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <FileImage className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">No Protection Result Yet</h3>
                        <p className="text-xs text-slate-500 max-w-xs">
                          Select a photo on the left, choose your disruption preset, and click "Run Protection Engine" to inspect results.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
  );
};

export default UploadPage;
