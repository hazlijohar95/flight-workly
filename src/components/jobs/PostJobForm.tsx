
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { addHours, format } from "date-fns";

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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { JOB_CATEGORIES, DEADLINE_OPTIONS } from "@/constants/jobCategories";
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  budget: z.number().positive("Budget must be a positive number"),
  currency: z.string().default("MYR"),
  deadline_option: z.string().min(1, "Please select a deadline"),
});

export default function PostJobForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      budget: 0,
      currency: "MYR",
      deadline_option: "",
    },
  });
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to post a job");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Calculate deadline based on selected option
      const selectedOption = DEADLINE_OPTIONS.find(option => option.value === data.deadline_option);
      const hours = selectedOption ? selectedOption.hours : 24; // Default to 24 hours
      
      const deadline = addHours(new Date(), hours);
      const bidding_end_time = addHours(new Date(), hours / 2); // Bidding ends halfway to deadline
      
      const { data: job, error } = await supabase
        .from('jobs')
        .insert({
          title: data.title,
          category: data.category,
          description: data.description || null,
          budget: data.budget,
          currency: data.currency,
          deadline: deadline.toISOString(),
          bidding_end_time: bidding_end_time.toISOString(),
          status: 'open',
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success("Job posted successfully!");
      navigate("/dashboard/jobs");
    } catch (error: any) {
      console.error("Error posting job:", error);
      toast.error(error.message || "Failed to post job");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Need Instagram captions by tonight" {...field} />
              </FormControl>
              <FormDescription>
                Keep it short and specific
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {JOB_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe what you need" 
                  maxLength={500}
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Max 500 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Budget</FormLabel>
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
            name="currency"
            render={({ field }) => (
              <FormItem className="w-24">
                <FormLabel>Currency</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="MYR" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MYR">MYR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="deadline_option"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a deadline" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DEADLINE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Bidding will auto-close halfway to the deadline
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Job"}
        </Button>
      </form>
    </Form>
  );
}
