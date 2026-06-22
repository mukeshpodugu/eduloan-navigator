import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { calculateLoanDetails, formatCurrency } from '../utils/finance';
import { Info, HelpCircle, Sparkles, AlertCircle } from 'lucide-react';

export default function LoanComparison() {
  const [bank1, setBank1] = useState({ name: 'Bank Alpha', principal: 1500000, rate: 9.5, tenure: 120, moratorium: 24, moratoriumType: 'COMPOUND' });
  const [bank2, setBank2] = useState({ name: 'Bank Beta', principal: 1500000, rate: 10.2, tenure: 120, moratorium: 24, moratoriumType: 'SIMPLE' });
  const [bank3, setBank3] = useState({ name: 'Bank Gamma', principal: 1500000, rate: 9.0, tenure: 120, moratorium: 24, moratoriumType: 'DEFERRED' });

  // Compute values
  const res1 = calculateLoanDetails({ principal: bank1.principal, interestRate: bank1.rate, tenureMonths: bank1.tenure, moratoriumMonths: bank1.moratorium, moratoriumInterestType: bank1.moratoriumType });
  const res2 = calculateLoanDetails({ principal: bank2.principal, interestRate: bank2.rate, tenureMonths: bank2.tenure, moratoriumMonths: bank2.moratorium, moratoriumInterestType: bank2.moratoriumType });
  const res3 = calculateLoanDetails({ principal: bank3.principal, interestRate: bank3.rate, tenureMonths: bank3.tenure, moratoriumMonths: bank3.moratorium, moratoriumInterestType: bank3.moratoriumType });

  const compareData = [
    {
      name: 'Monthly EMI',
      [bank1.name]: res1.monthlyEmi,
      [bank2.name]: res2.monthlyEmi,
      [bank3.name]: res3.monthlyEmi,
    },
    {
      name: 'Total Interest',
      [bank1.name]: res1.totalInterest,
      [bank2.name]: res2.totalInterest,
      [bank3.name]: res3.totalInterest,
    }
  ];

  const updateBank = (bankIndex, field, value) => {
    const setters = [setBank1, setBank2, setBank3];
    const states = [bank1, bank2, bank3];
    const setBank = setters[bankIndex];
    const bank = states[bankIndex];

    setBank({
      ...bank,
      [field]: value
    });
  };

  const getBestOffer = () => {
    const costs = [
      { name: bank1.name, cost: res1.totalPayment },
      { name: bank2.name, cost: res2.totalPayment },
      { name: bank3.name, cost: res3.totalPayment },
    ];
    costs.sort((a, b) => a.cost - b.cost);
    return costs[0];
  };

  const bestOffer = getBestOffer();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient-slate">
          Education Loan Comparison
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">
          Compare up to 3 bank offers side-by-side. Model differences in principal, floats, grace rules, and capitalization models.
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-accent animate-pulse" />
        <span className="text-xs sm:text-sm font-semibold">
          Smart Advice: <strong className="text-accent">{bestOffer.name}</strong> offers the lowest total cost of liability: <strong className="text-accent">{formatCurrency(bestOffer.cost)}</strong>.
        </span>
      </div>

      {/* Entry Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[bank1, bank2, bank3].map((bank, index) => (
          <div key={index} className="glass-card p-6 space-y-4">
            <input 
              type="text" 
              value={bank.name}
              onChange={(e) => updateBank(index, 'name', e.target.value)}
              className="font-bold text-md w-full bg-transparent border-b border-slate-200 dark:border-slate-800 focus:outline-none focus:border-accent pb-1 text-slate-800 dark:text-slate-200"
            />
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Principal Amount</label>
                <input 
                  type="number" 
                  value={bank.principal} 
                  onChange={(e) => updateBank(index, 'principal', Number(e.target.value))}
                  className="input-field py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={bank.rate} 
                    onChange={(e) => updateBank(index, 'rate', Number(e.target.value))}
                    className="input-field py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Tenure (m)</label>
                  <input 
                    type="number" 
                    value={bank.tenure} 
                    onChange={(e) => updateBank(index, 'tenure', Number(e.target.value))}
                    className="input-field py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Moratorium (m)</label>
                  <input 
                    type="number" 
                    value={bank.moratorium} 
                    onChange={(e) => updateBank(index, 'moratorium', Number(e.target.value))}
                    className="input-field py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Interest Type</label>
                  <select
                    value={bank.moratoriumType}
                    onChange={(e) => updateBank(index, 'moratoriumType', e.target.value)}
                    className="input-field py-2 text-xs h-9 bg-white dark:bg-slate-950"
                  >
                    <option value="COMPOUND">Compound</option>
                    <option value="SIMPLE">Simple</option>
                    <option value="DEFERRED">Deferred</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Grid & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Table Comparison */}
        <div className="lg:col-span-6 glass-card p-6 space-y-4">
          <h3 className="font-bold text-md flex items-center gap-1.5"><Info className="h-5 w-5 text-accent" /> Comparison Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5">Parameter</th>
                  <th className="py-2.5">{bank1.name}</th>
                  <th className="py-2.5">{bank2.name}</th>
                  <th className="py-2.5">{bank3.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/10">
                  <td className="py-3 font-medium text-slate-500">EMI after Moratorium</td>
                  <td className="py-3 font-semibold text-accent">{formatCurrency(res1.monthlyEmi)}</td>
                  <td className="py-3 font-semibold text-accent">{formatCurrency(res2.monthlyEmi)}</td>
                  <td className="py-3 font-semibold text-accent">{formatCurrency(res3.monthlyEmi)}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/10">
                  <td className="py-3 font-medium text-slate-500">Moratorium Interest</td>
                  <td className="py-3">{formatCurrency(res1.accumulatedInterest)}</td>
                  <td className="py-3">{formatCurrency(res2.accumulatedInterest)}</td>
                  <td className="py-3">{formatCurrency(res3.accumulatedInterest)}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/10">
                  <td className="py-3 font-medium text-slate-500">Capitalized Principal</td>
                  <td className="py-3">{formatCurrency(res1.capitalizedPrincipal)}</td>
                  <td className="py-3">{formatCurrency(res2.capitalizedPrincipal)}</td>
                  <td className="py-3">{formatCurrency(res3.capitalizedPrincipal)}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/10">
                  <td className="py-3 font-medium text-slate-500">Total Interest</td>
                  <td className="py-3 text-danger font-semibold">{formatCurrency(res1.totalInterest)}</td>
                  <td className="py-3 text-danger font-semibold">{formatCurrency(res2.totalInterest)}</td>
                  <td className="py-3 text-danger font-semibold">{formatCurrency(res3.totalInterest)}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/10">
                  <td className="py-3 font-medium text-slate-500">Total Payment</td>
                  <td className="py-3 font-bold text-slate-700 dark:text-slate-200">{formatCurrency(res1.totalPayment)}</td>
                  <td className="py-3 font-bold text-slate-700 dark:text-slate-200">{formatCurrency(res2.totalPayment)}</td>
                  <td className="py-3 font-bold text-slate-700 dark:text-slate-200">{formatCurrency(res3.totalPayment)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Comparison Charts */}
        <div className="lg:col-span-6 glass-card p-6 space-y-4">
          <h3 className="font-bold text-md">Visual Comparison Chart</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis tickFormatter={(val) => `${(val / 100000).toFixed(0)}L`} stroke="#64748b" fontSize={10} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey={bank1.name} fill="#0F172A" radius={[4, 4, 0, 0]} />
                <Bar dataKey={bank2.name} fill="#14B8A6" radius={[4, 4, 0, 0]} />
                <Bar dataKey={bank3.name} fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
