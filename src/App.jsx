import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ViewPostPage from "./pages/ViewPostPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotificationPage from "./pages/NotificationPage";
import ArticleManagementPage from "./pages/admin/ArticleManagementPage";
import ArticleFormPage from "./pages/admin/ArticleFormPage";
import CategoryManagementPage from "./pages/admin/CategoryManagementPage";
import AdminNotificationPage from "./pages/admin/AdminNotificationPage";
import { AdminProvider } from "./context/AdminContext";

function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/post/:id" element={<ViewPostPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Admin Part Routes */}
          <Route path="/admin" element={<Navigate to="/admin/articles" replace />} />
          <Route path="/admin/articles" element={<ArticleManagementPage />} />
          <Route path="/admin/articles/create" element={<ArticleFormPage />} />
          <Route path="/admin/articles/edit/:id" element={<ArticleFormPage />} />
          <Route path="/admin/categories" element={<CategoryManagementPage />} />
          <Route path="/admin/notifications" element={<AdminNotificationPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  );
}

export default App;
