import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Book } from "@/lib/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface Challenge {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  targetBooks: number;
  books: Book[];
}

interface CreateChallengeData {
  name: string;
  startDate: string;
  endDate: string;
  targetBooks: number;
}

export const useChallenges = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ["challenges", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: challengesData, error: challengesError } = await supabase
        .from("reading_challenges")
        .select(`
          id,
          name,
          start_date,
          end_date,
          target_books,
          challenge_books (
            book_id,
            title,
            author,
            cover_url,
            average_rating
          )
        `)
        .eq("user_id", user.id);

      if (challengesError) {
        console.error("Error fetching challenges:", challengesError);
        throw challengesError;
      }

      return challengesData.map((challenge) => ({
        id: challenge.id,
        name: challenge.name,
        startDate: challenge.start_date,
        endDate: challenge.end_date,
        targetBooks: challenge.target_books,
        books: (challenge.challenge_books || []).map((book) => ({
          id: book.book_id,
          title: book.title,
          author: book.author,
          coverUrl: book.cover_url,
          averageRating: book.average_rating,
          description: "", // Default empty values for required Book properties
          publishedDate: "",
          isbn: ""
        })),
      }));
    },
    enabled: !!user,
  });

  const createChallenge = useMutation({
    mutationFn: async (data: CreateChallengeData) => {
      if (!user) throw new Error("User not authenticated");

      const { data: challenge, error } = await supabase
        .from("reading_challenges")
        .insert([{
          user_id: user.id,
          name: data.name,
          start_date: data.startDate,
          end_date: data.endDate,
          target_books: data.targetBooks,
        }])
        .select()
        .single();

      if (error) throw error;
      return challenge;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      toast({
        title: "Success",
        description: "Challenge created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating challenge:", error);
      toast({
        title: "Error",
        description: "Failed to create challenge",
        variant: "destructive",
      });
    },
  });

  const addBookToChallenge = useMutation({
    mutationFn: async ({ challengeId, book }: { challengeId: string; book: Book }) => {
      const { error } = await supabase
        .from("challenge_books")
        .insert([{
          challenge_id: challengeId,
          book_id: book.id,
          title: book.title,
          author: book.author,
          cover_url: book.coverUrl,
          average_rating: book.averageRating
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      toast({
        title: "Success",
        description: "Book added to challenge successfully",
      });
    },
    onError: (error) => {
      console.error("Error adding book to challenge:", error);
      toast({
        title: "Error",
        description: "Failed to add book to challenge",
        variant: "destructive",
      });
    },
  });

  return {
    challenges,
    isLoading,
    createChallenge,
    addBookToChallenge,
  };
};