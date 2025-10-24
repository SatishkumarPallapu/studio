'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { Icons } from '@/components/icons';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth } = useFirebase();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useState(() => {
    setIsClient(true);
  });
  
  const setupRecaptcha = () => {
    if (!isClient) return;
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (!auth || !recaptchaContainer) return;
    
    // Clear the container before creating a new verifier
    recaptchaContainer.innerHTML = '';

    const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainer, {
      'size': 'invisible',
      'callback': (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
    return recaptchaVerifier;
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const appVerifier = setupRecaptcha();
      if (!appVerifier) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Recaptcha verifier not initialized.'
        });
        setLoading(false);
        return;
      }
      const result = await signInWithPhoneNumber(auth, `+${phoneNumber}`, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: `An OTP has been sent to +${phoneNumber}.`,
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send OTP. Please check the phone number and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    if (!confirmationResult) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'OTP not sent yet.',
      });
      setLoading(false);
      return;
    }
    try {
      await confirmationResult.confirm(otp);
      toast({
        title: 'Login Successful',
        description: 'You are now logged in.',
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid OTP. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icons.logo className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">AI Rythu Mitra</h1>
          </div>
          <CardTitle>{otpSent ? 'Enter OTP' : 'Login'}</CardTitle>
          <CardDescription>
            {otpSent
              ? `We've sent an OTP to +${phoneNumber}`
              : 'Enter your phone number to receive an OTP'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!otpSent ? (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="919876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="rounded-l-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter your 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}
            <Button
              onClick={otpSent ? handleVerifyOtp : handleSendOtp}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Processing...' : otpSent ? 'Verify OTP' : 'Send OTP'}
            </Button>
            {otpSent && (
              <Button variant="link" onClick={() => {
                setOtpSent(false);
                setPhoneNumber('');
                setOtp('');
              }}>
                Change phone number
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {isClient && <div id="recaptcha-container"></div>}
    </div>
  );
}
