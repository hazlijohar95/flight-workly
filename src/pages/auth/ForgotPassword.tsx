
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { logException } from "@/utils/logger";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof formSchema>;

export default function ForgotPassword(): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsSubmitting(true);
    try {
      await resetPassword(data.email);
      setIsSubmitted(true);
    } catch (error: unknown) {
      logException(error, 'ForgotPassword.onSubmit');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Check your email</h2>
          <p className="text-sm text-gray-600 mt-2">
            We've sent you a password reset link
          </p>
        </div>
        
        <div className="mt-6 text-center">
          <Link
            to="/auth/login"
            className="text-[#FF4081] hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Reset your password</h2>
        <p className="text-sm text-gray-600 mt-2">
          Enter your email address and we'll send you a reset link
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

          <Button
            type="submit"
            className="w-full bg-[#121212] hover:bg-black"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
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
