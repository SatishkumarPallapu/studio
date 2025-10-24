'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, MapPin, Sprout } from 'lucide-react';
import Link from 'next/link';

// Mock user profile
const userProfile = {
  district: 'Anantapur',
  crops: ['Paddy', 'Groundnut'],
};

// Mock subsidy data (as we can't call APIs directly)
const allSubsidies = [
  {
    id: 1,
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'Crop insurance scheme to provide financial support to farmers suffering crop loss/damage.',
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible.',
    deadline: '2024-12-31',
    link: '#',
    tags: { districts: ['All'], crops: ['All'] },
  },
  {
    id: 2,
    title: 'Rythu Bharosa',
    description: 'Financial assistance to farmers for investment in crops.',
    eligibility: 'Farmers owning cultivable land in Andhra Pradesh.',
    deadline: '2025-01-15',
    link: '#',
    tags: { districts: ['Anantapur', 'Chittoor', 'Kadapa'], crops: ['All'] },
  },
  {
    id: 3,
    title: 'Drip Irrigation Subsidy',
    description: '70% subsidy on the cost of drip irrigation systems to promote water conservation.',
    eligibility: 'Farmers in drought-prone areas.',
    deadline: '2024-11-30',
    link: '#',
    tags: { districts: ['Anantapur'], crops: ['Groundnut', 'Maize', 'Horticulture crops'] },
  },
  {
    id: 4,
    title: 'National Food Security Mission (NFSM) - Pulses',
    description: 'Assistance for purchasing high-yielding variety seeds for pulses.',
    eligibility: 'All farmers cultivating pulses.',
    deadline: '2024-12-10',
    link: '#',
    tags: { districts: ['All'], crops: ['Pulses', 'Lentils'] },
  },
];

export default function SubsidyAlertsClient() {
  const matchedSubsidies = allSubsidies.filter(subsidy => {
    const districtMatch = subsidy.tags.districts.includes('All') || subsidy.tags.districts.includes(userProfile.district);
    const cropMatch = subsidy.tags.crops.includes('All') || userProfile.crops.some(crop => subsidy.tags.crops.includes(crop));
    return districtMatch && cropMatch;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Smart Subsidy Alerts</CardTitle>
          <CardDescription>
            Showing government subsidies automatically matched to your profile (Location: {userProfile.district}, Crops: {userProfile.crops.join(', ')}).
          </CardDescription>
        </CardHeader>
      </Card>
      
      {matchedSubsidies.length > 0 ? (
        <div className="space-y-4">
          {matchedSubsidies.map((subsidy) => (
            <Card key={subsidy.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <Badge variant="secondary" className="mb-2">Matching Your Profile</Badge>
                        <CardTitle className="text-xl">{subsidy.title}</CardTitle>
                    </div>
                    <Bell className="w-6 h-6 text-primary"/>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{subsidy.description}</p>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Eligibility</h4>
                  <p className="text-sm text-muted-foreground">{subsidy.eligibility}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">Districts:</span>
                        <span className="text-muted-foreground">{subsidy.tags.districts.join(', ')}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Sprout className="w-4 h-4" />
                        <span className="font-medium">Crops:</span>
                        <span className="text-muted-foreground">{subsidy.tags.crops.join(', ')}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div>
                    <p className="text-sm font-semibold">Application Deadline</p>
                    <p className="text-sm font-bold text-destructive">{new Date(subsidy.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <Button asChild>
                    <Link href={subsidy.link}>Apply Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-10">
          <CardContent>
            <Bell className="w-12 h-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Matching Subsidies Found</h3>
            <p className="mt-1 text-muted-foreground">
              We couldn&apos;t find any subsidies matching your current profile. We&apos;ll notify you when new ones become available.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
