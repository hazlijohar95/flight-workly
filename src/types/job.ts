
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
