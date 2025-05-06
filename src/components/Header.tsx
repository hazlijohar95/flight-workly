
import React from 'react';
import Logo from './Logo';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  showEarlyAdopter?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showEarlyAdopter = true }) => {
  const { user } = useAuth();

  return (
    <>
      {showEarlyAdopter && (
        <div className="bg-black text-white text-center py-2 text-xs md:text-sm">
          <span>Be an </span>
          <Link to="/waitlist" className="underline hover:text-[#FF4081] transition-colors">early adopter</Link>
          <span>. Help change how people get hired and work gets done — fast.</span>
        </div>
      )}

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
                to="/waitlist" 
                className="px-4 py-2 bg-[#121212] hover:bg-black hover:shadow-md text-white rounded-md transition-colors"
              >
                Join Waitlist
              </Link>
            </>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
