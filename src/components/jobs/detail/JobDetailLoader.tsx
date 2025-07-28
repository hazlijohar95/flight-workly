
interface JobDetailLoaderProps {
  isLoading: boolean;
  error: unknown;
}

export default function JobDetailLoader({ isLoading, error }: JobDetailLoaderProps): JSX.Element | null {
  if (isLoading) {
    return (
      <div className="text-center py-8">Loading job details...</div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading job details. Please try again.
      </div>
    );
  }
  
  return null;
}
