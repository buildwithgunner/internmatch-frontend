import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Mail, Phone, Briefcase, Linkedin, FileText,
  UploadCloud, CheckCircle2, Image as ImageIcon,
  ArrowLeft, Save, Sparkles, ShieldCheck, GraduationCap,
  IdCard, FileCheck, Globe, Github, Info, MapPin,
  Clock, Target, ListChecks
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import Input from "../../components/ui/Input.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Button from "../../components/ui/Button.jsx";
import Select from "../../components/ui/Select.jsx";
import Swal from 'sweetalert2';

function EditProfile() {
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    university: '', faculty: '', department: '', level: '', graduation_year: '',
    bio: '', skills: '', country: '', state: '', city: '',
    linkedin_url: '', portfolio_url: '', github_url: '', website_url: '',
    preferred_role: '', internship_type: 'Onsite', availability: 'Full-time'
  });
  const [profileStrength, setProfileStrength] = useState({ percentage: 0, tasks: [] });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/student/profile');
      const user = res.data.student;
      const profile = user.profile || {};
      setFormData({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        university: profile.university || '',
        faculty: profile.faculty || '',
        department: profile.department || '',
        level: profile.level || '',
        graduation_year: profile.graduation_year || '',
        bio: profile.bio || '',
        skills: profile.skills || '',
        country: profile.country || '',
        state: profile.state || '',
        city: profile.city || '',
        linkedin_url: profile.linkedin_url || '',
        portfolio_url: profile.portfolio_url || '',
        github_url: profile.github_url || '',
        website_url: profile.website_url || '',
        preferred_role: profile.preferred_role || '',
        internship_type: profile.internship_type || 'Onsite',
        availability: profile.availability || 'Full-time',
      });
      setProfileStrength(user.profile_strength || { percentage: 0, tasks: [] });
      setDocuments(user.documents || []);
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await api.put('/student/profile', {
        name: fullName,
        phone: formData.phone,
        university: formData.university,
        faculty: formData.faculty,
        department: formData.department,
        level: formData.level,
        graduation_year: formData.graduation_year,
        bio: formData.bio,
        skills: formData.skills,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        linkedin_url: formData.linkedin_url,
        portfolio_url: formData.portfolio_url,
        github_url: formData.github_url,
        website_url: formData.website_url,
        preferred_role: formData.preferred_role,
        internship_type: formData.internship_type,
        availability: formData.availability,
      });
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your changes are now visible to recruiters.',
        timer: 1800,
        showConfirmButton: false,
        customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
      });
      fetchProfile();
      refreshUser();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Please check your connection and try again.',
        customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
      });
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(type);
    const data = new FormData();
    data.append('file', file);
    data.append('type', type);

    try {
      await api.post('/documents/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchProfile();
      refreshUser();
      Swal.fire({
        icon: 'success',
        title: 'File Uploaded',
        timer: 1200,
        showConfirmButton: false,
        customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
      });
    } finally {
      setUploading(null);
    }
  };

  const getDoc = (type) => documents.find(d => d.type === type);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50/70 dark:bg-slate-950/70">
      <div className="w-16 h-16 border-4 border-orange-200 dark:border-slate-700 border-t-orange-600 dark:border-t-orange-500 rounded-full animate-spin" />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">Loading your profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950/70 transition-colors duration-300 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16 space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-4">
              Edit Profile <Sparkles className="text-orange-600 dark:text-orange-500 animate-pulse" size={32} />
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
              Craft a standout profile that attracts top opportunities.
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/student/profile" className="px-6 py-3 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/40 rounded-2xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
              <ArrowLeft size={18} /> Back
            </Link>
            <Link to="/student/profile" className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-semibold shadow-lg shadow-orange-600/20 transition-all flex items-center gap-2">
              Preview Profile
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Left: Main Form */}
          <div className="lg:col-span-8 space-y-8">

            {/* Profile Strength */}
            <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-xl overflow-hidden p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-600/10 dark:bg-orange-700/20 rounded-xl text-orange-600 dark:text-orange-400">
                    <ListChecks size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Strength</h2>
                    <p className="text-sm text-slate-500">Complete these tasks to increase visibility</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-orange-600 dark:text-orange-500">{profileStrength.percentage}%</span>
                </div>
              </div>

              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-1000"
                  style={{ width: `${profileStrength.percentage}%` }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {profileStrength.tasks.map((task, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    {task.completed ? (
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                    )}
                    <span className={`text-[11px] font-bold uppercase tracking-tight ${task.completed ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400'}`}>
                      {task.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Identity */}
            <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-xl overflow-hidden">
              <div className="px-8 py-5 bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-700/40 flex items-center gap-3">
                <div className="p-3 bg-orange-600/10 dark:bg-orange-700/20 rounded-xl text-orange-600 dark:text-orange-400">
                  <User size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email (cannot change)</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/40 text-slate-600 dark:text-slate-400">
                      <Mail size={18} /> {formData.email}
                    </div>
                  </div>
                  <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="+234..." required />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-xl overflow-hidden">
              <div className="px-8 py-5 bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-700/40 flex items-center gap-3">
                <div className="p-3 bg-orange-600/10 dark:bg-orange-700/20 rounded-xl text-orange-600 dark:text-orange-400">
                  <GraduationCap size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Academic Information</h2>
              </div>
              <div className="p-8 space-y-6">
                <Input label="University" name="university" value={formData.university} onChange={handleChange} placeholder="e.g. University of Lagos" required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Faculty" name="faculty" value={formData.faculty} onChange={handleChange} placeholder="Faculty eg. Engineering" required />
                  <Input label="Department" name="department" value={formData.department} onChange={handleChange} placeholder="Department e.g. Computer Science" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Current Level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    required
                    options={[
                      { value: '100', label: '100 Level' },
                      { value: '200', label: '200 Level' },
                      { value: '300', label: '300 Level' },
                      { value: '400', label: '400 Level' },
                      { value: '500', label: '500 Level' },
                      { value: 'Graduate', label: 'Graduate' },
                    ]}
                  />
                  <Input label="Graduation Year" name="graduation_year" type="number" value={formData.graduation_year} onChange={handleChange} placeholder="e.g. 2026" required />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-xl overflow-hidden">
              <div className="px-8 py-5 bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-700/40 flex items-center gap-3">
                <div className="p-3 bg-orange-600/10 dark:bg-orange-700/20 rounded-xl text-orange-600 dark:text-orange-400">
                  <MapPin size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Location Details</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input label="Country" name="country" value={formData.country} onChange={handleChange} placeholder="Nigeria" required />
                  <Input label="State" name="state" value={formData.state} onChange={handleChange} placeholder="Lagos" required />
                  <Input label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Yaba" />
                </div>
              </div>
            </div>

            {/* Internship Preferences */}
            <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-xl overflow-hidden">
              <div className="px-8 py-5 bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-700/40 flex items-center gap-3">
                <div className="p-3 bg-orange-600/10 dark:bg-orange-700/20 rounded-xl text-orange-600 dark:text-orange-400">
                  <Target size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Internship Preferences</h2>
              </div>
              <div className="p-8 space-y-6">
                <Input label="Preferred Role" name="preferred_role" value={formData.preferred_role} onChange={handleChange} placeholder="e.g. Marketing Intern, Fullstack Developer" required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Internship Type"
                    name="internship_type"
                    value={formData.internship_type}
                    onChange={handleChange}
                    required
                    options={[
                      { value: 'Remote', label: 'Remote Only' },
                      { value: 'Onsite', label: 'Onsite' },
                      { value: 'Hybrid', label: 'Hybrid' },
                    ]}
                  />
                  <Select
                    label="Availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    required
                    options={[
                      { value: 'Full-time', label: 'Full-time' },
                      { value: 'Part-time', label: 'Part-time' },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Professional */}
            <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-xl overflow-hidden">
              <div className="px-8 py-5 bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-700/40 flex items-center gap-3">
                <div className="p-3 bg-orange-600/10 dark:bg-orange-700/20 rounded-xl text-orange-600 dark:text-orange-400">
                  <Briefcase size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Professional Details & Links</h2>
              </div>
              <div className="p-8 space-y-6">
                <Textarea label="Bio / About You" name="bio" value={formData.bio} onChange={handleChange} rows={5} placeholder="Share your story, passions, and career goals..." />
                <Input label="Skills (comma-separated)" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Python, AutoCAD, Digital Marketing..." />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="relative">
                    <Input label="LinkedIn Profile" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} placeholder="linkedin.com/in/username" className="pl-12" />
                    <Linkedin size={20} className="absolute left-4 top-11 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div className="relative">
                    <Input label="GitHub Link" name="github_url" value={formData.github_url} onChange={handleChange} placeholder="github.com/username" className="pl-12" />
                    <Github size={20} className="absolute left-4 top-11 text-slate-400 dark:text-slate-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Input label="Portfolio Website" name="portfolio_url" value={formData.portfolio_url} onChange={handleChange} placeholder="behance.net/username" className="pl-12" />
                    <Briefcase size={20} className="absolute left-4 top-11 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div className="relative">
                    <Input label="Personal Website" name="website_url" value={formData.website_url} onChange={handleChange} placeholder="yourname.dev" className="pl-12" />
                    <Globe size={20} className="absolute left-4 top-11 text-slate-400 dark:text-slate-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="px-10 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-semibold shadow-lg shadow-orange-600/20 transition-all flex items-center gap-2 text-lg"
              >
                <Save size={20} /> Save Changes
              </Button>
            </div>
          </div>

          {/* Right: Document Vault */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-orange-600/10 dark:bg-orange-700/20 rounded-2xl">
                  <ShieldCheck size={28} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Document Vault</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Secure • Encrypted • Recruiter-Visible</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                Up-to-date documents increase your visibility to recruiters by up to 40%.
              </p>

              <div className="space-y-4">
                {[
                  { title: "Resume / CV", type: "resume", icon: <FileText size={24} /> },
                  { title: "Passport Photo", type: "passport_photo", icon: <ImageIcon size={24} /> },
                  { title: "University Certificate", type: "university_certificate", icon: <GraduationCap size={24} /> },
                  { title: "Student ID Card", type: "student_id", icon: <IdCard size={24} /> },
                  { title: "Academic Transcript", type: "transcript", icon: <FileCheck size={24} /> },
                ].map(item => (
                  <UploadTile
                    key={item.type}
                    title={item.title}
                    type={item.type}
                    icon={item.icon}
                    onUpload={handleFileUpload}
                    doc={getDoc(item.type)}
                    uploading={uploading === item.type}
                  />
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function UploadTile({ title, type, icon, onUpload, doc, uploading }) {
  return (
    <div className={`bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border transition-all rounded-2xl overflow-hidden ${doc ? 'border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20' : 'border-slate-200/50 dark:border-slate-700/40 hover:border-orange-400/50 dark:hover:border-orange-500/50'
      }`}>
      <div className="p-5 flex items-center gap-5">
        <div className={`p-4 rounded-xl transition-colors ${doc ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 group-hover:bg-orange-100/50 dark:group-hover:bg-orange-900/30'
          }`}>
          {uploading ? <span className="loading loading-spinner loading-sm" /> : icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <p className="text-sm font-medium truncate">
            {doc ? doc.original_name : 'Not uploaded yet'}
          </p>
        </div>
        <label className="cursor-pointer">
          <div className={`p-3 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors ${doc ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-500'
            }`}>
            {doc ? <CheckCircle2 size={22} /> : <UploadCloud size={22} />}
          </div>
          <input type="file" className="hidden" onChange={(e) => onUpload(e, type)} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

export default EditProfile;