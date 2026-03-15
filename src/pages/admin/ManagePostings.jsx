import { useState, useEffect } from 'react';
import api from '../../services/api.js';

function ManagePostings() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await api.get('/admin/internships');
        setInternships(res.data.internships || []);
      } catch (err) {
        console.error('Failed to load internships', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-base-content">Manage All Postings</h1>
      <p className="text-lg text-base-content/70">Approve, pause, or delete any internship posting</p>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {internships.map(internship => (
                  <tr key={internship.id}>
                    <td className="font-bold">{internship.title}</td>
                    <td>{internship.recruiter?.company?.company_name || 'Individual'}</td>
                    <td>
                      <span className={`badge ${internship.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>
                        {internship.status}
                      </span>
                    </td>
                    <td>{new Date(internship.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-xs btn-ghost">Edit</button>
                      <button className="btn btn-xs btn-error btn-outline ml-2">Delete</button>
                    </td>
                  </tr>
                ))}
                {internships.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-base-content/50 py-4">No internships found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagePostings;