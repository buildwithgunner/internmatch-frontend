import { useState } from 'react';
import StudentInterviewList from "../../components/student/StudentInterviewList.jsx";
import { Calendar, Video, Clock, Info, CheckCircle, ChevronDown, ChevronUp, Link as LinkIcon, ExternalLink } from 'lucide-react';

function Interviews() {
  const [isPastOpen, setIsPastOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    wifi: false,
    micCamera: false,
    space: false,
    resume: false,
    water: false,
  });

  // Mock stats – replace with real data from API/context when available
  const upcomingCount = 3; // example
  const completedCount = 7;
  const successCount = 5; // e.g. offered / accepted
  const successRate = completedCount > 0 ? Math.round((successCount / completedCount) * 100) : 0;

  const toggleChecklistItem = (key) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950/70 transition-colors duration-300 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12 md:space-y-16">

        {/* Hero */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 lg:gap-16">
          <div className="space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-orange-600/10 dark:bg-orange-700/20 text-orange-700 dark:text-orange-300 rounded-full text-sm font-semibold uppercase tracking-wide border border-orange-500/20 dark:border-orange-600/30">
              <Calendar size={18} /> Interview Hub
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Your <span className="text-orange-600 dark:text-orange-500 italic">Interview</span> Journey
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Stay prepared, join on time, and bring your best self. Upcoming and past interviews in one place.
            </p>
          </div>

          {/* Stats + Quick Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 w-full lg:w-auto lg:min-w-[320px]">
            <div className="p-6 bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-600/10 dark:bg-orange-700/20 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0">
                  <Calendar size={28} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Upcoming</p>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{upcomingCount}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/40 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-600/10 dark:bg-emerald-700/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <CheckCircle size={28} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Success Rate</p>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{successRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reminder Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 md:p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-orange-600/10 dark:bg-orange-700/20 flex items-center justify-center flex-shrink-0">
            <Info size={28} className="text-orange-600 dark:text-orange-400" />
          </div>
          <div className="space-y-2">
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              Interviews usually run on <strong>Google Meet</strong>, <strong>Zoom</strong>, or <strong>Microsoft Teams</strong>.
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Test your setup ahead of time and keep the link ready — good luck!
            </p>
          </div>
        </div>

        {/* Calendar Integration Quick Links */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl p-6 md:p-8 shadow-xl">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-3">
            <LinkIcon size={22} className="text-orange-600 dark:text-orange-500" />
            Add to Calendar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="https://calendar.google.com/calendar/u/0/r/eventedit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-300 dark:hover:border-orange-700 transition-all text-slate-800 dark:text-slate-200 font-medium"
            >
              <ExternalLink size={18} /> Google Calendar
            </a>
            <a
              href="https://outlook.live.com/calendar/0/deeplink/compose"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-300 dark:hover:border-orange-700 transition-all text-slate-800 dark:text-slate-200 font-medium"
            >
              <ExternalLink size={18} /> Outlook
            </a>
            <button className="flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-300 dark:hover:border-orange-700 transition-all text-slate-800 dark:text-slate-200 font-medium">
              <ExternalLink size={18} /> Apple Calendar
            </button>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-3xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-6 md:px-10 py-6 border-b border-slate-200/50 dark:border-slate-700/40 bg-slate-50/70 dark:bg-slate-800/30">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Calendar size={28} className="text-orange-600 dark:text-orange-500" />
              Upcoming & Active Interviews
            </h2>
          </div>
          <div className="p-5 md:p-8 min-h-[400px]">
            <StudentInterviewList /> {/* Assuming this shows upcoming by default */}
          </div>
        </div>

        {/* Past Interviews – Collapsible */}
        <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-3xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-2xl overflow-hidden">
          <button
            onClick={() => setIsPastOpen(!isPastOpen)}
            className="w-full px-6 md:px-10 py-6 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-700/40 text-left"
          >
            <div className="flex items-center gap-3">
              <Calendar size={24} className="text-orange-600 dark:text-orange-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                Past Interviews
              </h2>
            </div>
            {isPastOpen ? (
              <ChevronUp size={24} className="text-slate-500 dark:text-slate-400" />
            ) : (
              <ChevronDown size={24} className="text-slate-500 dark:text-slate-400" />
            )}
          </button>

          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isPastOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="p-5 md:p-8 min-h-[300px]">
              {/* You can render a filtered/past version of StudentInterviewList here */}
              <StudentInterviewList /> {/* Or pass a prop like pastOnly={true} if component supports it */}
              {/* Placeholder if no past data */}
              {completedCount === 0 && (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  No past interviews yet. Your first one is coming soon!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Checklist + Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Interactive Checklist */}
          <div className="p-7 md:p-8 bg-white/50 dark:bg-slate-900/40 backdrop-blur-3xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-2xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <CheckCircle size={24} className="text-orange-600 dark:text-orange-500" />
              Pre-Interview Preparation
            </h3>
            <ul className="space-y-4">
              {[
                { key: 'wifi', label: "Stable Wi-Fi & backup hotspot ready" },
                { key: 'micCamera', label: "Microphone + camera tested" },
                { key: 'space', label: "Quiet, well-lit space prepared" },
                { key: 'resume', label: "Resume, notes & job description open" },
                { key: 'water', label: "Glass of water nearby" },
              ].map(item => (
                <li key={item.key} className="flex items-start gap-3">
                  <button
                    onClick={() => toggleChecklistItem(item.key)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      checkedItems[item.key]
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-orange-400 dark:hover:border-orange-500'
                    }`}
                  >
                    {checkedItems[item.key] && <CheckCircle size={14} />}
                  </button>
                  <span className={`text-slate-700 dark:text-slate-300 ${checkedItems[item.key] ? 'line-through opacity-70' : ''}`}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Day-of Tips */}
          <div className="p-7 md:p-8 bg-white/50 dark:bg-slate-900/40 backdrop-blur-3xl border border-slate-200/50 dark:border-slate-700/40 rounded-3xl shadow-2xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <Clock size={24} className="text-orange-600 dark:text-orange-500" />
              Interview Day Essentials
            </h3>
            <ul className="space-y-4 text-slate-700 dark:text-slate-300">
              {[
                "Join 5–10 minutes early (shows punctuality)",
                "Dress professionally (at least upper body)",
                "Look at the camera when speaking",
                "Smile naturally & speak clearly",
                "Keep bullet-point notes visible but don't read verbatim"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-orange-600 dark:text-orange-400 font-bold mt-1 text-xl">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Interviews;