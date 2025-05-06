
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Job } from "@/types/job";

interface BidFormProps {
  job: Job;
  onBidSubmitted?: () => void;
}

const formSchema = z.object({
  fee: z.number().positive("Fee must be a positive number"),
  time_estimate: z.number().int().positive("Time estimate must be a positive number"),
  portfolio_url: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  note: z.string().max(200, "Note must be less than 200 characters").optional(),
});

export default function BidForm({ job, onBidSubmitted }: BidFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fee: job.budget, // Default to job budget
      time_estimate: 1, // Default to 1 hour
      portfolio_url: "",
      note: "",
    },
  });
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to submit a bid");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('bids')
        .insert({
          job_id: job.id,
          user_id: user.id,
          fee: data.fee,
          time_estimate: data.time_estimate,
          portfolio_url: data.portfolio_url || null,
          note: data.note || null,
        });
      
      if (error) {
        if (error.code === '23505') {
          toast.error("You have already bid on this job");
        } else {
          throw error;
        }
      } else {
        toast.success("Bid submitted successfully!");
        if (onBidSubmitted) {
          onBidSubmitted();
        }
      }
    } catch (error: any) {
      console.error("Error submitting bid:", error);
      toast.error(error.message || "Failed to submit bid");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="fee"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Your Fee ({job.currency})</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time_estimate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Time Estimate (hours)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="1" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="portfolio_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portfolio URL (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://your-portfolio.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief note to the job poster" 
                  maxLength={200}
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Max 200 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Bid"}
        </Button>
      </form>
    </Form>
  );
}
