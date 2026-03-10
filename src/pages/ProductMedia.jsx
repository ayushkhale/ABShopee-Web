// import { useState, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../services/api'; // Direct import for FormData
// import { useBusiness } from '../context/BusinessContext';

// // PrimeReact & Icons
// import { Button } from 'primereact/button';
// import { Toast } from 'primereact/toast';
// import { Dropdown } from 'primereact/dropdown';
// import { ProgressBar } from 'primereact/progressbar';
// import { FaCloudUploadAlt, FaArrowLeft, FaImages, FaTimes, FaFileImage, FaFileVideo, FaCheckCircle } from 'react-icons/fa';

// const ProductMedia = () => {
//     const { id } = useParams();
//     const { businessId } = useBusiness();
//     const navigate = useNavigate();
//     const toast = useRef(null);
//     const fileInputRef = useRef(null);

//     // --- State ---
//     const [role, setRole] = useState('gallery');
//     const [files, setFiles] = useState([]);
//     const [previews, setPreviews] = useState([]);
//     const [uploading, setUploading] = useState(false);
//     const [progress, setProgress] = useState(0);

//     const roles = [
//         { label: 'Gallery (Images/Videos)', value: 'gallery' },
//         { label: 'Primary Image (Cover)', value: 'primary' }
//     ];

//     // --- 1. File Handling ---
//     const handleFileSelect = (e) => {
//         const selectedFiles = Array.from(e.target.files);
        
//         // Validation Logic
//         if (selectedFiles.length === 0) return;

//         if (role === 'primary') {
//             if (selectedFiles.length > 1) {
//                 toast.current.show({ severity: 'warn', summary: 'Limit Exceeded', detail: 'Primary media must be exactly one file.' });
//                 return;
//             }
//             if (!selectedFiles[0].type.startsWith('image/')) {
//                 toast.current.show({ severity: 'error', summary: 'Invalid Type', detail: 'Primary media must be an image.' });
//                 return;
//             }
//         }

//         if (selectedFiles.length > 5) {
//             toast.current.show({ severity: 'warn', summary: 'Limit Exceeded', detail: 'Maximum 5 files allowed per upload.' });
//             return;
//         }

//         setFiles(selectedFiles);

//         // Generate Previews
//         const newPreviews = selectedFiles.map(file => ({
//             name: file.name,
//             size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
//             type: file.type,
//             url: URL.createObjectURL(file)
//         }));
//         setPreviews(newPreviews);
//     };

//     const clearFiles = () => {
//         setFiles([]);
//         setPreviews([]);
//         if (fileInputRef.current) fileInputRef.current.value = '';
//     };

//     // --- 2. Upload Logic ---
//     const handleUpload = async () => {
//         if (files.length === 0) return;

//         setUploading(true);
//         setProgress(0);

//         const formData = new FormData();
//         formData.append('role', role);
//         files.forEach(file => {
//             formData.append('files', file);
//         });

//         try {
//             // Using apiClient directly to handle FormData headers automatically
//             // Note: We access the full URL structure as per your previous requirement
//             await apiClient.post(`/seller/business/${businessId}/items/${id}/media`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 },
//                 onUploadProgress: (progressEvent) => {
//                     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                     setProgress(percentCompleted);
//                 }
//             });

//             toast.current.show({ severity: 'success', summary: 'Uploaded', detail: 'Media added successfully' });
//             clearFiles();
            
//             // Optional: Redirect back to details after short delay
//             setTimeout(() => navigate(`/product/${id}`), 1000);

//         } catch (error) {
//             console.error(error);
//             toast.current.show({ severity: 'error', summary: 'Upload Failed', detail: error.response?.data?.message || error.message });
//         } finally {
//             setUploading(false);
//         }
//     };

//     // --- 3. Render ---
//     return (
//         <div className="max-w-4xl mx-auto pb-24 animate-fade-in mt-8 px-4">
//             <Toast ref={toast} />

//             {/* Header */}
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//                 <div>
//                     <button onClick={() => navigate(`/product/${id}`)} className="flex items-center text-gray-500 hover:text-[#1a1a2e] mb-2 transition-colors">
//                         <FaArrowLeft className="mr-2 text-xs" /> Back to Product
//                     </button>
//                     <h1 className="text-3xl font-black text-[#1a1a2e] font-playfair">Upload Media</h1>
//                     <p className="text-gray-500 text-sm">Add images or videos to Item ID: <span className="font-mono text-xs bg-gray-100 px-1 rounded">{id.slice(0,8)}...</span></p>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
//                 {/* --- Left: Configuration --- */}
//                 <div className="lg:col-span-1 space-y-6">
//                     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//                         <div className="mb-6">
//                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Media Role</label>
//                             <Dropdown 
//                                 value={role} 
//                                 options={roles} 
//                                 onChange={(e) => {
//                                     setRole(e.value);
//                                     clearFiles(); // Clear files if role changes to prevent invalid types
//                                 }} 
//                                 className="w-full !rounded-xl !border-gray-200"
//                             />
//                             <p className="text-xs text-gray-400 mt-2 leading-relaxed">
//                                 <strong>Primary:</strong> Replaces the main cover image.<br/>
//                                 <strong>Gallery:</strong> Adds to the product carousel.
//                             </p>
//                         </div>

