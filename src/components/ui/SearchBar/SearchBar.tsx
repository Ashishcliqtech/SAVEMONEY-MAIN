import { useState } from 'react';
import { FiSearch, FiLoader } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useSearch } from '../../../hooks/useSearch';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { data, isLoading, isError } = useSearch(query);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    // We add a small delay here to allow the user to click on a search result
    // before the dropdown disappears.
    setTimeout(() => setIsFocused(false), 200);
  };

  return (
    <div className="relative w-full max-w-lg" onFocus={handleFocus} onBlur={handleBlur}>
      <div className="flex items-center bg-white rounded-md shadow-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.targe.value)}
          placeholder="Search for stores, categories, and offers..."
          className="w-full px-4 py-2 text-gray-700 rounded-l-md focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-primary-500 rounded-r-md hover:bg-primary-600"
        >
          {isLoading ? <FiLoader className="animate-spin" /> : <FiSearch />}
        </button>
      </div>

      {isFocused && query && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg max-h-96 overflow-y-auto">
          {isError && <p className="p-4 text-red-500">Could not fetch results.</p>}
          {data && (
            <ul>
              {data.stores.map((store) => (
                <li key={store.id}>
                  <Link to={`/stores/${store.slug}`} className="block px-4 py-2 hover:bg-gray-100">
                    {store.name}
                  </Link>
                </li>
              ))}
              {data.categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/categories/${category.slug}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              {data.offers.map((offer) => (
                <li key={offer.id}>
                  <Link to={`/offers/${offer.id}`} className="block px-4 py-2 hover:bg-gray-100">
                    {offer.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {data && !data.stores.length && !data.categories.length && !data.offers.length && (
            <p className="p-4">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
}