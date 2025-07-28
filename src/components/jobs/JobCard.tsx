
import { formatDistance } from "date-fns";
import { Clock, DollarSign, Tag, MapPin, Eye, MessageSquare, Calendar, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { JOB_CATEGORIES } from "@/constants/jobCategories";
import { Job } from "@/types/job";
import { Link } from "react-router-dom";

interface JobCardProps {
  job: Job;
  showActions?: boolean;
  isOwner?: boolean; 
}

export function JobCard({ job, showActions = true, isOwner = false }: JobCardProps): JSX.Element {
  const categoryInfo = JOB_CATEGORIES.find(c => c.value === job.category);
  const categoryLabel = categoryInfo?.label || job.category;
  
  // Calculate time left until bidding ends
  const biddingEndsAt = new Date(job.bidding_end_time);
  const timeLeft = formatDistance(biddingEndsAt, new Date(), { addSuffix: true });
  const isUrgent = biddingEndsAt.getTime() - new Date().getTime() < 6 * 3600 * 1000; // 6 hours
  const isExpiringSoon = biddingEndsAt.getTime() - new Date().getTime() < 24 * 3600 * 1000; // 24 hours
  
  // Format currency
  const formattedBudget = `${job.currency} ${job.budget.toFixed(2)}`;
  
  // Determine status color and styling
  const getStatusConfig = (status: string): { color: string; text: string; bg: string; border: string } => {
    switch (status) {
      case 'open':
        return { color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' };
      case 'bidding':
        return { color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
      case 'in_progress':
        return { color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' };
      case 'complete':
        return { color: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' };
      default:
        return { color: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' };
    }
  };
  
  const statusConfig = getStatusConfig(job.status);
  
  // Format deadline date
  const deadline = new Date(job.deadline);
  const formattedDeadline = deadline.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  // Mock data for enhanced display
  const mockData = {
    bids: Math.floor(Math.random() * 20) + 1,
    views: Math.floor(Math.random() * 100) + 10,
    rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
    location: 'Remote' // Default location since Job interface doesn't have location property
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 border-0 shadow-lg group">
      {/* Status indicator bar */}
      <div className={`h-1 ${statusConfig.color} w-full`}></div>
      
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-lg font-bold line-clamp-2 text-gray-900 group-hover:text-[#FF4081] transition-colors duration-200">
            {job.title}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} font-medium`}
          >
            {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace('_', ' ')}
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
          <div className="flex items-center">
            <Tag className="h-3 w-3 mr-1 text-[#FF4081]" />
            <span className="font-medium">{categoryLabel}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{mockData.location}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        {job.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {job.description}
          </p>
        )}
        
        {/* Budget and Deadline */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-lg">
            <DollarSign className="h-4 w-4 text-green-600 mr-2" />
            <span className="font-bold text-green-700">{formattedBudget}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-2" />
            <span className={`text-sm font-medium ${isUrgent ? 'text-red-600' : 'text-gray-700'}`}>
              Due {formattedDeadline}
            </span>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <MessageSquare className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm font-medium text-gray-700">{mockData.bids}</span>
            </div>
            <span className="text-xs text-gray-500">Bids</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Eye className="h-4 w-4 text-purple-500 mr-1" />
              <span className="text-sm font-medium text-gray-700">{mockData.views}</span>
            </div>
            <span className="text-xs text-gray-500">Views</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium text-gray-700">{mockData.rating}</span>
            </div>
            <span className="text-xs text-gray-500">Rating</span>
          </div>
        </div>
        
        {/* Urgency Badge */}
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={`text-xs font-medium ${
              isUrgent 
                ? 'bg-red-50 text-red-800 border-red-200 animate-pulse' 
                : isExpiringSoon
                ? 'bg-orange-50 text-orange-800 border-orange-200'
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}
          >
            {isUrgent ? '🔥 Urgent' : isExpiringSoon ? '⏰ Expiring Soon' : 'Bidding ends'} {timeLeft}
          </Badge>
          
          {isUrgent && (
            <div className="flex items-center text-red-600 text-xs font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              High Priority
            </div>
          )}
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="bg-gradient-to-r from-gray-50 to-gray-100 pt-4 border-t border-gray-200">
          <div className="w-full flex justify-between items-center">
            {isOwner ? (
              <Link to={`/dashboard/jobs/${job.id}`} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full bg-white hover:bg-gray-50 border-gray-300 hover:border-[#FF4081] text-gray-700 hover:text-[#FF4081] transition-all duration-200"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </Link>
            ) : (
              <Link to={`/dashboard/jobs/${job.id}`} className="w-full">
                <Button 
                  className="w-full bg-gradient-to-r from-[#FF4081] to-[#E91E63] hover:from-[#E91E63] hover:to-[#C2185B] text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Submit Bid
                </Button>
              </Link>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
