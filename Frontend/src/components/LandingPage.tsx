import { Button } from "./ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "./ui/card";
import {
  Sparkles, TrendingUp, Shield, Zap, Users, DollarSign,
  Instagram, Twitter, Linkedin, Mail, LogIn, UserPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// 🧠 Clean version using navigate (no need for onNavigate prop)
export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreatorJoin = () => {
    if (user) navigate("/creator");
    else navigate("/signup");
  };

  const handlePromoterJoin = () => {
    if (user) navigate("/promoter");
    else navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
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
            <Button variant="ghost" onClick={() => navigate("/admin")}>Admin</Button>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 text-gray-700 hover:text-pink-600"
                  onClick={() => navigate(user?.brandName ? "/creator" : "/promoter")}
                >
                  <Users className="w-4 h-4" />
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 text-gray-700 hover:text-pink-600"
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
                <Button
                  className="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90"
                  onClick={() => navigate("/signup")}
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
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
              onClick={handleCreatorJoin}
            >
              Join as Creator / Brand
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-6 rounded-xl shadow-lg hover:shadow-xl"
              onClick={handlePromoterJoin}
            >
              Join as Promoter
            </Button>
          </div>
        </div>
      </section>

      {/* The rest of your existing sections stay the same */}
      {/* How It Works / Features / Why GoViral / Testimonials / Footer */}

      {/* KEEP ALL YOUR EXISTING CONTENT BELOW UNCHANGED */}
      {/* ... (your existing sections go here exactly as before) ... */}
    </div>
  );
}
