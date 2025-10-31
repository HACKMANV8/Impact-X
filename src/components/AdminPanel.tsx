import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  Activity,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { mockTransactions, mockDisputes, monthlyRevenueData, topNiches } from "./data/adminData";

interface AdminPanelProps {
  onNavigate: (view: 'landing' | 'creator' | 'promoter' | 'admin') => void;
}

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const COLORS = ['#ec4899', '#a855f7', '#f97316', '#6366f1', '#8b5cf6'];

  const totalUsers = 1247;
  const activeCampaigns = 156;
  const totalRevenue = 284500;
  const commission = totalRevenue * 0.1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => onNavigate('landing')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl">GoViral Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-green-100 text-green-700">System Healthy</Badge>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
              AD
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/60 backdrop-blur-md border-r border-gray-200 min-h-[calc(100vh-73px)] p-6">
          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
              { id: 'analytics', label: 'Analytics', icon: Activity },
              { id: 'transactions', label: 'Transactions', icon: DollarSign }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Platform overview and key metrics</p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', value: totalUsers.toLocaleString(), icon: Users, gradient: 'from-indigo-500 to-purple-500', change: '+12%' },
                  { label: 'Active Campaigns', value: activeCampaigns, icon: Activity, gradient: 'from-purple-500 to-pink-500', change: '+8%' },
                  { label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, gradient: 'from-pink-500 to-rose-500', change: '+24%' },
                  { label: 'Commission Earned', value: `₹${(commission / 1000).toFixed(1)}K`, icon: TrendingUp, gradient: 'from-rose-500 to-orange-500', change: '+24%' }
                ].map((stat, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardDescription>{stat.label}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-3xl">{stat.value}</div>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-sm text-green-600">{stat.change} from last month</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Revenue Chart */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Platform Revenue</CardTitle>
                  <CardDescription>Monthly revenue and deal volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} />
                      <Line yAxisId="right" type="monotone" dataKey="deals" stroke="#ec4899" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Quick Stats Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
                  <CardHeader>
                    <CardTitle>User Distribution</CardTitle>
                    <CardDescription>Creators vs Promoters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Creators</span>
                          <span className="">687 (55%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full" style={{ width: '55%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Promoters</span>
                          <span className="">560 (45%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-3 rounded-full" style={{ width: '45%' }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-rose-50">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Last 24 hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { label: 'New Users', value: 23, color: 'text-indigo-600' },
                        { label: 'Campaigns Created', value: 18, color: 'text-purple-600' },
                        { label: 'Deals Completed', value: 12, color: 'text-pink-600' },
                        { label: 'Messages Sent', value: 342, color: 'text-rose-600' }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-600">{item.label}</span>
                          <span className={`text-xl ${item.color}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl mb-2">User Management</h1>
                <p className="text-gray-600">Manage platform users and accounts</p>
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
                  <CardHeader>
                    <CardDescription>Total Users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {totalUsers.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardHeader>
                    <CardDescription>Active This Month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      892
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-rose-50">
                  <CardHeader>
                    <CardDescription>New This Week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      67
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center py-12 text-gray-400">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>User management interface coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'disputes' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl mb-2">Dispute Management</h1>
                <p className="text-gray-600">Review and resolve user disputes</p>
              </div>

              {/* Dispute Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Open Disputes', value: '1', color: 'from-rose-500 to-red-500' },
                  { label: 'Investigating', value: '1', color: 'from-orange-500 to-amber-500' },
                  { label: 'Resolved This Month', value: '8', color: 'from-green-500 to-emerald-500' }
                ].map((stat, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardDescription>{stat.label}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-xl`}>
                          {stat.value}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Disputes Table */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Active Disputes</CardTitle>
                  <CardDescription>Cases requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Promoter</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDisputes.map((dispute) => (
                        <TableRow key={dispute.id}>
                          <TableCell className="">{dispute.id}</TableCell>
                          <TableCell>{dispute.date}</TableCell>
                          <TableCell>{dispute.creator}</TableCell>
                          <TableCell>{dispute.promoter}</TableCell>
                          <TableCell>₹{dispute.amount}</TableCell>
                          <TableCell className="max-w-xs truncate">{dispute.reason}</TableCell>
                          <TableCell>
                            <Badge className={
                              dispute.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                              dispute.status === 'Investigating' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }>
                              {dispute.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="rounded-lg">
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl mb-2">Platform Analytics</h1>
                <p className="text-gray-600">Deep insights into platform performance</p>
              </div>

              {/* Top Niches */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Top Niches</CardTitle>
                    <CardDescription>Most popular categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topNiches}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="niche" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="deals" fill="#a855f7" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Niche Distribution</CardTitle>
                    <CardDescription>Deal percentage by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={topNiches}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} ${percentage}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="deals"
                        >
                          {topNiches.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Average Deal Price */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                  <CardDescription>Platform performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { label: 'Avg Deal Price', value: '₹420' },
                      { label: 'Success Rate', value: '94%' },
                      { label: 'Avg Response Time', value: '2.3h' },
                      { label: 'User Satisfaction', value: '4.8/5' }
                    ].map((metric, index) => (
                      <div key={index} className="text-center">
                        <div className="text-3xl mb-1">{metric.value}</div>
                        <div className="text-sm text-gray-600">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl mb-2">Transaction Logs</h1>
                <p className="text-gray-600">Monitor all platform transactions</p>
              </div>

              {/* Transaction Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Volume', value: '₹284.5K', icon: DollarSign },
                  { label: 'Transactions', value: '487', icon: Activity },
                  { label: 'Avg Transaction', value: '₹584', icon: TrendingUp },
                  { label: 'Commission', value: '₹28.4K', icon: Sparkles }
                ].map((stat, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardDescription>{stat.label}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl">{stat.value}</div>
                        <stat.icon className="w-8 h-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Transactions Table */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest platform transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="">{transaction.id}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.user}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{transaction.userType}</Badge>
                          </TableCell>
                          <TableCell>₹{transaction.amount}</TableCell>
                          <TableCell className="text-green-600">₹{transaction.commission}</TableCell>
                          <TableCell>
                            <Badge className={
                              transaction.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              transaction.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-700'
                            }>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
