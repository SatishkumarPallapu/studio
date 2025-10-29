
'use client';

import { Button } from "@/components/ui/button";
import { useCropLifecycle } from "@/contexts/active-crop-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";

type FarmingType = 'Open Field' | 'Indoor/Soilless' | 'Both';

export default function StartTrackingButton({ cropName }: { cropName: string }) {
    const { startTrackingCrop } = useCropLifecycle();
    const router = useRouter();
    const { translations } = useLanguage();
    const searchParams = useSearchParams();
    const farmingType = (searchParams.get('farmingType') as FarmingType) || 'Open Field';

    const handleStartTracking = async () => {
        await startTrackingCrop(cropName, farmingType);
        router.push('/crop-dashboard');
    };

    return (
        <Button onClick={handleStartTracking}>{translations.crop_roadmap.start_tracking}</Button>
    )
}
