
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SearchBarProps {
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full px-4 py-3 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button className="absolute right-0 flex items-center justify-center w-12 h-12 text-white bg-black rounded-full mr-1">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
