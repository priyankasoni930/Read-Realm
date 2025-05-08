import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./StarRating";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ReviewFormProps {
  bookId: string;
  onSubmit: (rating: number, content: string) => void;
}

const ReviewForm = ({ bookId, onSubmit }: ReviewFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get existing review if it exists
  const { data: existingReview } = useQuery({
    queryKey: ["userReview", user?.id, bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", user?.id)
        .eq("bookid", bookId);

      if (error) throw error;
      return data?.[0] || null;
    },
    enabled: !!user && !!bookId,
  });

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  // Update form if existingReview is loaded
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 0);
      setContent(existingReview.content || "");
    }
  }, [existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to leave a review",
        variant: "destructive",
      });
      return;
    }

    try {
      const reviewData = {
        user_id: user.id,
        bookid: bookId,
        rating,
        content,
        created_at: new Date().toISOString(),
      };

      let error;

      if (existingReview) {
        // Update existing review
        const { error: updateError } = await supabase
          .from("reviews")
          .update(reviewData)
          .eq("user_id", user.id)
          .eq("bookid", bookId);
        error = updateError;
      } else {
        // Create new review
        const { error: insertError } = await supabase
          .from("reviews")
          .insert([reviewData]);
        error = insertError;
      }

      if (error) throw error;

      onSubmit(rating, content);

      // Clear form after successful submission
      if (!existingReview) {
        setRating(0);
        setContent("");
      }

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ["reviews", bookId] });
      queryClient.invalidateQueries({
        queryKey: ["userReview", user.id, bookId],
      });

      toast({
        title: existingReview ? "Review updated" : "Review submitted",
        description: existingReview
          ? "Your review has been updated!"
          : "Thank you for your review!",
      });
    } catch (error) {
      console.error("Review submission error:", error);
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-bookCharcoal mb-2">
          Your Rating
        </label>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>
      <div>
        <label className="block text-sm font-medium text-bookCharcoal mb-2">
          Your Review
        </label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your review here..."
          className="w-full min-h-[100px] max-w-2xl"
        />
      </div>
      <Button
        type="submit"
        className="bg-bookBrown hover:bg-bookBurgundy text-white"
        disabled={rating === 0 || !content.trim()}
      >
        {existingReview ? "Update Review" : "Submit Review"}
      </Button>
    </form>
  );
};

export default ReviewForm;
