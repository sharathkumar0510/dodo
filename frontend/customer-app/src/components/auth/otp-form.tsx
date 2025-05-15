'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Define the form schema for mobile number
const mobileSchema = z.object({
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits').max(15),
});

// Define the form schema for OTP
const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6),
});

export function OTPForm() {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { sendOTP, verifyOTP } = useAuth();

  // Form for mobile number
  const mobileForm = useForm<z.infer<typeof mobileSchema>>({
    resolver: zodResolver(mobileSchema),
    defaultValues: {
      mobile: '',
    },
  });

  // Form for OTP
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Handle mobile form submission
  const onMobileSubmit = async (data: z.infer<typeof mobileSchema>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await sendOTP(data.mobile);
      setMobile(data.mobile);
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP form submission
  const onOTPSubmit = async (data: z.infer<typeof otpSchema>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await verifyOTP(mobile, data.otp);
      if (result.isNewUser) {
        // Redirect to registration page with mobile number
        router.push(`/register?mobile=${mobile}`);
      } else {
        // Redirect to home page
        router.push('/');
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login to Dodo Services</CardTitle>
        <CardDescription>
          {step === 'mobile'
            ? 'Enter your mobile number to receive an OTP'
            : 'Enter the OTP sent to your mobile'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {step === 'mobile' ? (
          <Form {...mobileForm}>
            <form onSubmit={mobileForm.handleSubmit(onMobileSubmit)} className="space-y-4">
              <FormField
                control={mobileForm.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter 6-digit OTP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {step === 'otp' && (
          <Button variant="link" onClick={() => setStep('mobile')}>
            Change mobile number
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
