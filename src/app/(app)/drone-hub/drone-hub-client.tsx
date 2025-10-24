'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, Wind, Beaker, PlusCircle, Calendar, CheckCircle, Clock } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirebase, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type DroneMission = {
    id: string;
    type: 'NDVI Scan' | 'Pesticide Spraying';
    status: 'Pending' | 'In Progress' | 'Completed';
    date: any; 
    mapDataUrl?: string;
};


export default function DroneHubClient() {
    const { firestore } = useFirebase();
    const { user } = useUser();
    const { toast } = useToast();

    const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    const missionsCollection = useMemo(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/drone_missions`);
    }, [user, firestore]);
    
    const missionsQuery = useMemo(() => {
        if (!missionsCollection) return null;
        return query(missionsCollection, orderBy('date', 'desc'));
    }, [missionsCollection]);

    const { data: missions, isLoading } = useCollection<DroneMission>(missionsQuery);

    const ndviImage = PlaceHolderImages.find(img => img.id === 'drone-ndvi');
    const pathImage = PlaceHolderImages.find(img => img.id === 'drone-path');

    const latestNdviMission = useMemo(() => {
        return missions?.find(m => m.type === 'NDVI Scan' && m.status === 'Completed' && m.mapDataUrl);
    }, [missions]);

    const handlePlanMission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!missionsCollection) return;

        const formData = new FormData(event.currentTarget);
        const type = formData.get('type') as string;
        const date = formData.get('date') as string;

        if (!type || !date) {
            toast({ variant: 'destructive', title: 'Missing fields', description: 'Please select a mission type and date.' });
            return;
        }

        try {
            await addDoc(missionsCollection, {
                type,
                date: new Date(date),
                status: 'Pending',
                userId: user?.uid,
            });
            toast({ title: 'Mission Planned!', description: 'Your drone mission has been scheduled.' });
            setIsPlanDialogOpen(false);
        } catch (error) {
            console.error("Error planning mission:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not plan the mission.' });
        }
    };
    
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Completed': return 'default';
            case 'In Progress': return 'secondary';
            case 'Pending': return 'outline';
            default: return 'secondary';
        }
    }
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Completed': return <CheckCircle className="h-4 w-4" />;
            case 'In Progress': return <Clock className="h-4 w-4 animate-pulse" />;
            case 'Pending': return <Calendar className="h-4 w-4" />;
            default: return null;
        }
    }


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Drone Operations Hub</CardTitle>
          <CardDescription>
            Manage and view data from your agricultural drone missions.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-6 h-6 text-primary" />
              NDVI Field Analysis
            </CardTitle>
            <CardDescription>Visualize crop health and stress using NDVI data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ndviImage && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image 
                        src={ndviImage.imageUrl} 
                        alt="NDVI map placeholder" 
                        fill
                        className="object-cover"
                        data-ai-hint={ndviImage.imageHint}
                    />
                     <div className="absolute inset-0 bg-green-900/50 flex items-center justify-center">
                        <p className="text-white font-bold text-xl">NDVI Map Visualization</p>
                    </div>
                </div>
            )}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full" disabled={!latestNdviMission}>View Latest NDVI Scan</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Latest NDVI Scan</DialogTitle>
                        <DialogDescription>
                            {latestNdviMission ? `Scan from: ${new Date(latestNdviMission.date.seconds * 1000).toLocaleDateString()}` : 'No scan available'}
                        </DialogDescription>
                    </DialogHeader>
                    {latestNdviMission?.mapDataUrl && (
                         <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                            <Image 
                                src={latestNdviMission.mapDataUrl}
                                alt="Latest NDVI Scan"
                                fill
                                className="object-cover"
                            />
                         </div>
                    )}
                </DialogContent>
            </Dialog>

          </CardContent>
        </Card>

        <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Wind className="w-6 h-6 text-primary" />
                Automated Spraying
                </CardTitle>
                <CardDescription>Plan and deploy automated pesticide or fertilizer spraying missions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {pathImage && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                        <Image 
                            src={pathImage.imageUrl} 
                            alt="Spraying path placeholder"
                            fill
                            className="object-cover brightness-75"
                            data-ai-hint={pathImage.imageHint}
                        />
                        <div className="absolute inset-0 bg-blue-900/50 flex items-center justify-center">
                            <p className="text-white font-bold text-xl">Spraying Path Planner</p>
                        </div>
                    </div>
                )}
                <DialogTrigger asChild>
                    <Button className="w-full">Plan New Mission</Button>
                </DialogTrigger>
            </CardContent>
            </Card>
             <DialogContent>
                <DialogHeader>
                    <DialogTitle>Plan a New Drone Mission</DialogTitle>
                    <DialogDescription>Schedule a new operation for your drone.</DialogDescription>
                </DialogHeader>
                <form id="plan-mission-form" onSubmit={handlePlanMission} className="space-y-4">
                    <div>
                        <Label htmlFor="type">Mission Type</Label>
                        <Select name="type" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a mission type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NDVI Scan">NDVI Scan</SelectItem>
                                <SelectItem value="Pesticide Spraying">Pesticide Spraying</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="date" required/>
                    </div>
                </form>
                 <DialogFooter>
                    <Button type="submit" form="plan-mission-form">Schedule Mission</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>Mission History</CardTitle>
            <CardDescription>A log of your past and upcoming drone operations.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <p>Loading missions...</p>}
            {!isLoading && missions?.length === 0 && <p>No missions planned yet.</p>}
            <div className="space-y-4">
                {missions?.map(mission => (
                    <div key={mission.id} className="flex items-center justify-between p-3 rounded-md border">
                        <div className="flex items-center gap-4">
                             {mission.type === 'NDVI Scan' ? <Map className="w-6 h-6 text-primary"/> : <Beaker className="w-6 h-6 text-primary"/>}
                             <div>
                                <p className="font-semibold">{mission.type}</p>
                                <p className="text-sm text-muted-foreground">
                                    Scheduled for: {new Date(mission.date.seconds * 1000).toLocaleDateString()}
                                </p>
                             </div>
                        </div>
                        <Badge variant={getStatusVariant(mission.status)} className="flex items-center gap-2">
                            {getStatusIcon(mission.status)}
                            {mission.status}
                        </Badge>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
