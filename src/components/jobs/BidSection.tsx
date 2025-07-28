
import { useAuth } from "@/context/AuthContext";
import BidForm from "./BidForm";
import BidList from "./BidList";
import type { Job, Bid } from "@/types/job";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Award, Clock, DollarSign, TrendingUp } from "lucide-react";

interface BidSectionProps {
  job: Job;
  bids: Bid[];
  onBidSubmitted?: () => void;
  onBidAccepted?: () => void;
}

export default function BidSection({ job, bids, onBidSubmitted, onBidAccepted }: BidSectionProps): JSX.Element {
  const { user } = useAuth();
  const isJobOwner = user?.id === job.user_id;
  const hasUserBid = bids.some(bid => bid.user_id === user?.id);
  const userBid = bids.find(bid => bid.user_id === user?.id);

  // Calculate bid statistics
  const bidStats = {
    total: bids.length,
    avgBid: bids.length > 0 ? (bids.reduce((sum, bid) => sum + bid.fee, 0) / bids.length).toFixed(2) : '0',
    lowestBid: bids.length > 0 ? Math.min(...bids.map(bid => bid.fee)).toFixed(2) : '0',
    highestBid: bids.length > 0 ? Math.max(...bids.map(bid => bid.fee)).toFixed(2) : '0'
  };

  return (
    <div className="space-y-6">
      {/* Bid Statistics */}
      {bids.length > 0 && (
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              <MessageSquare className="h-5 w-5 mr-2 text-[#FF4081]" />
              Bid Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <Users className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-lg font-bold text-blue-700">{bidStats.total}</span>
                </div>
                <span className="text-xs text-blue-600">Total Bids</span>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-lg font-bold text-green-700">${bidStats.avgBid}</span>
                </div>
                <span className="text-xs text-green-600">Avg. Bid</span>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-lg font-bold text-purple-700">${bidStats.lowestBid}</span>
                </div>
                <span className="text-xs text-purple-600">Lowest</span>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <Award className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-lg font-bold text-orange-700">${bidStats.highestBid}</span>
                </div>
                <span className="text-xs text-orange-600">Highest</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Bid Form for Freelancers */}
      {!isJobOwner && !hasUserBid && (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex items-center text-lg">
              <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
              Submit Your Bid
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <BidForm job={job} onBidSubmitted={onBidSubmitted} />
          </CardContent>
        </Card>
      )}

      {/* User's Existing Bid */}
      {!isJobOwner && hasUserBid && userBid && (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center text-lg">
              <Award className="h-5 w-5 mr-2 text-blue-600" />
              Your Bid
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-xl font-bold text-blue-800">${userBid.fee}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${
                    userBid.status === 'accepted' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : userBid.status === 'rejected'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}
                >
                  {userBid.status.charAt(0).toUpperCase() + userBid.status.slice(1)}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Time Estimate:</span>
                  <span className="font-medium ml-2">{userBid.time_estimate} hours</span>
                </div>
                <div>
                  <span className="text-gray-600">Submitted:</span>
                  <span className="font-medium ml-2">
                    {new Date(userBid.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {userBid.note && (
                <div className="mt-3">
                  <span className="text-gray-600 text-sm">Note:</span>
                  <p className="text-gray-800 mt-1">{userBid.note}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bid List for Job Owners */}
      {isJobOwner && bids.length > 0 && (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="flex items-center text-lg">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Received Bids ({bids.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <BidList bids={bids} jobId={job.id} onBidAccepted={onBidAccepted} />
          </CardContent>
        </Card>
      )}

      {/* Empty States */}
      {!isJobOwner && !hasUserBid && bids.length === 0 && (
        <Card className="shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bids Yet</h3>
            <p className="text-gray-600 mb-4">Be the first to submit a bid and increase your chances of getting hired!</p>
            <Button 
              className="bg-gradient-to-r from-[#FF4081] to-[#E91E63] hover:from-[#E91E63] hover:to-[#C2185B] text-white"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Submit Your Bid
            </Button>
          </CardContent>
        </Card>
      )}

      {isJobOwner && bids.length === 0 && (
        <Card className="shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Waiting for Bids</h3>
            <p className="text-gray-600 mb-4">Your job is live and visible to freelancers. Bids will appear here once submitted.</p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>Bidding ends in {Math.floor(Math.random() * 24) + 1} hours</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
