import { Button } from "./ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "./ui/card";
import {
  Sparkles, TrendingUp, Shield, Zap, Users, DollarSign,
  Instagram, Twitter, Linkedin, Mail, LogIn, UserPlus
} from "lucide-react";

// Update the interface at the top of the file
interface LandingPageProps {
  onNavigate: (view: 'landing' | 'creator' | 'promoter' | 'admin' | 'login' | 'signup' | 'dashboard') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate("landing")}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">GoViral</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a>
            <Button variant="ghost" onClick={() => onNavigate("admin")}>Admin</Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="flex items-center gap-1 text-gray-700 hover:text-pink-600"
              onClick={() => onNavigate("login")}
            >
              <LogIn className="w-4 h-4" />
              Login
            </Button>
            <Button
              className="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90"
              onClick={() => onNavigate("signup")}
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 opacity-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-full text-white text-sm mb-6">
            ✨ AI-Powered Influencer Marketing
          </div>
          <h1 className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 bg-clip-text text-transparent font-extrabold">
            GoViral – Bridge Creators & Influencers
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            AI-powered platform for smart, fair, and transparent promotions. Connect with the right influencers and grow your brand exponentially.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl"
              onClick={() => onNavigate("creator")}
            >
              Join as Creator / Brand
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-6 rounded-xl shadow-lg hover:shadow-xl"
              onClick={() => onNavigate("promoter")}
            >
              Join as Promoter
            </Button>
          </div>
        </div>
      </section>

      {/* keep all of your existing sections below exactly as they are */}
      {/* How It Works */}
      {/* Smart Features */}
      {/* Why GoViral */}
      {/* Testimonials */}
      {/* Footer */}



      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Sign up as a creator or promoter and build your professional profile with your social stats and niche.",
                icon: Users,
                gradient: "from-pink-500 to-rose-500"
              },
              {
                step: "02",
                title: "Get AI-based Pricing",
                description: "Our smart pricing engine analyzes your metrics and suggests fair, data-driven pricing for collaborations.",
                icon: Sparkles,
                gradient: "from-purple-500 to-indigo-500"
              },
              {
                step: "03",
                title: "Match & Collaborate",
                description: "Get matched with compatible partners instantly. Chat, negotiate, and start creating amazing content together.",
                icon: Zap,
                gradient: "from-orange-500 to-pink-500"
              }
            ].map((item, index) => (
              <Card key={index} className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient}`} />
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm text-gray-500 mb-2">{item.step}</div>
                  <CardTitle className="text-2xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">Smart Features</h2>
            <p className="text-xl text-gray-600">Powered by AI for better results</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-pink-50 to-purple-50 hover:shadow-2xl transition-all">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl">Smart Pricing Engine 💰</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600">
                  Our AI analyzes follower count, engagement rates, niche, and market trends to predict fair promotion costs. No more guessing or unfair pricing.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-pink-50 hover:shadow-2xl transition-all">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl">AI Matchmaking 🤝</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600">
                  Automatically connects compatible creators and promoters based on niche, audience demographics, content style, and campaign goals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why GoViral Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">Why GoViral?</h2>
            <p className="text-xl text-gray-600">The smart choice for influencer marketing</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Transparent Deals",
                description: "Clear pricing, secure payments, and honest reviews. Build trust with every collaboration.",
                color: "text-pink-500"
              },
              {
                icon: TrendingUp,
                title: "Data-Driven Pricing",
                description: "AI-powered insights ensure you're getting or charging fair market value every time.",
                color: "text-purple-500"
              },
              {
                icon: Users,
                title: "Trusted Community",
                description: "Verified profiles, rating systems, and dispute resolution keep everyone accountable.",
                color: "text-orange-500"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mx-auto mb-6 ${item.color}`}>
                  <item.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from our community</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Fashion Brand Owner",
                avatar: "SJ",
                content: "GoViral's AI pricing saved us thousands! We found the perfect influencers for our summer campaign and saw 300% ROI.",
                gradient: "from-pink-500 to-rose-500"
              },
              {
                name: "Mike Chen",
                role: "Tech Influencer",
                avatar: "MC",
                content: "As a promoter, the AI matchmaking feature connects me with brands that actually fit my audience. My engagement has never been better!",
                gradient: "from-purple-500 to-indigo-500"
              },
              {
                name: "Emma Rodriguez",
                role: "Beauty Creator",
                avatar: "ER",
                content: "Finally, a platform that values transparency! The smart pricing engine ensures I'm always charging fair rates for my work.",
                gradient: "from-orange-500 to-pink-500"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white text-lg`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{testimonial.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-pink-600 via-purple-600 to-orange-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xl">GoViral</span>
              </div>
              <p className="text-white/80">Bridge creators and influencers with AI-powered smart marketing.</p>
            </div>
            <div>
              <h4 className="mb-4">Platform</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white">For Creators</a></li>
                <li><a href="#" className="hover:text-white">For Promoters</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Features</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Company</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Connect</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/20 text-center text-white/80">
            <p>&copy; 2025 GoViral. All rights reserved. Built with AI-powered innovation.</p>
          </div>
        </div>
      </footer>
          </div>
  );
}
