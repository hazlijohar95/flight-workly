
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import BidForm from "@/components/jobs/BidForm";
import { Job } from "@/types/job";

interface BidFormContainerProps {
  job: Job;
  onBidSubmitted: () => void;
}

export default function BidFormContainer({ job, onBidSubmitted }: BidFormContainerProps): JSX.Element {
  return (
    <Card className="mt-6">
      <CardHeader>
        <h2 className="text-xl font-semibold">Submit Your Bid</h2>
      </CardHeader>
      <CardContent>
        <BidForm job={job} onBidSubmitted={onBidSubmitted} />
      </CardContent>
    </Card>
  );
}
