
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
  payment_status?: string; // Payment status: unpaid, processing, paid, released
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
  chip_send_transaction_id?: string; // New field for CHIP Send transactions
  status: 'pending' | 'completed' | 'failed' | 'released' | 'disbursed'; // Added 'disbursed' status
  escrow_released_at?: string;
  disbursed_at?: string; // New field for disbursement timestamp
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
