import BookCard from "./BookCard";
import { Book } from "@/lib/types";
import { useNavigate } from "react-router-dom";

interface BookGridProps {
  books: Book[];
}

const BookGrid = ({ books }: BookGridProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onClick={() => navigate(`/book/${book.id}`)}
        />
      ))}
    </div>
  );
};

export default BookGrid;