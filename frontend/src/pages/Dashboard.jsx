import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { calculateLoanDetails, formatCurrency } from '../utils/finance';
import { LayoutDashboard, Trash2, Calendar, FileText, ArrowRight, TrendingUp, PlusCircle, CreditCard, ChevronRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, api } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [extraPayment, setExtraPayment] = useState(10000);
  const [optimizedRes, setOptimizedRes] = useState(null);

  const [otpMonth, setOtpMonth] = useState(12);
  const [otpAmount, setOtpAmount] = useState(50000);
  const [savedPrepayments, setSavedPrepayments] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await api.get('/loans');
      setLoans(response.data);
      if (response.data.length > 0) {
        handleSelectLoan(response.data[0]);
      }
    } catch (err) {
      console.error("Failed to load user loans", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLoan = async (loan) => {
    setSelectedLoan(loan);
    try {
      // 1. Get standard amortization schedule
      const schedRes = await api.get(`/loans/${loan.id}/amortization`);
      setSchedule(schedRes.data.amortizationSchedule || []);

      // 2. Fetch saved one-time prepayments
      const prepayRes = await api.get(`/loans/${loan.id}/prepayments`);
      setSavedPrepayments(prepayRes.data || []);

      // 3. Fetch optimized prepayment schedule
      const optRes = await api.get(`/loans/${loan.id}/optimize?extraPayment=${extraPayment}`);
      setOptimizedRes(optRes.data);
    } catch (err) {
      console.error("Failed to fetch loan details from API, using client fallback", err);
      // Client-side fallback if backend is down or mock
      const clientDetails = calculateLoanDetails({
        principal: loan.principal,
        interestRate: loan.interestRate,
        tenureMonths: loan.tenureMonths,
        moratoriumMonths: loan.moratoriumMonths,
        moratoriumInterestType: loan.moratoriumInterestType
      });
      setSchedule(clientDetails.amortizationSchedule);
    }
  };

  const handleDeleteLoan = async (loanId) => {
    if (!window.confirm("Are you sure you want to delete this loan simulation?")) return;
    try {
      await api.delete(`/loans/${loanId}`);
      setLoans(loans.filter(l => l.id !== loanId));
      if (selectedLoan?.id === loanId) {
        setSelectedLoan(null);
        setSchedule([]);
        setOptimizedRes(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPrepayment = async () => {
    if (!selectedLoan) return;
    try {
      const newOtp = { month: Number(otpMonth), amount: Number(otpAmount) };
      const currentList = savedPrepayments.map(p => ({ month: p.prepaymentMonth, amount: p.prepaymentAmount }));
      currentList.push(newOtp);
      currentList.sort((a, b) => a.month - b.month);

      await api.post(`/loans/${selectedLoan.id}/prepayments`, currentList);
      setOtpAmount(50000);
      handleSelectLoan(selectedLoan);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearPrepayments = async () => {
    if (!selectedLoan) return;
    try {
      await api.post(`/loans/${selectedLoan.id}/prepayments`, []);
      handleSelectLoan(selectedLoan);
    } catch (err) {
      console.error(err);
    }
  };

  // Run optimization locally or remote when slider changes
  const runOptimization = async (extraVal) => {
    setExtraPayment(extraVal);
    if (!selectedLoan) return;
    try {
      const optRes = await api.get(`/loans/${selectedLoan.id}/optimize?extraPayment=${extraVal}`);
      setOptimizedRes(optRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics
  const totalPrincipal = loans.reduce((acc, curr) => acc + curr.principal, 0);
  const totalMonthlyEmi = loans.reduce((acc, curr) => acc + curr.monthlyEmi, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-brandBg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient-slate flex items-center gap-2">
            <LayoutDashboard className="text-accent" /> Portfolio Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-light text-sm">
            Track saved loan schedules, liability balances, and model prepayments.
          </p>
        </div>
        <Link to="/emi" className="btn-primary py-2 px-5 text-sm">
          + Simulate New Loan
        </Link>
      </div>

      {loans.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <CreditCard className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">No saved loan simulations found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-light">
              Create a standard EMI or moratorium loan configuration and save it to begin tracking liability projections.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Link to="/emi" className="btn-primary text-xs">Standard EMI Calculator</Link>
            <Link to="/moratorium" className="btn-outline text-xs">Moratorium Planner</Link>
          </div>
        </div>
      ) : (
        <>
          {/* Portfolio Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-card p-6 bg-slate-900 text-white space-y-1.5 relative overflow-hidden">
              <p className="text-xs uppercase font-bold text-slate-400">Total Loan Principal</p>
              <p className="text-2xl font-bold text-slate-100">{formatCurrency(totalPrincipal)}</p>
              <p className="text-[10px] text-slate-400 font-light">Sum of all saved planning principals</p>
            </div>
            
            <div className="glass-card p-6 bg-slate-900 text-white space-y-1.5">
              <p className="text-xs uppercase font-bold text-slate-400">Total Saved Simulations</p>
              <p className="text-2xl font-bold text-accent">{loans.length} Plans</p>
              <p className="text-[10px] text-slate-400 font-light">Comparing variable moratorium plans</p>
            </div>

            <div className="glass-card p-6 bg-slate-900 text-white space-y-1.5">
              <p className="text-xs uppercase font-bold text-slate-400">Combined Monthly EMI</p>
              <p className="text-2xl font-bold text-slate-100">{formatCurrency(totalMonthlyEmi)}</p>
              <p className="text-[10px] text-slate-400 font-light">Monthly repayment obligation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* List saved configurations */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="font-bold text-slate-500 uppercase tracking-wider text-xs">Saved Loan Plans</h3>
              <div className="space-y-4">
                {loans.map(loan => (
                  <div 
                    key={loan.id}
                    onClick={() => handleSelectLoan(loan)}
                    className={`glass-card p-5 cursor-pointer transition-all border ${
                      selectedLoan?.id === loan.id
                        ? 'border-accent bg-accent/5'
                        : 'hover:border-slate-300 dark:hover:border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{loan.bankName}</h4>
                        <p className="text-xs text-slate-400 font-medium">Principal: {formatCurrency(loan.principal)}</p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteLoan(loan.id); }}
                        className="text-slate-400 hover:text-danger transition-colors p-1"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                      <span>Rate: {loan.interestRate}%</span>
                      <span>Tenure: {loan.tenureMonths}m</span>
                      <span>EMI: {formatCurrency(loan.monthlyEmi)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Loan Details and Prepayment Config */}
            {selectedLoan && (
              <div className="lg:col-span-8 space-y-6">
                <div className="glass-card p-6 space-y-6">
                  {/* Title Bar */}
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{selectedLoan.bankName}</h2>
                      <p className="text-xs text-slate-400">
                        Moratorium: {selectedLoan.moratoriumMonths}m ({selectedLoan.moratoriumInterestType}) | Tenure: {selectedLoan.tenureMonths}m
                      </p>
                    </div>
                    <Link 
                      to={`/schedule/${selectedLoan.id}`} 
                      className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1.5 font-bold"
                    >
                      View Schedule <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  {/* Prepayment Optimizer sliders inside dashboard */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-accent" /> Prepayment Optimization Panel</h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400">Extra Monthly Payment Added to EMI</span>
                        <span className="text-accent font-bold">{formatCurrency(extraPayment)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        step="1000"
                        value={extraPayment}
                        onChange={(e) => runOptimization(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {optimizedRes && (
                      <div className="grid grid-cols-3 gap-3 bg-slate-900 text-white p-4 rounded-xl text-center">
                        <div>
                          <p className="text-[10px] text-slate-400">Months Saved</p>
                          <p className="text-md font-bold text-accent">{optimizedRes.monthsSaved} months</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400">Interest Saved</p>
                          <p className="text-md font-bold text-success">{formatCurrency(optimizedRes.interestSaved)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400">Revised Repayment Term</p>
                          <p className="text-md font-bold text-slate-100">{optimizedRes.optimizedTenureMonths} months</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <hr className="border-slate-200 dark:border-slate-800" />

                  {/* One-time prepayments logs */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-1.5"><Calendar className="h-4 w-4 text-accent" /> Save Custom Lump Sums</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400">Repayment Month</label>
                        <input 
                          type="number" 
                          value={otpMonth}
                          onChange={(e) => setOtpMonth(Number(e.target.value))}
                          className="input-field py-1.5 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400">Amount (INR)</label>
                        <input 
                          type="number" 
                          value={otpAmount}
                          onChange={(e) => setOtpAmount(Number(e.target.value))}
                          className="input-field py-1.5 text-xs mt-1"
                        />
                      </div>
                      <button 
                        onClick={handleAddPrepayment}
                        className="btn-primary py-2 text-xs flex items-center justify-center gap-1.5"
                      >
                        <PlusCircle className="h-4 w-4" /> Save Lump Sum
                      </button>
                    </div>

                    {/* Prepayment summary lists */}
                    {savedPrepayments.length > 0 ? (
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-slate-400 font-semibold">Active Prepayments Logged:</p>
                          <button onClick={handleClearPrepayments} className="text-[10px] text-danger hover:underline">
                            Clear All Logs
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {savedPrepayments.map((p, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded-full border border-slate-200/50 dark:border-slate-800/50"
                            >
                              Month {p.prepaymentMonth}: <strong>{formatCurrency(p.prepaymentAmount)}</strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
