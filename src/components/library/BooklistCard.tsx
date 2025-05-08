import { Book } from "@/lib/types";
import BookCard from "@/components/BookCard";
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
import { useState } from "react";
import { searchBooks } from "@/lib/googleBooks";

interface BooklistCardProps {
  name: string;
  booklistId: string;
  books: Book[];
  onBookClick: (bookId: string) => void;
  onAddBook: (booklistId: string, book: Book) => void;
}

const BooklistCard = ({
  name,
  booklistId,
  books,
  onBookClick,
  onAddBook,
}: BooklistCardProps) => {
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleAddBook = (book: Book) => {
    onAddBook(booklistId, book);
    setDialogOpen(false);
  };

  return (
    <div className="border border-purple-100 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">{name}</h2>
          <p className="text-gray-600 mb-4">{books.length} books</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Book to Library</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add Book to {name}</DialogTitle>
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
                    onClick={() => handleAddBook(book)}
                    className="cursor-pointer"
                  >
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => onBookClick(book.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default BooklistCard;
