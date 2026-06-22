import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/finance';
import { Shield, Users, CreditCard, MailOpen, AlertCircle, Save, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { api } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [queries, setQueries] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [updatingConfigKey, setUpdatingConfigKey] = useState('');
  const [configValues, setConfigValues] = useState({});

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const metRes = await api.get('/admin/metrics');
      setMetrics(metRes.data);

      const qRes = await api.get('/admin/queries');
      setQueries(qRes.data);

      const conRes = await api.get('/admin/configs');
      setConfigs(conRes.data);

      // Prepopulate config values
      const vals = {};
      conRes.data.forEach(c => {
        vals[c.configKey] = c.configValue;
      });
      setConfigValues(vals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyQuery = async () => {
    if (!selectedQuery || !replyMessage.trim()) return;
    try {
      await api.post(`/contact/${selectedQuery.id}/reply`, { replyMessage });
      setSelectedQuery(null);
      setReplyMessage('');
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateConfig = async (key) => {
    setUpdatingConfigKey(key);
    try {
      await api.put(`/admin/configs/${key}`, { value: configValues[key] });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingConfigKey('');
    }
  };

  const handleConfigChange = (key, value) => {
    setConfigValues({
      ...configValues,
      [key]: value
    });
  };

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
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gradient-slate flex items-center gap-2 justify-center md:justify-start">
          <Shield className="text-accent h-8 w-8" /> Admin Management Center
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-light text-sm">
          Monitor platform metrics, manage user inquiries, and configure benchmark interest rates.
        </p>
      </div>

      {metrics && (
        /* Metrics Grid */
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="glass-card p-5 bg-slate-900 text-white space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs uppercase font-bold">Total Accounts</span>
              <Users className="h-4.5 w-4.5 text-accent" />
            </div>
            <p className="text-2xl font-bold">{metrics.totalUsers}</p>
          </div>

          <div className="glass-card p-5 bg-slate-900 text-white space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs uppercase font-bold">Simulations Tracked</span>
              <CreditCard className="h-4.5 w-4.5 text-accent" />
            </div>
            <p className="text-2xl font-bold">{metrics.totalLoans}</p>
          </div>

          <div className="glass-card p-5 bg-slate-900 text-white space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs uppercase font-bold">Pending Inquiries</span>
              <MailOpen className="h-4.5 w-4.5 text-accent animate-pulse" />
            </div>
            <p className="text-2xl font-bold text-warning">{metrics.pendingQueries}</p>
          </div>

          <div className="glass-card p-5 bg-slate-900 text-white space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs uppercase font-bold">Total Liability Saved</span>
            </div>
            <p className="text-2xl font-bold text-accent">{formatCurrency(metrics.totalOutstandingPrincipal)}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Configurations Panel */}
        <div className="lg:col-span-4 glass-card p-6 space-y-6 self-start">
          <h3 className="font-bold text-md border-b border-slate-200/50 dark:border-slate-800/50 pb-2 flex items-center gap-2">
            System Benchmarks
          </h3>

          <div className="space-y-4 text-xs">
            {configs.map(config => (
              <div key={config.configKey} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-500 capitalize">{config.configKey.replace(/_/g, ' ')}</span>
                  <button 
                    onClick={() => handleUpdateConfig(config.configKey)}
                    disabled={updatingConfigKey === config.configKey}
                    className="text-accent hover:text-accent-dark flex items-center gap-1 font-semibold"
                  >
                    <Save className="h-3.5 w-3.5" /> Save
                  </button>
                </div>
                <input 
                  type="text" 
                  value={configValues[config.configKey] || ''}
                  onChange={(e) => handleConfigChange(config.configKey, e.target.value)}
                  className="input-field py-1.5 text-xs bg-slate-50 dark:bg-slate-950"
                />
                <p className="text-[9px] text-slate-400 font-light">{config.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support inquiries list */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="font-bold text-slate-500 uppercase tracking-wider text-xs">Student Inquiries Queue</h3>

          <div className="space-y-4">
            {queries.map(q => (
              <div 
                key={q.id}
                className="glass-card p-5 space-y-3"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{q.subject}</h4>
                    <p className="text-[10px] text-slate-400">
                      From: <strong>{q.name}</strong> ({q.email}) | {q.createdAt}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    q.status === 'PENDING'
                      ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                      : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                  }`}>
                    {q.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  {q.message}
                </p>

                {q.status === 'PENDING' ? (
                  selectedQuery?.id === q.id ? (
                    <div className="space-y-2 pt-2">
                      <textarea
                        rows="2"
                        placeholder="Type reply message..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="input-field text-xs py-2"
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setSelectedQuery(null)} className="btn-outline py-1 px-3 text-xs">Cancel</button>
                        <button onClick={handleReplyQuery} className="btn-primary py-1 px-4 text-xs">Submit Reply</button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setSelectedQuery(q); setReplyMessage(''); }}
                      className="btn-outline py-1 px-3 text-xs font-semibold"
                    >
                      Post Reply
                    </button>
                  )
                ) : (
                  <div className="text-[10px] text-slate-400 flex items-start gap-1 bg-emerald-50 dark:bg-emerald-950/10 p-2.5 rounded-xl border border-emerald-100/50 dark:border-emerald-900/20">
                    <CheckCircle className="h-4 w-4 text-success shrink-0" />
                    <div>
                      <strong className="text-success">Reply Sent:</strong>
                      <p className="font-light italic mt-0.5">{q.replyMessage}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {queries.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6 font-light">No platform queries reported yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
