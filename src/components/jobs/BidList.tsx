
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, ExternalLink, DollarSign, User, Star, MessageSquare, Award, X } from "lucide-react";
import { logException } from "@/utils/logger";
import type { Bid } from "@/types/job";

interface AppError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

interface BidListProps {
  bids: Bid[];
  jobId: string;
  onBidAccepted?: () => void;
}

export default function BidList({ bids, jobId, onBidAccepted }: BidListProps): JSX.Element {
  const [loadingBidId, setLoadingBidId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAcceptBid = async (bidId: string): Promise<void> => {
    setLoadingBidId(bidId);
    
    try {
      // TODO: Implement bid acceptance logic
      // const response = await acceptBid(bidId);
      
      toast.success("Bid accepted successfully!");
      
      if (onBidAccepted) {
        onBidAccepted();
      }
    } catch (error: unknown) {
      const appError = error as AppError;
      logException(error, 'BidList.handleAcceptBid');
      toast.error(appError.message || "Failed to accept bid");
    } finally {
      setLoadingBidId(null);
    }
  };

  // Sort bids by fee (lowest first) and status
  const sortedBids = [...bids].sort((a, b) => {
    if (a.status === 'accepted') {
      return -1;
    }
    if (b.status === 'accepted') {
      return 1;
    }
    return a.fee - b.fee;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Bids ({bids.length})</h3>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Award className="h-3 w-3 mr-1" />
          Sorted by price
        </Badge>
      </div>
      
      {sortedBids.map((bid, index) => (
        <Card key={bid.id} className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${
          bid.status === 'accepted' ? 'ring-2 ring-green-200 bg-green-50/30' : 
          bid.status === 'rejected' ? 'ring-2 ring-red-200 bg-red-50/30' : 
          'hover:ring-2 hover:ring-blue-200'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#FF4081] to-[#E91E63] rounded-full flex items-center justify-center text-white font-semibold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Freelancer Bid</h4>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(bid.created_at).toLocaleDateString()} at {new Date(bid.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {bid.status === 'accepted' && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Check className="h-3 w-3 mr-1" /> Accepted
                  </Badge>
                )}
                
                {bid.status === 'rejected' && (
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    <X className="h-3 w-3 mr-1" /> Rejected
                  </Badge>
                )}
                
                {bid.status === 'pending' && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Pending Review
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-600 font-medium">Fee</span>
                </div>
                <p className="text-xl font-bold text-green-700">${bid.fee.toFixed(2)}</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <Clock className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-600 font-medium">Time Estimate</span>
                </div>
                <p className="text-xl font-bold text-blue-700">
                  {bid.time_estimate} hour{bid.time_estimate !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <Star className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-sm text-purple-600 font-medium">Hourly Rate</span>
                </div>
                <p className="text-xl font-bold text-purple-700">
                  ${(bid.fee / bid.time_estimate).toFixed(2)}/hr
                </p>
              </div>
            </div>
            
            {bid.note && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Proposal Note</span>
                </div>
                <p className="text-gray-800 leading-relaxed">{bid.note}</p>
              </div>
            )}
            
            {bid.portfolio_url && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-700">Portfolio</span>
                  </div>
                  <a 
                    href={bid.portfolio_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200"
                  >
                    View Portfolio
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              {bid.status === 'pending' && (
                <Button 
                  onClick={() => handleAcceptBid(bid.id)} 
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={!!loadingBidId}
                >
                  {loadingBidId === bid.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Accept Bid
                    </>
                  )}
                </Button>
              )}
              
              {bid.status === 'accepted' && (
                <Button 
                  onClick={() => navigate(`/dashboard/jobs/${jobId}/chat`)}
                  variant="outline" 
                  className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Open Chat
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="px-4 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => navigate(`/dashboard/profile/${bid.user_id}`)}
              >
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {bids.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bids Yet</h3>
          <p className="text-gray-600">Bids will appear here once freelancers start submitting proposals.</p>
        </div>
      )}
    </div>
  );
}
