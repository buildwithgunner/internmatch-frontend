import { useState, useEffect } from 'react';
import api from '../../services/api.js';

function ManageUsers() {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setStudents(res.data.students || []);
        setCompanies(res.data.companies || []);
      } catch (err) {
        console.error('Failed to load users', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
      <h1 className="text-4xl font-bold text-base-content">Manage Users</h1>
      <p className="text-lg text-base-content/70">View, suspend, or delete user accounts</p>

      {/* Companies Section */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Companies</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Verification</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(company => (
                  <tr key={`company-${company.id}`}>
                    <td className="font-bold">{company.name}</td>
                    <td>{company.email}</td>
                    <td>
                      {company.is_verified ? (
                        <span className="badge badge-success gap-1">Verified</span>
                      ) : (
                        <span className="badge badge-warning gap-1">Pending</span>
                      )}
                    </td>
                    <td>{new Date(company.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-xs btn-ghost">Edit</button>
                    </td>
                  </tr>
                ))}
                {companies.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-base-content/50 py-4">No companies found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Students Section */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Students</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={`student-${student.id}`}>
                    <td className="font-bold">{student.name}</td>
                    <td>{student.email}</td>
                    <td>{new Date(student.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-xs btn-ghost">Edit</button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-base-content/50 py-4">No students found</td>
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

export default ManageUsers;