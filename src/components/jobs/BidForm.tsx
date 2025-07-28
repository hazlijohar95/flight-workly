
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { DollarSign, Clock, Link as LinkIcon } from "lucide-react";

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
import { logException } from "@/utils/logger";
import type { Job } from "@/types/job";

interface AppError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

const formSchema = z.object({
  fee: z.number().min(0.01, "Fee must be at least $0.01"),
  time_estimate: z.number().min(1, "Time estimate must be at least 1 hour"),
  portfolio_url: z.string().url().optional().or(z.literal("")),
  note: z.string().max(200, "Note must be less than 200 characters").optional(),
});

interface BidFormProps {
  job: Job;
  onBidSubmitted?: () => void;
}

export default function BidForm({ job, onBidSubmitted }: BidFormProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fee: 0,
      time_estimate: 1,
      portfolio_url: "",
      note: "",
    },
  });
  
  const onSubmit = async (_data: z.infer<typeof formSchema>): Promise<void> => {
    setIsSubmitting(true);
    
    try {
      // TODO: Implement bid submission logic
      // const response = await submitBid(job.id, data);
      
      toast.success("Bid submitted successfully!");
      
      if (onBidSubmitted) {
        onBidSubmitted();
      }
    } catch (error: unknown) {
      const appError = error as AppError;
      logException(error, 'BidForm.onSubmit');
      toast.error(appError.message || "Failed to submit bid");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
          <p className="text-sm font-medium text-gray-700">Job Budget: {job.currency} {job.budget.toFixed(2)}</p>
        </div>
        
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="fee"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Your Fee ({job.currency})
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter your price" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                    className="text-lg font-medium"
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
                <FormLabel className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Time Estimate (hours)
                </FormLabel>
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
              <FormLabel className="flex items-center">
                <LinkIcon className="w-4 h-4 mr-1" />
                Portfolio or Sample Work (optional)
              </FormLabel>
              <FormControl>
                <Input placeholder="https://your-portfolio.com" {...field} />
              </FormControl>
              <FormDescription>
                Share a link to relevant work to increase your chances
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why you're perfect for this job (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief note about your skills and experience relevant to this job" 
                  maxLength={200}
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <div className="flex justify-between">
                <FormDescription>
                  Explain why you're the best fit for this project
                </FormDescription>
                <span className="text-xs text-gray-500">
                  {field.value?.length || 0}/200
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Bid"}
        </Button>
      </form>
    </Form>
  );
}
