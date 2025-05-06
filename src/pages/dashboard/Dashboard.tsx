
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileText, Briefcase, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import useRequireAuth from "@/hooks/useRequireAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, profile, isAdmin } = useRequireAuth({ requireBetaAccess: true });
  
  if (!user || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {profile.first_name}!</h1>
          <p className="text-muted-foreground">
            {!profile.user_type 
              ? "Complete your profile to get started with Flightworkly" 
              : `This is your ${profile.user_type === 'freelancer' ? 'freelancer' : 'business'} dashboard`}
          </p>
        </div>
        
        {!profile.user_type ? (
          <Card className="bg-amber-50 border border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800">Complete Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 mb-4">
                To use Flightworkly, please complete your profile and select your role:
                are you a freelancer looking for work, or a business looking to hire?
              </p>
              <Link to="/dashboard/profile">
                <Button 
                  variant="outline" 
                  className="bg-amber-100 hover:bg-amber-200 border-amber-300"
                >
                  Complete Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : profile.user_type === "freelancer" ? (
          // Freelancer Dashboard
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" /> Available Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">Browse available jobs and submit proposals</p>
                <Link to="/dashboard/jobs">
                  <Button variant="outline" size="sm">Find Jobs</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" /> My Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">Track job applications and bids</p>
                <Link to="/dashboard/jobs?tab=applied">
                  <Button variant="outline" size="sm">View Applications</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserRound className="mr-2 h-5 w-5" /> My Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Update your freelancer profile and skills
                </p>
                <Link to="/dashboard/profile">
                  <Button variant="outline" size="sm">Edit Profile</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Job Poster Dashboard
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PlusCircle className="mr-2 h-5 w-5" /> Post a Job
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">Create a new job posting</p>
                <Link to="/dashboard/jobs/new">
                  <Button variant="outline" size="sm">Create Job</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" /> My Job Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">Manage your active job listings</p>
                <Link to="/dashboard/jobs">
                  <Button variant="outline" size="sm">View Jobs</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserRound className="mr-2 h-5 w-5" /> My Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Update your business profile and company details
                </p>
                <Link to="/dashboard/profile">
                  <Button variant="outline" size="sm">Edit Profile</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
        
        {isAdmin && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
            <h3 className="font-medium text-amber-800 mb-1">Admin Access</h3>
            <p className="text-sm text-amber-700 mb-2">You have admin privileges.</p>
            <Link to="/dashboard/admin/invites">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-amber-100 hover:bg-amber-200 border-amber-300"
              >
                Open Admin Panel
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
