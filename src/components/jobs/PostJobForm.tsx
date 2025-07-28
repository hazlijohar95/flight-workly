
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { addHours } from "date-fns";
import { Briefcase, DollarSign, Calendar, FileText, Zap, CheckCircle, ArrowLeft } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { JOB_CATEGORIES, DEADLINE_OPTIONS } from "@/constants/jobCategories";
import { useAuth } from "@/context/AuthContext";
import { logException } from "@/utils/logger";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  budget: z.number().positive("Budget must be a positive number"),
  currency: z.string().default("MYR"),
  deadline_option: z.string().min(1, "Please select a deadline"),
});

export default function PostJobForm(): JSX.Element {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
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
  
  const onSubmit = async (data: z.infer<typeof formSchema>): Promise<void> => {
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
      
      const { data: _job, error } = await supabase
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
    } catch (error: unknown) {
      logException(error, "PostJobForm.onSubmit");
      const errorMessage = error instanceof Error ? error.message : "Failed to post job";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: "Job Details", icon: Briefcase },
    { id: 2, title: "Budget & Timeline", icon: DollarSign },
  ];

  const getCurrentStepData = (): { title: string; category: string; budget: number; currency: string; deadline: string } => {
    const values = form.getValues();
    return {
      title: values.title,
      category: values.category,
      budget: values.budget,
      currency: values.currency,
      deadline: values.deadline_option
    };
  };
  
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
        <p className="text-gray-600">Get your project done by talented freelancers</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.id 
                ? 'bg-[#FF4081] border-[#FF4081] text-white' 
                : 'bg-white border-gray-300 text-gray-500'
            }`}>
              {currentStep > step.id ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-2 ${
                currentStep > step.id ? 'bg-[#FF4081]' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-[#FF4081]" />
            {currentStep === 1 ? "Job Details" : "Budget & Timeline"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Job Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Job Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Need Instagram captions by tonight" 
                            className="h-12 text-base"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="flex items-center">
                          <Zap className="h-4 w-4 mr-1 text-[#FF4081]" />
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
                        <FormLabel className="text-base font-medium">Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 text-base">
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
                        <FormLabel className="text-base font-medium">Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what you need, requirements, and any specific details..." 
                            maxLength={500}
                            className="resize-none min-h-[120px] text-base" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="flex items-center justify-between">
                          <span className="flex items-center">
                            <FileText className="h-4 w-4 mr-1 text-[#FF4081]" />
                            Max 500 characters
                          </span>
                          <span className="text-sm text-gray-500">
                            {field.value?.length || 0}/500
                          </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate("/dashboard/jobs")}
                      className="flex-1 h-12"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 h-12 bg-gradient-to-r from-[#FF4081] to-[#E91E63] hover:from-[#E91E63] hover:to-[#C2185B] text-white"
                      disabled={!form.getValues("title") || !form.getValues("category")}
                    >
                      Next Step
                      <DollarSign className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Budget & Timeline */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-base font-medium">Budget</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              className="h-12 text-base"
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
                        <FormItem className="w-32">
                          <FormLabel className="text-base font-medium">Currency</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 text-base">
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
                        <FormLabel className="text-base font-medium">Deadline</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 text-base">
                              <SelectValue placeholder="Select a deadline" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DEADLINE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="flex items-center">
                          <Zap className="h-4 w-4 mr-1 text-[#FF4081]" />
                          Bidding will auto-close halfway to the deadline
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-gray-900">Job Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Title:</span>
                        <span className="font-medium">{getCurrentStepData().title || "Not set"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">
                          {JOB_CATEGORIES.find(c => c.value === getCurrentStepData().category)?.label || "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-medium">
                          {getCurrentStepData().budget ? `${getCurrentStepData().currency} ${getCurrentStepData().budget}` : "Not set"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 h-12"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 bg-gradient-to-r from-[#FF4081] to-[#E91E63] hover:from-[#E91E63] hover:to-[#C2185B] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Briefcase className="h-4 w-4 mr-2" />
                          Post Job
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
