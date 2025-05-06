import React, { useState } from 'react';
interface SearchBarProps {
  placeholder: string;
  label?: string;
}
const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  label
}) => {
  const [isFocused, setIsFocused] = useState(false);
  return <div className="relative w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100">
      {label && <label className="block text-left mb-2 text-lg font-medium text-gray-800">
          {label}
        </label>}
      <div className={`relative flex flex-col md:flex-row items-center gap-2 md:gap-0 transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
        <input type="text" placeholder={placeholder} className="w-full px-5 py-4 rounded-full md:rounded-l-full md:rounded-r-none text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF4081] pr-14 transition-all duration-300 hover:shadow-md" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} />
        <button className="w-full md:w-auto px-6 py-4 text-white font-medium rounded-full md:rounded-l-none md:rounded-r-full transition-all duration-300 transform hover:scale-105 whitespace-nowrap shadow-md bg-[#121212]">
          Post job & get offers instantly
        </button>
      </div>
    </div>;
};
export default SearchBar;