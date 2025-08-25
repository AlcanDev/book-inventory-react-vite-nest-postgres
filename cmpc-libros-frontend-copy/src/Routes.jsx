import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { AuthProvider } from "contexts/AuthContext";
import ProtectedRoute from "components/ProtectedRoute";
import Layout from "components/Layout";
import NotFound from "pages/NotFound";
import LoginScreen from './pages/login-screen';
import BookInventoryDashboard from './pages/book-inventory-dashboard';
import AddNewBookForm from './pages/add-new-book-form';
import BookDetailsView from './pages/book-details-view';
import SearchResultsPage from './pages/search-results-page';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ScrollToTop />
          <RouterRoutes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginScreen />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <BookInventoryDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/inventory" element={
              <ProtectedRoute>
                <Layout>
                  <BookInventoryDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/add-book" element={
              <ProtectedRoute>
                <Layout>
                  <AddNewBookForm />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/edit-book/:id" element={
              <ProtectedRoute>
                <Layout>
                  <AddNewBookForm />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/book/:id" element={
              <ProtectedRoute>
                <Layout>
                  <BookDetailsView />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/search" element={
              <ProtectedRoute>
                <Layout>
                  <SearchResultsPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;