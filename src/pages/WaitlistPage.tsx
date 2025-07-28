
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function WaitlistPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement waitlist signup logic
      // const response = await joinWaitlist(email);
      
      toast.success("You've been added to the waitlist!");
      navigate("/auth/signup");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to join waitlist";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join the Waitlist
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Be among the first to experience Flight Workly
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#FF4081] focus:border-[#FF4081] focus:z-10 sm:text-sm"
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF4081] hover:bg-[#E91E63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4081]"
            >
              {isSubmitting ? "Joining..." : "Join Waitlist"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
