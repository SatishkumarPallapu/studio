
'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useActiveCrop } from "@/contexts/active-crop-context";
import { useRouter } from "next/navigation";

export default function StartTrackingButton({ cropName }: { cropName: string }) {
    const { toast } = useToast();
    const { setActiveCrop } = useActiveCrop();
    const router = useRouter();

    const handleStartTracking = () => {
        const newCrop = {
            id: `${cropName.toLowerCase().replace(/ /g, '-')}-${Date.now()}`,
            name: cropName,
        };
        setActiveCrop(newCrop);

        toast({
            title: "Crop Tracking Enabled!",
            description: `You are now tracking the progress of ${cropName}. View progress in your dashboard.`,
        });

        router.push('/crop-dashboard');
    };

    return (
        <Button onClick={handleStartTracking}>Start Tracking This Crop</Button>
    )
}
