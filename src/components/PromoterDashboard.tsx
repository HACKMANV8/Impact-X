import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  LayoutDashboard, 
  MessageSquare, 
  DollarSign, 
  User,
  Sparkles,
  TrendingUp,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Instagram
} from "lucide-react";
import { mockRequests } from "./data/requests";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PromoterDashboardProps {
  onNavigate: (view: 'landing' | 'creator' | 'promoter' | 'admin') => void;
}

export default function PromoterDashboard({ onNavigate }: PromoterDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const earningsData = [
    { month: 'May', earnings: 2400, deals: 8 },
    { month: 'Jun', earnings: 3200, deals: 11 },
    { month: 'Jul', earnings: 3800, deals: 13 },
    { month: 'Aug', earnings: 4500, deals: 15 },
    { month: 'Sep', earnings: 5200, deals: 18 },
    { month: 'Oct', earnings: 6100, deals: 21 }
  ];

  const totalEarnings = earningsData.reduce((sum, item) => sum + item.earnings, 0);
  const totalDeals = earningsData.reduce((sum, item) => sum + item.deals, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => onNavigate('landing')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl">GoViral Promoter</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <MessageSquare className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white">
              MP
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/60 backdrop-blur-md border-r border-gray-200 min-h-[calc(100vh-73px)] p-6">
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'requests', label: 'Promotion Requests', icon: MessageSquare },
              { id: 'earnings', label: 'Earnings', icon: DollarSign },
              { id: 'pricing', label: 'AI Smart Pricing', icon: Sparkles },
              { id: 'profile', label: 'Profile Setup', icon: User }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's your promoter overview.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Pending Requests', value: '2', icon: MessageSquare, gradient: 'from-orange-500 to-pink-500' },
                  { label: 'Total Earnings', value: '₹25,200', icon: DollarSign, gradient: 'from-pink-500 to-purple-500' },
                  { label: 'This Month', value: '₹6,100', icon: TrendingUp, gradient: 'from-purple-500 to-indigo-500' },
                  { label: 'Completed Deals', value: '86', icon: CheckCircle, gradient: 'from-indigo-500 to-blue-500' }
                ].map((stat, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardDescription>{stat.label}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl">{stat.value}</div>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Earnings Chart */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                  <CardDescription>Monthly revenue and completed deals</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="earnings" stroke="#f97316" strokeWidth={3} />
                      <Line yAxisId="right" type="monotone" dataKey="deals" stroke="#ec4899" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Profile Summary */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-pink-50">
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Current promoter statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl mb-1">350K</div>
                      <div className="text-sm text-gray-600">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-1">18K</div>
                      <div className="text-sm text-gray-600">Avg Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl text-green-600 mb-1">5.2%</div>
                      <div className="text-sm text-gray-600">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-1">Lifestyle</div>
                      <div className="text-sm text-gray-600">Niche</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl mb-2">Promotion Requests</h1>
                <p className="text-gray-600">Review and respond to collaboration offers</p>
              </div>

              <div className="space-y-4">
                {mockRequests.map((request) => (
                  <Card key={request.id} className={`border-0 shadow-lg transition-all ${
                    request.status === 'pending' 
                      ? 'bg-white/80 backdrop-blur-sm' 
                      : 'bg-gray-50/80 backdrop-blur-sm opacity-70'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl">{request.brandName}</h3>
                            <Badge className={
                              request.status === 'accepted' ? 'bg-green-100 text-green-700' :
                              request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-orange-100 text-orange-700'
                            }>
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-1">{request.creatorName}</p>
                          <p className="text-gray-500 text-sm">{request.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                            ₹{request.price}
                          </div>
                          <div className="text-sm text-gray-600">{request.contentType}</div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
                        <p className="text-sm text-gray-700">{request.message}</p>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex gap-3">
                          <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept Request
                          </Button>
                          <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl">
                            <XCircle className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                          <Button variant="outline" className="rounded-xl">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Chat
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl mb-2">Earnings Dashboard</h1>
                <p className="text-gray-600">Track your revenue and performance</p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-pink-50">
                  <CardHeader>
                    <CardDescription>Total Earnings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      ₹{totalEarnings.toLocaleString()}
                    </div>
                    <p className="text-sm text-green-600">+24% from last period</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-purple-50">
                  <CardHeader>
                    <CardDescription>Average Per Deal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      ₹{Math.round(totalEarnings / totalDeals)}
                    </div>
                    <p className="text-sm text-gray-600">Based on {totalDeals} deals</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
                  <CardHeader>
                    <CardDescription>This Month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                      ₹6,100
                    </div>
                    <p className="text-sm text-green-600">21 completed deals</p>
                  </CardContent>
                </Card>
              </div>

              {/* Earnings Graph */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Monthly Revenue Growth</CardTitle>
                  <CardDescription>Track your earnings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="earnings" stroke="#f97316" strokeWidth={4} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl mb-2">AI Smart Pricing</h1>
                <p className="text-gray-600">Get AI-recommended pricing for your promotions</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-pink-50">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-4">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Your AI Suggested Price</CardTitle>
                    <CardDescription>Based on your current metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <div className="text-6xl bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        ₹420
                      </div>
                      <p className="text-gray-600 mb-6">Recommended base price per post</p>
                      <div className="space-y-2 text-sm text-left bg-white/60 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price Range:</span>
                          <span className="">₹336 - ₹504</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stories (each):</span>
                          <span className="">₹168</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reels:</span>
                          <span className="">₹630</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-purple-50">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-4">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Market Insights</CardTitle>
                    <CardDescription>How you compare to similar promoters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/60 backdrop-blur-sm">
                      <div className="text-sm text-gray-600 mb-1">Your Niche Average</div>
                      <div className="text-2xl">₹385</div>
                      <p className="text-sm text-green-600 mt-1">You're above average! 🎉</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/60 backdrop-blur-sm">
                      <div className="text-sm text-gray-600 mb-1">Top 10% in Your Niche</div>
                      <div className="text-2xl">₹550+</div>
                      <p className="text-sm text-gray-600 mt-1">Increase engagement to reach this tier</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/60 backdrop-blur-sm">
                      <div className="text-sm text-gray-600 mb-1">Growth Potential</div>
                      <div className="text-2xl text-green-600">+31%</div>
                      <p className="text-sm text-gray-600 mt-1">Based on your current growth rate</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pricing Tips */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Tips to Increase Your Pricing</CardTitle>
                  <CardDescription>Maximize your earning potential</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: 'Boost Engagement', desc: 'Higher engagement rates = higher prices. Interact with your audience daily.', percent: '+20-50%' },
                      { title: 'Quality Content', desc: 'Professional photos and videos justify premium pricing.', percent: '+15-30%' },
                      { title: 'Build Portfolio', desc: 'Showcase successful past collaborations and results.', percent: '+10-25%' }
                    ].map((tip, index) => (
                      <div key={index} className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                        <div className="text-sm text-green-600 mb-1">{tip.percent}</div>
                        <h4 className="mb-2">{tip.title}</h4>
                        <p className="text-sm text-gray-600">{tip.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl mb-2">Profile Setup</h1>
                <p className="text-gray-600">Manage your promoter profile and preferences</p>
              </div>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Instagram Connection</CardTitle>
                  <CardDescription>Connect your Instagram account for automatic stats</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 text-white rounded-xl">
                    <Instagram className="w-5 h-5 mr-2" />
                    Connect Instagram Account
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center py-12 text-gray-400">
                    <User className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Additional profile settings coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
