
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, TrendingUp, Zap, ScanEye } from 'lucide-react';
import { useFirebase } from '@/firebase/provider';
import { useUser } from '@/firebase/provider';
import { useMemoFirebase } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useLanguage } from '@/contexts/language-context';

type SatelliteHealthData = {
    date: string;
    ndvi: number;
    healthStatus: 'Healthy' | 'Moderate Stress' | 'Severe Stress';
    advice: string;
};

// Mock data to use when no live data is available
const mockSatelliteData: SatelliteHealthData[] = [
    { date: '2024-06-01', ndvi: 0.68, healthStatus: 'Moderate Stress', advice: 'Stress detected. Check irrigation or nutrient levels for early intervention.' },
    { date: '2024-06-08', ndvi: 0.75, healthStatus: 'Healthy', advice: 'Crop appears healthy. Current input utilization is optimal. Maintain practices.' },
    { date: '2024-06-15', ndvi: 0.72, healthStatus: 'Healthy', advice: 'Slight dip in health, monitor for potential weed outbreaks or pests.' },
    { date: '2024-06-22', ndvi: 0.81, healthStatus: 'Healthy', advice: 'Excellent health. Optimized management is improving yield potential.' },
    { date: '2024-06-29', ndvi: 0.79, healthStatus: 'Healthy', advice: 'Stable and healthy. Continue optimized management to ensure profitability.' },
];

const getStatusInfo = (status: SatelliteHealthData['healthStatus']) => {
    switch (status) {
        case 'Healthy':
            return {
                variant: 'default',
                icon: <CheckCircle className="h-5 w-5 text-green-500" />,
                className: 'bg-green-100/50 text-green-800 border-green-200',
            };
        case 'Moderate Stress':
            return {
                variant: 'secondary',
                icon: <Zap className="h-5 w-5 text-yellow-500" />,
                className: 'bg-yellow-100/50 text-yellow-800 border-yellow-200',
            };
        case 'Severe Stress':
            return {
                variant: 'destructive',
                icon: <AlertCircle className="h-5 w-5 text-red-500" />,
                className: 'bg-red-100/50 text-red-800 border-red-200',
            };
        default:
            return {
                variant: 'secondary',
                icon: <CheckCircle className="h-5 w-5" />,
                className: '',
            };
    }
};

export default function SatelliteHealthPage() {
    const { firestore } = useFirebase();
    const { user, isUserLoading } = useUser();
    const { translations } = useLanguage();
    
    // Hardcoded for prototype, but will use real user ID when available
    const cropId = 'tomato-123';

    const healthCollectionQuery = useMemoFirebase(() => {
        // Wait for auth to finish and services to be available.
        if (isUserLoading || !user || !firestore) {
            return null;
        }
        return query(
            collection(firestore, `users/${user.uid}/crops/${cropId}/satelliteHealth`),
            orderBy('date', 'desc'),
            limit(10)
        );
    }, [firestore, user, isUserLoading, cropId]);

    const { data: liveData, isLoading: isCollectionLoading } = useCollection<SatelliteHealthData>(healthCollectionQuery);
    
    const [latestData, setLatestData] = useState<SatelliteHealthData | null>(null);
    const [chartData, setChartData] = useState<SatelliteHealthData[]>([]);

    useEffect(() => {
        // Use live data if available and not loading, otherwise use mock data
        const data = !isCollectionLoading && liveData && liveData.length > 0 ? liveData : mockSatelliteData;
        
        // Data is ordered desc, so reverse for chart and take first for latest
        const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setChartData(sortedData);
        setLatestData(sortedData.length > 0 ? sortedData[sortedData.length - 1] : null);

    }, [liveData, isCollectionLoading]);

    const statusInfo = latestData ? getStatusInfo(latestData.healthStatus) : getStatusInfo('Healthy');

    if (isUserLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">{translations.satellite_health.authenticating}</p>
            </div>
        );
    }


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{translations.satellite_health.title}</CardTitle>
                    <CardDescription>{translations.satellite_health.description}</CardDescription>
                </CardHeader>
            </Card>

            {latestData && (
                <Card className={statusInfo.className}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{translations.satellite_health.latest_status}</CardTitle>
                        {statusInfo.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{latestData.healthStatus}</div>
                        <p className="text-xs text-muted-foreground">{latestData.advice}</p>
                    </CardContent>
                </Card>
            </Card>
        )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        {translations.satellite_health.trend_title}
                    </CardTitle>
                    <CardDescription>{translations.satellite_health.trend_description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorNdvi" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="date" 
                                    tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis domain={[0, 1]} style={{ fontSize: '12px' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: 'var(--radius)', 
                                        border: '1px solid hsl(var(--border))',
                                        background: 'hsl(var(--background))'
                                    }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                />
                                <Area type="monotone" dataKey="ndvi" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorNdvi)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ScanEye className="w-5 h-5" />
                        Benefits of Monitoring
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                   <ul className="list-disc pl-5 space-y-2">
                        <li>Early detection of threats (weed outbreaks, pest damage, nutrient deficiencies) so interventions can be timely, avoiding larger losses.</li>
                        <li>Better utilisation of inputs: knowing exactly where and when to apply fertiliser/chemicals instead of blanket application → cost savings, environmental benefit.</li>
                        <li>Improved yield and profitability: by reducing losses and optimising management, growers can improve bottom-line.</li>
                   </ul>
                </CardContent>
            </Card>
        </div>
    );
}
