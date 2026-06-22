import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut, Menu, X, GraduationCap, LayoutDashboard, Calculator, Layers, Award, Sparkles, Send } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Dark mode sync
    const isDark = document.body.classList.contains('dark');
    setDark(isDark);
  }, []);

  const toggleDarkMode = () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setDark(isDark);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'EMI Calculator', path: '/emi', icon: Calculator },
    { name: 'Moratorium Plan', path: '/moratorium', icon: Layers },
    { name: 'Repayment Sim', path: '/simulator', icon: Sparkles },
    { name: 'Optimizer', path: '/optimizer', icon: Award },
    { name: 'Comparison', path: '/compare', icon: Layers },
    { name: 'Contact Us', path: '/contact', icon: Send },
  ];

  const activeClass = (path) => 
    location.pathname === path 
      ? 'text-accent border-b-2 border-accent' 
      : 'text-slate-600 dark:text-slate-300 hover:text-accent dark:hover:text-accent';

  return (
    <nav className="sticky top-0 z-50 glass-card rounded-none border-t-0 border-x-0 bg-white/75 dark:bg-brandBg-dark/75">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary dark:text-white">
              <div className="p-2 bg-gradient-to-tr from-accent to-emerald-400 rounded-xl text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-slate-800 to-accent dark:from-white dark:to-accent font-extrabold tracking-tight">
                EduLoan Navigator
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`flex items-center gap-1.5 py-1 px-1 text-sm font-medium transition-colors ${activeClass(link.path)}`}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`flex items-center gap-1.5 text-sm font-medium ${activeClass('/dashboard')}`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    className={`flex items-center gap-1.5 text-sm font-medium ${activeClass('/admin')}`}
                  >
                    Admin
                  </Link>
                )}
              </>
            ) : null}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Hi, {user.username}
                </span>
                <button 
                  onClick={handleLogout}
                  className="btn-secondary py-2 px-4 text-sm flex items-center gap-1.5"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn-primary py-2 px-5 text-sm">
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400"
            >
              {dark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white dark:bg-brandBg-dark border-t border-slate-200 dark:border-slate-800">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <link.icon className="h-5 w-5" />
              {link.name}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              {isAdmin() && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Admin Portal
                </Link>
              )}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2 px-3">
                <p className="text-sm font-medium text-slate-500">Signed in as {user.username}</p>
                <button
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="btn-secondary w-full py-2 flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full py-2.5 mt-2"
            >
              Get Started
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
