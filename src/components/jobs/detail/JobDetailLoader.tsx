
import DashboardLayout from "@/components/DashboardLayout";

interface JobDetailLoaderProps {
  isLoading: boolean;
  error: unknown;
}

export default function JobDetailLoader({ isLoading, error }: JobDetailLoaderProps) {
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Loading job details...</div>
      </DashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-500 py-8">
          Error loading job details. Please try again.
        </div>
      </DashboardLayout>
    );
  }
  
  return null;
}
