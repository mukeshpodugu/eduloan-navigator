import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { optimizePrepayment, formatCurrency } from '../utils/finance';
import { Award, DollarSign, Calendar, IndianRupee, PlayCircle, PlusCircle, Trash2 } from 'lucide-react';

export default function PrepaymentOptimizer() {
  const [principal, setPrincipal] = useState(2500000);
  const [rate, setRate] = useState(9.6);
  const [tenure, setTenure] = useState(144); // 12 years in months
  const [moratorium, setMoratorium] = useState(0);
  const [extraPayment, setExtraPayment] = useState(15000);
  const [frequency, setFrequency] = useState('MONTHLY'); // MONTHLY, YEARLY
  
  // Custom One Time Prepayments list
  const [oneTimePayments, setOneTimePayments] = useState([
    { month: 12, amount: 100000 },
    { month: 24, amount: 200000 }
  ]);
  const [newOtpMonth, setNewOtpMonth] = useState(36);
  const [newOtpAmount, setNewOtpAmount] = useState(50000);

  const [optDetails, setOptDetails] = useState(null);

  useEffect(() => {
    const details = optimizePrepayment({
      principal,
      interestRate: rate,
      tenureMonths: tenure,
      moratoriumMonths: moratorium,
      moratoriumInterestType: 'COMPOUND',
      extraPayment,
      extraPaymentFrequency: frequency,
      oneTimePayments
    });
    setOptDetails(details);
  }, [principal, rate, tenure, moratorium, extraPayment, frequency, oneTimePayments]);

  if (!optDetails) return null;

  const {
    originalTenureMonths,
    originalTotalInterest,
    originalTotalPayment,
    optimizedTenureMonths,
    optimizedTotalInterest,
    optimizedTotalPayment,
    monthsSaved,
    interestSaved,
    totalSavings,
    amortizationSchedule
  } = optDetails;

  // Compile visual comparison data
  // Sample every 12 months for readable charts
  const chartData = [];
  const totalLength = Math.max(originalTenureMonths, optimizedTenureMonths);
  
  // To match baseline values, calculate standard baseline schedule
  const baseDetails = optimizePrepayment({
    principal,
    interestRate: rate,
    tenureMonths: tenure,
    moratoriumMonths: moratorium,
    moratoriumInterestType: 'COMPOUND',
    extraPayment: 0,
    oneTimePayments: []
  });

  for (let i = 0; i <= totalLength; i += 12) {
    const label = `Yr ${Math.floor(i / 12)}`;
    const baseRow = baseDetails.amortizationSchedule[i] || { endingBalance: 0 };
    const optRow = amortizationSchedule[i] || { endingBalance: 0 };
    chartData.push({
      Month: label,
      'Standard Plan': baseRow.endingBalance,
      'Optimized Plan': optRow.endingBalance
    });
  }

  // Ensure last month drops to zero in chart
  chartData.push({
    Month: 'End',
    'Standard Plan': 0,
    'Optimized Plan': 0
  });

  const handleAddOtp = () => {
    if (newOtpAmount <= 0 || newOtpMonth <= 0) return;
    setOneTimePayments([
      ...oneTimePayments,
      { month: Number(newOtpMonth), amount: Number(newOtpAmount) }
    ].sort((a, b) => a.month - b.month));
    setNewOtpAmount(50000);
  };

  const handleRemoveOtp = (index) => {
    setOneTimePayments(oneTimePayments.filter((_, idx) => idx !== index));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient-slate">
          Prepayment Optimizer
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">
          Model surplus income allocations and one-off windfalls to optimize your repayment timeline and save on interest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Base Loan */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">1. Setup Loan Details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400">Principal Amount</label>
                <input 
                  type="number" 
                  value={principal} 
                  onChange={(e) => setPrincipal(Number(e.target.value))} 
                  className="input-field py-2 mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={rate} 
                    onChange={(e) => setRate(Number(e.target.value))} 
                    className="input-field py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Tenure (Months)</label>
                  <input 
                    type="number" 
                    value={tenure} 
                    onChange={(e) => setTenure(Number(e.target.value))} 
                    className="input-field py-2 mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Prepayment Config */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Award className="h-5 w-5 text-accent animate-bounce" /> 2. Prepayment Rules
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400">Extra Recurring Prepayment</label>
                <input 
                  type="number" 
                  value={extraPayment} 
                  onChange={(e) => setExtraPayment(Number(e.target.value))} 
                  className="input-field py-2.5 mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400">Prepayment Frequency</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {['MONTHLY', 'YEARLY'].map(freq => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFrequency(freq)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                        frequency === freq
                          ? 'border-accent bg-accent/10 text-accent font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Custom One-time Prepayments */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Calendar className="h-4.5 w-4.5 text-accent" /> 3. One-Time Lump Sums
            </h2>

            <div className="space-y-3">
              {oneTimePayments.map((otp, index) => (
                <div key={index} className="flex justify-between items-center text-xs bg-slate-100 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                  <span>Month {otp.month}</span>
                  <span className="font-semibold text-accent">{formatCurrency(otp.amount)}</span>
                  <button onClick={() => handleRemoveOtp(index)} className="text-danger hover:text-red-650 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <div className="grid grid-cols-3 gap-2 items-end pt-2">
                <div className="col-span-1">
                  <label className="text-[10px] text-slate-400 font-bold">Month</label>
                  <input 
                    type="number" 
                    value={newOtpMonth} 
                    onChange={(e) => setNewOtpMonth(Number(e.target.value))} 
                    className="input-field py-1 text-xs"
                  />
                </div>
                <div className="col-span-2 flex gap-1.5 items-center">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 font-bold">Amount</label>
                    <input 
                      type="number" 
                      value={newOtpAmount} 
                      onChange={(e) => setNewOtpAmount(Number(e.target.value))} 
                      className="input-field py-1 text-xs"
                    />
                  </div>
                  <button 
                    onClick={handleAddOtp} 
                    className="p-2 bg-accent rounded-xl text-white hover:bg-accent-dark transition-colors self-end h-[34px] w-9 flex items-center justify-center"
                  >
                    <PlusCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projections & Visuals */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-5 bg-slate-900 text-white space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400">Interest Saved</p>
              <p className="text-xl font-bold text-success">{formatCurrency(interestSaved)}</p>
              <p className="text-[10px] text-slate-400 font-light">
                {((interestSaved / originalTotalInterest) * 100).toFixed(0)}% reduction in interest
              </p>
            </div>
            
            <div className="glass-card p-5 bg-slate-900 text-white space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400">Tenure reduction</p>
              <p className="text-xl font-bold text-accent">{monthsSaved} months</p>
              <p className="text-[10px] text-slate-400 font-light">
                Cleared in {(optimizedTenureMonths / 12).toFixed(1)} yrs vs {(originalTenureMonths / 12).toFixed(1)} yrs
              </p>
            </div>

            <div className="glass-card p-5 bg-slate-900 text-white space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Payments Saved</p>
              <p className="text-xl font-bold text-slate-100">{formatCurrency(totalSavings)}</p>
              <p className="text-[10px] text-slate-400 font-light">
                Total repayment optimized to {formatCurrency(optimizedTotalPayment)}
              </p>
            </div>
          </div>

          {/* Visual chart comparison */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-md font-bold">Debt Clearance Curve</h2>
              <div className="flex items-center gap-1.5 text-xs text-success">
                <PlayCircle className="h-4 w-4" /> Acceleration Active
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                  <XAxis dataKey="Month" stroke="#64748b" fontSize={11} />
                  <YAxis tickFormatter={(val) => `${(val / 100000).toFixed(0)}L`} stroke="#64748b" fontSize={10} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Standard Plan" 
                    stroke="#1E293B" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Optimized Plan" 
                    stroke="#14B8A6" 
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
