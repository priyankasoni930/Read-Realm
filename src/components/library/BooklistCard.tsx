import { Book } from "@/lib/types";
import BookCard from "@/components/BookCard";

interface BooklistCardProps {
  name: string;
  books: Book[];
  onBookClick: (bookId: string) => void;
}

const BooklistCard = ({ name, books, onBookClick }: BooklistCardProps) => {
  return (
    <div className="border border-purple-100 rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-semibold">{name}</h2>
      <p className="text-gray-600 mb-4">{books.length} books</p>
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
