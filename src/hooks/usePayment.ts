
import { useState, useCallback } from 'react';
import { logException, logInfo } from '@/utils/logger';
import { getFreelancerData, getAuthSession, createChipPayment, releaseChipPayment } from '@/utils/paymentUtils';

interface PaymentState {
  isLoading: boolean;
  error: string | null;
  transactionId: string | null;
}

interface PaymentData {
  amount: number;
  currency: string;
  jobId: string;
  freelancerId: string;
  description?: string;
}

export function usePayment() {
  const [state, setState] = useState<PaymentState>({
    isLoading: false,
    error: null,
    transactionId: null,
  });

  const createPayment = useCallback(async (paymentData: PaymentData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get freelancer data
      const freelancerData = await getFreelancerData(paymentData.freelancerId);
      if (!freelancerData) {
        throw new Error('Freelancer data not found');
      }

      // Get auth session
      const session = await getAuthSession();

      // Create payment
      const result = await createChipPayment(session, paymentData);
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        transactionId: result.transactionId 
      }));

      logInfo('Payment created successfully', 'usePayment', {
        transactionId: result.transactionId,
        amount: paymentData.amount,
        jobId: paymentData.jobId,
      });

      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Payment creation failed';
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));

      logException(error, 'usePayment.createPayment');
      return false;
    }
  }, []);

  const releasePayment = useCallback(async (transactionId: string, jobId: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const session = await getAuthSession();
      await releaseChipPayment(session, transactionId, jobId);

      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        transactionId: null 
      }));

      logInfo('Payment released successfully', 'usePayment', {
        transactionId,
        jobId,
      });

      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Payment release failed';
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));

      logException(error, 'usePayment.releasePayment');
      return false;
    }
  }, []);

  const resetPayment = useCallback((): void => {
    setState({
      isLoading: false,
      error: null,
      transactionId: null,
    });
  }, []);

  const getPaymentStatus = useCallback(async (transactionId: string): Promise<string | null> => {
    try {
      // TODO: Implement payment status check
      // This would typically call an API to check the payment status
      logInfo('Checking payment status', 'usePayment', { transactionId });
      return 'pending';
    } catch (error: unknown) {
      logException(error, 'usePayment.getPaymentStatus');
      return null;
    }
  }, []);

  return {
    ...state,
    createPayment,
    releasePayment,
    resetPayment,
    getPaymentStatus,
  };
}
