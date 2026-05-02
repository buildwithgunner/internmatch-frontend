import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { UploadCloud, Trash2, Save, AlertCircle, Building2, Globe, Mail, Briefcase, FileText, Eye, Edit, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import Cropper from 'react-easy-crop';

function CompanyProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    website: '',
    description: '',
    logo_path: '',
    support_email: '',
    industry: '',
  });

  const [previewLogo, setPreviewLogo] = useState(null);
  const [croppedLogo, setCroppedLogo] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropping, setCropping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false); // real-time preview toggle
  const [cropImageSrc, setCropImageSrc] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/company/profile');
        const company = res.data.company;

        setFormData({
          company_name: company.company_name || '',
          website: company.website || '',
          description: company.description || '',
          logo_path: company.logo_path || '',
          support_email: company.email || '',
          industry: company.industry || 'Technology',
        });

        if (company.logo_path) {
          const fullUrl = `https://internmatch-backend-api.up.railway.app/storage/${company.logo_path}`;
          setPreviewLogo(fullUrl);
        }
      } catch (err) {
        console.error('Failed to load company profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    // You can save croppedAreaPixels if you want server-side cropping later
  }, []);

  const handleLogoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: 'File too large',
        text: 'Maximum allowed size is 2MB.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      setCropping(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async () => {
    // For simplicity, we use the preview as cropped result (real crop needs canvas)
    // In production, use canvas to generate cropped image blob and upload it
    setPreviewLogo(cropImageSrc); // placeholder — replace with real cropped blob URL
    setCropping(false);

    // Simulate upload of cropped image (in real app: convert to blob → FormData)
    Swal.fire({
      icon: 'info',
      title: 'Logo Cropped',
      text: 'In production, this would now be uploaded as cropped version.',
      timer: 2000,
    });
  };

  const handleLogoUpload = async () => {
    // This would be triggered after crop → upload the cropped blob
    // For now, just placeholder success
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      Swal.fire({ icon: 'success', title: 'Logo Updated', timer: 1500 });
    }, 1500);
  };

  const handleLogoDelete = async () => {
    const result = await Swal.fire({
      title: 'Remove Logo?',
      text: "This will delete your company logo permanently.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Remove',
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete('/company/logo');
      setFormData(prev => ({ ...prev, logo_path: '' }));
      setPreviewLogo(null);
      Swal.fire({ icon: 'success', title: 'Logo Removed', timer: 1500 });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed to Remove' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.patch('/company/profile', formData);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your company information has been saved.',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Please check your inputs and try again.',
      });
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Deactivate Company Profile?',
      text: 'All your postings will be hidden. This can be reversed by an administrator.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, Deactivate',
      background: '#0f172a',
      color: '#fff',
      customClass: { popup: 'rounded-3xl border border-slate-700/40 shadow-2xl backdrop-blur-2xl' }
    });

    if (result.isConfirmed) {
      try {
        await api.delete('/company/account');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        Swal.fire({
          title: 'Deactivated',
          text: 'Company account deactivated successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#0f172a',
          color: '#fff'
        });
        setTimeout(() => navigate('/login'), 2000);
      } catch (err) {
        Swal.fire('Error', 'Failed to deactivate account.', 'error');
      }
    }
  };

  // Profile completeness calculation
  const calculateCompleteness = () => {
    let score = 0;
    if (formData.company_name.trim()) score += 20;
    if (formData.website.trim()) score += 15;
    if (formData.description.trim().length > 50) score += 25;
    if (formData.industry && formData.industry !== 'Technology') score += 10; // bonus for custom
    if (previewLogo || formData.logo_path) score += 30;
    return score;
  };

  const completeness = calculateCompleteness();
  const isComplete = completeness === 100;

  const logoUrl = previewLogo ||
    (formData.logo_path ? `https://internmatch-backend-api.up.railway.app/storage/${formData.logo_path}` :
      "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-designs_343694-2506.jpg");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50/70 dark:bg-slate-950/70">
        <div className="w-16 h-16 border-4 border-orange-200 dark:border-slate-700 border-t-orange-600 dark:border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading company profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950/70 transition-colors duration-300 pb-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">

        {/* Header + Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-4">
              Company Profile <Building2 size={32} className="text-orange-600 dark:text-orange-500" />
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Update your company's public information and branding.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {previewMode ? 'Preview Mode' : 'Edit Mode'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={previewMode}
                  onChange={() => setPreviewMode(!previewMode)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            {!previewMode && (
              <button
                onClick={handleSubmit}
                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-semibold shadow-lg shadow-orange-600/20 transition-all flex items-center gap-2 text-lg"
                disabled={uploading}
              >
                <Save size={20} /> Save Changes
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              Profile Completeness
              {isComplete && <CheckCircle2 size={20} className="text-emerald-500" />}
            </h3>
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{completeness}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {isComplete ? 'Your profile is fully visible to students!' : 'Add more info to reach 100% visibility.'}
          </p>
        </div>

        {/* Main Content – Edit vs Preview */}
        {previewMode ? (
          <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-slate-200/50 dark:border-slate-700/40 shadow-xl">
                <img src={logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{formData.company_name || 'Your Company'}</h2>
                <p className="text-lg text-orange-600 dark:text-orange-400 mt-2">
                  {formData.industry} • <a href={formData.website} target="_blank" className="hover:underline">{formData.website || 'website.com'}</a>
                </p>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
                {formData.description || "Your company description will appear here..."}
              </p>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Contact: {formData.support_email}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 md:p-10 space-y-10">
              {/* Logo Section with Cropper */}
              <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-slate-200/50 dark:border-slate-700/40">
                <div className="relative group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-slate-200/50 dark:border-slate-700/40 shadow-xl">
                    <img
                      src={previewLogo || logoUrl}
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                    <UploadCloud size={32} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-4 text-center md:text-left">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Company Logo</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Recommended: square PNG/JPG. Max 2MB. Crop to focus on logo.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <label className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-medium cursor-pointer transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                      Change Logo
                      <input type="file" accept="image/*" onChange={handleLogoSelect} className="hidden" />
                    </label>

                    {(previewLogo || formData.logo_path) && (
                      <button
                        onClick={handleLogoDelete}
                        className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <Trash2 size={18} /> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Cropper Modal */}
              {cropping && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Crop Your Logo</h3>
                      <button onClick={() => setCropping(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                        <X size={24} />
                      </button>
                    </div>

                    <div className="relative h-96">
                      <Cropper
                        image={cropImageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    </div>

                    <div className="p-6 flex justify-end gap-4">
                      <button
                        onClick={() => setCropping(false)}
                        className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCropConfirm}
                        className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors"
                      >
                        Confirm Crop & Upload
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-xl focus:border-orange-500 dark:focus:border-orange-400 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Website
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300/50 dark:border-slate-600/50 rounded-l-xl text-slate-500 dark:text-slate-400">
                      https://
                    </span>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-r-xl focus:border-orange-500 dark:focus:border-orange-400 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Industry
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-xl focus:border-orange-500 dark:focus:border-orange-400 outline-none transition-all"
                  >
                    <option>Technology</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                    <option>Retail</option>
                    <option>Manufacturing</option>
                    <option>Real Estate</option>
                    <option>Marketing & Advertising</option>
                    <option>Consulting</option>
                    <option>Logistics & Supply Chain</option>
                    <option>Media & Entertainment</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={formData.support_email}
                    disabled
                    className="w-full px-4 py-3 bg-slate-100/70 dark:bg-slate-800/70 border border-slate-300/50 dark:border-slate-600/50 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-xl focus:border-orange-500 dark:focus:border-orange-400 outline-none transition-all resize-none"
                  placeholder="Tell your company's story, mission, values, and what makes you unique..."
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-rose-300/50 dark:border-rose-800/40 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold text-rose-700 dark:text-rose-400 flex items-center gap-3">
                <AlertCircle size={24} /> Danger Zone
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Deactivate your company account. Your profile and internships will be hidden.
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-semibold shadow-lg shadow-rose-600/20 transition-all"
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyProfile;