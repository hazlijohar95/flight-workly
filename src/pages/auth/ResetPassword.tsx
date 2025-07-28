import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logException } from "@/utils/logger";

const formSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

export default function ResetPassword(): JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Check if we have a valid reset token
    const checkResetToken = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      
      if (accessToken && refreshToken) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) {
            toast.error('Invalid or expired reset link');
            navigate('/auth/forgot-password');
            return;
          }
          
          setIsValidToken(true);
        } catch (error) {
          logException(error, 'ResetPassword.checkResetToken');
          toast.error('Invalid or expired reset link');
          navigate('/auth/forgot-password');
        }
      } else {
        toast.error('Invalid reset link');
        navigate('/auth/forgot-password');
      }
    };

    checkResetToken();
  }, [searchParams, navigate]);

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });
      
      if (error) {
        throw error;
      }
      
      setIsSuccess(true);
      toast.success('Password updated successfully!');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (error: unknown) {
      logException(error, 'ResetPassword.onSubmit');
      toast.error('Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Password Updated!</h2>
        <p className="text-sm text-gray-600 mb-6">
          Your password has been successfully updated. You will be redirected to login shortly.
        </p>
        <Link to="/auth/login">
          <Button className="w-full bg-[#121212] hover:bg-black">
            Go to Login
          </Button>
        </Link>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="text-center">
        <div className="mb-6">
          <Lock className="h-16 w-16 text-gray-400 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Verifying Reset Link</h2>
        <p className="text-sm text-gray-600">
          Please wait while we verify your reset link...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center">
        <div className="mb-6">
          <Lock className="h-16 w-16 text-blue-500 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Reset your password</h2>
        <p className="text-sm text-gray-600 mt-2">
          Enter your new password below
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter your new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm your new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-[#121212] hover:bg-black"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating Password..." : "Update Password"}
          </Button>

          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link
              to="/auth/login"
              className="text-[#FF4081] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
} 