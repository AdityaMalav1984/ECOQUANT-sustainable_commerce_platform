import React, { useState, useEffect } from 'react';
import { useGlobal } from '../GlobalContext';

export default function Business() {
  const { addBusiness } = useGlobal();
  const [name, setName] = useState('');
  const [type, setType] = useState('Food & Beverage');
  const [plan, setPlan] = useState<'starter' | 'growth' | 'enterprise'>('starter');
  const [metrics, setMetrics] = useState({ 
    energy: 12, 
    waste: 10, 
    supply: 7, 
    water: 5,
    transport: 7,
    social: 7
  });
  const [score, setScore] = useState(48);
  const [stars, setStars] = useState(4);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const newScore = metrics.energy + metrics.waste + metrics.supply + metrics.water + metrics.transport + metrics.social;
    setScore(newScore);
    
    let calculatedStars = 1;
    if (newScore >= 96) calculatedStars = 10;
    else if (newScore >= 91) calculatedStars = 9;
    else if (newScore >= 81) calculatedStars = 8;
    else if (newScore >= 71) calculatedStars = 7;
    else if (newScore >= 61) calculatedStars = 6;
    else if (newScore >= 51) calculatedStars = 5;
    else if (newScore >= 41) calculatedStars = 4;
    else if (newScore >= 31) calculatedStars = 3;
    else if (newScore >= 21) calculatedStars = 2;
    else calculatedStars = 1;
    
    setStars(calculatedStars);
  }, [metrics]);

  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (score / 100) * circumference;

  let tierColor = 'text-[#eab308] border-[#eab308]/30';
  let arcColor = 'stroke-eq-accent';

  if (stars >= 8) {
    tierColor = 'text-[#eab308] border-[#eab308]/30';
    arcColor = 'stroke-[#eab308]';
  } else if (stars >= 5) {
    tierColor = 'text-[#eab308] border-[#eab308]/30';
    arcColor = 'stroke-[#9ea3a8]';
  }

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Please enter a business name');
      return;
    }
    addBusiness({ name, type, score, stars, metrics, plan });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setName('');
  };

  return (
    <div className="animate-fadeSlide">
      <div className="mb-8">
        <h2 className="font-display text-[1.8rem] font-semibold tracking-tight text-eq-text">Business Dashboard</h2>
        <p className="text-eq-sec text-[0.9rem] mt-1">Enter your sustainability metrics to calculate your EcoScore.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score Card */}
        <div className="text-center p-10 bg-white border border-eq-border rounded-3xl relative overflow-hidden flex flex-col items-center justify-center">
          
          <div className="w-[200px] h-[200px] mx-auto mb-2 relative">
            <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
              <circle cx="100" cy="100" r="80" fill="none" className="stroke-[#E5E7EB]" strokeWidth="12"/>
              <circle 
                cx="100" cy="100" r="80" fill="none" 
                className={`${arcColor} transition-all duration-800 ease-[cubic-bezier(0.4,0,0.2,1)]`} 
                strokeWidth="12" strokeLinecap="round" 
                strokeDasharray={circumference} 
                strokeDashoffset={offset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center -mt-4">
              <div className="font-display text-[4.5rem] font-bold text-eq-accent leading-none tracking-tighter" style={{ textShadow: '0 2px 10px rgba(107,142,35,0.3)' }}>{score}</div>
              <div className="text-[0.85rem] text-eq-sec tracking-wider mt-1">/ 100</div>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-sans text-[0.95rem] font-semibold tracking-wide uppercase border ${tierColor} bg-transparent -mt-6 relative z-10`}>
            <span className="text-[#eab308]">⭐</span> {stars} STARS
          </div>
          
          <p className="text-[0.85rem] text-eq-sec mt-6 leading-[1.5]">
            Reach <b className="text-eq-text font-semibold">51</b> for 5 Stars · <b className="text-[#eab308] font-semibold">81</b> for 8 Stars
          </p>

          <div className="mt-8 pt-6 border-t border-eq-border w-full">
            <p className="text-[0.75rem] text-eq-sec uppercase tracking-[0.15em] mb-3 font-semibold">POINTS MULTIPLIER</p>
            <div className="font-display text-[3rem] font-bold text-eq-accent tracking-tighter leading-none" style={{ textShadow: '0 2px 10px rgba(107,142,35,0.3)' }}>
              x{(stars / 5).toFixed(1)}
            </div>
            <p className="text-[0.8rem] text-eq-sec mt-3">per $100 customer spends</p>
          </div>
        </div>

        {/* Sliders */}
        <div className="bg-eq-card border border-eq-border rounded-3xl p-8 shadow-sm">
          <h3 className="mb-6 text-[1.1rem] font-display font-semibold text-eq-text">Business Details</h3>
          
          <div className="mb-6 flex flex-col gap-4">
            <div>
              <label className="block text-[0.85rem] font-semibold mb-2 text-eq-text">Business Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full p-3 bg-eq-bg border border-eq-border rounded-xl text-eq-text font-sans text-[0.9rem] outline-none focus:border-eq-accent transition-colors" 
                placeholder="e.g. GreenBrew Café" 
              />
            </div>
            <div>
              <label className="block text-[0.85rem] font-semibold mb-2 text-eq-text">Business Type</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value)} 
                className="w-full p-3 bg-eq-bg border border-eq-border rounded-xl text-eq-text font-sans text-[0.9rem] outline-none focus:border-eq-accent transition-colors [&>option]:bg-eq-bg"
              >
                <option>Food & Beverage</option>
                <option>Grocery / Retail</option>
                <option>Electronics</option>
                <option>Apparel</option>
                <option>Agriculture</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[0.85rem] font-semibold mb-2 text-eq-text">Subscription Plan</label>
              <select
                value={plan}
                onChange={e => setPlan(e.target.value as 'starter' | 'growth' | 'enterprise')}
                className="w-full p-3 bg-eq-bg border border-eq-border rounded-xl text-eq-text font-sans text-[0.9rem] outline-none focus:border-eq-accent transition-colors [&>option]:bg-eq-bg"
              >
                <option value="starter">Starter — $19/mo</option>
                <option value="growth">Growth — $79/mo</option>
                <option value="enterprise">Enterprise — $299/mo</option>
              </select>
            </div>
          </div>

          <h3 className="mb-6 text-[1.1rem] font-display font-semibold pt-6 border-t border-eq-border text-eq-text">Sustainability Metrics</h3>
          <div className="flex flex-col gap-5">
            <Slider label="Energy & Emissions" value={metrics.energy} max={25} onChange={(v) => setMetrics({...metrics, energy: v})} />
            <Slider label="Waste Management" value={metrics.waste} max={20} onChange={(v) => setMetrics({...metrics, waste: v})} />
            <Slider label="Supply Chain" value={metrics.supply} max={15} onChange={(v) => setMetrics({...metrics, supply: v})} />
            <Slider label="Water Efficiency" value={metrics.water} max={10} onChange={(v) => setMetrics({...metrics, water: v})} />
            <Slider label="Sustainable Transport" value={metrics.transport} max={15} onChange={(v) => setMetrics({...metrics, transport: v})} />
            <Slider label="Social & Ethical Impact" value={metrics.social} max={15} onChange={(v) => setMetrics({...metrics, social: v})} />
          </div>
          <button 
            onClick={handleSubmit}
            className="w-full mt-6 bg-eq-accent text-eq-bg py-3.5 rounded-xl font-sans font-semibold text-[0.95rem] hover:bg-eq-accent/80 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(107,142,35,0.4)] transition-all cursor-pointer"
          >
            Submit for Certification ✓
          </button>
        </div>
      </div>

      {/* Toast */}
      <div className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-eq-card border border-eq-accent text-eq-text px-4 py-3 md:px-5 md:py-3.5 rounded-xl text-[0.8rem] md:text-[0.88rem] font-semibold z-[999] flex items-center gap-2.5 transition-all duration-300 shadow-lg ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}>
        <span className="text-[1rem] md:text-[1.1rem]">✅</span>
        <span className="hidden md:inline">Score {score} submitted for certification!</span>
      </div>
    </div>
  );
}

function Slider({ label, value, max, onChange }: { label: string, value: number, max: number, onChange: (v: number) => void }) {
  return (
    <div>
      <label className="flex justify-between text-[0.85rem] font-semibold mb-2 text-eq-text">
        {label} <span className="text-eq-accent font-bold">{value}/{max}</span>
      </label>
      <input 
        type="range" min="0" max={max} value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
    </div>
  );
}
