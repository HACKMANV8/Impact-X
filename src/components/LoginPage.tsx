import { useState } from "react";
import { Mail, Lock, Sparkles, UserPlus } from "lucide-react";
import { Button } from "../components/ui/button";

interface LoginPageProps {
  onNavigate: (view: "landing" | "signup" | "dashboard") => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 via-purple-50 to-orange-50 relative overflow-hidden">
      {/* Floating gradient glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-pink-400 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-400 rounded-full blur-3xl opacity-20 animate-pulse" />

      {/* Compact login card */}
      <div className="relative z-10 w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 mx-4 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
          Welcome Back 👋
        </h2>
        <p className="text-gray-500 mt-1 mb-6 text-sm">
          Login to your GoViral account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-md shadow-md hover:shadow-lg transition-all text-sm"
          >
            Login
          </Button>
        </form>

        {/* Footer link */}
        <p className="text-gray-600 text-sm mt-5">
          Don’t have an account?{" "}
          <button
            onClick={() => onNavigate("signup")}
            className="text-pink-600 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <UserPlus className="w-4 h-4" /> Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
