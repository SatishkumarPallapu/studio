import CropRecommendationClient from './crop-recommendation-client';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

function CropRecommendationFallback() {
    return (
        <div className="flex items-center justify-center h-96">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
    )
}

export default function CropRecommendationPage() {
  return (
    <div>
        <Suspense fallback={<CropRecommendationFallback />}>
          <CropRecommendationClient />
        </Suspense>
    </div>
  );
}
