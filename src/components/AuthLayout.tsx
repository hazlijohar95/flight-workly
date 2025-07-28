
import { Outlet, Link } from "react-router-dom";
import Logo from "./Logo";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#FF4081]/10 to-[#E91E63]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[#FF4081]/10 to-[#E91E63]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/" className="group">
            <Logo showTagline={true} size="lg" />
          </Link>
        </div>

        {/* Back to home link */}
        <div className="flex justify-center mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#FF4081] transition-colors duration-200 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to home
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-white/20">
          <Outlet />
        </div>
      </div>

      {/* Footer text */}
      <div className="relative z-10 mt-8 text-center">
        <p className="text-sm text-gray-500">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-[#FF4081] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-[#FF4081] hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
