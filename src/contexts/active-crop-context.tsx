
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { useFirebase, useUser } from '@/firebase';
import { collection, doc, onSnapshot, setDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import type { CropRoadmapOutput, Activity } from '@/ai/flows/crop-roadmap-flow';
import { useToast } from '@/hooks/use-toast';
import { generateCropRoadmap } from '@/ai/flows/crop-roadmap-flow';

export interface TrackedCrop {
  id: string; // e.g., 'tomato-1678886400000'
  name: string;
  startDate: string; // ISO string
  roadmap: CropRoadmapOutput;
  activities: (Activity & { status: 'pending' | 'completed' | 'skipped'; feedback?: string; date: string })[];
}

interface CropLifecycleContextType {
  trackedCrops: TrackedCrop[];
  activeCrop: TrackedCrop | null;
  setActiveCrop: (id: string | null) => void;
  startTrackingCrop: (cropName: string, farmingType: 'Open Field' | 'Indoor/Soilless' | 'Both') => Promise<void>;
  updateActivity: (cropId: string, activityDay: number, status: 'completed' | 'skipped', feedback?: string) => void;
  isLoading: boolean;
}

const CropLifecycleContext = createContext<CropLifecycleContextType | undefined>(undefined);

export function CropLifecycleProvider({ children }: { children: ReactNode }) {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const { toast } = useToast();
  const { translations } = useLanguage();

  const [trackedCrops, setTrackedCrops] = useState<TrackedCrop[]>([]);
  const [activeCropId, setActiveCropId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to the user's tracked crops in Firestore
  useEffect(() => {
    if (!user || !firestore) {
      setTrackedCrops([]);
      setIsLoading(false);
      return;
    }

    const q = query(collection(firestore, `users/${user.uid}/trackedCrops`), orderBy('startDate', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const crops: TrackedCrop[] = [];
      snapshot.forEach(doc => {
        crops.push({ id: doc.id, ...doc.data() } as TrackedCrop);
      });
      setTrackedCrops(crops);
      
      // If no active crop is set, or the active one is deleted, set to the latest one
      if (crops.length > 0 && (!activeCropId || !crops.some(c => c.id === activeCropId))) {
        setActiveCropId(crops[0].id);
      } else if (crops.length === 0) {
        setActiveCropId(null);
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching tracked crops: ", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, firestore, activeCropId]);

  const startTrackingCrop = useCallback(async (cropName: string, farmingType: 'Open Field' | 'Indoor/Soilless' | 'Both') => {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'User not authenticated' });
      return;
    }
    
    setIsLoading(true);
    try {
      // 1. Generate the roadmap
      const roadmap = await generateCropRoadmap({ cropName, farmingType });
      const startDate = new Date();

      // 2. Prepare the activities with dates and default status
      const activities = roadmap.activities.map(activity => {
        const activityDate = new Date(startDate);
        activityDate.setDate(startDate.getDate() + activity.day - 1);
        return {
          ...activity,
          date: activityDate.toISOString(),
          status: 'pending' as const,
        };
      });

      // 3. Create the new TrackedCrop object
      const newCropId = `${cropName.toLowerCase().replace(/ /g, '-')}-${Date.now()}`;
      const newTrackedCrop: Omit<TrackedCrop, 'id'> = {
        name: cropName,
        startDate: startDate.toISOString(),
        roadmap,
        activities,
      };

      // 4. Save to Firestore
      const docRef = doc(firestore, `users/${user.uid}/trackedCrops`, newCropId);
      await setDoc(docRef, newTrackedCrop);

      toast({ title: translations.crop_roadmap.tracking_enabled, description: translations.crop_roadmap.tracking_desc.replace('{cropName}', cropName) });
      setActiveCropId(newCropId);

    } catch (error) {
      console.error('Failed to start tracking crop:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not generate the crop lifecycle plan.' });
    } finally {
      setIsLoading(false);
    }
  }, [user, firestore, toast, translations]);
  
  const updateActivity = useCallback(async (cropId: string, activityDay: number, status: 'completed' | 'skipped', feedback?: string) => {
    if(!user || !firestore) return;

    const crop = trackedCrops.find(c => c.id === cropId);
    if (!crop) return;

    const activityIndex = crop.activities.findIndex(a => a.day === activityDay);
    if (activityIndex === -1) return;

    const updatedActivities = [...crop.activities];
    updatedActivities[activityIndex] = {
      ...updatedActivities[activityIndex],
      status,
      ...(feedback && { feedback }),
    };

    const docRef = doc(firestore, `users/${user.uid}/trackedCrops`, cropId);
    
    try {
        await updateDoc(docRef, { activities: updatedActivities });
        toast({ title: 'Feedback Logged', description: 'Your response has been saved.' });
    } catch(e) {
        console.error("Failed to update activity", e);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not save your feedback.' });
    }
    

  }, [user, firestore, trackedCrops, toast]);


  const activeCrop = useMemo(() => trackedCrops.find(c => c.id === activeCropId) || null, [trackedCrops, activeCropId]);

  const value = {
    trackedCrops,
    activeCrop,
    setActiveCrop: setActiveCropId,
    startTrackingCrop,
    updateActivity,
    isLoading,
  };

  return (
    <CropLifecycleContext.Provider value={value}>
      {children}
    </CropLifecycleContext.Provider>
  );
}

export function useCropLifecycle() {
  const context = useContext(CropLifecycleContext);
  if (context === undefined) {
    throw new Error('useCropLifecycle must be used within a CropLifecycleProvider');
  }
  return context;
}

// Re-add useLanguage to avoid breaking other components
import { useLanguage } from './language-context';
