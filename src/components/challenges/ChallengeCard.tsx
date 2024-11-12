import { Book } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import BookCard from "@/components/BookCard";
import { useState } from "react";
import { searchBooks } from "@/lib/googleBooks";

interface ChallengeCardProps {
  challenge: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    targetBooks: number;
    books: Book[];
  };
  onAddBook: (book: Book) => void;
  onBookClick: (bookId: string) => void;
}

export function ChallengeCard({
  challenge,
  onAddBook,
  onBookClick,
}: ChallengeCardProps) {
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      setIsSearching(true);
      try {
        const results = await searchBooks(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching books:", error);
      }
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="border border-rose-100 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">{challenge.name}</h2>
          <p className="text-gray-600">
            {new Date(challenge.startDate).toLocaleDateString()} -{" "}
            {new Date(challenge.endDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            Progress: {challenge.books.length} / {challenge.targetBooks} books
          </p>
        </div>
        <div className="w-32 h-32 relative">
          <div
            className="w-full h-full rounded-full border-4 border-stone-500"
            style={{
              background: `conic-gradient(#4F46E5 ${
                (challenge.books.length / challenge.targetBooks) * 360
              }deg, transparent 0deg)`,
            }}
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-semibold">
            {Math.round((challenge.books.length / challenge.targetBooks) * 100)}
            %
          </div>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Add Book to Challenge</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Book to {challenge.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search for a book..."
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Button>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {isSearching && <div>Searching...</div>}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {searchResults.map((book) => (
                <div
                  key={book.id}
                  onClick={() => onAddBook(book)}
                  className="cursor-pointer"
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {challenge.books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => onBookClick(book.id)}
          />
        ))}
      </div>
    </div>
  );
}
