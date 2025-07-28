
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import { useAuth } from "@/context/AuthContext";

const betaAccessSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  code: z.string().min(1, "Please enter your invitation code"),
});

type BetaAccessFormValues = z.infer<typeof betaAccessSchema>;

export default function BetaAccess(): JSX.Element {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BetaAccessFormValues>({
    resolver: zodResolver(betaAccessSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  // Redirect if already logged in
  if (user && !isLoading) {
    navigate("/dashboard");
  }

  const onSubmit = async (data: BetaAccessFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Check if invite exists and is valid
      const { data: inviteData, error: inviteError } = await supabase
        .from("beta_invites")
        .select("*")
        .eq("email", data.email)
        .eq("code", data.code)
        .single();
      
      if (inviteError || !inviteData) {
        toast.error("Invalid email or invitation code");
        return;
      }
      
      if (inviteData.used) {
        toast.error("This invitation has already been used");
        return;
      }
      
      // Redirect to signup with the email pre-filled
      navigate(`/auth/signup?email=${encodeURIComponent(data.email)}&beta=true&invite=${inviteData.id}`);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundCanvas />
      <Header showEarlyAdopter={false} />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Beta Access
            </h2>
            <p className="mt-2 text-gray-600">
              Enter your email and invitation code to access the beta
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
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invitation Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your invitation code" {...field} />
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
                {isSubmitting ? "Verifying..." : "Access Beta"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
