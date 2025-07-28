
import { Transaction, Bid } from "@/types/job";

interface TransactionDetailsProps {
  bid: Bid;
  transaction?: Transaction;
  currency: string;
  compact?: boolean;
}

export default function TransactionDetails({ bid, transaction, currency, compact = false }: TransactionDetailsProps): JSX.Element {
  // For milestone payments, we use the transaction amount instead of the bid amount
  const amount = transaction ? Number(transaction.amount) : Number(bid.fee);
  const feeAmount = transaction ? Number(transaction.fee_amount) : (amount * 0.05);
  const totalAmount = amount + feeAmount;
  
  if (compact) {
    return (
      <div className="text-xs border-t pt-2 space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Platform Fee:</span>
          <span>{currency} {feeAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center font-medium">
          <span>Total:</span>
          <span>{currency} {totalAmount.toFixed(2)}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">Amount</span>
        <span>{currency} {amount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium">Platform Fee</span>
        <span>{currency} {feeAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center font-bold pt-2 border-t">
        <span>Total</span>
        <span>{currency} {totalAmount.toFixed(2)}</span>
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
