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

// Company Pages
import CompanyLayout from "./pages/company/CompanyLayout.jsx";
import CompanyDashboard from "./pages/company/Dashboard.jsx";
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

// Protected Route Guard
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
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
          <Route path="post" element={<PostInternship />} />
          <Route path="edit/:id" element={<PostInternship />} />
          <Route path="manage" element={<CompanyManagePostings />} />
          <Route path="manage" element={<CompanyManagePostings />} />
          <Route path="applicants" element={<ViewApplicants />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="schedule-interview/:applicationId" element={<ScheduleInterview />} />
          <Route path="profile" element={<CompanyProfile />} />
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
        </Route>

        {/* Catch all — redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

export default App;