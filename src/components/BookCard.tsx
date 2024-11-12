import { Card } from "@/components/ui/card";
import StarRating from "./StarRating";
import { Book } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

const BookCard = ({ book, onClick }: BookCardProps) => {
  const { data: averageRating = 0 } = useQuery({
    queryKey: ['bookRating', book.id],
    queryFn: async () => {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('bookID', book.id);

      if (error) throw error;

      if (!reviews || reviews.length === 0) return 0;

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      return Number((totalRating / reviews.length).toFixed(1));
    },
  });

  return (
    <Card
      className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white"
      onClick={onClick}
    >
      <div className="relative pt-[150%]">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-bookCharcoal line-clamp-2">{book.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{book.author}</p>
        <div className="mt-2">
          <StarRating rating={averageRating} readonly />
        </div>
      </div>
    </Card>
  );
};

export default BookCard;