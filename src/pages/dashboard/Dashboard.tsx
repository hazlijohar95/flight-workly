
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import useRequireAuth from "@/hooks/useRequireAuth";
import DashboardLayout from "@/components/DashboardLayout";

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
            This is your private beta dashboard. You're accessing early features!
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Dashboard cards would go here */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium text-lg mb-2">Your Profile</h3>
            <p className="text-sm text-gray-500 mb-4">Complete your profile to get started</p>
            <Button variant="outline" size="sm">Edit Profile</Button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium text-lg mb-2">Post a Job</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first job posting</p>
            <Button variant="outline" size="sm">Get Started</Button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium text-lg mb-2">Find Freelancers</h3>
            <p className="text-sm text-gray-500 mb-4">Browse skilled professionals</p>
            <Button variant="outline" size="sm">Explore</Button>
          </div>
        </div>
        
        {isAdmin && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
            <h3 className="font-medium text-amber-800 mb-1">Admin Access</h3>
            <p className="text-sm text-amber-700 mb-2">You have admin privileges.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-amber-100 hover:bg-amber-200 border-amber-300"
            >
              Open Admin Panel
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
