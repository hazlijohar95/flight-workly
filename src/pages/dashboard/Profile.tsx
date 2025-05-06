
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import useRequireAuth from "@/hooks/useRequireAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  display_name: z.string().optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  user_type: z.enum(["freelancer", "job_poster"]).nullable(),
});

const freelancerSchema = z.object({
  headline: z.string().max(100, "Headline must be 100 characters or less").optional(),
  hourly_rate: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid rate format").optional(),
  years_experience: z.string().regex(/^\d+$/, "Must be a number").optional(),
  portfolio_url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  skills: z.string().optional(),
});

const jobPosterSchema = z.object({
  company_name: z.string().optional(),
  company_website: z.string().url("Invalid URL format").optional().or(z.literal("")),
  company_size: z.string().optional(),
  industry: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type FreelancerFormValues = z.infer<typeof freelancerSchema>;
type JobPosterFormValues = z.infer<typeof jobPosterSchema>;

export default function Profile() {
  const { user, profile, updateProfile } = useRequireAuth({ requireBetaAccess: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [freelancerProfile, setFreelancerProfile] = useState<any>(null);
  const [jobPosterProfile, setJobPosterProfile] = useState<any>(null);
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      display_name: profile?.display_name || "",
      bio: profile?.bio || "",
      user_type: profile?.user_type as "freelancer" | "job_poster" | null,
    },
  });

  const freelancerForm = useForm<FreelancerFormValues>({
    resolver: zodResolver(freelancerSchema),
    defaultValues: {
      headline: "",
      hourly_rate: "",
      years_experience: "",
      portfolio_url: "",
      skills: "",
    },
  });

  const jobPosterForm = useForm<JobPosterFormValues>({
    resolver: zodResolver(jobPosterSchema),
    defaultValues: {
      company_name: "",
      company_website: "",
      company_size: "",
      industry: "",
    },
  });

  // Load specialized profile data if user type is selected
  useEffect(() => {
    const fetchSpecializedProfile = async () => {
      if (!user) return;
      
      if (profile?.user_type === "freelancer") {
        const { data, error } = await supabase
          .from("freelancer_profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (data && !error) {
          setFreelancerProfile(data);
          freelancerForm.reset({
            headline: data.headline || "",
            hourly_rate: data.hourly_rate ? String(data.hourly_rate) : "",
            years_experience: data.years_experience ? String(data.years_experience) : "",
            portfolio_url: data.portfolio_url || "",
            skills: data.skills ? data.skills.join(", ") : "",
          });
        }
      } else if (profile?.user_type === "job_poster") {
        const { data, error } = await supabase
          .from("job_poster_profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (data && !error) {
          setJobPosterProfile(data);
          jobPosterForm.reset({
            company_name: data.company_name || "",
            company_website: data.company_website || "",
            company_size: data.company_size || "",
            industry: data.industry || "",
          });
        }
      }
    };
    
    fetchSpecializedProfile();
  }, [user, profile?.user_type]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSubmitting(true);
      await updateProfile(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFreelancerSubmit = async (data: FreelancerFormValues) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      const skillsArray = data.skills 
        ? data.skills.split(',').map(skill => skill.trim()).filter(skill => skill) 
        : [];
      
      const { error } = await supabase
        .from("freelancer_profiles")
        .upsert({
          id: user.id,
          headline: data.headline,
          hourly_rate: data.hourly_rate ? parseFloat(data.hourly_rate) : null,
          years_experience: data.years_experience ? parseInt(data.years_experience) : null,
          portfolio_url: data.portfolio_url || null,
          skills: skillsArray,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      toast.success("Freelancer profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update freelancer profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onJobPosterSubmit = async (data: JobPosterFormValues) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from("job_poster_profiles")
        .upsert({
          id: user.id,
          company_name: data.company_name || null,
          company_website: data.company_website || null,
          company_size: data.company_size || null,
          industry: data.industry || null,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      toast.success("Business profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update business profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const userTypeChanged = (value: "freelancer" | "job_poster") => {
    profileForm.setValue("user_type", value);
    onProfileSubmit({
      ...profileForm.getValues(),
      user_type: value,
    });
  };

  if (!user || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
          <p className="text-muted-foreground">
            Update your personal information and public profile
          </p>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={profileForm.control}
                    name="display_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>
                          This is the name that will be displayed to other users
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value || ""}
                            placeholder="Tell us about yourself"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Basic Info"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>I am a...</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={profileForm.control}
                name="user_type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value: "freelancer" | "job_poster") => userTypeChanged(value)}
                        defaultValue={field.value || undefined}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="freelancer" id="freelancer" />
                          <FormLabel htmlFor="freelancer" className="cursor-pointer">
                            Freelancer (I want to work on projects)
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="job_poster" id="job_poster" />
                          <FormLabel htmlFor="job_poster" className="cursor-pointer">
                            Business (I want to hire freelancers)
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Conditional freelancer fields */}
          {profile.user_type === "freelancer" && (
            <Card>
              <CardHeader>
                <CardTitle>Freelancer Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...freelancerForm}>
                  <form onSubmit={freelancerForm.handleSubmit(onFreelancerSubmit)} className="space-y-4">
                    <FormField
                      control={freelancerForm.control}
                      name="headline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Headline</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g. Senior Web Developer with 5 years experience"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={freelancerForm.control}
                        name="hourly_rate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hourly Rate (MYR)</FormLabel>
                            <FormControl>
                              <Input {...field} type="text" placeholder="e.g. 75" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={freelancerForm.control}
                        name="years_experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Experience</FormLabel>
                            <FormControl>
                              <Input {...field} type="text" placeholder="e.g. 5" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={freelancerForm.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skills (comma separated)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g. React, TypeScript, UI Design"
                            />
                          </FormControl>
                          <FormDescription>
                            Enter your skills separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={freelancerForm.control}
                      name="portfolio_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portfolio URL</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="https://your-portfolio.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Freelancer Profile"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
          
          {/* Conditional job poster fields */}
          {profile.user_type === "job_poster" && (
            <Card>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...jobPosterForm}>
                  <form onSubmit={jobPosterForm.handleSubmit(onJobPosterSubmit)} className="space-y-4">
                    <FormField
                      control={jobPosterForm.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Your company name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={jobPosterForm.control}
                      name="company_website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Website</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="https://your-company.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={jobPosterForm.control}
                        name="company_size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Size</FormLabel>
                            <FormControl>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select company size" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1-10">1-10 employees</SelectItem>
                                  <SelectItem value="11-50">11-50 employees</SelectItem>
                                  <SelectItem value="51-200">51-200 employees</SelectItem>
                                  <SelectItem value="201-500">201-500 employees</SelectItem>
                                  <SelectItem value="501+">501+ employees</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={jobPosterForm.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g. Technology, Healthcare"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Business Profile"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Email</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Account Created</h3>
                <p className="text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Beta Access Status</h3>
                <p className="text-sm">
                  {profile.is_beta_tester ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Beta Tester
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Standard User
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
