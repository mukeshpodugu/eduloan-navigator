import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area } from 'recharts';
import { calculateLoanDetails, formatCurrency } from '../utils/finance';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Calendar, HelpCircle, FileSpreadsheet, FileText, IndianRupee, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MoratoriumCalculator() {
  const { user, api } = useAuth();
  const [principal, setPrincipal] = useState(1500000);
  const [rate, setRate] = useState(10.2);
  const [tenure, setTenure] = useState(120); // Repayment tenure in months
  const [moratorium, setMoratorium] = useState(24); // 2 years study + grace in months
  const [interestType, setInterestType] = useState('COMPOUND'); // COMPOUND, SIMPLE, DEFERRED
  const [bankName, setBankName] = useState('Moratorium Simulation');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [loanDetails, setLoanDetails] = useState(null);

  useEffect(() => {
    const details = calculateLoanDetails({
      principal,
      interestRate: rate,
      tenureMonths: tenure,
      moratoriumMonths: moratorium,
      moratoriumInterestType: interestType
    });
    setLoanDetails(details);
  }, [principal, rate, tenure, moratorium, interestType]);

  if (!loanDetails) return null;

  const { accumulatedInterest, capitalizedPrincipal, monthlyEmi, totalInterest, totalPayment, amortizationSchedule } = loanDetails;

  // Bar chart: Principal vs Moratorium Interest vs Repayment Interest
  const barData = [
    {
      name: 'Plan Breakdown',
      'Principal Amount': principal,
      'Moratorium Interest': accumulatedInterest,
      'Repayment Interest': totalInterest - accumulatedInterest,
    }
  ];

  // Sampling schedule for progress chart
  const progressChartData = amortizationSchedule
    .filter((_, idx) => idx % 6 === 0 || idx === amortizationSchedule.length - 1)
    .map(row => ({
      Month: `M${row.month}`,
      Balance: row.endingBalance,
      cumulativeInterest: row.cumulativeInterest,
      phase: row.phase
    }));

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.text('EduLoan Navigator - Moratorium Plan Report', 14, 15);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Original Principal: ${formatCurrency(principal)}`, 14, 25);
    doc.text(`Interest Rate: ${rate}% p.a.`, 14, 30);
    doc.text(`Moratorium Period: ${moratorium} months`, 14, 35);
    doc.text(`Interest Treatment: ${interestType}`, 14, 40);
    doc.text(`Accumulated Interest (Moratorium): ${formatCurrency(accumulatedInterest)}`, 14, 45);
    doc.text(`Repayment Principal (Capitalized): ${formatCurrency(capitalizedPrincipal)}`, 14, 50);
    doc.text(`Revised EMI: ${formatCurrency(monthlyEmi)}`, 14, 55);
    doc.text(`Total Interest Paid: ${formatCurrency(totalInterest)}`, 14, 60);
    doc.text(`Total Payment: ${formatCurrency(totalPayment)}`, 14, 65);

    const headers = [['Month', 'Phase', 'Beginning Balance (INR)', 'Payment Made (INR)', 'Principal Paid (INR)', 'Interest Component (INR)', 'Ending Balance (INR)']];
    const data = amortizationSchedule.map(row => [
      `M${row.month}`,
      row.phase,
      row.beginningBalance,
      row.payment,
      row.principalPaid,
      row.interestPaid,
      row.endingBalance
    ]);

    doc.autoTable({
      head: headers,
      body: data,
      startY: 75,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [20, 184, 166] }
    });

    doc.save('eduloan_moratorium_schedule.pdf');
  };

  const handleExportExcel = () => {
    const data = amortizationSchedule.map(row => ({
      Month: `Month ${row.month}`,
      Phase: row.phase,
      'Beginning Balance (INR)': row.beginningBalance,
      'Payment (INR)': row.payment,
      'Principal Component (INR)': row.principalPaid,
      'Interest Component (INR)': row.interestPaid,
      'Ending Balance (INR)': row.endingBalance,
      'Cumulative Interest (INR)': row.cumulativeInterest
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Moratorium Schedule');

    const summary = [
      { Parameter: 'Original Principal', Value: principal },
      { Parameter: 'Interest Rate (%)', Value: rate },
      { Parameter: 'Moratorium (Months)', Value: moratorium },
      { Parameter: 'Interest Type', Value: interestType },
      { Parameter: 'Accumulated Moratorium Interest', Value: accumulatedInterest },
      { Parameter: 'Capitalized Principal', Value: capitalizedPrincipal },
      { Parameter: 'EMI', Value: monthlyEmi },
      { Parameter: 'Total Interest', Value: totalInterest },
      { Parameter: 'Total Repayment', Value: totalPayment },
    ];
    const wsSum = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, wsSum, 'Summary');

    XLSX.writeFile(wb, 'eduloan_moratorium_plan.xlsx');
  };

  const handleSaveLoan = async () => {
    if (!user) {
      setSuccessMsg('Please sign in or create an account to save simulations.');
      return;
    }
    setSaving(true);
    setSuccessMsg('');
    try {
      await api.post('/loans', {
        bankName,
        principal,
        interestRate: rate,
        tenureMonths: tenure,
        moratoriumMonths: moratorium,
        moratoriumInterestType: interestType
      });
      setSuccessMsg('Moratorium scenario saved to your dashboard!');
    } catch (err) {
      console.error(err);
      setSuccessMsg('Failed to save simulation.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient-slate">
          Moratorium Interest Planner
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">
          Simulate how study periods, grace terms, and compounding structures affect your loan maturity principal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Layers className="text-accent h-5 w-5" /> Adjust Parameters
            </h2>

            {/* Principal */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Principal Amount</span>
                <span className="text-accent">{formatCurrency(principal)}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="15000000"
                step="50000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Interest Rate (p.a.)</span>
                <span className="text-accent">{rate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Moratorium Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Moratorium Period (Study + Grace)</span>
                <span className="text-accent">{moratorium} months ({(moratorium / 12).toFixed(1)} yrs)</span>
              </div>
              <input
                type="range"
                min="6"
                max="60"
                step="6"
                value={moratorium}
                onChange={(e) => setMoratorium(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>6 months</span>
                <span>3 years</span>
                <span>5 years</span>
              </div>
            </div>

            {/* Repayment Tenure Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Repayment Tenure (After Moratorium)</span>
                <span className="text-accent">{tenure} months ({(tenure / 12).toFixed(1)} yrs)</span>
              </div>
              <input
                type="range"
                min="12"
                max="180"
                step="6"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Moratorium Type Select */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                Interest Capitalization Type <HelpCircle className="h-4 w-4 text-slate-400 cursor-pointer" title="How interest is capitalized during the study moratorium" />
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['COMPOUND', 'SIMPLE', 'DEFERRED'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setInterestType(type)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      interestType === type
                        ? 'border-accent bg-accent/10 text-accent font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-light mt-1">
                {interestType === 'COMPOUND' && 'Compounding: Unpaid interest adds to principal monthly, inflating your EMI.'}
                {interestType === 'SIMPLE' && 'Simple: Interest accumulates monthly but only adds to principal as a flat sum at the end.'}
                {interestType === 'DEFERRED' && 'Deferred: Interest is paid off monthly during college, leaving your principal untouched.'}
              </p>
            </div>
          </div>

          {/* Save simulation */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-bold text-sm">Save Moratorium Plan</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Sim Name (e.g. SBI Abroad Compound)" 
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="input-field py-2"
              />
              <button onClick={handleSaveLoan} disabled={saving} className="btn-primary w-full py-2.5 text-sm">
                {saving ? 'Saving...' : 'Save Plan'}
              </button>
              {successMsg && <p className="text-xs text-center font-medium text-emerald-500">{successMsg}</p>}
            </div>
          </div>
        </div>

        {/* Outputs Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 space-y-1 bg-slate-900 text-white">
              <p className="text-[10px] uppercase font-bold text-slate-400">Moratorium Interest</p>
              <p className="text-lg font-bold text-accent">{formatCurrency(accumulatedInterest)}</p>
            </div>
            <div className="glass-card p-4 space-y-1 bg-slate-900 text-white">
              <p className="text-[10px] uppercase font-bold text-slate-400">Revised Principal</p>
              <p className="text-lg font-bold text-slate-100">{formatCurrency(capitalizedPrincipal)}</p>
            </div>
            <div className="glass-card p-4 space-y-1 bg-slate-900 text-white">
              <p className="text-[10px] uppercase font-bold text-slate-400">Repayment EMI</p>
              <p className="text-lg font-bold text-accent">{formatCurrency(monthlyEmi)}</p>
            </div>
            <div className="glass-card p-4 space-y-1 bg-slate-900 text-white">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Payment</p>
              <p className="text-lg font-bold text-slate-100">{formatCurrency(totalPayment)}</p>
            </div>
          </div>

          {/* Charts Card */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Fintech Portfolio Analysis</h3>
              <div className="flex gap-2">
                <button onClick={handleExportPDF} className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" /> PDF
                </button>
                <button onClick={handleExportExcel} className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1">
                  <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
                </button>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis tickFormatter={(val) => `${(val / 100000).toFixed(0)}L`} stroke="#64748b" fontSize={10} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="Principal Amount" fill="#0F172A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Moratorium Interest" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Repayment Interest" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Area Chart: Balance Progression (Moratorium vs Repayment) */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-500">Balance Progression Curve</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                    <XAxis dataKey="Month" stroke="#64748b" fontSize={10} />
                    <YAxis tickFormatter={(val) => `${(val / 100000).toFixed(0)}L`} stroke="#64748b" fontSize={10} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area 
                      name="Outstanding Loan Balance" 
                      type="monotone" 
                      dataKey="Balance" 
                      stroke="#14B8A6" 
                      fill="#14B8A6" 
                      fillOpacity={0.1} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
