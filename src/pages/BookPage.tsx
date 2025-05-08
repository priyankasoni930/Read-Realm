import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBookById } from "@/lib/googleBooks";
import StarRating from "@/components/StarRating";
import ReviewForm from "@/components/ReviewForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { DatabaseReview } from "@/lib/types";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import ReviewsList from "@/components/ReviewList";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBooklists } from "@/hooks/useBooklists";

// Separate components to reduce file size
const BookDetails = ({ book, onAddToBooklist, booklists }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="flex justify-center">
      <img
        src={book.coverUrl}
        alt={book.title}
        className="max-w-[300px] rounded-lg shadow-md"
      />
    </div>
    <div>
      <h1 className="text-3xl font-bold text-bookCharcoal mb-2">
        {book.title}
      </h1>
      <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
      <div className="mb-4">
        <StarRating rating={book.averageRating} readonly />
      </div>
      <ScrollArea className="h-[200px] mb-6">
        <p className="text-gray-700">{book.description}</p>
      </ScrollArea>
      <div className="text-sm text-gray-600 mb-4">
        <p>Published: {book.publishedDate}</p>
        <p>ISBN: {book.isbn}</p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Add to Library</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Booklist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {booklists.length === 0 ? (
              <p>No booklists created yet. Create one in your library first.</p>
            ) : (
              booklists.map((list: any) => (
                <Button
                  key={list.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onAddToBooklist(list.id)}
                >
                  {list.name}
                </Button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
);

const BookPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: book, isLoading: isLoadingBook } = useQuery({
    queryKey: ["book", id],
    queryFn: () => fetchBookById(id!),
    enabled: !!id,
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("bookid", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DatabaseReview[];
    },
    enabled: !!id,
  });

  const { booklists, addBookToBooklist } = useBooklists();

  const handleAddToBooklist = async (booklistId: string) => {
    if (book) {
      try {
        await addBookToBooklist.mutateAsync({
          booklistId,
          book: {
            id: book.id,
            title: book.title,
            author: book.author,
            coverUrl: book.coverUrl,
            averageRating: book.averageRating,
            description: book.description,
            publishedDate: book.publishedDate,
            isbn: book.isbn,
          },
        });
      } catch (error) {
        console.error("Error adding book to booklist:", error);
      }
    }
  };

  if (isLoadingBook || isLoadingReviews) return <div>Loading...</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div className="min-h-screen bg-bookBeige py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <BookDetails
            book={book}
            onAddToBooklist={handleAddToBooklist}
            booklists={booklists}
          />

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-bookCharcoal mb-4">
              Reviews
            </h2>
            {user ? (
              <ReviewForm bookId={id!} onSubmit={() => {}} />
            ) : (
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-4">
                  Sign in to leave a review
                </h3>
                <AuthForm />
              </div>
            )}

            <div className="mt-8">
              {reviews && reviews.length > 0 ? (
                <ReviewsList reviews={reviews} />
              ) : (
                <p className="text-gray-500">
                  No reviews yet. Be the first to review this book!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPage;
