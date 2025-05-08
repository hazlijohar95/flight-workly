
import React from 'react';
import Logo from './Logo';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  showEarlyAdopter?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showEarlyAdopter = false }) => {
  const { user } = useAuth();

  return (
    <>
      {/* Early adopter banner removed */}
      
      <header className="container mx-auto pt-4 pb-2 px-4 md:px-6 flex justify-between items-center">
        <Logo showTagline={true} />
        <nav className="flex items-center gap-4">
          {user ? (
            <Link 
              to="/dashboard" 
              className="px-4 py-2 bg-[#121212] hover:bg-black hover:shadow-md text-white rounded-md transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                to="/auth/login" 
                className="text-gray-700 hover:text-[#FF4081] transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/auth/signup" 
                className="px-4 py-2 bg-[#121212] hover:bg-black hover:shadow-md text-white rounded-md transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
