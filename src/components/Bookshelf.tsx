import { Book } from "@/lib/types";
import BookCard from "./BookCard";

interface BookshelfProps {
  title: string;
  books: Book[];
  onBookClick: (bookId: string) => void;
}

const Bookshelf = ({ title, books, onBookClick }: BookshelfProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-bookCharcoal mb-4">{title}</h2>
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

export default Bookshelf;