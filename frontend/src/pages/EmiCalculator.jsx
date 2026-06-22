import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { calculateEMI, calculateLoanDetails, formatCurrency } from '../utils/finance';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Download, FileSpreadsheet, FileText, RefreshCw, Calendar, IndianRupee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EmiCalculator() {
  const { user, api } = useAuth();
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(9.5);
  const [tenure, setTenure] = useState(120); // 10 years in months
  const [saving, setSaving] = useState(false);
  const [bankName, setBankName] = useState('Standard Education Loan');
  const [successMsg, setSuccessMsg] = useState('');

  const [loanDetails, setLoanDetails] = useState(null);

  // Re-calculate whenever inputs change
  useEffect(() => {
    const details = calculateLoanDetails({
      principal,
      interestRate: rate,
      tenureMonths: tenure,
      moratoriumMonths: 0,
    });
    setLoanDetails(details);
  }, [principal, rate, tenure]);

  if (!loanDetails) return null;

  const { monthlyEmi, totalInterest, totalPayment, amortizationSchedule } = loanDetails;

  // Pie chart data
  const pieData = [
    { name: 'Principal Amount', value: principal, color: '#0F172A' },
    { name: 'Total Interest', value: totalInterest, color: '#14B8A6' },
  ];

  // Map schedule data for line/area chart (sampling every 12 months for readability)
  const chartData = amortizationSchedule
    .filter((_, idx) => idx % 12 === 0 || idx === amortizationSchedule.length - 1)
    .map((row) => ({
      Month: `Yr ${Math.floor(row.month / 12)}`,
      Balance: row.endingBalance,
      InterestPaid: row.cumulativeInterest,
    }));

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.text('EduLoan Navigator - Standard Loan EMI Schedule', 14, 15);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Principal Amount: ${formatCurrency(principal)}`, 14, 25);
    doc.text(`Interest Rate: ${rate}%`, 14, 30);
    doc.text(`Tenure: ${tenure} months (${(tenure / 12).toFixed(1)} years)`, 14, 35);
    doc.text(`Monthly EMI: ${formatCurrency(monthlyEmi)}`, 14, 40);
    doc.text(`Total Interest Paid: ${formatCurrency(totalInterest)}`, 14, 45);
    doc.text(`Total Repayment: ${formatCurrency(totalPayment)}`, 14, 50);
    doc.text(`Report Generated On: ${new Date().toLocaleDateString()}`, 14, 55);

    const headers = [['Month', 'Beginning Balance (INR)', 'Monthly EMI (INR)', 'Principal Portion (INR)', 'Interest Portion (INR)', 'Ending Balance (INR)']];
    const data = amortizationSchedule.map(row => [
      row.month,
      row.beginningBalance,
      row.payment,
      row.principalPaid,
      row.interestPaid,
      row.endingBalance
    ]);

    doc.autoTable({
      head: headers,
      body: data,
      startY: 65,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 23, 42] }
    });

    doc.save('eduloan_emi_schedule.pdf');
  };

  const handleExportExcel = () => {
    const data = amortizationSchedule.map(row => ({
      Month: row.month,
      'Beginning Balance (INR)': row.beginningBalance,
      'Payment (INR)': row.payment,
      'Principal Portion (INR)': row.principalPaid,
      'Interest Portion (INR)': row.interestPaid,
      'Ending Balance (INR)': row.endingBalance,
      'Cumulative Interest (INR)': row.cumulativeInterest
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'EMI Amortization');

    // Summary metadata sheet
    const summaryData = [
      { Parameter: 'Principal Amount', Value: principal },
      { Parameter: 'Interest Rate (%)', Value: rate },
      { Parameter: 'Tenure (Months)', Value: tenure },
      { Parameter: 'Monthly EMI', Value: monthlyEmi },
      { Parameter: 'Total Interest', Value: totalInterest },
      { Parameter: 'Total Repayment', Value: totalPayment },
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    XLSX.writeFile(wb, 'eduloan_emi_schedule.xlsx');
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
        moratoriumMonths: 0,
        moratoriumInterestType: 'COMPOUND'
      });
      setSuccessMsg('Loan configuration successfully saved to your dashboard!');
    } catch (err) {
      console.error(err);
      setSuccessMsg('Failed to save loan. Please check server connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient-slate">
          Standard EMI Calculator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">
          Model monthly installments, visualize repayments, and download professional amortization schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="text-accent h-5 w-5" /> Adjust Parameters
            </h2>

            {/* Principal Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Loan Amount</span>
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
              <div className="flex justify-between text-xs text-slate-400">
                <span>1L</span>
                <span>50L</span>
                <span>1.5Cr</span>
              </div>
            </div>

            {/* Rate Slider */}
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
              <div className="flex justify-between text-xs text-slate-400">
                <span>5%</span>
                <span>12.5%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Tenure</span>
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
              <div className="flex justify-between text-xs text-slate-400">
                <span>1 yr</span>
                <span>7.5 yrs</span>
                <span>15 yrs</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="glass-card p-6 bg-slate-900 text-white space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Commitment</h3>
            <div className="text-3xl font-extrabold text-accent flex items-center gap-1">
              <IndianRupee className="h-7 w-7" /> {formatCurrency(monthlyEmi).replace('₹', '')}
              <span className="text-xs text-slate-400 font-light">/ month</span>
            </div>
            
            <hr className="border-slate-800" />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-400">Total Interest</p>
                <p className="font-bold text-slate-100">{formatCurrency(totalInterest)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Repayment</p>
                <p className="font-bold text-slate-100">{formatCurrency(totalPayment)}</p>
              </div>
            </div>
          </div>

          {/* Save & Track */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-bold text-sm">Save This Loan Simulation</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Bank / Plan name (e.g. SBI Scholar Loan)" 
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="input-field py-2"
              />
              <button 
                onClick={handleSaveLoan}
                disabled={saving}
                className="btn-primary w-full py-2.5 text-sm"
              >
                {saving ? 'Saving...' : 'Save Configuration to Dashboard'}
              </button>
              {successMsg && (
                <p className="text-xs text-center font-medium text-emerald-500 dark:text-emerald-400">
                  {successMsg}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Charts & Actions Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Charts Card */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-lg font-bold">Repayment Distribution</h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleExportPDF} 
                  className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1"
                >
                  <FileText className="h-3.5 w-3.5" /> PDF
                </button>
                <button 
                  onClick={handleExportExcel} 
                  className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Pie Chart */}
              <div className="h-56 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-slate-400">Total Interest</span>
                  <span className="text-sm font-extrabold text-accent">
                    {((totalInterest / totalPayment) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Legends & Bullet Info */}
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-slate-900 dark:bg-slate-800"></div>
                  <div>
                    <p className="text-xs text-slate-400">Principal Portion</p>
                    <p className="font-bold">{formatCurrency(principal)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-accent"></div>
                  <div>
                    <p className="text-xs text-slate-400">Interest Portion</p>
                    <p className="font-bold">{formatCurrency(totalInterest)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Area Chart: Outstanding Balance */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300">Repayment Progress Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="Month" stroke="#64748b" fontSize={11} />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={10} 
                      tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`}
                    />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Area 
                      name="Outstanding Balance" 
                      type="monotone" 
                      dataKey="Balance" 
                      stroke="#14B8A6" 
                      fillOpacity={1} 
                      fill="url(#colorBalance)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Table */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-bold">First 12 Months Amortization Preview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-medium">
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">Beginning Balance</th>
                <th className="py-3 px-4">EMI Payment</th>
                <th className="py-3 px-4">Principal Component</th>
                <th className="py-3 px-4">Interest Component</th>
                <th className="py-3 px-4">Ending Balance</th>
              </tr>
            </thead>
            <tbody>
              {amortizationSchedule.slice(0, 12).map((row) => (
                <tr 
                  key={row.month} 
                  className="border-b border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-500">M{row.month}</td>
                  <td className="py-3.5 px-4">{formatCurrency(row.beginningBalance)}</td>
                  <td className="py-3.5 px-4 text-accent font-semibold">{formatCurrency(row.payment)}</td>
                  <td className="py-3.5 px-4 text-success">{formatCurrency(row.principalPaid)}</td>
                  <td className="py-3.5 px-4 text-danger">{formatCurrency(row.interestPaid)}</td>
                  <td className="py-3.5 px-4 font-medium">{formatCurrency(row.endingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 font-light text-center">
          Showing preview of year 1. Export Excel or PDF to view the full {tenure} months schedule.
        </p>
      </div>
    </div>
  );
}
