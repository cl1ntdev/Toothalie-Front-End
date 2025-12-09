import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle 
} from "lucide-react";

// API Imports
import LoginAuth from "@/API/LoginAuth";
import { UserLoginInfoClass } from "@/Classes/UserLogin";
import { authenticateUser } from "@/API/AuthenticateUser";

export default function ToothalieAdmin() {
  const navigate = useNavigate();

  // Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null); // Clear previous errors

    try {
      console.log("Login attempt:", { username });
      
      const user = new UserLoginInfoClass(username, password);
      const result = await LoginAuth(user);

      if (!result || !result.token) {
        throw new Error("Invalid credentials");
      }

      // Success Logic
      const token = result.token;
      localStorage.setItem("userInfo", JSON.stringify({ token }));
      
      // Fetch user details
      const userDetails = await authenticateUser(token);
      localStorage.setItem("userDetails", JSON.stringify(userDetails));

      // Redirect
      navigate("/admin");

    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Incorrect username or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 font-sans p-4">
      
      {/* Main Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl w-full max-w-md overflow-hidden relative transition-all duration-300 hover:shadow-indigo-100/50">
        
        {/* Decorative Top Banner */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 w-full"></div>

        <div className="p-8 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-indigo-100 transform rotate-3 transition-transform hover:rotate-6">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 font-ceramon tracking-tight">Admin Portal</h2>
            <p className="text-slate-500 mt-2 text-sm">Sign in to manage Toothalie services</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error Message Display */}
            {errorMessage && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1" htmlFor="username">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  placeholder="Enter username"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Spacer */}
            <div className="h-2"></div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full group flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} Toothalie System. Secure Access Only.
          </p>
        </div>
      </div>
    </div>
  );
}