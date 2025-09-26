import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'store' | 'offer' | 'category';
  image?: string;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  suggestions?: SearchSuggestion[];
  loading?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  onSearch,
  suggestions = [],
  loading = false,
  className = '',
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    onSearch(suggestion.title);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full min-w-0 ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowSuggestions(true)}
          placeholder={placeholder || t('home.searchPlaceholder')}
          className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
        {loading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                  index === selectedIndex ? 'bg-purple-50' : ''
                }`}
              >
                {suggestion.image && (
                  <img
                    src={suggestion.image}
                    alt={suggestion.title}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-900">{suggestion.title}</div>
                  <div className="text-sm text-gray-500 capitalize">{suggestion.type}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};