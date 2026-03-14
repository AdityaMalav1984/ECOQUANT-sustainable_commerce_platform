import React, { useState } from 'react';
import { useGlobal } from '../GlobalContext';

export default function Admin() {
  const { businesses, approveBusiness, deleteBusiness, fraudAlerts, dismissAlert } = useGlobal();
  const [toastMsg, setToastMsg] = useState('');

  const pendingCount = businesses.filter(b => !b.approved).length;
  const approvedCount = businesses.filter(b => b.approved).length;

  const handleApprove = (id: number, name: string) => {
    approveBusiness(id);
    setToastMsg(`✅ ${name} approved!`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleDelete = (id: number, name: string) => {
    deleteBusiness(id);
    setToastMsg(`🗑️ ${name} removed`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div className="animate-fadeSlide">
      <div className="mb-8">
        <h2 className="font-display text-[1.8rem] font-semibold tracking-tight text-eq-text">Admin Panel</h2>
        <p className="text-eq-sec text-[0.9rem] mt-1">Review and approve business sustainability certifications.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-7">
        <div className="bg-eq-card border border-eq-border rounded-2xl md:rounded-3xl p-4 md:p-5 text-center shadow-sm">
          <div className="font-display text-[1.4rem] md:text-[1.8rem] font-bold text-[#f59e0b] leading-none">{pendingCount}</div>
          <div className="text-[0.78rem] text-eq-sec mt-1">Pending</div>
        </div>
        <div className="bg-eq-card border border-eq-border rounded-2xl md:rounded-3xl p-4 md:p-5 text-center shadow-sm">
          <div className="font-display text-[1.4rem] md:text-[1.8rem] font-bold text-eq-accent leading-none">{approvedCount}</div>
          <div className="text-[0.78rem] text-eq-sec mt-1">Approved</div>
        </div>
        <div className="bg-eq-card border border-eq-border rounded-2xl md:rounded-3xl p-4 md:p-5 text-center shadow-sm">
          <div className="font-display text-[1.4rem] md:text-[1.8rem] font-bold text-eq-data leading-none">{businesses.length}</div>
          <div className="text-[0.78rem] text-eq-sec mt-1">Total</div>
        </div>
      </div>

      {fraudAlerts.length > 0 && (
        <div className="mb-8">
          <h3 className="font-display text-[1.2rem] font-semibold mb-4 flex items-center gap-2 text-orange-500">
            ⚠️ Fraud Alerts
          </h3>
          <div className="flex flex-col gap-3">
            {fraudAlerts.map(alert => (
              <div key={alert.id} className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 flex justify-between items-start animate-fadeSlide">
                <div>
                  <h4 className="font-bold text-eq-text">{alert.title}</h4>
                  <p className="text-[0.85rem] text-eq-sec mt-1">{alert.desc}</p>
                  <div className="text-[0.75rem] text-orange-400 mt-2 font-semibold">{alert.time}</div>
                </div>
                <button 
                  onClick={() => dismissAlert(alert.id)} 
                  className="text-[0.75rem] font-bold text-eq-sec hover:text-eq-text uppercase tracking-wide cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {businesses.map(b => {
          const tierColor = b.stars >= 8 ? 'text-[#eab308]' : b.stars >= 5 ? 'text-[#9ea3a8]' : 'text-[#cd7f32]';
          const tierEmoji = b.stars >= 8 ? '🥇' : b.stars >= 5 ? '🥈' : '🥉';
          
          return (
            <div key={b.id} className="bg-eq-card border border-eq-border rounded-2xl p-6 hover:border-eq-accent/30 transition-all flex flex-col shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-display font-semibold text-[1rem] leading-tight text-eq-text">{b.name}</div>
                  <div className="text-[0.75rem] text-eq-sec mt-0.5">{b.type}</div>
                </div>
                <div className={`w-2 h-2 rounded-full mt-1 ${b.approved ? 'bg-eq-accent' : 'bg-[#f59e0b]'}`} title={b.approved ? 'Approved' : 'Pending'}></div>
              </div>

              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <div className={`font-display text-[1.8rem] font-bold leading-none ${tierColor}`}>{b.score}</div>
                  <div className="text-[0.7rem] text-eq-sec uppercase tracking-widest mt-0.5">EcoScore</div>
                </div>
                <div className="text-right text-[0.7rem] text-eq-sec uppercase tracking-widest">
                  <div className="text-[1.4rem] leading-none mb-0.5">{tierEmoji}</div>
                  <span>
                    {b.plan === 'starter' && 'Starter · $19/mo'}
                    {b.plan === 'growth' && 'Growth · $79/mo'}
                    {b.plan === 'enterprise' && 'Enterprise · $299/mo'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 mb-4 flex-1">
                {[
                  { label: 'Energy', val: b.metrics.energy, max: 25 },
                  { label: 'Waste', val: b.metrics.waste, max: 20 },
                  { label: 'Supply', val: b.metrics.supply, max: 15 },
                  { label: 'Water', val: b.metrics.water, max: 10 },
                  { label: 'Transport', val: b.metrics.transport, max: 15 },
                  { label: 'Social', val: b.metrics.social, max: 15 },
                ].map(m => (
                  <div key={m.label} className="flex items-center gap-2 text-[0.78rem]">
                    <span className="text-eq-sec flex-1">{m.label}</span>
                    <div className="flex-[2] h-1 bg-eq-bg rounded-full overflow-hidden">
                      <div className="h-full bg-eq-data rounded-full transition-all duration-500" style={{ width: `${(m.val / m.max) * 100}%` }}></div>
                    </div>
                    <span className="font-semibold text-eq-text text-[0.72rem] min-w-[24px] text-right">{m.val}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-auto">
                <button 
                  onClick={() => handleDelete(b.id, b.name)}
                  className="flex-1 py-2.5 rounded-xl font-sans text-[0.8rem] font-semibold tracking-wide bg-red-500/10 text-red-500 border border-red-500/25 hover:bg-red-500/20 transition-all cursor-pointer"
                >
                  Delete
                </button>
                <button 
                  onClick={() => !b.approved && handleApprove(b.id, b.name)}
                  disabled={b.approved}
                  className={`flex-[2] py-2.5 rounded-xl font-sans text-[0.8rem] font-semibold tracking-wide transition-all ${
                    b.approved 
                      ? 'bg-eq-bg text-eq-sec border border-eq-border cursor-default' 
                      : 'bg-eq-accent/10 text-eq-accent border border-eq-accent/25 hover:bg-eq-accent/20 cursor-pointer'
                  }`}
                >
                  {b.approved ? '✓ Approved' : 'Approve'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast */}
      <div className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-eq-card border border-eq-accent text-eq-text px-4 py-3 md:px-5 md:py-3.5 rounded-xl text-[0.8rem] md:text-[0.88rem] font-semibold z-[999] flex items-center gap-2.5 transition-all duration-300 shadow-lg ${toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}>
        <span className="text-[1rem] md:text-[1.1rem]">✅</span>
        <span className="hidden md:inline">{toastMsg.replace('✅', '').trim()}</span>
      </div>
    </div>
  );
}
