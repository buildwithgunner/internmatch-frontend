import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Public Auth Pages
import Landing from "./pages/auth/Landing.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import OtpVerification from "./pages/auth/OtpVerification.jsx";

// Public Static Pages
import Privacy from "./pages/public/Privacy.jsx";
import Terms from "./pages/public/Terms.jsx";
import Contact from "./pages/public/Contact.jsx";

// Student Pages
import StudentLayout from "./pages/student/StudentLayout.jsx";
import StudentDashboard from "./pages/student/Dashboard.jsx";
import BrowseInternships from "./pages/student/BrowseInternships.jsx";
import MyApplications from "./pages/student/MyApplications.jsx";
import StudentInterviews from "./pages/student/Interviews.jsx";
import ViewProfile from "./pages/student/ViewProfile.jsx";
import EditProfile from "./pages/student/EditProfile.jsx";
const SavedInternships = lazy(() => import('./pages/student/SavedInternships'));
const CampusAmbassador = lazy(() => import('./pages/student/CampusAmbassador'));

// Company Pages
import CompanyLayout from "./pages/company/CompanyLayout.jsx";
const CompanyDashboard = lazy(() => import('./pages/company/Dashboard')); // Changed to lazy import
import PostInternship from "./pages/company/PostInternship.jsx";
import CompanyManagePostings from "./pages/company/ManagePostings.jsx";
import ViewApplicants from "./pages/company/ViewApplicants.jsx";
import CompanyProfile from "./pages/company/CompanyProfile.jsx";
import Interviews from "./pages/company/Interviews.jsx";
import ScheduleInterview from "./pages/company/ScheduleInterview.jsx";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AdminManagePostings from "./pages/admin/ManagePostings.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import Reports from "./pages/admin/Reports.jsx";
import Moderation from "./pages/admin/Moderation.jsx";

// Recruiter Pages
import RecruiterLayout from "./pages/recruiter/RecruiterLayout.jsx";
import RecruiterDashboard from "./pages/recruiter/Dashboard.jsx";
import MyInternships from "./pages/recruiter/MyInternships.jsx";
import Applicants from "./pages/recruiter/Applicants.jsx";
import DiscoverStudents from "./pages/recruiter/DiscoverStudents.jsx";
import SavedCandidates from "./pages/recruiter/SavedCandidates.jsx";
import RecruiterProfile from "./pages/recruiter/Profile.jsx";
import RecruiterSettings from "./pages/recruiter/Settings.jsx";

// Protected Route Guard
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-orange-600 border-t-transparent"></div>
        </div>
    }>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        
        {/* Static Pages */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Admin Public Routes */}
        <Route path="/admin/login" element={<Login restrictedRole="admin" />} />
        <Route path="/admin/register" element={<Register restrictedRole="admin" />} />

        {/* Protected Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} /> {/* /student */}
          <Route path="dashboard" element={<StudentDashboard />} /> {/* /student/dashboard */}
          <Route path="browse" element={<BrowseInternships />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="interviews" element={<StudentInterviews />} />
          <Route path="profile" element={<ViewProfile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="saved" element={<Suspense fallback={null}><SavedInternships /></Suspense>} />
          <Route path="ambassador" element={<CampusAmbassador />} />
        </Route>

        {/* Protected Company Routes */}
        <Route
          path="/company"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanyLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CompanyDashboard />} /> {/* /company */}
          <Route path="dashboard" element={<CompanyDashboard />} /> {/* /company/dashboard */}
          <Route path="post" element={<PostInternship mode="company" />} />
          <Route path="post/:internshipId" element={<PostInternship mode="company" />} />
          <Route path="manage" element={<CompanyManagePostings />} />
          <Route path="applications/:internshipId" element={<ViewApplicants />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="schedule-interview/:applicationId" element={<ScheduleInterview />} />
          <Route path="profile" element={<CompanyProfile />} />
        </Route>

        {/* Protected Recruiter Routes */}
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <RecruiterLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RecruiterDashboard />} /> {/* /recruiter */}
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="post" element={<PostInternship mode="recruiter" />} />
          <Route path="post/:internshipId" element={<PostInternship mode="recruiter" />} />
          <Route path="my-internships" element={<MyInternships />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="discover" element={<DiscoverStudents />} />
          <Route path="saved" element={<SavedCandidates />} />
          <Route path="profile" element={<RecruiterProfile />} />
          <Route path="settings" element={<RecruiterSettings />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} /> {/* /admin */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-postings" element={<AdminManagePostings />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="moderation" element={<Moderation />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;