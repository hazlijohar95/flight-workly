
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { PasswordStrength } from "@/components/ui/password-strength";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function Signup(): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsSubmitting(true);
    try {
      await signUp(data.email, data.password, data.firstName, data.lastName);
      navigate("/auth/verify-email");
    } catch (error: unknown) {
      logException(error, 'Signup.onSubmit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Create your account</h2>
        <p className="text-sm text-gray-600 mt-2">
          Join Flight Workly and start your freelancing journey
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    onFocus={() => setShowPasswordStrength(true)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                {showPasswordStrength && (
                  <PasswordStrength 
                    password={field.value} 
                    className="mt-2"
                  />
                )}
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-[#121212] hover:bg-black"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
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
