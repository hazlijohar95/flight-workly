
import { Transaction, Bid } from "@/types/job";

interface TransactionDetailsProps {
  bid: Bid;
  transaction?: Transaction;
  currency: string;
}

export default function TransactionDetails({ bid, transaction, currency }: TransactionDetailsProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">Amount</span>
        <span>{currency} {bid.fee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium">Platform Fee</span>
        <span>{currency} {transaction?.fee_amount.toFixed(2) || (bid.fee * 0.05).toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center font-bold pt-2 border-t">
        <span>Total</span>
        <span>{currency} {transaction 
          ? (bid.fee + transaction.fee_amount).toFixed(2) 
          : (bid.fee * 1.05).toFixed(2)}
        </span>
      </div>
      
      {transaction?.disbursed_at && (
        <div className="flex justify-between items-center pt-2">
          <span className="font-medium">Disbursed Date</span>
          <span>{new Date(transaction.disbursed_at).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
}
