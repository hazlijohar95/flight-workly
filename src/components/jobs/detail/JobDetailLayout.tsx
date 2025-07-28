
import { Job, Bid, Transaction } from "@/types/job";
import JobHeader from "@/components/jobs/JobHeader";
import JobStatusSection from "@/components/jobs/JobStatusSection";
import BidSection from "@/components/jobs/BidSection";
import WorkflowSection from "@/components/jobs/WorkflowSection";
import PaymentInfoSection from "@/components/jobs/PaymentInfoSection";
import MilestoneSection from "@/components/jobs/MilestoneSection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Users, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

interface JobDetailLayoutProps {
  job: Job;
  bids: Bid[] | undefined;
  isLoadingBids: boolean;
  bidsError: unknown;
  acceptedBid: Bid | null;
  transaction: Transaction | undefined;
  categoryLabel: string;
  isOwner: boolean;
  isFreelancer: boolean;
  canBid: boolean;
  hasBid: boolean;
  showBidForm: boolean;
  onShowBidForm: () => void;
  onBidSubmit: () => void;
  onBidAccepted: () => void;
  onWorkflowUpdate: () => void;
  onPaymentComplete: () => void;
  onJobUpdate: () => void;
}

export default function JobDetailLayout({
  job,
  bids,
  isLoadingBids: _isLoadingBids,
  bidsError: _bidsError,
  acceptedBid,
  transaction,
  categoryLabel,
  isOwner,
  isFreelancer,
  canBid,
  hasBid,
  showBidForm,
  onShowBidForm,
  onBidSubmit,
  onBidAccepted,
  onWorkflowUpdate,
  onPaymentComplete,
  onJobUpdate
}: JobDetailLayoutProps): JSX.Element {
  // Mock data for enhanced display
  const jobStats = {
    views: Math.floor(Math.random() * 200) + 50,
    bids: bids?.length || 0,
    avgBid: bids && bids.length > 0 
      ? (bids.reduce((sum, bid) => sum + bid.fee, 0) / bids.length).toFixed(2)
      : job.budget.toFixed(2),
    timeLeft: Math.floor(Math.random() * 24) + 1
  };

  const getStatusConfig = (status: string): { color: string; text: string; bg: string; border: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> } => {
    switch (status) {
      case 'open':
        return { color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle };
      case 'bidding':
        return { color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: TrendingUp };
      case 'in_progress':
        return { color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Clock };
      case 'complete':
        return { color: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', icon: CheckCircle };
      default:
        return { color: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', icon: AlertCircle };
    }
  };

  const statusConfig = getStatusConfig(job.status);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Job Overview Card */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <div className={`h-2 ${statusConfig.color} w-full`}></div>
        <CardContent className="p-8">
          <JobHeader
            job={job}
            isOwner={isOwner}
            isFreelancer={isFreelancer}
            canBid={canBid}
            hasBid={hasBid}
            showBidForm={showBidForm}
            onShowBidForm={onShowBidForm}
          />
        </CardContent>
      </Card>

      {/* Job Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{jobStats.views}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bids</p>
                <p className="text-2xl font-bold text-gray-900">{jobStats.bids}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Bid</p>
                <p className="text-2xl font-bold text-gray-900">${jobStats.avgBid}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Left</p>
                <p className="text-2xl font-bold text-gray-900">{jobStats.timeLeft}h</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Status Section */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <JobStatusSection job={job} categoryLabel={categoryLabel} />
            </CardContent>
          </Card>
          
          {/* Workflow Section */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <WorkflowSection 
                job={job} 
                bid={acceptedBid} 
                onStatusUpdate={onWorkflowUpdate} 
              />
            </CardContent>
          </Card>
          
          {/* Milestone Section */}
          {(isOwner || (acceptedBid && isFreelancer && job.uses_milestones)) && (
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <MilestoneSection
                  job={job}
                  isOwner={isOwner}
                  onUpdateJob={onJobUpdate}
                />
              </CardContent>
            </Card>
          )}
          
          {/* Payment Info Section */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <PaymentInfoSection 
                job={job} 
                bid={acceptedBid} 
                transaction={transaction} 
                isOwner={isOwner}
                isFreelancer={isFreelancer}
                onPaymentComplete={onPaymentComplete}
              />
            </CardContent>
          </Card>
          
          {/* Bid Form for Freelancers */}
          {isFreelancer && showBidForm && (
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <BidSection
                  job={job}
                  bids={[]}
                  onBidSubmitted={onBidSubmit}
                  onBidAccepted={onBidAccepted}
                />
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Job Status Badge */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <Badge 
                  variant="outline" 
                  className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} font-medium text-base px-4 py-2`}
                >
                  <statusConfig.icon className="h-4 w-4 mr-2" />
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace('_', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Bids Section for Job Owners */}
          {isOwner && (
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <BidSection
                  job={job}
                  bids={bids || []}
                  onBidSubmitted={onBidSubmit}
                  onBidAccepted={onBidAccepted}
                />
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {isOwner && job.status === 'open' && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Tip:</strong> Review bids carefully and check freelancer profiles before accepting.
                    </p>
                  </div>
                )}
                {isFreelancer && canBid && !hasBid && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Ready to bid?</strong> Make sure your proposal stands out from the competition.
                    </p>
                  </div>
                )}
                {acceptedBid && (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Work in progress:</strong> Stay in touch with your freelancer for updates.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
