import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { Eye, ShieldAlert, Trash2, CheckCircle, XCircle, ShieldCheck, RotateCcw } from 'lucide-react';
import Swal from 'sweetalert2';

function ManageUsers() {
  const [students, setStudents] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-refresh selected user if modal is open and theme changes (optional, but keep UI in sync)
  useEffect(() => {
    if (isModalOpen && selectedUser) {
      // resync modal if needed, though DaisyUI handles CSS automatically
    }
  }, [isModalOpen]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setStudents(res.data.students || []);
      setRecruiters(res.data.recruiters || []);
      setCompanies(res.data.companies || []);
    } catch (err) {
      console.error('Failed to load users', err);
      Swal.fire('Error', 'Failed to load users from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBan = async (type, id, currentStatus) => {
    const action = currentStatus ? 'activate' : 'suspend';
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You are about to ${action} this user account.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: currentStatus ? '#10b981' : '#f59e0b',
      cancelButtonColor: '#334155',
      confirmButtonText: `Yes, ${action}!`,
      background: '#0f172a',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/admin/users/${type}/${id}/toggle-ban`);
        Swal.fire({
          title: 'Success!',
          text: `User has been ${currentStatus ? 'activated' : 'suspended'}.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#0f172a',
          color: '#fff'
        });
        fetchUsers();
      } catch (err) {
        Swal.fire('Error', 'Failed to update user status', 'error');
      }
    }
  };

  const handleToggleVerify = async (type, id, currentStatus) => {
    const action = currentStatus ? 'unverify' : 'verify';
    const result = await Swal.fire({
      title: `Verification`,
      text: `Do you want to mark this ${type} as ${currentStatus ? 'unverified' : 'verified'}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#334155',
      confirmButtonText: `Yes, ${action}!`,
      background: '#0f172a',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/admin/users/${type}/${id}/toggle-verify`);
        Swal.fire({
          title: 'Updated!',
          text: `Status changed to ${currentStatus ? 'unverified' : 'verified'}.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#0f172a',
          color: '#fff'
        });
        fetchUsers();
        // If modal is open, we need to refresh selectedUser data
        if (isModalOpen && selectedUser?.user.id === id) {
          handleViewUser(type, id);
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to update verification status', 'error');
      }
    }
  };

  const handleDeleteUser = async (type, id, isAlreadyDeleted = false) => {
    const result = await Swal.fire({
      title: isAlreadyDeleted ? 'PERMANENT REMOVAL' : 'CRITICAL ACTION',
      text: isAlreadyDeleted
        ? 'This will IRREVERSIBLY delete all records from the database. Proceed with caution!'
        : 'Are you sure you want to deactivate this user? They will not be able to log in, but you can restore them later.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: isAlreadyDeleted ? 'Yes, DELETE forever' : 'Yes, Deactivate',
      background: '#0f172a',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        if (isAlreadyDeleted) {
          await api.delete(`/admin/users/${type}/${id}/force`);
        } else {
          await api.delete(`/admin/users/${type}/${id}`);
        }

        Swal.fire({
          title: isAlreadyDeleted ? 'Permanently Deleted!' : 'Deactivated!',
          text: isAlreadyDeleted ? 'User record has been removed forever.' : 'User account has been deactivated.',
          icon: 'success',
          background: '#0f172a',
          color: '#fff'
        });
        fetchUsers();
        if (isModalOpen) setIsModalOpen(false);
      } catch (err) {
        Swal.fire('Error', 'Failed to delete user', 'error');
      }
    }
  };

  const handleRestoreUser = async (type, id) => {
    const result = await Swal.fire({
      title: 'Restore Account',
      text: 'Are you sure you want to reactivate this user account?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, Restore it!',
      background: '#0f172a',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await api.post(`/admin/users/${type}/${id}/restore`);
        Swal.fire({
          title: 'Restored!',
          text: 'User account is now active again.',
          icon: 'success',
          background: '#0f172a',
          color: '#fff'
        });
        fetchUsers();
      } catch (err) {
        Swal.fire('Error', 'Failed to restore user', 'error');
      }
    }
  };

  const handleViewUser = async (type, id) => {
    try {
      const res = await api.get(`/admin/users/${type}/${id}`);
      setSelectedUser(res.data);
      setIsModalOpen(true);
    } catch (err) {
      Swal.fire('Error', 'Failed to fetch user details', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-base-content">Manage Users</h1>
        <p className="text-lg text-base-content/60">View, verify, suspend, or delete user accounts</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 border border-base-200 p-6 shadow-xl">
          <p className="text-base-content/50 text-sm font-medium uppercase tracking-wider">Total Students</p>
          <h3 className="text-3xl font-bold text-base-content mt-1">{students.length}</h3>
        </div>
        <div className="card bg-base-100 border border-base-200 p-6 shadow-xl">
          <p className="text-base-content/50 text-sm font-medium uppercase tracking-wider">Total Recruiters</p>
          <h3 className="text-3xl font-bold text-base-content mt-1">{recruiters.length}</h3>
        </div>
        <div className="card bg-base-100 border border-base-200 p-6 shadow-xl">
          <p className="text-base-content/50 text-sm font-medium uppercase tracking-wider">Total Companies</p>
          <h3 className="text-3xl font-bold text-base-content mt-1">{companies.length}</h3>
        </div>
      </div>

      {/* Companies Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-2xl font-bold text-base-content">Companies</h2>
          <span className="badge badge-primary">{companies.length} Total</span>
        </div>
        <div className="card bg-base-100 border border-base-200 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50">
                <tr className="text-base-content/60 border-b border-base-200">
                  <th className="py-4 font-semibold uppercase text-xs tracking-widest">Company Name</th>
                  <th className="py-4 font-semibold uppercase text-xs tracking-widest">Email Address</th>
                  <th className="py-4 font-semibold uppercase text-xs tracking-widest text-center">Verification</th>
                  <th className="py-4 font-semibold uppercase text-xs tracking-widest text-center">Account Status</th>
                  <th className="py-4 font-semibold uppercase text-xs tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {companies.map(company => (
                  <tr key={`company-${company.id}`} className="hover:bg-base-content/5 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-slate-200">{company.name}</div>
                    </td>
                    <td className="py-4 text-slate-400">{company.email}</td>
                    <td className="py-4 text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleToggleVerify('company', company.id, company.is_verified)}
                          className={`badge ${company.is_verified ? 'badge-success' : 'badge-warning'} badge-sm cursor-pointer hover:scale-105 transition-transform`}
                        >
                          {company.is_verified ? 'Verified' : 'Pending'}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      {company.deleted_at ? (
                        <span className="badge badge-error font-bold badge-sm">DEACTIVATED</span>
                      ) : company.is_banned ? (
                        <span className="badge badge-error badge-outline badge-sm">Suspended</span>
                      ) : (
                        <span className="badge badge-success badge-outline badge-sm">Active</span>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleViewUser('company', company.id)} className="btn btn-square btn-ghost btn-sm text-primary" title="View Details"><Eye size={18} /></button>

                        {!company.deleted_at ? (
                          <>
                            <button onClick={() => handleToggleVerify('company', company.id, company.is_verified)} className={`btn btn-square btn-ghost btn-sm ${company.is_verified ? 'text-success' : 'text-slate-500'}`} title={company.is_verified ? 'Unverify' : 'Verify'}>
                              <ShieldCheck size={18} />
                            </button>
                            <button onClick={() => handleToggleBan('company', company.id, company.is_banned)} className={`btn btn-square btn-ghost btn-sm ${company.is_banned ? 'text-success' : 'text-warning'}`} title={company.is_banned ? 'Activate' : 'Suspend'}>
                              {company.is_banned ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
                            </button>
                            <button onClick={() => handleDeleteUser('company', company.id, false)} className="btn btn-square btn-ghost btn-sm text-error" title="Deactivate Account"><Trash2 size={18} /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleRestoreUser('company', company.id)} className="btn btn-square btn-ghost btn-sm text-success" title="Restore Account"><RotateCcw size={18} /></button>
                            <button onClick={() => handleDeleteUser('company', company.id, true)} className="btn btn-square btn-ghost btn-sm text-error" title="Permanent Delete"><Trash2 size={18} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {companies.length === 0 && (
                  <tr><td colSpan="5" className="text-center text-slate-500 py-10 italic">No companies registered yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Recruiters Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-2xl font-bold text-base-content">Recruiters</h2>
          <span className="badge badge-primary">{recruiters.length} Total</span>
        </div>
        <div className="card bg-base-100 border border-base-200 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50">
                <tr className="text-base-content/60 border-b border-base-200">
                  <th className="py-4 font-semibold uppercase text-xs tracking-widest">Recruiter</th>
                  <th className="py-4 font-semibold uppercase text-xs tracking-widest">Company</th>
                  <th className="py-4 font-semibold uppercase text-xs tracking-widest text-center">Status</th>
                  <th className="py-4 font-semibold uppercase text-xs tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {recruiters.map(recruiter => (
                  <tr key={`recruiter-${recruiter.id}`} className="hover:bg-base-content/5 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-base-content">{recruiter.name}</div>
                      <div className="text-xs text-base-content/50">{recruiter.email}</div>
                    </td>
                    <td className="py-4 text-base-content/70 font-medium">{recruiter.company_name || 'Individual'}</td>
                    <td className="py-4 text-center">
                      <div className="flex flex-col gap-1 items-center">
                        {recruiter.deleted_at ? (
                          <span className="badge badge-error font-bold badge-sm">DEACTIVATED</span>
                        ) : (
                          <>
                            <span
                              onClick={() => handleToggleVerify('recruiter', recruiter.id, recruiter.is_verified)}
                              className={`badge ${recruiter.is_verified ? 'badge-success' : 'badge-warning'} badge-sm cursor-pointer`}
                            >
                              {recruiter.is_verified ? 'Verified' : 'Pending'}
                            </span>
                            {recruiter.is_banned && <span className="badge badge-error badge-sm">Suspended</span>}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleViewUser('recruiter', recruiter.id)} className="btn btn-square btn-ghost btn-sm text-primary" title="Details"><Eye size={18} /></button>

                        {!recruiter.deleted_at ? (
                          <>
                            <button onClick={() => handleToggleVerify('recruiter', recruiter.id, recruiter.is_verified)} className={`btn btn-square btn-ghost btn-sm ${recruiter.is_verified ? 'text-success' : 'text-slate-500'}`} title="Toggle Verification">
                              <ShieldCheck size={18} />
                            </button>
                            <button onClick={() => handleToggleBan('recruiter', recruiter.id, recruiter.is_banned)} className={`btn btn-square btn-ghost btn-sm ${recruiter.is_banned ? 'text-success' : 'text-warning'}`} title="Account Access">
                              {recruiter.is_banned ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
                            </button>
                            <button onClick={() => handleDeleteUser('recruiter', recruiter.id, false)} className="btn btn-square btn-ghost btn-sm text-error" title="Deactivate"><Trash2 size={18} /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleRestoreUser('recruiter', recruiter.id)} className="btn btn-square btn-ghost btn-sm text-success" title="Restore Account"><RotateCcw size={18} /></button>
                            <button onClick={() => handleDeleteUser('recruiter', recruiter.id, true)} className="btn btn-square btn-ghost btn-sm text-error" title="Permanent Delete"><Trash2 size={18} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {recruiters.length === 0 && (
                  <tr><td colSpan="6" className="text-center text-slate-500 py-10 italic">No recruiters found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Students Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-2xl font-bold text-base-content">Students</h2>
          <span className="badge badge-primary">{students.length} Total</span>
        </div>
        <div className="card bg-base-100 border border-base-200 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50">
                <tr className="text-base-content/60 border-b border-base-200">
                  <th className="py-4 font-semibold uppercase text-xs tracking-widest">Student Info</th>
                  <th className="py-4 font-semibold uppercase text-xs tracking-widest text-center">Status</th>
                  <th className="py-4 font-semibold uppercase text-xs tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {students.map(student => (
                  <tr key={`student-${student.id}`} className="hover:bg-base-content/5 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-base-content">{student.name}</div>
                      <div className="text-sm text-base-content/50">{student.email}</div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex flex-col gap-1 items-center">
                        {student.deleted_at ? (
                          <span className="badge badge-error font-bold badge-sm">DEACTIVATED</span>
                        ) : (
                          <>
                            <span
                              onClick={() => handleToggleVerify('student', student.id, student.is_verified)}
                              className={`badge ${student.is_verified ? 'badge-success' : 'badge-warning'} badge-sm cursor-pointer`}
                            >
                              {student.is_verified ? 'Verified' : 'Pending'}
                            </span>
                            {student.is_banned && <span className="badge badge-error badge-sm">Suspended</span>}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleViewUser('student', student.id)} className="btn btn-square btn-ghost btn-sm text-primary" title="View Profile"><Eye size={18} /></button>

                        {!student.deleted_at ? (
                          <>
                            <button onClick={() => handleToggleVerify('student', student.id, student.is_verified)} className={`btn btn-square btn-ghost btn-sm ${student.is_verified ? 'text-success' : 'text-slate-500'}`} title="Verify Student">
                              <ShieldCheck size={18} />
                            </button>
                            <button onClick={() => handleToggleBan('student', student.id, student.is_banned)} className={`btn btn-square btn-ghost btn-sm ${student.is_banned ? 'text-success' : 'text-warning'}`} title="Suspend / Activate">
                              {student.is_banned ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
                            </button>
                            <button onClick={() => handleDeleteUser('student', student.id, false)} className="btn btn-square btn-ghost btn-sm text-error" title="Deactivate User"><Trash2 size={18} /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleRestoreUser('student', student.id)} className="btn btn-square btn-ghost btn-sm text-success" title="Restore Account"><RotateCcw size={18} /></button>
                            <button onClick={() => handleDeleteUser('student', student.id, true)} className="btn btn-square btn-ghost btn-sm text-error" title="Permanent Delete"><Trash2 size={18} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr><td colSpan="4" className="text-center text-slate-500 py-10 italic">No students registered</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-100 border border-base-300 max-w-2xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold text-2xl text-base-content capitalize">{selectedUser.type} Profile</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost text-base-content/50"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold uppercase">
                  {(selectedUser.user.name || selectedUser.user.company_name || 'U').charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-base-content">{selectedUser.user.name || selectedUser.user.company_name}</h4>
                  <p className="text-base-content/60">{selectedUser.user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-base-200/50 rounded-lg border border-base-300">
                  <p className="text-base-content/50 mb-1 font-medium">Account Details</p>
                  <p className="text-base-content font-bold mb-1">Joined: {new Date(selectedUser.user.created_at).toLocaleDateString()}</p>
                  <div className="flex items-center gap-2">
                    {selectedUser.user.email_verified_at ?
                      <span className="text-success text-xs font-bold flex items-center gap-1"><CheckCircle size={12} /> Email Verified</span> :
                      <span className="text-warning text-xs font-bold flex items-center gap-1"><XCircle size={12} /> Email Unverified</span>
                    }
                  </div>
                </div>

                <div className="p-4 bg-base-200/50 rounded-lg border border-base-300">
                  <p className="text-base-content/50 mb-1 font-medium">Admin Verification</p>
                  <div className="flex items-center gap-2">
                    {selectedUser.user.is_verified ?
                      <span className="bg-success/20 text-success px-2 py-1 rounded text-xs font-black flex items-center gap-1">
                        <ShieldCheck size={14} /> IDENTITY VERIFIED
                      </span> :
                      <span className="bg-warning/20 text-warning px-2 py-1 rounded text-xs font-black flex items-center gap-1">
                        <ShieldAlert size={14} /> PENDING REVIEW
                      </span>
                    }
                  </div>
                </div>
              </div>

              {selectedUser.type === 'student' && selectedUser.user.profile && (
                <div className="space-y-4">
                  <h5 className="font-bold text-base-content border-b border-base-300 pb-2 flex items-center gap-2">
                    Academic Background
                  </h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="col-span-2">
                      <p className="text-base-content/50">University</p>
                      <p className="text-base-content font-medium">{selectedUser.user.profile.university}</p>
                    </div>
                    <div>
                      <p className="text-base-content/50">Department</p>
                      <p className="text-base-content font-medium">{selectedUser.user.profile.department}</p>
                    </div>
                    <div>
                      <p className="text-base-content/50">Graduation</p>
                      <p className="text-base-content font-medium">{selectedUser.user.profile.graduation_year}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedUser.type === 'recruiter' && (
                <div className="space-y-4">
                  <h5 className="font-bold text-base-content border-b border-base-300 pb-2">Business Information</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-base-content/50">Representing</p>
                      <p className="text-base-content font-bold">{selectedUser.user.company_name}</p>
                    </div>
                    <div>
                      <p className="text-base-content/50">Current Position</p>
                      <p className="text-base-content font-medium">{selectedUser.user.position || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedUser.user.internships && selectedUser.user.internships.length > 0 && (
                <div className="space-y-4">
                  <h5 className="font-bold text-base-content border-b border-base-300 pb-2 flex justify-between">
                    <span>Active Postings</span>
                    <span className="text-xs text-base-content/50">{selectedUser.user.internships.length} Posts</span>
                  </h5>
                  <div className="space-y-2">
                    {selectedUser.user.internships.map(i => (
                      <div key={i.id} className="p-3 bg-base-200/50 rounded-lg border border-base-300 flex justify-between items-center text-xs">
                        <div>
                          <p className="text-base-content font-bold">{i.title}</p>
                          <p className="text-base-content/50 mt-0.5">{new Date(i.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`badge badge-sm font-bold ${i.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>{i.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-action gap-2">
              <button
                onClick={() => handleToggleBan(selectedUser.type, selectedUser.user.id, selectedUser.user.is_banned)}
                className={`btn ${selectedUser.user.is_banned ? 'btn-success' : 'btn-warning'} btn-outline flex-1`}
              >
                {selectedUser.user.is_banned ? 'Activate Account' : 'Suspend Account'}
              </button>
              <button
                onClick={() => handleToggleVerify(selectedUser.type, selectedUser.user.id, selectedUser.user.is_verified)}
                className={`btn ${selectedUser.user.is_verified ? 'btn-ghost' : 'btn-info'} flex-1`}
              >
                {selectedUser.user.is_verified ? 'Revoke Verification' : 'Verify Identity'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;