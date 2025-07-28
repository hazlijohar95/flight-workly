import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logException } from "@/utils/logger";

export default function VerifyEmail(): JSX.Element {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Check if user is already verified
    const checkVerification = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email_confirmed_at) {
        setIsVerified(true);
      }
    };

    checkVerification();
  }, []);

  const handleResendEmail = async (): Promise<void> => {
    setIsVerifying(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email || searchParams.get('email') || '',
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Verification email sent!');
    } catch (error: unknown) {
      logException(error, 'VerifyEmail.handleResendEmail');
      toast.error('Failed to send verification email');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  if (isVerified) {
    return (
      <div className="text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
        <p className="text-sm text-gray-600 mb-6">
          Your email has been successfully verified. You can now access your account.
        </p>
        <Link to="/auth/login">
          <Button className="w-full bg-[#121212] hover:bg-black">
            Continue to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-6">
        <Mail className="h-16 w-16 text-blue-500 mx-auto" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Check your email</h2>
      <p className="text-sm text-gray-600 mb-6">
        We've sent you a verification link to complete your registration.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Didn't receive the email?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>• Check your spam folder</p>
            <p>• Make sure you entered the correct email address</p>
            <p>• Wait a few minutes for the email to arrive</p>
          </div>
          
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4081] focus:border-transparent"
            />
            <Button
              onClick={handleResendEmail}
              disabled={isVerifying}
              variant="outline"
              className="w-full"
            >
              {isVerifying ? "Sending..." : "Resend Verification Email"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm">
        Already verified?{" "}
        <Link
          to="/auth/login"
          className="text-[#FF4081] hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
} 