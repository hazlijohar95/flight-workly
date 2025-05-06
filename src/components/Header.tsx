
import React from 'react';
import Logo from './Logo';
import { Link } from 'react-router-dom';

interface HeaderProps {
  showEarlyAdopter?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showEarlyAdopter = true }) => {
  return (
    <>
      {showEarlyAdopter && (
        <div className="bg-black text-white text-center py-2 text-xs md:text-sm">
          <span>Be an </span>
          <Link to="#" className="underline hover:text-[#FF4081] transition-colors">early adopter</Link>
          <span>. Help change how people get hired and work gets done — fast.</span>
        </div>
      )}

      <header className="container mx-auto pt-4 pb-2 px-4 md:px-6">
        <Logo showTagline={true} />
      </header>
    </>
  );
};

export default Header;
