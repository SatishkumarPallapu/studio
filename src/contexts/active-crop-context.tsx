
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Crop {
  id: string;
  name: string;
}

interface ActiveCropContextType {
  activeCrop: Crop | null;
  trackedCrops: Crop[];
  addTrackedCrop: (crop: Crop) => void;
  setActiveCrop: (cropId: string) => void;
}

const ActiveCropContext = createContext<ActiveCropContextType | undefined>(undefined);

export function ActiveCropProvider({ children }: { children: ReactNode }) {
  const [trackedCrops, setTrackedCrops] = useState<Crop[]>(() => {
    if (typeof window === 'undefined') return [{ id: 'tomato-default', name: 'Tomato' }];
    try {
      const item = window.localStorage.getItem('trackedCrops');
      return item ? JSON.parse(item) : [{ id: 'tomato-default', name: 'Tomato' }];
    } catch (error) {
      console.error(error);
      return [{ id: 'tomato-default', name: 'Tomato' }];
    }
  });

  const [activeCrop, _setActiveCrop] = useState<Crop | null>(() => {
     if (trackedCrops.length > 0) return trackedCrops[0];
     return null;
  });
  
  const { toast } = useToast();

  useEffect(() => {
    try {
      window.localStorage.setItem('trackedCrops', JSON.stringify(trackedCrops));
    } catch (error) {
      console.error("Could not save tracked crops to localStorage", error);
    }
  }, [trackedCrops]);
  
  useEffect(() => {
    if (trackedCrops.length > 0 && !activeCrop) {
        _setActiveCrop(trackedCrops[0]);
    } else if (trackedCrops.length === 0) {
        _setActiveCrop(null);
    }
  }, [trackedCrops, activeCrop]);

  const addTrackedCrop = (crop: Crop) => {
    setTrackedCrops((prevCrops) => {
      const isAlreadyTracked = prevCrops.some(c => c.name.toLowerCase() === crop.name.toLowerCase());
      if (isAlreadyTracked) {
        toast({
          variant: 'default',
          title: "Already Tracked",
          description: `You are already tracking ${crop.name}.`,
        });
        const existingCrop = prevCrops.find(c => c.name.toLowerCase() === crop.name.toLowerCase())!;
        _setActiveCrop(existingCrop);
        return prevCrops;
      }
      const newCrops = [...prevCrops, crop];
      _setActiveCrop(crop);
      return newCrops;
    });
  };
  
  const setActiveCrop = (cropId: string) => {
    const cropToActivate = trackedCrops.find(c => c.id === cropId);
    if(cropToActivate) {
        _setActiveCrop(cropToActivate);
    }
  };


  const value = {
    activeCrop,
    trackedCrops,
    addTrackedCrop,
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
