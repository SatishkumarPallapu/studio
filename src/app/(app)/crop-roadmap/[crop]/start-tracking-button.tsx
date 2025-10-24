'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function StartTrackingButton({ cropName }: { cropName: string }) {
    const { toast } = useToast();

    const handleStartTracking = () => {
        // In a real app, this would likely involve a database mutation
        // to create a new crop tracking entry for the current user.
        toast({
            title: "Crop Tracking Enabled!",
            description: `You are now tracking the progress of ${cropName}. View progress in your dashboard.`,
        });
    };

    return (
        <Button onClick={handleStartTracking}>Start Tracking This Crop</Button>
    )
}
