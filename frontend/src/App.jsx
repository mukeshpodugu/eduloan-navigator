import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Landing from './pages/Landing';
import EmiCalculator from './pages/EmiCalculator';
import MoratoriumCalculator from './pages/MoratoriumCalculator';
import RepaymentSimulator from './pages/RepaymentSimulator';
import LoanComparison from './pages/LoanComparison';
import PrepaymentOptimizer from './pages/PrepaymentOptimizer';
import Dashboard from './pages/Dashboard';
import AmortizationSchedule from './pages/AmortizationSchedule';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-brandBg-light dark:bg-brandBg-dark text-slate-800 dark:text-slate-100">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/emi" element={<EmiCalculator />} />
              <Route path="/moratorium" element={<MoratoriumCalculator />} />
              <Route path="/simulator" element={<RepaymentSimulator />} />
              <Route path="/compare" element={<LoanComparison />} />
              <Route path="/optimizer" element={<PrepaymentOptimizer />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />

              {/* Protected Student Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/schedule/:loanId" 
                element={
                  <ProtectedRoute>
                    <AmortizationSchedule />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}
