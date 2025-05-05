
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface SearchBarProps {
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className={`relative flex items-center transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
        <input
          type="text"
          placeholder={placeholder}
          className="w-full px-5 py-4 rounded-full text-gray-800 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary pr-14 transition-all duration-300 hover:shadow-md"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button className="absolute right-1 flex items-center justify-center w-12 h-12 text-white bg-black rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
