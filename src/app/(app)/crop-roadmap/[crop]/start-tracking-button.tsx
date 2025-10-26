
'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useActiveCrop } from "@/contexts/active-crop-context";
import { useRouter } from "next/navigation";

export default function StartTrackingButton({ cropName }: { cropName: string }) {
    const { toast } = useToast();
    const { addTrackedCrop } = useActiveCrop();
    const router = useRouter();

    const handleStartTracking = () => {
        const newCrop = {
            id: `${cropName.toLowerCase().replace(/ /g, '-')}-${Date.now()}`,
            name: cropName,
        };
        addTrackedCrop(newCrop);

        toast({
            title: "Crop Tracking Enabled!",
            description: `You are now tracking ${cropName}. View its progress in the Crop Lifecycle dashboard.`,
        });

        router.push('/crop-dashboard');
    };

    return (
        <Button onClick={handleStartTracking}>Start Tracking This Crop</Button>
    )
}
