import React, { useEffect, useState } from 'react';
import { useGlobal } from '../GlobalContext';

export default function Home({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { businesses, globalStats } = useGlobal();
  const approvedCount = businesses.filter(b => b.approved).length;
  
  const [bizCount, setBizCount] = useState(0);
  const [ptsCount, setPtsCount] = useState(0);
  const [co2Count, setCo2Count] = useState(0);

  useEffect(() => {
    const animate = (target: number, setter: any, step: number) => {
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        setter(current);
        if (current >= target) clearInterval(timer);
      }, 20);
    };
    animate(approvedCount, setBizCount, Math.max(1, approvedCount / 40));
    animate(globalStats.totalPointsIssued, setPtsCount, Math.max(1, globalStats.totalPointsIssued / 40));
    animate(globalStats.totalCo2Saved, setCo2Count, Math.max(1, globalStats.totalCo2Saved / 40));
  }, [approvedCount, globalStats.totalPointsIssued, globalStats.totalCo2Saved]);

  return (
    <div className="animate-fadeSlide">
      <div className="text-center pt-20 pb-15">
        <div className="inline-flex items-center gap-1.5 bg-eq-accent/10 border border-eq-accent/30 text-eq-accent px-3.5 py-1.5 rounded-full text-[0.78rem] font-semibold tracking-wide uppercase mb-7">
          🌍 Sustainable Commerce Platform
        </div>
        <h1 className="font-display font-bold text-[clamp(2.8rem,6vw,5rem)] leading-[1.05] tracking-[-2px] mb-5 text-eq-text">
          Shop <span className="text-eq-accent">greener</span>,<br />earn smarter.
        </h1>
        <p className="text-[1.1rem] text-eq-sec max-w-[520px] mx-auto mb-10 leading-[1.7]">
          ECOQUANT rewards customers for buying from eco-certified businesses — turning sustainability into loyalty points.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button 
            onClick={() => onNavigate('customer')}
            className="px-7 py-3 rounded-xl font-sans text-[0.9rem] font-semibold bg-eq-accent text-eq-bg hover:bg-eq-accent/80 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(34,211,238,0.35)] transition-all tracking-wide cursor-pointer"
          >
            Open Wallet →
          </button>
          <button 
            onClick={() => onNavigate('business')}
            className="px-7 py-3 rounded-xl font-sans text-[0.9rem] font-semibold bg-transparent text-eq-text border-[1.5px] border-eq-border hover:border-eq-accent hover:text-eq-accent hover:-translate-y-0.5 transition-all tracking-wide cursor-pointer"
          >
            For Businesses
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-15">
        <StatCard num={Math.floor(bizCount)} label="Certified Businesses" />
        <StatCard num={Math.floor(ptsCount).toLocaleString()} label="Points Issued" />
        <StatCard num={`${Math.floor(co2Count)}t`} label="CO₂ Offset Tracked" />
      </div>

      <div className="mb-8">
        <h2 className="font-display text-[1.8rem] font-semibold tracking-tight text-eq-text">How it works</h2>
        <p className="text-eq-sec text-[0.9rem] mt-1">Three roles, one ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard 
          icon="🏢" 
          title="Businesses" 
          desc="Submit sustainability data — energy, water, waste & EV usage — to receive an EcoScore and certified tier." 
        />
        <InfoCard 
          icon="📱" 
          title="Customers" 
          desc="Scan the business QR at checkout to earn points scaled by the business's EcoScore. Redeem for rewards." 
        />
        <InfoCard 
          icon="🛡️" 
          title="Admins" 
          desc="Review and approve businesses before they can issue points. Maintain integrity of the green certification." 
        />
      </div>
    </div>
  );
}

function StatCard({ num, label }: { num: string | number, label: string }) {
  return (
    <div className="bg-eq-card border border-eq-border rounded-2xl p-7 text-center hover:bg-eq-card/80 hover:border-eq-accent/30 hover:-translate-y-1 transition-all shadow-sm">
      <div className="font-display text-[2.4rem] font-bold text-eq-accent tracking-tight">{num}</div>
      <div className="text-[0.85rem] text-eq-sec mt-1">{label}</div>
    </div>
  );
}

function InfoCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="bg-eq-card border border-eq-border rounded-3xl p-8 hover:border-eq-accent/20 transition-all shadow-sm">
      <div className="text-[2rem] mb-3.5">{icon}</div>
      <h3 className="font-display text-[1rem] font-semibold mb-2 text-eq-text">{title}</h3>
      <p className="text-[0.85rem] text-eq-sec leading-[1.6]">{desc}</p>
    </div>
  );
}
