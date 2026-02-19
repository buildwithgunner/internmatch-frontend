import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, Video, Link as LinkIcon, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import Swal from 'sweetalert2';

function ScheduleInterview() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  
  // Data about who we are interviewing (optional, can fetch if needed)
  const [applicantName, setApplicantName] = useState('Candidate');
  const [studentId, setStudentId] = useState(null);

  const [formData, setFormData] = useState({
    scheduled_date: '',
    scheduled_time: '',
    type: 'video',
    meeting_link: '',
    notes: '',
  });

  useEffect(() => {
    // If we passed state from the previous page, use it to pre-fill info
    if (location.state?.studentName) {
        setApplicantName(location.state.studentName);
    }
    if (location.state?.studentId) {
        setStudentId(location.state.studentId);
    } else {
        // Fetch application details to get student ID if not passed
        // For now, let's assume valid ID or fetch logic. 
        // We'll fetch application details to get student_id.
        const fetchAppDetails = async () => {
             // We don't have a direct 'get application' endpoint easily accessible without nesting?
             // Actually we can just GET /internships/{id}/applications and filter, or...
             // Let's rely on the backend to validate application ownership.
             // But we DO need student_id for the creation endpoint `student_id` field.
             // Wait, the InterviewController::store requires `student_id`.
             // We can fetch the application via an endpoint if we add one, or 
             // we can trust that the previous page passed the student ID.
             // Let's try to fetch it if missing. But `api` routes... 
             // We don't have a solitary `GET /applications/{id}` for companies?
             // Let's check api.php
             // Route::get('/internships/{internship}/applications', [ApplicationController::class, 'index']);
             
             // Workaround: We really should have passed it. 
             // If not present, we might be stuck. 
             // Let's add a todo to ensure ViewApplicants passes this.
        }
    }
    setInitializing(false);
  }, [applicationId, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.scheduled_date || !formData.scheduled_time) {
        Swal.fire('Error', 'Please select date and time', 'error');
        return;
    }

    setLoading(true);
    try {
        const scheduledAt = `${formData.scheduled_date} ${formData.scheduled_time}`; // Simple concatenation, ideally handling TZ
        
        // We need student_id. If we don't have it from state, we can't create.
        if (!studentId) {
            Swal.fire('Error', 'Missing student information. Please retry from Applicants list.', 'error');
            return;
        }

        await api.post('/company/interviews', {
            student_id: studentId,
            application_id: applicationId,
            scheduled_at: scheduledAt,
            type: formData.type,
            meeting_link: formData.meeting_link,
            notes: formData.notes
        });

        // Also update application status to 'interview' if not already?
        // Let's do that for convenience
        try {
            await api.patch(`/applications/${applicationId}/status`, { status: 'interview' });
        } catch (e) {
            // Ignore if fails, main goal is creating interview
        }

        Swal.fire({
            title: 'Scheduled!',
            text: `Interview with ${applicantName} has been scheduled.`,
            icon: 'success',
            confirmButtonText: 'View Interviews'
        }).then(() => {
            navigate('/company/interviews');
        });

    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to schedule interview.', 'error');
    } finally {
        setLoading(false);
    }
  };

  if (initializing) return <div className="p-10 text-center">Loading...</div>;

  if (!studentId) {
      return (
        <div className="p-10 text-center">
            <h2 className="text-xl font-bold text-error">Error: Missing Candidate Info</h2>
            <p>Please navigate here from the Applicants page.</p>
            <button onClick={() => navigate('/company/applicants')} className="btn btn-outline mt-4">Go Back</button>
        </div>
      );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 min-h-screen flex flex-col justify-center">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate(-1)} className="btn btn-circle btn-ghost"><ArrowLeft /></button>
        <div>
            <h1 className="text-3xl font-black text-base-content">Schedule Interview</h1>
            <p className="text-base-content/60">With <span className="font-bold text-primary">{applicantName}</span></p>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <form onSubmit={handleSubmit} className="card-body gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                    <label className="label"><span className="label-text font-bold flex gap-2"><Calendar size={16}/> Date</span></label>
                    <input 
                        type="date" 
                        required
                        className="input input-bordered w-full" 
                        value={formData.scheduled_date}
                        onChange={e => setFormData({...formData, scheduled_date: e.target.value})}
                    />
                </div>
                <div className="form-control w-full">
                    <label className="label"><span className="label-text font-bold flex gap-2"><Clock size={16}/> Time</span></label>
                    <input 
                        type="time" 
                        required
                        className="input input-bordered w-full" 
                        value={formData.scheduled_time}
                        onChange={e => setFormData({...formData, scheduled_time: e.target.value})}
                    />
                </div>
            </div>

            <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold flex gap-2"><Video size={16}/> Interview Type</span></label>
                <select 
                    className="select select-bordered w-full"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                >
                    <option value="video">Video Call (Google Meet/Zoom)</option>
                    <option value="phone">Phone Call</option>
                    <option value="in-person">In Person</option>
                </select>
            </div>

            <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold flex gap-2"><LinkIcon size={16}/> Meeting Link / Address</span></label>
                <input 
                    type="text" 
                    placeholder={formData.type === 'in-person' ? "Office Address..." : "https://meet.google.com/..."}
                    className="input input-bordered w-full" 
                    value={formData.meeting_link}
                    onChange={e => setFormData({...formData, meeting_link: e.target.value})}
                />
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-bold">Notes / Instructions</span></label>
                <textarea 
                    className="textarea textarea-bordered h-24" 
                    placeholder="Anything the candidate should prepare?"
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                ></textarea>
            </div>

            <div className="card-actions justify-end mt-4">
                <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost" disabled={loading}>Cancel</button>
                <button type="submit" className="btn btn-primary px-8" disabled={loading}>
                    {loading ? <span className="loading loading-spinner"></span> : 'Schedule Interview'}
                </button>
            </div>

        </form>
      </div>
    </div>
  );
}

export default ScheduleInterview;
