import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { calculateLoanDetails, formatCurrency } from '../utils/finance';
import { IndianRupee, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

export default function RepaymentSimulator() {
  const [principal, setPrincipal] = useState(2000000);
  const [rate, setRate] = useState(9.8);
  const [tenure, setTenure] = useState(120);
  const [stepUp, setStepUp] = useState(5); // % annual increase in EMI
  const [rateShockMonth, setRateShockMonth] = useState(36); // month interest changes
  const [rateShockValue, setRateShockValue] = useState(9.8); // new rate value

  const [simResults, setSimResults] = useState(null);

  useEffect(() => {
    // 1. Calculate Standard Baseline
    const baseline = calculateLoanDetails({
      principal,
      interestRate: rate,
      tenureMonths: tenure,
      moratoriumMonths: 0
    });

    // 2. Perform Custom Simulation Loop (Step-up and Rate Shock)
    const M = 0;
    const P = Number(principal);
    const N = Number(tenure);
    const stepUpPercent = Number(stepUp) / 100;
    const shockMonth = Number(rateShockMonth);
    const shockRate = Number(rateShockValue);

    let currentBalance = P;
    let cumInterest = 0;
    const simulatedSchedule = [];
    let currentRate = rate;
    let monthlyEmi = baseline.monthlyEmi;

    const baseEmi = monthlyEmi;

    for (let month = 1; month <= N * 2; month++) {
      if (currentBalance <= 0) break;

      // Apply Rate Shock if reached
      if (month === shockMonth) {
        currentRate = shockRate;
      }

      // Apply annual step up to EMI
      if (month > 1 && (month - 1) % 12 === 0) {
        // e.g. at month 13, 25, 37 etc.
        monthlyEmi = Number((monthlyEmi * (1 + stepUpPercent)).toFixed(2));
      }

      const r = currentRate / (12 * 100);
      const interestForMonth = Number((currentBalance * r).toFixed(2));
      let payment = monthlyEmi;
      let principalPaid = Number((payment - interestForMonth).toFixed(2));

      // Re-adjust EMI if rate changed to ensure payout, but standard simulations just keep paying new EMI
      if (principalPaid < 0) {
        // EMI is too low for interest, force increase
        payment = Number((interestForMonth + 1000).toFixed(2));
        principalPaid = 1000;
      }

      if (currentBalance < principalPaid) {
        principalPaid = currentBalance;
        payment = Number((principalPaid + interestForMonth).toFixed(2));
      }

      const endingBalance = Number((currentBalance - principalPaid).toFixed(2));
      cumInterest += interestForMonth;

      simulatedSchedule.push({
        month,
        endingBalance,
        cumulativeInterest: cumInterest
      });

      currentBalance = endingBalance;
    }

    setSimResults({
      baseline,
      simulated: {
        tenure: simulatedSchedule.length,
        totalInterest: cumInterest,
        totalPayment: P + cumInterest,
        schedule: simulatedSchedule
      }
    });

  }, [principal, rate, tenure, stepUp, rateShockMonth, rateShockValue]);

  if (!simResults) return null;

  const { baseline, simulated } = simResults;

  const tenureSaved = baseline.amortizationSchedule.length - simulated.schedule.length;
  const interestSaved = baseline.totalInterest - simulated.totalInterest;

  // Prepare line chart comparison data
  // Sample every 12 months for chart layout
  const chartData = [];
  const maxLength = Math.max(baseline.amortizationSchedule.length, simulated.schedule.length);
  for (let i = 0; i < maxLength; i += 12) {
    const monthLabel = `Yr ${Math.floor(i / 12)}`;
    const baseRow = baseline.amortizationSchedule[i] || { endingBalance: 0 };
    const simRow = simulated.schedule[i] || { endingBalance: 0 };

    chartData.push({
      Month: monthLabel,
      'Standard Plan': baseRow.endingBalance,
      'Simulated Plan (Step-up)': simRow.endingBalance
    });
  }

  // Ensure last month is in the chart
  chartData.push({
    Month: 'End',
    'Standard Plan': 0,
    'Simulated Plan (Step-up)': 0
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient-slate">
          Repayment Simulator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">
          Simulate income hikes (progressive EMI step-ups) and bank interest fluctuations over your repayment term.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Base Loan */}
          <div className="glass-card p-6 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">1. Setup Base Loan</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400">Principal</label>
                <input 
                  type="number" 
                  value={principal} 
                  onChange={(e) => setPrincipal(Number(e.target.value))} 
                  className="input-field py-2.5 mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={rate} 
                    onChange={(e) => { setRate(Number(e.target.value)); setRateShockValue(Number(e.target.value)); }} 
                    className="input-field py-2.5 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Tenure (m)</label>
                  <input 
                    type="number" 
                    value={tenure} 
                    onChange={(e) => setTenure(Number(e.target.value))} 
                    className="input-field py-2.5 mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Rules */}
          <div className="glass-card p-6 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-accent animate-pulse" /> 2. Simulation Triggers
            </h2>

            {/* Step up slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Annual EMI Step-Up</span>
                <span className="text-accent">{stepUp}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={stepUp}
                onChange={(e) => setStepUp(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-[10px] text-slate-400 font-light">
                EMI increases by {stepUp}% every 12 months as your salary steps up.
              </p>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Interest Rate Shock */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-warning" /> Model Interest Change (Maturity Shock)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Trigger Month</label>
                  <input 
                    type="number" 
                    value={rateShockMonth} 
                    onChange={(e) => setRateShockMonth(Number(e.target.value))} 
                    className="input-field py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">New Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={rateShockValue} 
                    onChange={(e) => setRateShockValue(Number(e.target.value))} 
                    className="input-field py-2 mt-1"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-light">
                Model repo rate increments or float interest variations mid-tenure.
              </p>
            </div>
          </div>
        </div>

        {/* Charts and projections */}
        <div className="lg:col-span-7 space-y-6">
          {/* Metrics summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-5 bg-slate-900 text-white space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400">Interest Savings</p>
              <p className={`text-xl font-bold ${interestSaved >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(Math.abs(interestSaved))}
              </p>
              <p className="text-[10px] text-slate-400 font-light">
                {interestSaved >= 0 ? 'Saved in total interest' : 'Additional interest liability'}
              </p>
            </div>

            <div className="glass-card p-5 bg-slate-900 text-white space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400">Tenure reduction</p>
              <p className="text-xl font-bold text-accent">
                {Math.max(0, tenureSaved)} months
              </p>
              <p className="text-[10px] text-slate-400 font-light">
                Saved {(Math.max(0, tenureSaved) / 12).toFixed(1)} years of EMI payments
              </p>
            </div>

            <div className="glass-card p-5 bg-slate-900 text-white space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Simulated Cost</p>
              <p className="text-xl font-bold text-slate-100">
                {formatCurrency(simulated.totalPayment)}
              </p>
              <p className="text-[10px] text-slate-400 font-light">
                vs {formatCurrency(baseline.totalPayment)} baseline
              </p>
            </div>
          </div>

          {/* Visual Area */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-md font-bold">Amortization Comparison</h2>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <TrendingUp className="h-4 w-4 text-accent" /> Active Step-Up Model
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
                    dataKey="Simulated Plan (Step-up)" 
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
