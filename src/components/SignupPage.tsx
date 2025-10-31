import { useState } from "react";
import {
  Sparkles,
  User,
  Users,
  Mail,
  Lock,
  Globe,
  Briefcase,
  Instagram,
  BarChart3,
  Activity,
  Eye,
  UserPlus,
} from "lucide-react";
import { Button } from "../components/ui/button";

interface SignupPageProps {
  onNavigate: (view: "login" | "landing") => void;
}

export default function SignupPage({ onNavigate }: SignupPageProps) {
  const [role, setRole] = useState<"creator" | "promoter">("creator");
  const [formData, setFormData] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup data:", { role, ...formData });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 via-purple-50 to-orange-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-400 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-20 animate-pulse" />

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-8 mx-4 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-semibold bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 bg-clip-text text-transparent mb-6">
          Create Your Account
        </h2>

        {/* Role Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setRole("creator")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              role === "creator"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Briefcase className="w-4 h-4 mr-2" /> Creator / Brand
          </Button>
          <Button
            onClick={() => setRole("promoter")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              role === "promoter"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Users className="w-4 h-4 mr-2" /> Promoter
          </Button>
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Common Fields */}
          <InputField icon={User} name="name" placeholder="Enter your full name" onChange={handleChange} />
          <InputField icon={Mail} name="email" placeholder="Enter your email address" onChange={handleChange} />
          <InputField icon={Lock} name="password" type="password" placeholder="Create a strong password" onChange={handleChange} />

          {role === "creator" ? (
            <>
              <InputField icon={Briefcase} name="brandName" placeholder="Your brand or company name" onChange={handleChange} />
              <InputField icon={Globe} name="website" placeholder="Your website or Instagram URL" onChange={handleChange} />
              <InputField icon={BarChart3} name="industry" placeholder="Your industry or niche" onChange={handleChange} />
            </>
          ) : (
            <>
              <InputField icon={Instagram} name="handle" placeholder="Your Instagram handle" onChange={handleChange} />
              <InputField icon={Globe} name="url" placeholder="Instagram or portfolio URL" onChange={handleChange} />
              <InputField icon={Users} name="followers" placeholder="Follower count (e.g. 250K)" onChange={handleChange} />

              {/* Insights Section */}
              <div className="grid md:grid-cols-2 gap-3">
                <InputField icon={Eye} name="views" placeholder="Average views" onChange={handleChange} />
                <InputField icon={Activity} name="interactions" placeholder="Total interactions" onChange={handleChange} />
                <InputField icon={UserPlus} name="newFollowers" placeholder="New followers gained" onChange={handleChange} />
                <InputField icon={BarChart3} name="accountsReached" placeholder="Accounts reached" onChange={handleChange} />
              </div>

              <InputField icon={Briefcase} name="niche" placeholder="Your niche (e.g. Fashion, Tech)" onChange={handleChange} />
            </>
          )}

          <Button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Sign Up
          </Button>
        </form>

        {/* Footer */}
        <p className="text-gray-600 text-sm mt-6 text-center">
          Already have an account?{" "}
          <button
            onClick={() => onNavigate("login")}
            className="text-pink-600 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

// 🔹 Reusable Input Component
function InputField({ icon: Icon, name, type = "text", placeholder, onChange }: any) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full pl-10 pr-3 py-2 h-10 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        required
      />
    </div>
  );
}