//                         <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
//                             <h4 className="font-bold text-blue-800 text-sm mb-2 flex items-center"><FaCheckCircle className="mr-2"/> Requirements</h4>
//                             <ul className="text-xs text-blue-600 space-y-1 list-disc pl-4">
//                                 <li>Max 5 files per upload</li>
//                                 <li>Images: JPG, PNG, WEBP</li>
//                                 <li>Videos: MP4 (Gallery Only)</li>
//                                 <li>Max size: 10MB per file</li>
//                             </ul>
//                         </div>
//                     </div>
//                 </div>

//                 {/* --- Right: Upload Area --- */}
//                 <div className="lg:col-span-2 space-y-6">
                    
//                     {/* Drag Drop Zone */}
//                     <div 
//                         className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer group ${files.length > 0 ? 'border-green-300 bg-green-50/30' : 'border-gray-300 hover:border-[#1a1a2e] hover:bg-gray-50'}`}
//                         onClick={() => fileInputRef.current.click()}
//                     >
//                         <input 
//                             type="file" 
//                             ref={fileInputRef} 
//                             className="hidden" 
//                             multiple 
//                             accept={role === 'primary' ? "image/*" : "image/*,video/*"}
//                             onChange={handleFileSelect}
//                         />
                        
//                         <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
//                             {files.length > 0 ? <FaCheckCircle className="text-3xl text-green-500"/> : <FaCloudUploadAlt className="text-3xl text-[#1a1a2e]"/>}
//                         </div>
                        
//                         <h3 className="font-bold text-lg text-gray-700">
//                             {files.length > 0 ? `${files.length} File(s) Selected` : "Click to Upload"}
//                         </h3>
//                         <p className="text-sm text-gray-400 mt-1">
//                             {files.length > 0 ? "Click to change selection" : "or drag and drop files here"}
//                         </p>
//                     </div>

//                     {/* Previews */}
//                     {previews.length > 0 && (
//                         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//                             <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
//                                 <span className="text-xs font-bold text-gray-500 uppercase">Selected Files</span>
//                                 <button onClick={clearFiles} className="text-xs text-red-500 font-bold hover:underline">Clear All</button>
//                             </div>
//                             <div className="divide-y divide-gray-100">
//                                 {previews.map((file, idx) => (
//                                     <div key={idx} className="p-4 flex items-center gap-4">
//                                         <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-200">
//                                             {file.type.startsWith('image/') ? (
//                                                 <img src={file.url} alt="Preview" className="w-full h-full object-cover" />
//                                             ) : (
//                                                 <FaFileVideo className="text-2xl text-gray-400" />
//                                             )}
//                                         </div>
//                                         <div className="flex-1 min-w-0">
//                                             <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
//                                             <p className="text-xs text-gray-500">{file.size} • {file.type}</p>
//                                         </div>
//                                         <div className="text-green-500"><FaCheckCircle/></div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Progress Bar */}
//                     {uploading && (
//                         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//                             <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
//                                 <span>Uploading...</span>
//                                 <span>{progress}%</span>
//                             </div>
//                             <ProgressBar value={progress} showValue={false} style={{ height: '8px' }} color="#1a1a2e"></ProgressBar>
//                         </div>
//                     )}

//                     {/* Action Button */}
//                     <Button 
//                         label={uploading ? "Uploading..." : "Start Upload"} 
//                         icon="pi pi-cloud-upload" 
//                         disabled={files.length === 0 || uploading}
//                         onClick={handleUpload}
//                         className="w-full !bg-[#1a1a2e] !border-[#1a1a2e] !py-4 !rounded-xl !text-lg !font-bold shadow-lg hover:!bg-[#2d2d44] transition-all"
//                     />

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductMedia;
import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { useBusiness } from '../context/BusinessContext';

// PrimeReact
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { ProgressBar } from 'primereact/progressbar';

// Icons
import {
  FaCloudUploadAlt,
  FaArrowLeft,
  FaFileVideo,
  FaCheckCircle,
  FaImage,
  FaTrash,
  FaImages,
  FaInfoCircle,
  FaShieldAlt,
  FaStar,
  FaLayerGroup,
} from 'react-icons/fa';

