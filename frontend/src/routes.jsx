import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Academics from './pages/public/Academics';
import Admissions from './pages/public/Admissions';
import Facilities from './pages/public/Facilities';
import Faculty from './pages/public/Faculty';
import Gallery from './pages/public/Gallery';
import NoticeBoard from './pages/public/NoticeBoard';
import Contact from './pages/public/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminAdmissions from './pages/admin/Admissions';
import Enquiries from './pages/admin/Enquiries';
import Notices from './pages/admin/Notices';
import AdminGallery from './pages/admin/Gallery';
import PageEditor from './pages/admin/PageEditor';
import Settings from './pages/admin/Settings';
import Users from './pages/admin/Users';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="academics" element={<Academics />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="facilities" element={<Facilities />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="notices" element={<NoticeBoard />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Admin Auth Route */}
      <Route path="/admin/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="admissions" element={<AdminAdmissions />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="pages" element={<PageEditor />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="notices" element={<Notices />} />
        <Route path="settings" element={<Settings />} />
        <Route path="users" element={<Users />} />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
