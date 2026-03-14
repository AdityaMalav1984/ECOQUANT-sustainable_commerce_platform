import React, { useState, useEffect, useRef } from 'react';
import { useGlobal } from '../GlobalContext';

export default function Customer() {
  const { customer, earnPoints, redeemPoints, businesses } = useGlobal();
  const { balance, totalEarned, totalRedeemed, transactions } = customer;
  
  const approvedBusinesses = businesses.filter(b => b.approved);
  
  const [showQR, setShowQR] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState('100');
  const [toastMsg, setToastMsg] = useState('');
  
  const [selectedBizId, setSelectedBizId] = useState(approvedBusinesses[0]?.id?.toString() || '');
  const [transactionAmount, setTransactionAmount] = useState('2000');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!selectedBizId && approvedBusinesses.length > 0) {
      setSelectedBizId(approvedBusinesses[0].id.toString());
    }
  }, [approvedBusinesses, selectedBizId]);

  useEffect(() => {
    if (showQR && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      const size = 120, cells = 15, cell = size / cells;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#0f172a';
      
      // Generate pseudo-random pattern based on selectedBizId
      let hash = 0;
      for (let i = 0; i < selectedBizId.length; i++) {
        hash = selectedBizId.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      const seed = [];
      for (let i = 0; i < 225; i++) {
        const pseudoRandom = Math.sin(hash + i) * 10000;
        seed.push((pseudoRandom - Math.floor(pseudoRandom)) > 0.5 ? 1 : 0);
      }
      
      seed.forEach((v, i) => {
        if (v) {
          const col = i % cells, row = Math.floor(i / cells);
          ctx.fillRect(col * cell + 1, row * cell + 1, cell - 2, cell - 2);
        }
      });
      [[0,0],[0,12],[12,0]].forEach(([r,c]) => {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(c * cell, r * cell, 3 * cell, 3 * cell);
        ctx.fillStyle = '#fff';
        ctx.fillRect(c * cell + cell * 0.3, r * cell + cell * 0.3, cell * 2.4, cell * 2.4);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(c * cell + cell * 0.7, r * cell + cell * 0.7, cell * 1.6, cell * 1.6);
      });
    }
  }, [showQR, selectedBizId]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleScan = () => {
    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      triggerToast('⚠️ Invalid amount.');
      return;
    }
    const biz = approvedBusinesses.find(b => b.id.toString() === selectedBizId.toString());
    if (!biz) {
      triggerToast('⚠️ Please select a business.');
      return;
    }

    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      
      const rawEarned = (amount / 100) * (biz.stars / 5);
      const earned = amount < 50 ? parseFloat(rawEarned.toFixed(3)) : Math.floor(rawEarned);
      earnPoints(earned, biz.name);
      setShowQR(false);
      triggerToast(`🌿 Earned ${earned} EcoPoints!`);
    }, 1500);
  };

  const handleRedeem = () => {
    const amt = parseInt(redeemAmount);
    if (isNaN(amt) || amt <= 0 || amt > balance) {
      triggerToast('⚠️ Invalid amount.');
      return;
    }
    redeemPoints(amt);
    setShowRedeem(false);
    triggerToast(`🎁 Redeemed ${amt} points!`);
  };

  return (
    <div className="animate-fadeSlide">
      <div className="mb-8">
        <h2 className="font-display text-[1.8rem] font-semibold tracking-tight text-eq-text">Customer Wallet</h2>
        <p className="text-eq-sec text-[0.9rem] mt-1">Your eco-loyalty dashboard.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-7 items-start">
        {/* Phone Mockup */}
        <div className="mx-auto w-full max-w-[380px] bg-eq-card border border-eq-border rounded-[40px] p-5 md:p-8 relative shadow-sm">
          <div className="bg-[linear-gradient(135deg,#FFFFFF_0%,#F3F4F6_100%)] border border-eq-border rounded-[20px] p-7 text-center mb-6 relative overflow-hidden shadow-inner">
            <div className="absolute -top-7 -right-7 w-[120px] h-[120px] bg-eq-accent/10 rounded-full"></div>
            <div className="text-[0.75rem] uppercase tracking-[2px] text-eq-sec mb-1.5 relative z-10">Your Balance</div>
            <div className="font-display text-[3rem] font-bold text-eq-text tracking-[-2px] leading-none relative z-10">{balance.toLocaleString()}</div>
            <div className="text-[0.9rem] text-eq-sec mt-1 relative z-10">EcoPoints</div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => setShowQR(true)} className="bg-eq-accent/10 text-eq-accent border border-eq-accent/25 p-4 rounded-2xl flex flex-col items-center gap-1.5 font-sans text-[0.8rem] font-semibold tracking-wide hover:bg-eq-accent/20 hover:-translate-y-0.5 transition-all cursor-pointer">
              <span className="text-[1.4rem]">📷</span> Scan & Earn
            </button>
            <button onClick={() => setShowRedeem(true)} className="bg-eq-data/10 text-eq-data border border-eq-data/25 p-4 rounded-2xl flex flex-col items-center gap-1.5 font-sans text-[0.8rem] font-semibold tracking-wide hover:bg-eq-data/20 hover:-translate-y-0.5 transition-all cursor-pointer">
              <span className="text-[1.4rem]">🎁</span> Redeem
            </button>
          </div>

          <p className="text-[0.75rem] uppercase tracking-[1.5px] text-eq-sec mb-3">Recent Transactions</p>
          <div className="flex flex-col gap-2">
            {transactions.length === 0 ? (
              <div className="text-center p-6 bg-eq-bg rounded-xl border border-eq-border text-eq-sec text-[0.85rem]">
                <div className="text-[1.5rem] mb-2 opacity-50">🧾</div>
                No transactions yet.<br/>Scan a QR code to earn points!
              </div>
            ) : (
              transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-eq-bg rounded-xl text-[0.85rem] animate-fadeSlide border border-eq-border hover:bg-eq-border transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[1rem] ${tx.type === 'earn' ? 'bg-eq-accent/10 text-eq-accent' : 'bg-eq-data/10 text-eq-data'}`}>
                      {tx.type === 'earn' ? '🌿' : '🎁'}
                    </div>
                    <div>
                      <div className="font-semibold text-eq-text">{tx.name}</div>
                      <div className="text-[0.75rem] text-eq-sec flex gap-1.5 items-center">
                        <span className="capitalize">{tx.type}</span> • <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`font-display font-bold text-[1.1rem] ${tx.type === 'earn' ? 'text-eq-accent' : 'text-eq-sec'}`}>{tx.pts}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-5">
          <div className="bg-eq-card border border-eq-border rounded-3xl p-8 shadow-sm">
            <h3 className="text-[1rem] font-display font-semibold mb-4 text-eq-text">Lifetime Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="font-display text-[2rem] font-bold text-eq-accent leading-none mb-1">{totalEarned.toLocaleString()}</div>
                <div className="text-[0.78rem] text-eq-sec">Total Earned</div>
              </div>
              <div className="text-center">
                <div className="font-display text-[2rem] font-bold text-eq-data leading-none mb-1">{totalRedeemed.toLocaleString()}</div>
                <div className="text-[0.78rem] text-eq-sec">Total Redeemed</div>
              </div>
            </div>
          </div>
          <div className="bg-eq-card border border-eq-border rounded-3xl p-8 shadow-sm">
            <h3 className="text-[1rem] font-display font-semibold mb-2 text-eq-text">How Points Are Calculated</h3>
            <p className="text-[0.85rem] text-eq-sec leading-[1.7]">
              Points = (Transaction Amount ÷ 100) × (Business Star Rating ÷ 5)
            </p>
            <div className="bg-eq-accent/5 border border-eq-accent/15 rounded-xl p-3.5 mt-3">
              <p className="text-[0.8rem] text-eq-accent font-semibold">Example: Spend $200 at a 9-star eco-hotel → earn <b>36.000 points</b></p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center animate-fadeSlide">
          <div className="bg-eq-card border border-eq-border rounded-3xl p-9 w-[340px] text-center shadow-2xl">
            <h3 className="font-display text-[1.3rem] font-semibold mb-2 text-eq-text">Scan Business QR</h3>
            <p className="text-eq-sec text-[0.85rem] mb-4">Select a business and enter the amount paid to simulate a scan.</p>
            
            <div className="flex flex-col gap-3 mb-5 text-left">
              <div>
                <label className="block text-[0.75rem] text-eq-sec mb-1 uppercase tracking-wider">Business</label>
                <select 
                  value={selectedBizId} 
                  onChange={e => setSelectedBizId(e.target.value)}
                  className="w-full p-2.5 bg-eq-bg border border-eq-border rounded-xl text-eq-text font-sans text-[0.9rem] outline-none focus:border-eq-accent transition-colors [&>option]:bg-eq-bg"
                >
                  {approvedBusinesses.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.stars}⭐)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[0.75rem] text-eq-sec mb-1 uppercase tracking-wider">Amount Paid ($)</label>
                <input 
                  type="number" 
                  value={transactionAmount}
                  onChange={e => setTransactionAmount(e.target.value)}
                  className="w-full p-2.5 bg-eq-bg border border-eq-border rounded-xl text-eq-text font-sans text-[0.9rem] outline-none focus:border-eq-accent transition-colors"
                  placeholder="e.g. 2000"
                />
              </div>
            </div>

            <div className="w-[120px] h-[120px] mx-auto bg-white rounded-xl flex items-center justify-center mb-5 overflow-hidden relative">
              <canvas ref={canvasRef} width="120" height="120"></canvas>
              {isScanning && (
                <>
                  <div className="absolute inset-0 bg-eq-accent/10"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-eq-accent shadow-[0_0_15px_rgba(107,142,35,1)] animate-scan"></div>
                </>
              )}
            </div>
            
            <button 
              onClick={handleScan} 
              disabled={isScanning}
              className={`w-full py-3 rounded-xl font-sans font-semibold text-[0.9rem] mb-2.5 transition-colors ${
                isScanning 
                  ? 'bg-eq-accent/50 text-eq-bg/50 cursor-not-allowed' 
                  : 'bg-eq-accent text-eq-bg hover:bg-eq-accent/80 cursor-pointer'
              }`}
            >
              {isScanning ? 'Scanning...' : 'Simulate Scan ✓'}
            </button>
            <button onClick={() => setShowQR(false)} className="w-full bg-eq-bg border border-eq-border text-eq-sec py-3 rounded-xl font-sans text-[0.88rem] hover:bg-eq-border hover:text-eq-text transition-colors cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      {/* Redeem Modal */}
      {showRedeem && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center animate-fadeSlide">
          <div className="bg-eq-card border border-eq-border rounded-3xl p-9 w-[340px] text-center shadow-2xl">
            <h3 className="font-display text-[1.3rem] font-semibold mb-2 text-eq-text">Redeem Points</h3>
            <p className="text-eq-sec text-[0.85rem] mb-4">Enter the amount you'd like to redeem. Current balance: <span className="text-eq-accent font-bold">{balance}</span></p>
            <input 
              type="number" 
              value={redeemAmount}
              onChange={(e) => setRedeemAmount(e.target.value)}
              className="w-full p-3.5 bg-eq-bg border border-eq-border rounded-xl text-eq-text font-display text-[1.4rem] font-bold text-center outline-none focus:border-eq-accent transition-colors mb-4"
            />
            <button onClick={handleRedeem} className="w-full bg-eq-data text-eq-bg py-3.5 rounded-xl font-sans font-semibold text-[0.95rem] mb-2.5 hover:bg-eq-data/80 transition-colors cursor-pointer">Confirm Redemption</button>
            <button onClick={() => setShowRedeem(false)} className="w-full bg-eq-bg border border-eq-border text-eq-sec py-3 rounded-xl font-sans text-[0.88rem] hover:bg-eq-border hover:text-eq-text transition-colors cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-eq-card border border-eq-accent text-eq-text px-4 py-3 md:px-5 md:py-3.5 rounded-xl text-[0.8rem] md:text-[0.88rem] font-semibold z-[999] flex items-center gap-2.5 transition-all duration-300 shadow-lg ${toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}>
        <span className="text-[1rem] md:text-[1.1rem]">{toastMsg.includes('⚠️') ? '⚠️' : toastMsg.includes('🎁') ? '🎁' : '✅'}</span>
        <span className="hidden md:inline">{toastMsg.replace(/[✅⚠️🎁🌿]/g, '').trim()}</span>
      </div>
    </div>
  );
}
