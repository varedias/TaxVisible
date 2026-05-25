import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LoginEn from './pages/auth/LoginEn';
import RegisterEn from './pages/auth/RegisterEn';
import ForgotPassword from './pages/auth/ForgotPassword';
import ForgotPasswordEn from './pages/auth/ForgotPasswordEn';

// Home
import Home from './pages/home/Home';
import HomeEn from './pages/home/HomeEn';


// Product
import Mall from './pages/product/Mall';
import Leasing from './pages/product/Leasing';
import ProductDetail from './pages/product/ProductDetail';
import SelectEquipment from './pages/product/SelectEquipment';
import ProcurementDetail from './pages/product/ProcurementDetail';
import SearchResults from './pages/product/SearchResults';

// Supplier
import Suppliers from './pages/supplier/Suppliers';
import SupplierDetail from './pages/supplier/SupplierDetail';

// User
import PersonalCenter from './pages/user/PersonalCenter';
import UserInfo from './pages/user/UserInfo';
import PublishProduct from './pages/user/PublishProduct';

// Content
import Discovery from './pages/content/Discovery';
import ContentDetail from './pages/content/ContentDetail';

// Support
import HelpCenter from './pages/support/HelpCenter';
import ContactService from './pages/support/ContactService';
import InquiryChat from './pages/support/InquiryChat';

// Admin - 使用懒加载优化性能
import AdminLayout from './admin/layouts/AdminLayout';
import RequireAdmin from './admin/components/RequireAdmin';
const AdminDashboard = lazy(() => import('./admin/pages/Dashboard'));
const AdminUserList = lazy(() => import('./admin/pages/UserList'));
const AdminSupplierList = lazy(() => import('./admin/pages/SupplierList'));
const AdminProductList = lazy(() => import('./admin/pages/ProductList'));
const AdminLeasingList = lazy(() => import('./admin/pages/LeasingList'));
const AdminCommentList = lazy(() => import('./admin/pages/CommentList'));
const AdminInteractionList = lazy(() => import('./admin/pages/InteractionList'));
const AdminOrderList = lazy(() => import('./admin/pages/OrderList'));

import LayoutEn from './components/LayoutEn';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/en/login" element={<LoginEn />} />
          <Route path="/en/register" element={<RegisterEn />} />
          <Route path="/en/forgot-password" element={<ForgotPasswordEn />} />
          <Route path="/cross-border" element={<Navigate to="/en" replace />} />

          {/* English Site Routes */}
          <Route path="/en" element={<LayoutEn />}>
            <Route index element={<HomeEn />} />
            <Route path="login" element={<LoginEn />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="procurement/:id" element={<ProcurementDetail />} />
            <Route path="select-equipment" element={<SelectEquipment />} />
            <Route path="discovery" element={<Discovery />} />
            <Route path="leasing" element={<Leasing />} />
            <Route path="mall" element={<Mall />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="supplier/:id" element={<SupplierDetail />} />
            <Route path="profile" element={<PersonalCenter />} />
            <Route path="user-info" element={<UserInfo />} />
            <Route path="publish-product" element={<PublishProduct />} />
            <Route path="publish-product/:id" element={<PublishProduct />} />
            <Route path="content/:id" element={<ContentDetail />} />
            <Route path="help" element={<HelpCenter />} />
            <Route path="contact" element={<ContactService />} />
            <Route path="inquiry/:id" element={<InquiryChat />} />
          </Route>

          {/* Chinese Site Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="procurement/:id" element={<ProcurementDetail />} />
            <Route path="select-equipment" element={<SelectEquipment />} />
            <Route path="leasing" element={<Leasing />} />
            <Route path="mall" element={<Mall />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="supplier/:id" element={<SupplierDetail />} />
            <Route path="profile" element={<PersonalCenter />} />
            <Route path="user-info" element={<UserInfo />} />
            <Route path="publish-product" element={<PublishProduct />} />
            <Route path="publish-product/:id" element={<PublishProduct />} />
            <Route path="content/:id" element={<ContentDetail />} />
            <Route path="discovery" element={<Discovery />} />
            <Route path="help" element={<HelpCenter />} />
            <Route path="contact" element={<ContactService />} />
            <Route path="inquiry/:id" element={<InquiryChat />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUserList />} />
            <Route path="suppliers" element={<AdminSupplierList />} />
            <Route path="products" element={<AdminProductList />} />
            <Route path="leasing" element={<AdminLeasingList />} />
            <Route path="orders" element={<AdminOrderList />} />
            <Route path="comments" element={<AdminCommentList />} />
            <Route path="interactions" element={<AdminInteractionList />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;