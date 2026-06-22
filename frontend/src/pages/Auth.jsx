import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Auth() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (isLogin) {
      const res = await login(username, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setErrorMsg(res.message);
      }
    } else {
      const res = await register(username, email, password);
      if (res.success) {
        setIsLogin(true);
        setErrorMsg('Registration successful! Please login with your credentials.');
        setPassword('');
      } else {
        setErrorMsg(res.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-brandBg-dark">
      <div className="max-w-md w-full space-y-8 glass-card p-8 sm:p-10 relative overflow-hidden">
        {/* Brand Header */}
        <div className="text-center space-y-2 relative">
          <div className="w-14 h-14 bg-gradient-to-tr from-accent to-emerald-400 rounded-2xl flex items-center justify-center text-white mx-auto shadow-glow mb-4">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gradient-slate">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {isLogin ? 'Manage and optimize your student loans' : 'Simulate variable rates and prepayments'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
          <button 
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${isLogin ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-800 dark:text-slate-100 font-bold' : 'text-slate-400'}`}
          >
            Login
          </button>
          <button 
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${!isLogin ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-800 dark:text-slate-100 font-bold' : 'text-slate-400'}`}
          >
            Register
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className={`p-3 rounded-xl flex items-center gap-2 text-xs border ${
            errorMsg.includes('successful') 
              ? 'bg-emerald-100 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
              : 'bg-red-100 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
          }`}>
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="mukeshp" 
                className="input-field pl-10 py-2.5 text-sm"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mukesh@gmail.com" 
                  className="input-field pl-10 py-2.5 text-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="input-field pl-10 pr-10 py-2.5 text-sm"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-3 mt-6 text-sm"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {isLogin && (
          <p className="text-center text-[10px] text-slate-400">
            Mock Admin: Username is <strong className="text-accent">admin</strong>, password is <strong className="text-accent">admin123</strong>.
          </p>
        )}
      </div>
    </div>
  );
}
