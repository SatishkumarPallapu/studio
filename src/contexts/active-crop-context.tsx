
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
  addTrackedCrop: (crop: Crop) => boolean; // Returns true if already tracked
  setActiveCrop: (cropId: string) => void;
}

const ActiveCropContext = createContext<ActiveCropContextType | undefined>(undefined);

const getDefaultCrops = (): Crop[] => [{ id: 'tomato-default', name: 'Tomato' }];

export function ActiveCropProvider({ children }: { children: ReactNode }) {
  const [trackedCrops, setTrackedCrops] = useState<Crop[]>([]);
  const [activeCrop, _setActiveCrop] = useState<Crop | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  // Effect to load from localStorage only on the client side
  useEffect(() => {
    try {
      const item = window.localStorage.getItem('trackedCrops');
      const loadedCrops = item ? JSON.parse(item) : getDefaultCrops();
      if (loadedCrops.length > 0) {
        setTrackedCrops(loadedCrops);
        _setActiveCrop(loadedCrops[0]);
      } else {
        // Ensure there's always at least one default crop if storage is empty
        setTrackedCrops(getDefaultCrops());
        _setActiveCrop(getDefaultCrops()[0]);
      }
    } catch (error) {
      console.error(error);
      const defaultCrops = getDefaultCrops();
      setTrackedCrops(defaultCrops);
      _setActiveCrop(defaultCrops[0]);
    }
    setIsLoaded(true);
  }, []);

  // Effect to save to localStorage whenever trackedCrops changes
  useEffect(() => {
    if (!isLoaded) return; // Don't save until loaded from storage
    try {
      window.localStorage.setItem('trackedCrops', JSON.stringify(trackedCrops));
    } catch (error) {
      console.error("Could not save tracked crops to localStorage", error);
    }
  }, [trackedCrops, isLoaded]);

  const addTrackedCrop = (crop: Crop): boolean => {
    let alreadyTracked = false;
    setTrackedCrops((prevCrops) => {
      const isAlreadyTracked = prevCrops.some(c => c.name.toLowerCase() === crop.name.toLowerCase());
      if (isAlreadyTracked) {
        const existingCrop = prevCrops.find(c => c.name.toLowerCase() === crop.name.toLowerCase())!;
        _setActiveCrop(existingCrop);
        alreadyTracked = true;
        return prevCrops;
      }
      const newCrops = [...prevCrops, crop];
      _setActiveCrop(crop);
      return newCrops;
    });
    return alreadyTracked;
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
