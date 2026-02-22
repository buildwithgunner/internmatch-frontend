import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { FileDown, Loader2, Users, Briefcase, FileText, TrendingUp, BarChart3 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/admin/reports');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const generatePDF = () => {
    if (!data) return;
    setIsExporting(true);

    try {
      const doc = new jsPDF();
      const dateStr = new Date().toLocaleDateString();

      // --- 1. TITLE & HEADER ---
      doc.setFontSize(22);
      doc.setTextColor(79, 70, 229); // Indigo
      doc.text("Platform Intelligence Report", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Report Period: ${dateStr}`, 14, 28);

      // --- 2. SUMMARY STATS TABLE ---
      autoTable(doc, {
        startY: 35,
        head: [['Metric', 'Value']],
        body: [
          ['Total Users', data.stats.total_users],
          ['Internships Posted', data.stats.total_internships],
          ['Applications Received', data.stats.total_applications],
        ],
        headStyles: { fillColor: [79, 70, 229] },
        theme: 'striped'
      });

      // --- 3. USER GROWTH SECTION ---
      let currentY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text("User Growth Trends", 14, currentY);

      autoTable(doc, {
        startY: currentY + 5,
        head: [['Month', 'New Users']],
        body: data.user_growth?.map(item => [item.month, item.count]) || [['No data', 0]],
        headStyles: { fillColor: [99, 102, 241] }, // Indigo-ish
      });

      // --- 4. APPLICATION TRENDS SECTION ---
      currentY = doc.lastAutoTable.finalY + 15;
      
      // Page break check: if we're near the bottom, start a new page
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(16);
      doc.text("Application Trends", 14, currentY);

      autoTable(doc, {
        startY: currentY + 5,
        head: [['Month', 'Applications']],
        body: data.application_trends?.map(item => [item.month, item.count]) || [['No data', 0]],
        headStyles: { fillColor: [249, 115, 22] }, // Orange
      });

      // --- 5. SAVE ---
      doc.save(`Platform_Report_${dateStr}.pdf`);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
    </div>
  );

  const getMax = (arr) => {
    if (!arr || arr.length === 0) return 1;
    return Math.max(...arr.map(d => d.count)) || 1;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-8 lg:p-12 transition-all">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="relative bg-slate-900/50 p-6 sm:p-10 rounded-[2.5rem] border border-slate-800 overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">
                Reports <span className="text-indigo-500">Center.</span>
              </h1>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Data-Driven Insights</p>
            </div>
            <button 
              onClick={generatePDF}
              disabled={isExporting}
              className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shrink-0 disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="animate-spin" size={16} /> : <FileDown size={16} />}
              Export PDF
            </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl rounded-full" />
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { label: 'Total Users', val: data?.stats.total_users, icon: Users, color: 'indigo' },
            { label: 'Internships', val: data?.stats.total_internships, icon: Briefcase, color: 'emerald' },
            { label: 'Applications', val: data?.stats.total_applications, icon: FileText, color: 'orange' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800/50 hover:border-slate-700 transition-all group">
              <stat.icon className={`text-${stat.color}-500 mb-6 group-hover:scale-110 transition-transform`} size={28} />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-4xl font-black mt-2 tracking-tighter">{stat.val ?? 0}</h3>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Chart 1: User Growth */}
          <section className="bg-slate-900/40 p-6 sm:p-10 rounded-[2.5rem] border border-slate-800/50">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-xl font-bold tracking-tight">User Growth</h2>
            </div>
            
            <div className="space-y-8">
              {data?.user_growth?.length > 0 ? (
                data.user_growth.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-2">
                      <span>{item.month}</span>
                      <span className="text-indigo-400">{item.count}</span>
                    </div>
                    <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                        style={{ width: `${(item.count / getMax(data.user_growth)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-600 italic text-sm py-10 text-center">No growth data available...</p>
              )}
            </div>
          </section>

          {/* Chart 2: Application Trends */}
          <section className="bg-slate-900/40 p-6 sm:p-10 rounded-[2.5rem] border border-slate-800/50">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
                <BarChart3 size={20} />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Application Trends</h2>
            </div>

            <div className="space-y-8">
              {data?.application_trends?.length > 0 ? (
                data.application_trends.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-2">
                      <span>{item.month}</span>
                      <span className="text-orange-400">{item.count}</span>
                    </div>
                    <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                        style={{ width: `${(item.count / getMax(data.application_trends)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-600 italic text-sm py-10 text-center">No application data available...</p>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default Reports;