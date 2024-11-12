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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBooklists } from "@/hooks/useBooklists";
import { Card, CardContent } from "@/components/ui/card";

const ReviewsList = ({ reviews }: { reviews: DatabaseReview[] }) => {
  const navigate = useNavigate();

  const handleAvatarClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="max-w-2xl w-full">
          <CardContent className="p-4">
            <Avatar
              className="h-8 w-8 bg-gray-700 cursor-pointer"
              onClick={() => handleAvatarClick(String(review.user_id))}
            >
              <AvatarFallback className="bg-gray-600 text-gray-200">
                U
              </AvatarFallback>
            </Avatar>
            <StarRating rating={review.rating} readonly />
            <p className="mt-2">{review.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewsList;
