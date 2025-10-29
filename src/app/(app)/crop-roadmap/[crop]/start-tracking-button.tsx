
'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useActiveCrop } from "@/contexts/active-crop-context";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";

export default function StartTrackingButton({ cropName }: { cropName: string }) {
    const { toast } = useToast();
    const { addTrackedCrop } = useActiveCrop();
    const router = useRouter();
    const { translations } = useLanguage();

    const handleStartTracking = () => {
        const newCrop = {
            id: `${cropName.toLowerCase().replace(/ /g, '-')}-${Date.now()}`,
            name: cropName,
        };
        const alreadyTracked = addTrackedCrop(newCrop);

        if (alreadyTracked) {
          toast({
              title: translations.crop_roadmap.already_tracking,
              description: translations.crop_roadmap.already_tracking_desc.replace('{cropName}', cropName),
          });
        } else {
          toast({
              title: translations.crop_roadmap.tracking_enabled,
              description: translations.crop_roadmap.tracking_desc.replace('{cropName}', cropName),
          });
        }

        router.push('/crop-dashboard');
    };

    return (
        <Button onClick={handleStartTracking}>{translations.crop_roadmap.start_tracking}</Button>
    )
}