const color = {
  primary: '#2196F3',
  secondary: '#0057ae',
  background: '#F5F5F5',
  text: '#212121',
};

const ProductMedia = () => {
  const { id } = useParams();
  const { businessId } = useBusiness();
  const navigate = useNavigate();
  const toast = useRef(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const [role, setRole] = useState('gallery');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const roles = [
    { label: 'Gallery Media', value: 'gallery' },
    { label: 'Primary Cover Image', value: 'primary' }
  ];

  /* ================= FILE HANDLING ================= */

  const processFiles = (selectedFiles) => {
    if (!selectedFiles.length) return;

    if (role === 'primary') {
      if (selectedFiles.length > 1) {
        toast.current.show({ severity: 'warn', summary: 'Only one file allowed for primary' });
        return;
      }
      if (!selectedFiles[0].type.startsWith('image/')) {
        toast.current.show({ severity: 'error', summary: 'Primary must be an image' });
        return;
      }
    }

    if (selectedFiles.length > 5) {
      toast.current.show({ severity: 'warn', summary: 'Max 5 files allowed' });
      return;
    }

    setFiles(selectedFiles);
    setPreviews(
      selectedFiles.map(file => ({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type,
        url: URL.createObjectURL(file)
      }))
    );
  };

  const handleFileSelect = (e) => {
    processFiles(Array.from(e.target.files));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const clearFiles = () => {
    setFiles([]);
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ================= UPLOAD ================= */

  const handleUpload = async () => {
    if (!files.length) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('role', role);
    files.forEach(file => formData.append('files', file));

    try {
      await apiClient.post(
        `/seller/business/${businessId}/items/${id}/media`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) =>
            setProgress(Math.round((e.loaded * 100) / e.total))
        }
      );

      toast.current.show({ severity: 'success', summary: 'Upload successful!' });
      clearFiles();
      setTimeout(() => navigate(`/dashboard/product/${id}`), 900);
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: 'Upload failed',
        detail: err.response?.data?.message || err.message
      });
    } finally {
      setUploading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 animate-fade-in">
      <Toast ref={toast} />

      {/* Page Header */}
      <div className="mb-10">
        <button
          onClick={() => navigate(`/dashboard/product/${id}`)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#2196F3] mb-4 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-blue-50 transition-colors">
            <FaArrowLeft className="text-xs" />
          </div>
          Back to Product
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: color.text }}>
              Product Media
            </h1>
            <p className="text-sm text-gray-500">
              Upload images or videos for item&nbsp;
              <span className="font-mono px-2 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
                {id.slice(0, 8)}…
              </span>
            </p>
          </div>

          {files.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl" style={{ backgroundColor: `${color.primary}15` }}>
              <FaImages style={{ color: color.primary }} />
              <span className="text-sm font-bold" style={{ color: color.primary }}>
                {files.length} file{files.length !== 1 ? 's' : ''} ready
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Config Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-5">

            {/* Media Type Selector */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: color.primary }}>
                  <FaLayerGroup />
                </div>
                <h3 className="font-bold text-[#212121]">Media Type</h3>
              </div>

              <div className="space-y-3">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => { setRole(r.value); clearFiles(); }}
                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border-2 transition-all font-semibold text-sm text-left ${
                      role === r.value
                        ? 'border-[#2196F3] text-[#2196F3]'
                        : 'border-gray-100 text-gray-600 hover:border-gray-200 bg-gray-50'
                    }`}
                    style={role === r.value ? { backgroundColor: `${color.primary}10` } : {}}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      role === r.value ? 'text-white' : 'text-gray-400 bg-gray-200'
                    }`}
                    style={role === r.value ? { backgroundColor: color.primary } : {}}
                    >
                      {r.value === 'primary' ? <FaStar className="text-xs" /> : <FaImages className="text-xs" />}
                    </div>
                    {r.label}
                    {role === r.value && (
                      <FaCheckCircle className="ml-auto text-sm" style={{ color: color.primary }} />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                <p><span className="font-bold" style={{ color: color.secondary }}>Primary:</span> Replaces the main cover image</p>
                <p><span className="font-bold" style={{ color: color.secondary }}>Gallery:</span> Adds to the image carousel</p>
              </div>
            </div>

            {/* Upload Rules */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: color.secondary }}>
                  <FaInfoCircle />
                </div>
                <h3 className="font-bold text-[#212121]">Upload Rules</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: '📁', text: 'Max 5 files per upload' },
                  { icon: '🖼️', text: 'Images: JPG, PNG, WEBP' },
                  { icon: '🎬', text: 'Videos: MP4 (gallery only)' },
                  { icon: '⚖️', text: 'Max 10MB per file' },
                ].map((rule, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="text-base">{rule.icon}</span>
                    <span className="font-medium">{rule.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security note */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
                  <FaShieldAlt />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#212121]">Secure Upload</p>
                  <p className="text-xs text-gray-500">Files are encrypted in transit</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Upload Area */}
        <div className="lg:col-span-2 space-y-6">

          {/* Drop Zone */}
          <div
            ref={dropZoneRef}
            onClick={() => fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-3xl p-14 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-[#2196F3] bg-blue-50'
                : files.length
                ? 'border-emerald-400 bg-emerald-50'
                : 'border-gray-200 hover:border-[#2196F3] bg-white hover:bg-blue-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              hidden
              multiple
              accept={role === 'primary' ? 'image/*' : 'image/*,video/*'}
              onChange={handleFileSelect}
            />

            <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-md transition-all ${
              dragOver
                ? 'scale-110'
                : files.length
                ? ''
                : ''
            }`}
              style={{ backgroundColor: files.length ? '#10b981' : dragOver ? color.primary : color.primary }}
            >
              {files.length
                ? <FaCheckCircle className="text-5xl text-white" />
                : <FaCloudUploadAlt className="text-5xl text-white" />
              }
            </div>

            <h3 className="font-bold text-xl mb-2" style={{ color: color.text }}>
              {dragOver
                ? 'Drop your files here!'
                : files.length
                ? `${files.length} file${files.length !== 1 ? 's' : ''} selected`
                : 'Upload Media Files'
              }
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {files.length
                ? 'Click to add more files or scroll down to upload'
                : 'Click to browse or drag & drop your files here'
              }
            </p>

            {!files.length && (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm font-bold transition-all hover:scale-105"
                style={{ backgroundColor: color.primary }}
              >
                <FaImage /> Browse Files
              </div>
            )}
          </div>

          {/* File Previews */}
          {previews.length > 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between" style={{ backgroundColor: color.background }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs" style={{ backgroundColor: color.primary }}>
                    <FaImages />
                  </div>
                  <span className="font-bold text-sm" style={{ color: color.text }}>
                    Selected Files ({previews.length})
                  </span>
                </div>
                <button
                  onClick={clearFiles}
                  className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-700 px-3 py-2 rounded-xl hover:bg-red-50 transition-all"
                >
                  <FaTrash className="text-xs" /> Clear All
                </button>
              </div>

              {/* Image Grid Preview */}
              {previews.some(p => p.type.startsWith('image')) && (
                <div className="p-4 grid grid-cols-3 sm:grid-cols-5 gap-3 border-b border-gray-100">
                  {previews.map((file, i) => (
                    file.type.startsWith('image') && (
                      <div key={i} className="relative group aspect-square">
                        <img
                          src={file.url}
                          className="w-full h-full object-cover rounded-2xl"
                          alt={file.name}
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )
                  ))}
                </div>
              )}

              {/* File List */}
              <div className="divide-y divide-gray-100">
                {previews.map((file, i) => (
                  <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 bg-gray-50">
                      {file.type.startsWith('image')
                        ? <img src={file.url} className="w-full h-full object-cover rounded-2xl" alt="" />
                        : <FaFileVideo className="text-xl text-gray-400" />
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: color.text }}>{file.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">{file.size}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
                          {file.type.startsWith('image') ? 'Image' : 'Video'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFile(i)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white animate-pulse" style={{ backgroundColor: color.primary }}>
                  <FaCloudUploadAlt className="text-xl" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold" style={{ color: color.text }}>Uploading files...</span>
                    <span className="text-sm font-bold" style={{ color: color.primary }}>{progress}%</span>
                  </div>
                  <ProgressBar
                    value={progress}
                    showValue={false}
                    style={{ height: '8px', borderRadius: '99px' }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Please don't close this page while upload is in progress
              </p>
            </div>
          )}

          {/* Upload Button */}
          <div className="space-y-3">
            <button
              disabled={!files.length || uploading}
              onClick={handleUpload}
              className="w-full py-4 rounded-2xl text-white text-base font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              style={{ backgroundColor: color.primary }}
            >
              {uploading ? (
                <>
                  <i className="pi pi-spin pi-spinner"></i>
                  Uploading {progress}%...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt className="text-xl" />
                  {files.length ? `Upload ${files.length} File${files.length !== 1 ? 's' : ''}` : 'Select Files to Upload'}
                </>
              )}
            </button>

            {files.length > 0 && !uploading && (
              <button
                onClick={clearFiles}
                className="w-full py-3 rounded-2xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
              >
                Cancel & Clear Selection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMedia;