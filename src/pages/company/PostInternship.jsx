import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Briefcase, MapPin, Clock, BadgeDollarSign,
  FileText, ListChecks, Calendar, Rocket,
  ArrowLeft, Sparkles, Save, AlertCircle
} from 'lucide-react';
import api from '../../services/api.js';
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Checkbox from "../../components/ui/Checkbox.jsx";
import Button from "../../components/ui/Button.jsx";
import Swal from 'sweetalert2';

function PostInternship({ mode = 'company' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    type: '',
    duration: '',
    stipend: '',
    paid: false,
    description: '',
    requirements: '',
    deadline: '',
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchInternship = async () => {
        try {
          const res = await api.get(`/internships/${id}`);
          const data = res.data.internship;
          setFormData({
            title: data.title || '',
            category: data.category || '',
            location: data.location || '',
            type: data.type || '',
            duration: data.duration || '',
            stipend: data.stipend || '',
            paid: Boolean(data.paid),
            description: data.description || '',
            requirements: data.requirements || '',
            deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : '',
          });
        } catch (err) {
          setError('Failed to load internship details.');
          Swal.fire({
            icon: 'error',
            title: 'Load Failed',
            text: 'Could not fetch internship data.',
            customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
          });
        } finally {
          setPageLoading(false);
        }
      };
      fetchInternship();
    } else {
      setPageLoading(false);
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title.trim() || !formData.location.trim() || !formData.type) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        location: formData.location.trim(),
        type: formData.type,
        duration: formData.duration.trim(),
        stipend: formData.paid ? formData.stipend.trim() : null,
        paid: formData.paid,
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
        deadline: formData.deadline || null,
      };

      if (isEditing) {
        await api.put(`/internships/${id}`, payload);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Your internship listing has been refreshed.',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
        });
        setTimeout(() => navigate(mode === 'recruiter' ? '/recruiter/my-internships' : '/company/manage'), 2000);
      } else {
        const endpoint = mode === 'recruiter' ? '/recruiter/internships' : '/company/internships';
        await api.post(endpoint, payload);
        Swal.fire({
          icon: 'success',
          title: 'Published!',
          text: 'Your internship is now live for students.',
          confirmButtonColor: '#ea580c',
          customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
        });
        navigate(mode === 'recruiter' ? '/recruiter/my-internships' : '/company/manage');
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'post'} internship.`);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Something went wrong.',
        customClass: { popup: 'backdrop-blur-2xl bg-white/40 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-700/40 shadow-2xl' }
      });
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50/70 dark:bg-slate-950/70">
        <div className="w-16 h-16 border-4 border-orange-200 dark:border-slate-700 border-t-orange-600 dark:border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading internship data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950/70 transition-colors duration-300 pb-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-600/10 dark:bg-orange-700/20 text-orange-700 dark:text-orange-300 rounded-full text-sm font-semibold">
              <Rocket size={16} /> Opportunity Builder
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isEditing ? 'Edit Opportunity' : 'Create New Opportunity'}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
              {isEditing
                ? 'Update details to attract the best candidates.'
                : 'Define the role and reach talented students worldwide.'}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate(mode === 'recruiter' ? '/recruiter/my-internships' : '/company/manage')}
            className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back to Manage
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-800/40 rounded-3xl text-rose-700 dark:text-rose-300">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Left Column – Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Core Info */}
            <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-xl overflow-hidden">
              <div className="px-8 py-6 bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-700/40 flex items-center gap-3">
                <Briefcase size={24} className="text-orange-600 dark:text-orange-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Core Details</h2>
              </div>
              <div className="p-8 space-y-6">
                <Input
                  label="Internship Title *"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Frontend Development Intern"
                  required
                />
                <Select
                  label="Category / Field *"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  options={[
                    { value: '', label: 'Select category' },
                    { value: 'Software Engineering', label: 'Software Engineering' },
                    { value: 'Data Science', label: 'Data Science' },
                    { value: 'Design', label: 'Design' },
                    { value: 'Marketing', label: 'Marketing' },
                    { value: 'Business / Finance', label: 'Business / Finance' },
                    { value: 'Content / Media', label: 'Content / Media' },
                    { value: 'Other', label: 'Other' },
                  ]}
                  required
                />
              </div>
            </div>

            {/* Description & Requirements */}
            <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-xl overflow-hidden">
              <div className="px-8 py-6 bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-700/40 flex items-center gap-3">
                <FileText size={24} className="text-orange-600 dark:text-orange-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Role Description</h2>
              </div>
              <div className="p-8 space-y-6">
                <Textarea
                  label="Full Description *"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={8}
                  placeholder="What will the intern do day-to-day? What skills will they gain? Be specific and exciting..."
                  required
                />
                <Textarea
                  label="Requirements & Qualifications"
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  rows={6}
                  placeholder="• Strong knowledge of React&#10;• Familiar with Git&#10;• Excellent communication skills..."
                />
              </div>
            </div>
          </div>

          {/* Right Column – Logistics & Publish */}
          <div className="lg:col-span-4 space-y-8">
            {/* Logistics Card */}
            <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-xl overflow-hidden">
              <div className="px-8 py-6 bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-700/40 flex items-center gap-3">
                <Clock size={24} className="text-orange-600 dark:text-orange-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Logistics</h2>
              </div>
              <div className="p-8 space-y-6">
                <Input
                  label="Location *"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Lagos, Nigeria / Remote / Hybrid"
                  required
                />

                <Select
                  label="Work Type *"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  options={[
                    { value: '', label: 'Select type' },
                    { value: 'Remote', label: 'Remote' },
                    { value: 'Onsite', label: 'Onsite' },
                    { value: 'Hybrid', label: 'Hybrid' },
                  ]}
                  required
                />

                <Input
                  label="Duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g. 6 months, 3–6 months, Summer 2026"
                />

                <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/40">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <BadgeDollarSign size={18} className="text-orange-600 dark:text-orange-500" /> Paid Position
                    </label>
                    <Checkbox
                      checked={formData.paid}
                      onChange={(e) => setFormData(prev => ({ ...prev, paid: e.target.checked }))}
                    />
                  </div>

                  {formData.paid && (
                    <Input
                      label="Stipend / Allowance"
                      value={formData.stipend}
                      onChange={(e) => setFormData(prev => ({ ...prev, stipend: e.target.value }))}
                      placeholder="e.g. ₦150,000 / month, $500 / month"
                    />
                  )}
                </div>

                <Input
                  label="Application Deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                loading={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-2xl h-14 font-semibold shadow-lg shadow-orange-600/20 transition-all text-lg flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {isEditing ? 'Update Listing' : 'Publish Opportunity'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(mode === 'recruiter' ? '/recruiter/my-internships' : '/company/manage')}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-2xl h-14 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} /> Cancel & Go Back
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostInternship;