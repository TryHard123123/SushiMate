import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LoyaltyContextType {
  points: number;
  addPoints: (amount: number) => void;
  redeemPoints: (amount: number) => boolean;
  getPointsValue: (points: number) => number;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export const LoyaltyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('sushimate_points');
    if (saved) {
      setPoints(parseInt(saved));
    }
  }, []);

  const addPoints = (amount: number) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    localStorage.setItem('sushimate_points', newPoints.toString());
  };

  const redeemPoints = (amount: number): boolean => {
    if (points >= amount) {
      const newPoints = points - amount;
      setPoints(newPoints);
      localStorage.setItem('sushimate_points', newPoints.toString());
      return true;
    }
    return false;
  };

  const getPointsValue = (pointsAmount: number): number => {
    return pointsAmount;
  };

  return (
    <LoyaltyContext.Provider value={{ points, addPoints, redeemPoints, getPointsValue }}>
      {children}
    </LoyaltyContext.Provider>
  );
};

export const useLoyalty = () => {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error('useLoyalty must be used within LoyaltyProvider');
  }
  return context;
};