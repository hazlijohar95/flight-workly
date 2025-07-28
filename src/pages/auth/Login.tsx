
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
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
import { formSchemas, type LoginFormData } from "@/utils/validation";
import { ErrorHandler } from "@/utils/error-handler";
import { authRateLimiter } from "@/utils/rate-limiter";
import { toast } from "sonner";

export default function Login(): JSX.Element {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchemas.login),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    const emailKey = `login:${data.email}`;
    
    // Check rate limiting
    if (!authRateLimiter.isAllowed(emailKey)) {
      const remaining = authRateLimiter.getRemainingAttempts(emailKey);
      const blockTime = authRateLimiter.getTimeUntilUnblocked(emailKey);
      
      if (remaining === 0) {
        setIsBlocked(true);
        setBlockTimeRemaining(blockTime);
        toast.error(`Too many failed attempts. Please try again in ${Math.ceil(blockTime / 60000)} minutes.`);
        return;
      }
    }

    const success = await ErrorHandler.wrapVoid(
      async () => {
        setIsLoading(true);
        await signIn(data.email, data.password);
        // Reset rate limiter on successful login
        authRateLimiter.reset(emailKey);
        navigate("/dashboard");
      },
      "Sign in"
    );
    
    if (!success) {
      // Record failed attempt
      authRateLimiter.recordAttempt(emailKey);
      const remaining = authRateLimiter.getRemainingAttempts(emailKey);
      setRemainingAttempts(remaining);
      
      if (remaining === 0) {
        setIsBlocked(true);
        setBlockTimeRemaining(authRateLimiter.getTimeUntilUnblocked(emailKey));
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Welcome back</h2>
        <p className="text-sm text-gray-600 mt-2">
          Sign in to access your account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="you@example.com" 
                    type="email"
                    autoComplete="email"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Password</FormLabel>
                  <Link
                    to="/auth/forgot-password"
                    className="text-xs text-gray-500 hover:text-[#FF4081]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input 
                    type="password" 
                    autoComplete="current-password"
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
            disabled={isLoading || isBlocked}
          >
            {isLoading ? "Signing in..." : isBlocked ? "Account Temporarily Locked" : "Sign In"}
          </Button>

          {remainingAttempts < 5 && remainingAttempts > 0 && (
            <div className="text-center text-sm text-orange-600">
              {remainingAttempts} login attempt{remainingAttempts !== 1 ? 's' : ''} remaining
            </div>
          )}

          {isBlocked && (
            <div className="text-center text-sm text-red-600">
              Account locked. Try again in {Math.ceil(blockTimeRemaining / 60000)} minutes.
            </div>
          )}

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-[#FF4081] hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
