
import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  showClearButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search...", 
  className = "",
  debounceMs = 300,
  showClearButton = true,
  size = 'md'
}: SearchBarProps): JSX.Element {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  // Debounced search
  const debouncedSearch = useCallback(
    (searchQuery: string): void => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        onSearch(searchQuery);
        setTimeout(() => setIsSearching(false), 500);
      }
    },
    [onSearch]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, debouncedSearch]);

  const handleClear = (): void => {
    setQuery("");
    onSearch("");
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative group">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${iconSizes[size]} group-focus-within:text-[#FF4081] transition-colors duration-200`} />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`pl-10 pr-10 ${sizeClasses[size]} w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4081] focus:border-transparent transition-all duration-200 hover:border-gray-400 group-hover:shadow-sm`}
        />
        
        {showClearButton && query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-gray-100"
          >
            <X className={`${iconSizes[size]} text-gray-400 hover:text-gray-600`} />
          </Button>
        )}
        
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#FF4081] border-t-transparent"></div>
          </div>
        )}
      </div>
    </form>
  );
}
