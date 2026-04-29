import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types/order';

interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  addSavedAddress: (address: any) => void;
  removeSavedAddress: (id: string) => void;
  savedAddresses: any[];
  refreshStats: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    phone: '',
    email: '',
    joinDate: new Date().toISOString(),
    totalOrders: 0,
    totalSpent: 0
  });
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sushimate_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
    const addresses = localStorage.getItem('sushimate_addresses');
    if (addresses) {
      setSavedAddresses(JSON.parse(addresses));
    }
    
    // Обновляем статистику при загрузке
    refreshStats();
  }, []);

  const refreshStats = () => {
    // Получаем заказы из localStorage
    const savedOrders = localStorage.getItem('sushimate_orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum: number, order: any) => sum + order.total, 0);
      
      updateProfile({ totalOrders, totalSpent });
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...data };
    setProfile(newProfile);
    localStorage.setItem('sushimate_profile', JSON.stringify(newProfile));
  };

  const addSavedAddress = (address: any) => {
    const updated = [...savedAddresses, address];
    setSavedAddresses(updated);
    localStorage.setItem('sushimate_addresses', JSON.stringify(updated));
  };

  const removeSavedAddress = (id: string) => {
    const updated = savedAddresses.filter(a => a.id !== id);
    setSavedAddresses(updated);
    localStorage.setItem('sushimate_addresses', JSON.stringify(updated));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, addSavedAddress, removeSavedAddress, savedAddresses, refreshStats }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};