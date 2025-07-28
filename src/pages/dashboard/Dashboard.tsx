import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Briefcase, Clock, CheckCircle, TrendingUp, DollarSign, Users, Calendar, ArrowRight, Eye, MessageSquare, Star } from "lucide-react";

export default function Dashboard(): JSX.Element {
  // Mock data - in real app, this would come from API
  const stats = {
    activeJobs: 3,
    inProgress: 2,
    completed: 8,
    totalEarnings: 2450,
    totalSpent: 1800,
    activeBids: 12,
    profileViews: 45
  };

  const recentJobs = [
    {
      id: 1,
      title: "Website Redesign",
      status: "In Progress",
      budget: 500,
      bids: 8,
      daysLeft: 3
    },
    {
      id: 2,
      title: "Logo Design",
      status: "Active",
      budget: 200,
      bids: 15,
      daysLeft: 7
    },
    {
      id: 3,
      title: "Mobile App Development",
      status: "Completed",
      budget: 1500,
      bids: 12,
      daysLeft: 0
    }
  ];

  const quickActions = [
    {
      title: "Post New Job",
      description: "Create a new job posting",
      icon: Plus,
      href: "/dashboard/jobs/new",
      color: "from-[#FF4081] to-[#E91E63]"
    },
    {
      title: "View All Jobs",
      description: "Manage your job postings",
      icon: Briefcase,
      href: "/dashboard/jobs",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Update Profile",
      description: "Keep your profile current",
      icon: Users,
      href: "/dashboard/profile",
      color: "from-green-500 to-green-600"
    },
    {
      title: "View Analytics",
      description: "Track your performance",
      icon: TrendingUp,
      href: "/dashboard/analytics",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <Link to="/dashboard/jobs/new">
          <Button className="bg-gradient-to-r from-[#FF4081] to-[#E91E63] hover:from-[#E91E63] hover:to-[#C2185B] text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Jobs</CardTitle>
            <div className="p-2 bg-gradient-to-r from-[#FF4081]/10 to-[#E91E63]/10 rounded-lg">
              <Briefcase className="h-4 w-4 text-[#FF4081]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.activeJobs}</div>
            <p className="text-xs text-gray-500 mt-1">
              Jobs you've posted
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            <div className="p-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg">
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.inProgress}</div>
            <p className="text-xs text-gray-500 mt-1">
              Currently being worked on
            </p>
            <div className="flex items-center mt-2">
              <Calendar className="h-3 w-3 text-blue-500 mr-1" />
              <span className="text-xs text-blue-500">Avg. 5 days to complete</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            <div className="p-2 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.completed}</div>
            <p className="text-xs text-gray-500 mt-1">
              Successfully completed
            </p>
            <div className="flex items-center mt-2">
              <Star className="h-3 w-3 text-yellow-500 mr-1" />
              <span className="text-xs text-yellow-500">4.8/5 avg. rating</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
            <div className="p-2 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg">
              <DollarSign className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">${stats.totalSpent}</div>
            <p className="text-xs text-gray-500 mt-1">
              This month
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+8% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Jobs */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-[#FF4081]" />
              Recent Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'Active' ? 'bg-green-100 text-green-700' :
                          job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {job.status}
                        </span>
                        <span>${job.budget}</span>
                        <span>{job.bids} bids</span>
                      </div>
                    </div>
                    <Link to={`/dashboard/jobs/${job.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
                <Link to="/dashboard/jobs" className="block">
                  <Button variant="outline" className="w-full">
                    View All Jobs
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No jobs posted yet.</p>
                <Link to="/dashboard/jobs/new">
                  <Button className="bg-gradient-to-r from-[#FF4081] to-[#E91E63] hover:from-[#E91E63] hover:to-[#C2185B] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your First Job
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-[#FF4081]" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.href}>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 group">
                    <div className={`p-2 bg-gradient-to-r ${action.color} rounded-lg mr-4 group-hover:shadow-lg transition-shadow duration-200`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{action.title}</h4>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#FF4081] transition-colors duration-200" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Bids</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeBids}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg">
                <MessageSquare className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.profileViews}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 rounded-lg">
                <Eye className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
