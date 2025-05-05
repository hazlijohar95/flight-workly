
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SearchBarProps {
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder }) => {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full px-5 py-4 rounded-full text-gray-800 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary pr-14"
        />
        <button className="absolute right-1 flex items-center justify-center w-12 h-12 text-white bg-black rounded-full">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
