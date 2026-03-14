import React, { createContext, useContext, useState } from 'react';

export type BizMetrics = { energy: number, waste: number, supply: number, water: number, transport: number, social: number };
export type Business = { id: number, name: string, type: string, score: number, stars: number, approved: boolean, metrics: BizMetrics, plan: 'starter' | 'growth' | 'enterprise' };
export type Transaction = { id: number, name: string, pts: string, type: 'earn' | 'redeem', date: string };
export type FraudAlert = { id: number, title: string, desc: string, time: string };

interface GlobalState {
  businesses: Business[];
  addBusiness: (b: Omit<Business, 'id' | 'approved'>) => void;
  approveBusiness: (id: number) => void;
  deleteBusiness: (id: number) => void;
  customer: { balance: number, totalEarned: number, totalRedeemed: number, transactions: Transaction[] };
  earnPoints: (amount: number, source: string) => void;
  redeemPoints: (amount: number) => void;
  globalStats: { totalPointsIssued: number, totalCo2Saved: number };
  fraudAlerts: FraudAlert[];
  dismissAlert: (id: number) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [businesses, setBusinesses] = useState<Business[]>([
    { id: 1, name: 'EcoMart Superstore', type: 'Grocery / Retail', score: 87, stars: 8, approved: true, plan: 'growth', metrics: { energy: 20, waste: 18, supply: 12, water: 8, transport: 15, social: 14 }},
    { id: 2, name: 'GreenBrew Café', type: 'Food & Beverage', score: 74, stars: 7, approved: true, plan: 'starter', metrics: { energy: 18, waste: 15, supply: 10, water: 7, transport: 12, social: 12 }},
    { id: 3, name: 'SolarShop Electronics', type: 'Electronics', score: 71, stars: 7, approved: false, plan: 'growth', metrics: { energy: 25, waste: 12, supply: 10, water: 5, transport: 10, social: 9 }},
    { id: 4, name: 'NatureWear Fashion', type: 'Apparel', score: 62, stars: 6, approved: false, plan: 'starter', metrics: { energy: 15, waste: 12, supply: 10, water: 8, transport: 8, social: 9 }},
    { id: 5, name: 'BioFarm Fresh', type: 'Agriculture', score: 58, stars: 5, approved: false, plan: 'starter', metrics: { energy: 12, waste: 10, supply: 12, water: 9, transport: 5, social: 10 }},
  ]);

  const [customer, setCustomer] = useState({
    balance: 0,
    totalEarned: 0,
    totalRedeemed: 0,
    transactions: [] as Transaction[]
  });

  const [globalStats, setGlobalStats] = useState({
    totalPointsIssued: 0,
    totalCo2Saved: 0
  });

  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);

  const dismissAlert = (id: number) => {
    setFraudAlerts(prev => prev.filter(a => a.id !== id));
  };

  const addBusiness = (b: Omit<Business, 'id' | 'approved'>) => {
    setBusinesses(prev => [{ ...b, id: Date.now(), approved: false }, ...prev]);
  };

  const approveBusiness = (id: number) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, approved: true } : b));
  };

  const deleteBusiness = (id: number) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
  };

  const earnPoints = (amount: number, source: string) => {
    if (amount > 500) {
      setFraudAlerts(prev => [{
        id: Date.now(),
        title: 'High Value Transaction',
        desc: `User earned ${amount} points in a single transaction at "${source}". Flagged for review.`,
        time: 'Just now'
      }, ...prev]);
    }

    setCustomer(prev => ({
      ...prev,
      balance: prev.balance + amount,
      totalEarned: prev.totalEarned + amount,
      transactions: [{ id: Date.now(), name: source, pts: `+${amount}`, type: 'earn', date: 'Just now' }, ...prev.transactions]
    }));

    setGlobalStats(prev => ({
      totalPointsIssued: prev.totalPointsIssued + amount,
      totalCo2Saved: prev.totalCo2Saved + (amount * 0.015)
    }));
  };

  const redeemPoints = (amount: number) => {
    setCustomer(prev => ({
      ...prev,
      balance: prev.balance - amount,
      totalRedeemed: prev.totalRedeemed + amount,
      transactions: [{ id: Date.now(), name: 'Redeemed', pts: `−${amount}`, type: 'redeem', date: 'Just now' }, ...prev.transactions]
    }));
  };

  return (
    <GlobalContext.Provider value={{ businesses, addBusiness, approveBusiness, deleteBusiness, customer, earnPoints, redeemPoints, globalStats, fraudAlerts, dismissAlert }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobal must be used within GlobalProvider');
  return context;
};
