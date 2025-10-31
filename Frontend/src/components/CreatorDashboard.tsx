import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  LayoutDashboard, 
  Search, 
  MessageSquare, 
  ShoppingBag, 
  User,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  ArrowLeft
} from "lucide-react";
import { Promoter, mockPromoters } from "./data/promoters";

import { mockCampaigns } from "./data/campaigns";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CreatorDashboardProps {
  onNavigate: (view: 'landing' | 'creator' | 'promoter' | 'admin') => void;
}

export default function CreatorDashboard({ onNavigate }: CreatorDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [followers, setFollowers] = useState("");
  const [avgViews, setAvgViews] = useState("");
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
const [selectedPromoter, setSelectedPromoter] = useState<Promoter | null>(null);



  const filteredPromoters = mockPromoters.filter(promoter =>
    promoter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promoter.niche.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculatePrice = () => {
    if (followers && avgViews) {
      const f = parseInt(followers.replace(/,/g, ''));
      const v = parseInt(avgViews.replace(/,/g, ''));
      const engagementRate = (v / f) * 100;
      const basePrice = (f / 1000) * 1.5;
      const engagementMultiplier = Math.max(0.8, Math.min(2.0, engagementRate / 3));
      const price = Math.round(basePrice * engagementMultiplier);
      setPredictedPrice(price);
    }
  };

  const analyticsData = [
    { month: 'May', spent: 1200, engagement: 3.8 },
    { month: 'Jun', spent: 1800, engagement: 4.2 },
    { month: 'Jul', spent: 2200, engagement: 4.5 },
    { month: 'Aug', spent: 2600, engagement: 4.8 },
    { month: 'Sep', spent: 3100, engagement: 5.2 },
    { month: 'Oct', spent: 3500, engagement: 5.6 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => onNavigate('landing')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl">GoViral Creator</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <MessageSquare className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white">
              JD
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
              { id: 'find-promoters', label: 'Find Promoters', icon: Search },
              { id: 'campaigns', label: 'My Campaigns', icon: Target },
              { id: 'pricing', label: 'Smart Pricing', icon: Sparkles },
              { id: 'messages', label: 'Messages', icon: MessageSquare },
              { id: 'profile', label: 'Profile', icon: User }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
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
                <p className="text-gray-600">Welcome back! Here's your campaign overview.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Active Campaigns', value: '3', icon: Target, gradient: 'from-pink-500 to-rose-500' },
                  { label: 'Total Spent', value: '₹1,550', icon: DollarSign, gradient: 'from-purple-500 to-indigo-500' },
                  { label: 'Avg Engagement', value: '4.8%', icon: TrendingUp, gradient: 'from-orange-500 to-pink-500' },
                  { label: 'Promoters Worked', value: '12', icon: Users, gradient: 'from-indigo-500 to-purple-500' }
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

              {/* Analytics Chart */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>Monthly spending and engagement trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="spent" stroke="#ec4899" strokeWidth={3} />
                      <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#a855f7" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Campaigns */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Campaigns</CardTitle>
                  <CardDescription>Track your ongoing promotions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCampaigns.slice(0, 3).map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex-1">
                          <h4 className="mb-1">{campaign.name}</h4>
                          <p className="text-sm text-gray-600">{campaign.promoter} • {campaign.followers} followers</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={
                            campaign.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            campaign.status === 'Posted' ? 'bg-blue-100 text-blue-700' :
                            campaign.status === 'Accepted' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'
                          }>
                            {campaign.status}
                          </Badge>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Price</div>
                            <div className="">₹{campaign.price}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'find-promoters' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl mb-2">Find Promoters</h1>
                <p className="text-gray-600">Discover the perfect influencers for your brand</p>
              </div>

              {/* Search Bar */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="Search by name or niche..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12 rounded-xl"
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white h-12 px-8 rounded-xl">
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Promoter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPromoters.map((promoter) => (
                  <Card key={promoter.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${promoter.gradient} flex items-center justify-center text-white text-lg`}>
                          {promoter.avatar}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{promoter.name}</CardTitle>
                          <CardDescription className="text-sm">{promoter.handle}</CardDescription>
                        </div>
                      </div>
                      <Badge className="w-fit">{promoter.niche}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Followers</span>
                          <span className="">{promoter.followers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Avg Views</span>
                          <span className="">{promoter.avgViews}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Engagement</span>
                          <span className="text-green-600">{promoter.engagement}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <div className="text-sm text-gray-600">GoViral Price</div>
                          <div className="text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                              ₹{promoter.price}
                          </div>
                        </div>
                       <Button
  onClick={() => {
    setSelectedPromoter(promoter);
    setActiveTab("promoter-details");
  }}
  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl"
>
  Contact
</Button>

                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl mb-2">My Campaigns</h1>
                <p className="text-gray-600">Manage your ongoing and completed promotions</p>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-white/80 backdrop-blur-sm rounded-xl p-1">
                  <TabsTrigger value="all" className="rounded-lg">All</TabsTrigger>
                  <TabsTrigger value="requested" className="rounded-lg">Requested</TabsTrigger>
                  <TabsTrigger value="active" className="rounded-lg">Active</TabsTrigger>
                  <TabsTrigger value="completed" className="rounded-lg">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="space-y-4">
                    {mockCampaigns.map((campaign) => (
                      <Card key={campaign.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl">{campaign.name}</h3>
                                <Badge className={
                                  campaign.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                  campaign.status === 'Posted' ? 'bg-blue-100 text-blue-700' :
                                  campaign.status === 'Accepted' ? 'bg-purple-100 text-purple-700' :
                                  'bg-orange-100 text-orange-700'
                                }>
                                  {campaign.status}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-3">{campaign.promoter}</p>
                              <div className="flex gap-6 text-sm">
                                <div>
                                  <span className="text-gray-600">Followers: </span>
                                  <span className="">{campaign.followers}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Engagement: </span>
                                  <span className="text-green-600">{campaign.engagement}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Date: </span>
                                  <span className="">{campaign.date}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                ₹{campaign.price}
                              </div>
                              <Button variant="outline" className="rounded-xl">View Details</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl mb-2">Smart Pricing Calculator</h1>
                <p className="text-gray-600">Get AI-powered price predictions for your campaigns</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-purple-50">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-4">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Enter Promoter Details</CardTitle>
                    <CardDescription>Input follower count and average views for AI pricing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Followers</label>
                      <Input
                        placeholder="e.g., 250000"
                        value={followers}
                        onChange={(e) => setFollowers(e.target.value)}
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Average Views</label>
                      <Input
                        placeholder="e.g., 12000"
                        value={avgViews}
                        onChange={(e) => setAvgViews(e.target.value)}
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <Button 
                      onClick={calculatePrice}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white h-12 rounded-xl"
                    >
                      Calculate Price
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-pink-50">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-4">
                      <DollarSign className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Predicted Price</CardTitle>
                    <CardDescription>AI-calculated fair market value</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {predictedPrice !== null ? (
                      <div className="text-center py-8">
                        <div className="text-6xl bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
                          ₹{predictedPrice}
                        </div>
                        <p className="text-gray-600 mb-6">Recommended price based on AI analysis</p>
                        <div className="space-y-2 text-sm text-left bg-white/60 backdrop-blur-sm rounded-xl p-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Price Range:</span>
                            <span className="">${Math.round(predictedPrice * 0.8)} - ${Math.round(predictedPrice * 1.2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Confidence:</span>
                            <span className="text-green-600">High</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Enter details to see predicted price</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Pricing Tips */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Pricing Insights</CardTitle>
                  <CardDescription>Tips for successful collaborations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: 'Engagement Matters', desc: 'Higher engagement rates can increase pricing by up to 2x' },
                      { title: 'Niche Premium', desc: 'Specialized niches often command 20-30% higher rates' },
                      { title: 'Content Quality', desc: 'Professional content creation adds significant value' }
                    ].map((tip, index) => (
                      <div key={index} className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                        <h4 className="mb-2">{tip.title}</h4>
                        <p className="text-sm text-gray-600">{tip.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl mb-2">Messages</h1>
                <p className="text-gray-600">Chat with promoters and manage conversations</p>
              </div>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>No messages yet</p>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl mb-2">Profile</h1>
                <p className="text-gray-600">Manage your account settings</p>
              </div>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center py-12 text-gray-400">
                    <User className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Profile settings coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {activeTab === 'promoter-details' && selectedPromoter && (
  <div className="space-y-6">
    <Button
      variant="ghost"
      className="flex items-center gap-2 mb-6"
      onClick={() => setActiveTab("find-promoters")}
    >
      <ArrowLeft className="w-5 h-5" /> Back to Promoters
    </Button>

    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Section - Promoter Images */}
      <div className="lg:w-2/3 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <img
            src={selectedPromoter.image1 || "https://via.placeholder.com/400"}
            alt={selectedPromoter.name}
            className="rounded-2xl object-cover w-full h-80"
          />
          <img
            src={selectedPromoter.image2 || "https://via.placeholder.com/400"}
            alt="Sample Work"
            className="rounded-2xl object-cover w-full h-80"
          />
        </div>
      </div>

      {/* Right Section - Promoter Info */}
      <div className="lg:w-1/3 space-y-4">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedPromoter.gradient} flex items-center justify-center text-white text-xl`}
              >
                {selectedPromoter.avatar}
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{selectedPromoter.name}</h2>
                <p className="text-gray-500">{selectedPromoter.handle}</p>
                <Badge>{selectedPromoter.niche}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Followers:</span>
                <span>{selectedPromoter.followers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Views:</span>
                <span>{selectedPromoter.avgViews}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Engagement:</span>
                <span className="text-green-600">{selectedPromoter.engagement}</span>
              </div>
            </div>

            <div className="pt-6 border-t mt-4">
              <div className="text-sm text-gray-600 mb-1">GoViral Price</div>
              <div className="text-3xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                ₹{selectedPromoter.price}
              </div>
            </div>

            <Button className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl">
              Contact Promoter
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Analytics Section */}
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
        <CardDescription>Performance overview from Instagram</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { metric: 'Followers', value: parseInt(selectedPromoter.followers.replace('K', '000')) },
            { metric: 'Views', value: parseInt(selectedPromoter.avgViews.replace('K', '000')) },
            { metric: 'Engagement', value: parseFloat(selectedPromoter.engagement) * 1000 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#ec4899" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
)}

        </main>
      </div>
    </div>
  );
}
