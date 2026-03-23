import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// @ts-ignore
import ErrorBoundary from "./components/ErrorBoundary";

// ── Shared Fallback ──────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-orange-600 border-t-transparent"></div>
  </div>
);

// ── Public Auth Pages (eagerly loaded – critical path) ───────────────────────
import Landing from "./pages/auth/Landing.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

// ── Lazy-loaded Auth Pages ───────────────────────────────────────────────────
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword.jsx"));
const OtpVerification = lazy(() => import("./pages/auth/OtpVerification.jsx"));

// ── Lazy-loaded Static Pages ─────────────────────────────────────────────────
const Privacy = lazy(() => import("./pages/public/Privacy.jsx"));
const Terms = lazy(() => import("./pages/public/Terms.jsx"));
const Contact = lazy(() => import("./pages/public/Contact.jsx"));

// ── Lazy-loaded Student Pages ────────────────────────────────────────────────
const StudentLayout = lazy(() => import("./pages/student/StudentLayout.jsx"));
const StudentDashboard = lazy(() => import("./pages/student/Dashboard.jsx"));
const BrowseInternships = lazy(() => import("./pages/student/BrowseInternships.jsx"));
const MyApplications = lazy(() => import("./pages/student/MyApplications.jsx"));
const StudentInterviews = lazy(() => import("./pages/student/Interviews.jsx"));
const ViewProfile = lazy(() => import("./pages/student/ViewProfile.jsx"));
const EditProfile = lazy(() => import("./pages/student/EditProfile.jsx"));
const SavedInternships = lazy(() => import("./pages/student/SavedInternships"));
const CampusAmbassador = lazy(() => import("./pages/student/CampusAmbassador"));

// ── Lazy-loaded Company Pages ────────────────────────────────────────────────
const CompanyLayout = lazy(() => import("./pages/company/CompanyLayout.jsx"));
const CompanyDashboard = lazy(() => import("./pages/company/Dashboard"));
const PostInternship = lazy(() => import("./pages/company/PostInternship.jsx"));
const CompanyManagePostings = lazy(() => import("./pages/company/ManagePostings.jsx"));
const ViewApplicants = lazy(() => import("./pages/company/ViewApplicants.jsx"));
const CompanyProfile = lazy(() => import("./pages/company/CompanyProfile.jsx"));
const Interviews = lazy(() => import("./pages/company/Interviews.jsx"));
const ScheduleInterview = lazy(() => import("./pages/company/ScheduleInterview.jsx"));

// ── Lazy-loaded Admin Pages ──────────────────────────────────────────────────
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const AdminManagePostings = lazy(() => import("./pages/admin/ManagePostings.jsx"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers.jsx"));
const Reports = lazy(() => import("./pages/admin/Reports.jsx"));
const Moderation = lazy(() => import("./pages/admin/Moderation.jsx"));

// ── Lazy-loaded Recruiter Pages ──────────────────────────────────────────────
const RecruiterLayout = lazy(() => import("./pages/recruiter/RecruiterLayout.jsx"));
const RecruiterDashboard = lazy(() => import("./pages/recruiter/Dashboard.jsx"));
const MyInternships = lazy(() => import("./pages/recruiter/MyInternships.jsx"));
const Applicants = lazy(() => import("./pages/recruiter/Applicants.jsx"));
const DiscoverStudents = lazy(() => import("./pages/recruiter/DiscoverStudents.jsx"));
const SavedCandidates = lazy(() => import("./pages/recruiter/SavedCandidates.jsx"));
const RecruiterProfile = lazy(() => import("./pages/recruiter/Profile.jsx"));
const RecruiterSettings = lazy(() => import("./pages/recruiter/Settings.jsx"));

// ── Protected Route Guard ────────────────────────────────────────────────────
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
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
            <Route index element={<StudentDashboard />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="browse" element={<BrowseInternships />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="interviews" element={<StudentInterviews />} />
            <Route path="profile" element={<ViewProfile />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="saved" element={<SavedInternships />} />
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
            <Route index element={<CompanyDashboard />} />
            <Route path="dashboard" element={<CompanyDashboard />} />
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
            <Route index element={<RecruiterDashboard />} />
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
            <Route index element={<AdminDashboard />} />
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
    </ErrorBoundary>
  );
}

export default App;