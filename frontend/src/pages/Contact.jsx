import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, ChevronUp, CheckCircle, AlertCircle } from 'lucide-react';

export default function Contact() {
  const { api } = useAuth();
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ success: false, text: '' });

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const faqs = [
    {
      q: 'What is the moratorium period in an education loan?',
      a: 'The moratorium period (also called a repayment holiday or grace period) is a duration during your studies (plus standardly 6 to 12 months after graduation) where you are not required to pay principal repayments. However, interest continues to accrue depending on your chosen bank rules.'
    },
    {
      q: 'How does compound interest moratorium differ from simple interest moratorium?',
      a: 'In a compound interest moratorium, the accrued interest is added to your loan principal monthly (capitalized). This means interest compounds and your starting repayment principal becomes higher. In simple interest, interest accrues as a flat monthly sum but does not compound on the balance during studies.'
    },
    {
      q: 'Can I make prepayments during the moratorium period?',
      a: 'Yes. Most banks permit interest payments or principal prepayments during university. Paying off interest monthly (Deferred model) prevents capitalization and ensures you start repayments with the minimum base principal.'
    },
    {
      q: 'What is the prepayment optimizer?',
      a: 'It is a simulator that shows you how paying extra sums (monthly extra payments or one-off bonuses) directly cuts down your outstanding principal. Since education loans are calculated on reducing balances, prepayments drastically reduce tenure and total interest.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ success: false, text: '' });

    try {
      await api.post('/contact/submit', {
        name,
        email,
        subject,
        message
      });
      setStatusMsg({ success: true, text: 'Thank you! Your inquiry was successfully recorded. Our planner desk will email you shortly.' });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setStatusMsg({ success: false, text: 'Failed to record query. Please verify connection and details.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (idx) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient-slate">
          Get in Touch
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-light text-sm">
          Have specialized loan configurations or queries? Contact our planner desks or check our FAQs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact info & FAQs */}
        <div className="lg:col-span-6 space-y-8">
          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-bold">Desk Information</h2>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-slate-400 font-semibold">General Planners Desk</p>
                  <a href="mailto:mukeshpodugu123@gmail.com" className="font-bold hover:underline">
                    mukeshpodugu123@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-slate-400 font-semibold">Direct Hotline</p>
                  <a href="tel:+918143999463" className="font-bold hover:underline">
                    +91 8143999463
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <HelpCircle className="text-accent h-5 w-5" /> Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="border-b border-slate-200 dark:border-slate-800 pb-3 last:border-b-0 last:pb-0"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center text-left py-2 font-bold text-xs text-slate-700 dark:text-slate-300 hover:text-accent dark:hover:text-accent transition-colors"
                  >
                    <span>{faq.q}</span>
                    {openFaqIdx === idx ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                  </button>
                  {openFaqIdx === idx && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed mt-2 pl-1">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-6 glass-card p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Send className="text-accent h-5 w-5" /> Submit Inquiry
          </h2>

          {statusMsg.text && (
            <div className={`p-3 rounded-xl flex items-center gap-2 text-xs border ${
              statusMsg.success 
                ? 'bg-emerald-100 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                : 'bg-red-100 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
            }`}>
              {statusMsg.success ? <CheckCircle className="h-4.5 w-4.5" /> : <AlertCircle className="h-4.5 w-4.5" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mukesh Podugu" 
                  className="input-field py-2 text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mukesh@gmail.com" 
                  className="input-field py-2 text-xs mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400">Subject</label>
              <input 
                type="text" 
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Interest capitalization query" 
                className="input-field py-2 text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400">Message Content</label>
              <textarea 
                rows="4"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detail your loan query here..." 
                className="input-field py-2.5 text-xs mt-1"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5"
            >
              {loading ? 'Submitting...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
