import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, Sparkles, Layers, Award, Shield, ArrowRight, GraduationCap, TrendingDown, BookOpen } from 'lucide-react';

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const tools = [
    {
      name: 'EMI Calculator',
      desc: 'Calculate standard monthly installments with interest breakdowns and repayment timelines.',
      icon: Calculator,
      path: '/emi',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      name: 'Moratorium Planner',
      desc: 'Understand how interest accrues (compound, simple, deferred) during your college study period.',
      icon: Layers,
      path: '/moratorium',
      color: 'from-accent to-teal-600',
    },
    {
      name: 'Repayment Simulator',
      desc: 'Simulate progressive income hikes, custom payment modifications, and tenure scenarios.',
      icon: Sparkles,
      path: '/simulator',
      color: 'from-purple-500 to-pink-600',
    },
    {
      name: 'Prepayment Optimizer',
      desc: 'Identify how extra recurring or single prepayments reduce interest liabilities and clear debts early.',
      icon: Award,
      path: '/optimizer',
      color: 'from-amber-500 to-orange-600',
    },
    {
      name: 'Loan Comparison',
      desc: 'Compare interest rates, grace periods, processing fees, and moratorium rules of up to three banks.',
      icon: TrendingDown,
      path: '/compare',
      color: 'from-emerald-500 to-teal-600',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brandBg-dark text-slate-800 dark:text-slate-100 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 sm:py-32 bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.15),transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-accent text-xs font-semibold uppercase tracking-wider border border-slate-700"
            >
              <GraduationCap className="h-4 w-4" /> Next-Gen Student FinTech
            </motion.div>
            
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-accent"
            >
              Navigate Your Education Loan Smarter
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-slate-300 font-light leading-relaxed"
            >
              EduLoan Navigator gives you complete transparency over college debts. Simulate moratorium interest, compare rates, and create prepayments schedules to clear your liability years early.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              <Link to="/emi" className="btn-primary py-3 px-8 text-base">
                Explore Calculators <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/auth" className="btn-secondary py-3 px-8 text-base bg-slate-800 hover:bg-slate-700 border-slate-700">
                Sign In to Save Scenarios
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient-slate">
            Advanced Planning Engine
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-light">
            Every tool is customized for educational financing, supporting university study periods and grace rules.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {tools.map((tool) => (
            <motion.div 
              key={tool.name}
              variants={itemVariants}
              className="glass-card glass-card-hover p-8 flex flex-col justify-between"
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-md mb-6`}>
                  <tool.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{tool.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed mb-6">
                  {tool.desc}
                </p>
              </div>
              <Link 
                to={tool.path} 
                className="inline-flex items-center gap-1.5 text-accent hover:text-accent-dark font-semibold text-sm transition-colors group"
              >
                Launch Simulator <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Dynamic Visual Stats / Guide */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="glass-card p-8 sm:p-12 bg-gradient-to-br from-slate-900 to-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.1),transparent_40%)]"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative">
            <div className="space-y-6">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-accent font-semibold text-xs inline-flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> Did you know?
              </div>
              <h3 className="text-3xl font-extrabold leading-tight">
                Moratorium Interest can inflate your loan principal by up to 25% before repayments even start.
              </h3>
              <p className="text-slate-400 font-light leading-relaxed">
                Education loans standardly offer a study grace period where interest continues to compound. Understanding compound rules vs. interest-only payment options can save you lakhs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-accent font-bold">1</div>
                  <span className="text-sm text-slate-300 font-medium">Model grace periods</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-accent font-bold">2</div>
                  <span className="text-sm text-slate-300 font-medium">Compare compound rates</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-glow">
              <h4 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" /> Why create an account?
              </h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></span>
                  <span>Save active loan scenarios for bank comparisons.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></span>
                  <span>Store custom one-time prepayment logs and model timelines.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></span>
                  <span>Track outstanding loan liability charts via your personal financial dashboard.</span>
                </li>
              </ul>
              <Link to="/auth" className="btn-primary w-full py-3 mt-4">
                Create Free Planner Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
