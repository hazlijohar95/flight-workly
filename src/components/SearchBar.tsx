
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface SearchBarProps {
  placeholder: string;
  label?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, label }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {label && (
        <label className="block text-left mb-2 text-lg font-medium text-gray-800">
          {label}
        </label>
      )}
      <div className={`relative flex items-center transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
        <input
          type="text"
          placeholder={placeholder}
          className="w-full px-5 py-4 rounded-l-full text-gray-800 border border-r-0 border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary pr-14 transition-all duration-300 hover:shadow-md"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button className="px-6 py-4 bg-[#4CAF50] text-white font-medium rounded-r-full hover:bg-[#3d9040] transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
          Post job & get offers instantly
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
