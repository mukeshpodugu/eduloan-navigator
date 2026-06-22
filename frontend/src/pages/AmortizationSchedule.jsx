import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { calculateLoanDetails, formatCurrency } from '../utils/finance';
import { FileSpreadsheet, FileText, ArrowLeft, Search, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function AmortizationSchedule() {
  const { loanId } = useParams();
  const { api } = useAuth();
  const [loan, setLoan] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Show year by year

  useEffect(() => {
    fetchSchedule();
  }, [loanId]);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const loanRes = await api.get(`/loans/${loanId}`);
      setLoan(loanRes.data);

      const schedRes = await api.get(`/loans/${loanId}/amortization`);
      setSchedule(schedRes.data.amortizationSchedule || []);
    } catch (err) {
      console.error(err);
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-brandBg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-brandBg-dark">
        <div className="text-center space-y-4">
          <p className="font-bold text-lg">Loan schedule not found or access denied.</p>
          <Link to="/dashboard" className="btn-primary text-xs">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  // Filter based on search query
  const filteredSchedule = schedule.filter(row => 
    row.month.toString().includes(searchQuery) ||
    row.phase.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculation
  const totalPages = Math.ceil(filteredSchedule.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSchedule.slice(indexOfFirstItem, indexOfLastItem);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.text(`Amortization Schedule - ${loan.bankName}`, 14, 15);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Principal: ${formatCurrency(loan.principal)} | Rate: ${loan.interestRate}%`, 14, 25);
    doc.text(`Moratorium: ${loan.moratoriumMonths}m | Repayment Tenure: ${loan.tenureMonths}m`, 14, 30);
    doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 14, 35);

    const headers = [['Month', 'Phase', 'Beginning Balance', 'Payment', 'Principal Paid', 'Interest Paid', 'Ending Balance']];
    const data = schedule.map(row => [
      `Month ${row.month}`,
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
      startY: 45,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 23, 42] }
    });

    doc.save(`Schedule_${loan.bankName.replace(/\s+/g, '_')}.pdf`);
  };

  const handleExportExcel = () => {
    const data = schedule.map(row => ({
      Month: row.month,
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
    XLSX.utils.book_append_sheet(wb, ws, 'Schedule');
    XLSX.writeFile(wb, `Schedule_${loan.bankName.replace(/\s+/g, '_')}.xlsx`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-accent font-semibold transition-colors mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gradient-slate">
            Amortization Schedule: {loan.bankName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total Repayment Tenure: {loan.tenureMonths} Months | Study Moratorium: {loan.moratoriumMonths} Months
          </p>
        </div>

        <div className="flex gap-2 self-end sm:self-center">
          <button onClick={handleExportPDF} className="btn-outline py-2 px-4 text-xs flex items-center gap-1.5 font-bold">
            <FileText className="h-4 w-4" /> Export PDF
          </button>
          <button onClick={handleExportExcel} className="btn-outline py-2 px-4 text-xs flex items-center gap-1.5 font-bold">
            <FileSpreadsheet className="h-4 w-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Search and stats bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search month index (e.g. 12)..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="input-field pl-10 py-2.5 text-sm"
          />
        </div>

        {/* Stats */}
        <div className="md:col-span-8 flex justify-end gap-6 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-accent" />
            <span>Moratorium Phase: <strong className="text-slate-700 dark:text-slate-200">{loan.moratoriumMonths} Months</strong></span>
          </div>
          <div>
            <span>Active Repayment Phase: <strong className="text-slate-700 dark:text-slate-200">{loan.tenureMonths} Months</strong></span>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="glass-card p-6 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold text-xs uppercase">
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">Phase</th>
                <th className="py-3 px-4">Beginning Balance</th>
                <th className="py-3 px-4">Monthly Payment</th>
                <th className="py-3 px-4">Principal Paid</th>
                <th className="py-3 px-4">Interest Paid</th>
                <th className="py-3 px-4">Ending Balance</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row) => (
                <tr 
                  key={row.month} 
                  className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-500">Month {row.month}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      row.phase === 'MORATORIUM'
                        ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                        : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                    }`}>
                      {row.phase}
                    </span>
                  </td>
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center text-xs pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <span className="text-slate-400 font-medium">
              Showing page {currentPage} of {totalPages} ({filteredSchedule.length} months total)
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn-outline p-2 h-9 w-9 flex items-center justify-center disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn-outline p-2 h-9 w-9 flex items-center justify-center disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
