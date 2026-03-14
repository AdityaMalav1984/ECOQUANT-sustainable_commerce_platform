import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Business from './components/Business';
import Customer from './components/Customer';
import Admin from './components/Admin';
import { GlobalProvider } from './GlobalContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const tabs = ['home', 'business', 'customer', 'admin'];

  return (
    <GlobalProvider>
      <div className="relative z-10">
        <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 md:px-10 py-3 md:py-4 bg-eq-bg/70 backdrop-blur-xl border-b border-eq-border shadow-[0_10px_30px_rgba(0,0,0,0.20)]">
          <button
            type="button"
            onClick={() => handleTabClick('home')}
            className="font-display font-bold text-[1.2rem] md:text-[1.4rem] text-eq-text tracking-tight flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eq-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-eq-bg rounded-xl"
            aria-label="Go to Home"
          >
            <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-xl overflow-hidden bg-eq-card border border-eq-border shadow-sm transition-transform duration-200 group-hover:scale-[1.03]">
              <img
                src="/Screenshot 2026-02-28 at 12.09.40 PM.png"
                alt="EcoQuant preview"
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <span className="hidden sm:inline">ECOQUANT</span>
            <span className="sm:hidden">EQ</span>
          </button>
          
          {isMobile ? (
            <div className="relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="px-3 py-2 rounded-lg bg-eq-card/80 border border-eq-border text-eq-text font-semibold text-sm shadow-sm hover:bg-eq-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eq-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-eq-bg"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
              
              {mobileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-eq-card/95 backdrop-blur-xl border border-eq-border rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.35)] overflow-hidden animate-fadeSlide">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabClick(tab)}
                      className={`w-full px-4 py-3 text-left text-sm font-semibold capitalize transition-all duration-200 ${
                        activeTab === tab
                          ? 'bg-eq-accent text-eq-bg'
                          : 'text-eq-sec hover:text-eq-text hover:bg-white/5'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-1 bg-eq-card/70 rounded-2xl p-1 border border-eq-border shadow-sm backdrop-blur-xl">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 md:px-5 py-2 rounded-xl font-sans text-[0.8rem] md:text-[0.85rem] font-semibold transition-all duration-200 capitalize cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eq-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-eq-bg hover:-translate-y-[1px] active:translate-y-0 ${
                    activeTab === tab
                      ? 'bg-eq-accent text-eq-bg shadow-[0_12px_30px_rgba(34,211,238,0.28)]'
                      : 'text-eq-sec hover:text-eq-text hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </nav>

        <main className="pt-[80px] md:pt-[100px] pb-[60px] px-4 md:px-10 max-w-[1100px] mx-auto">
          {activeTab === 'home' && <Home onNavigate={setActiveTab} />}
          {activeTab === 'business' && <Business />}
          {activeTab === 'customer' && <Customer />}
          {activeTab === 'admin' && <Admin />}
        </main>
      </div>
    </GlobalProvider>
  );
}
