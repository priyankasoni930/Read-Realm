import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import BookGrid from "@/components/BookGrid";
import { searchBooks } from "@/lib/googleBooks";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: books, isLoading } = useQuery({
    queryKey: ["books", searchQuery],
    queryFn: () =>
      searchQuery ? searchBooks(searchQuery) : Promise.resolve([]),
    enabled: searchQuery.length > 0,
  });

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      const updatedSearches = [query, ...recentSearches.slice(0, 4)];
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    }
  };

  const removeRecentSearch = (searchToRemove: string) => {
    const updatedSearches = recentSearches.filter(
      (search) => search !== searchToRemove
    );
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  return (
    <div className="bg-bookCharcoal text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} />

        {recentSearches.length > 0 && !searchQuery && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-black rounded-full px-4 py-2"
                >
                  <span
                    className="cursor-pointer"
                    onClick={() => handleSearch(search)}
                  >
                    {search}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full"
                    onClick={() => removeRecentSearch(search)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isLoading && <div className="text-center mt-8">Loading...</div>}

      {books && books.length > 0 && (
        <div className="mt-8">
          <BookGrid books={books} />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
