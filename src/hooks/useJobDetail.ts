
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logException, logInfo } from '@/utils/logger';
import type { Job, Bid } from '@/types/job';

interface JobDetailData {
  job: Job | null;
  bids: Bid[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  updateJob: (updates: Partial<Job>) => Promise<void>;
  deleteJob: () => Promise<void>;
}

export function useJobDetail(jobId: string): JobDetailData {
  const queryClient = useQueryClient();

  // Fetch job details
  const {
    data: job,
    isLoading: isLoadingJob,
    error: jobError,
    refetch: refetchJob
  } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async (): Promise<Job | null> => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        logException(error, 'useJobDetail.fetchJob');
        throw error;
      }

      return data as Job;
    },
    enabled: !!jobId,
  });

  // Fetch bids for the job
  const {
    data: bids = [],
    isLoading: isLoadingBids,
    error: bidsError,
    refetch: refetchBids
  } = useQuery({
    queryKey: ['job-bids', jobId],
    queryFn: async (): Promise<Bid[]> => {
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (error) {
        logException(error, 'useJobDetail.fetchBids');
        throw error;
      }

      return data as Bid[];
    },
    enabled: !!jobId,
  });

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: async (updates: Partial<Job>): Promise<void> => {
      if (!jobId) {throw new Error('Job ID is required');}

      const { error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', jobId);

      if (error) {
        logException(error, 'useJobDetail.updateJob');
        throw error;
      }
    },
    onSuccess: () => {
      logInfo('Job updated successfully', 'useJobDetail');
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
    },
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      if (!jobId) {throw new Error('Job ID is required');}

      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) {
        logException(error, 'useJobDetail.deleteJob');
        throw error;
      }
    },
    onSuccess: () => {
      logInfo('Job deleted successfully', 'useJobDetail');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const updateJob = async (updates: Partial<Job>): Promise<void> => {
    await updateJobMutation.mutateAsync(updates);
  };

  const deleteJob = async (): Promise<void> => {
    await deleteJobMutation.mutateAsync();
  };

  const refetch = (): void => {
    refetchJob();
    refetchBids();
  };

  return {
    job: job || null,
    bids,
    isLoading: isLoadingJob || isLoadingBids,
    error: (jobError || bidsError) as Error | null,
    refetch,
    updateJob,
    deleteJob,
  };
}
