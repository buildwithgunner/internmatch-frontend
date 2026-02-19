import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Phone, MapPin, Building2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Swal from 'sweetalert2';

const StudentInterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await api.get('/student/interviews');
        const allInterviews = res.data.interviews;
        
        // Handle notifications for cancelled interviews
        const cancelled = allInterviews.filter(i => i.status === 'cancelled');
        const seenCancelledIds = JSON.parse(localStorage.getItem('seen_cancelled_interviews') || '[]');
        
        const newCancellations = cancelled.filter(i => !seenCancelledIds.includes(i.id));
        
        if (newCancellations.length > 0) {
          const latest = newCancellations[0];
          Swal.fire({
            title: 'Interview Cancelled',
            html: `
              <div class="text-left">
                <p>Your interview with <strong>${latest.company?.company_name}</strong> has been cancelled.</p>
                <div class="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                  <strong>Reason:</strong> ${latest.cancellation_reason || 'No reason provided.'}
                </div>
              </div>
            `,
            icon: 'warning',
            confirmButtonColor: '#ff5c00',
            confirmButtonText: 'Understood'
          });
          
          const updatedSeen = [...seenCancelledIds, ...newCancellations.map(i => i.id)];
          localStorage.setItem('seen_cancelled_interviews', JSON.stringify(updatedSeen));
        }

        // Only display scheduled interviews
        const displayList = allInterviews.filter(i => i.status === 'scheduled');
        setInterviews(displayList);
      } catch (err) {
        console.error('Failed to fetch interviews', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded-xl"></div>
        <div className="h-24 bg-gray-200 rounded-xl"></div>
        <div className="h-24 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <Calendar size={40} className="text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">No interviews scheduled yet</h3>
        <p className="text-gray-600 max-w-md">
          Once companies schedule interviews with you, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {interviews.map((interview) => (
        <div
          key={interview.id}
          className="p-5 md:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center"
        >
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="avatar placeholder flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-[#ff5c00]/10 text-[#ff5c00] flex items-center justify-center font-bold text-xl">
                {interview.company?.company_name?.charAt(0) || 'C'}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900 text-lg truncate">
                {interview.company?.company_name || 'Company Name'}
              </h3>
              <div className="text-sm text-gray-600 mt-1">
                For: {interview.application?.internship?.title || 'Internship Position'}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2 text-right w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-700">
                {new Date(interview.scheduled_at).toLocaleString([], {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </div>
              <Clock size={16} className="text-[#ff5c00]" />
            </div>

            <div className="flex items-center gap-3 text-sm">
              {interview.type === 'video' && <Video size={16} className="text-[#ff5c00]" />}
              {interview.type === 'phone' && <Phone size={16} className="text-[#ff5c00]" />}
              {interview.type === 'in-person' && <MapPin size={16} className="text-[#ff5c00]" />}
              <span className="font-medium capitalize">{interview.type || 'Meeting'}</span>
            </div>

            {interview.meeting_link && (
              <a
                href={interview.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff5c00] hover:underline font-medium text-sm mt-1 inline-flex items-center gap-1"
              >
                Join Meeting
                <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentInterviewList;