import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Phone, MapPin, User as UserIcon } from 'lucide-react';
import api from '../../services/api';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await api.get('/company/interviews');
        // Filter for upcoming only? Or all? Let's show scheduled ones.
        const scheduled = res.data.interviews.filter(i => i.status === 'scheduled');
        setInterviews(scheduled);
      } catch (err) {
        console.error('Failed to fetch interviews', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) return <div className="animate-pulse h-40 bg-base-200 rounded-xl"></div>;

  if (interviews.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body items-center text-center p-8">
          <div className="bg-base-200 p-4 rounded-full mb-2">
            <Calendar className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="font-bold text-lg">No interviews scheduled</h3>
          <p className="text-sm opacity-60">Upcoming interviews will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body p-0">
        <div className="p-4 border-b border-base-200 flex justify-between items-center">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming Interviews
          </h2>
          <span className="badge badge-primary badge-sm">{interviews.length}</span>
        </div>
        <div className="divide-y divide-base-200">
          {interviews.map((interview) => (
            <div key={interview.id} className="p-4 hover:bg-base-200/50 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-12">
                    <span className="text-lg font-bold">{interview.student?.name?.charAt(0) || 'U'}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold group-hover:text-primary transition-colors">
                    {interview.student?.name}
                  </h3>
                  <div className="text-xs opacity-60 flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1">
                       For: {interview.application?.internship?.title || 'Internship'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right flex flex-col sm:items-end gap-1">
                <div className="badge badge-ghost gap-2">
                  <Clock size={12} />
                  {new Date(interview.scheduled_at).toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-xs opacity-70 mt-1">
                    {interview.type === 'video' && <Video size={14} />}
                    {interview.type === 'phone' && <Phone size={14} />}
                    {interview.type === 'in-person' && <MapPin size={14} />}
                    <span className="capitalize">{interview.type || 'Meeting'}</span>
                </div>
                {interview.meeting_link && (
                    <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer" className="link link-primary text-xs">
                        Join Meeting
                    </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewList;
