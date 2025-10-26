
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Crop {
  id: string;
  name: string;
}

interface ActiveCropContextType {
  activeCrop: Crop;
  setActiveCrop: (crop: Crop) => void;
}

const ActiveCropContext = createContext<ActiveCropContextType | undefined>(undefined);

export function ActiveCropProvider({ children }: { children: ReactNode }) {
  const [activeCrop, setActiveCrop] = useState<Crop>({ id: 'tomato-default', name: 'Tomato' });

  const value = {
    activeCrop,
    setActiveCrop,
  };

  return (
    <ActiveCropContext.Provider value={value}>
      {children}
    </ActiveCropContext.Provider>
  );
}

export function useActiveCrop() {
  const context = useContext(ActiveCropContext);
  if (context === undefined) {
    throw new Error('useActiveCrop must be used within an ActiveCropProvider');
  }
  return context;
}
