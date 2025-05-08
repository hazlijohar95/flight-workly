
export interface Job {
  id: string;
  title: string;
  category: string;
  description: string | null;
  budget: number;
  currency: string;
  deadline: string;
  bidding_end_time: string;
  status: 'open' | 'bidding' | 'in_progress' | 'complete';
  payment_status?: string; // New field
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Bid {
  id: string;
  job_id: string;
  user_id: string;
  fee: number;
  time_estimate: number;
  portfolio_url: string | null;
  note: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  job_id: string;
  bid_id: string;
  amount: number;
  fee_amount: number;
  currency: string;
  payer_id: string;
  payee_id: string;
  payment_method_id?: string;
  chip_transaction_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'released';
  escrow_released_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  provider: string;
  payment_method_id: string;
  last_four?: string;
  card_type?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}
