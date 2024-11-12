import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Book } from "@/lib/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface Booklist {
  id: string;
  name: string;
  books: Book[];
}

export const useBooklists = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: booklists = [], isLoading } = useQuery({
    queryKey: ["booklists", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: booklistsData, error: booklistsError } = await supabase
        .from("booklists")
        .select(`
          id,
          name,
          booklist_books (
            book_id,
            title,
            author,
            cover_url,
            average_rating
          )
        `)
        .eq("user_id", user.id);

      if (booklistsError) {
        console.error("Error fetching booklists:", booklistsError);
        throw booklistsError;
      }

      return booklistsData.map((list: any) => ({
        id: list.id,
        name: list.name,
        books: list.booklist_books?.map((book: any) => ({
          id: book.book_id,
          title: book.title,
          author: book.author,
          coverUrl: book.cover_url,
          averageRating: book.average_rating,
          description: "", // Default values for required Book properties
          publishedDate: "",
          isbn: ""
        })) || [],
      }));
    },
    enabled: !!user,
  });

  const createBooklist = useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("booklists")
        .insert([{ name, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booklists"] });
      toast({
        title: "Success",
        description: "Booklist created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating booklist:", error);
      toast({
        title: "Error",
        description: "Failed to create booklist",
        variant: "destructive",
      });
    },
  });

  const addBookToBooklist = useMutation({
    mutationFn: async ({ booklistId, book }: { booklistId: string; book: Book }) => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("booklist_books")
        .insert([{
          booklist_id: booklistId,
          book_id: book.id,
          title: book.title,
          author: book.author,
          cover_url: book.coverUrl,
          average_rating: book.averageRating
        }]);

      if (error) {
        console.error("Error adding book to booklist:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booklists"] });
      toast({
        title: "Success",
        description: "Book added to booklist successfully",
      });
    },
    onError: (error) => {
      console.error("Error adding book to booklist:", error);
      toast({
        title: "Error",
        description: "Failed to add book to booklist",
        variant: "destructive",
      });
    },
  });

  return {
    booklists,
    isLoading,
    createBooklist,
    addBookToBooklist,
  };
};