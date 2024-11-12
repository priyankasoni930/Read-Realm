import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Bookshelf from "@/components/Bookshelf";
import { ProfileHeader } from "@/components/profile/ProfileHeaderForUserProfile";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: followStats } = useQuery({
    queryKey: ["followStats", id],
    queryFn: async () => {
      const { data: followers, count: followersCount } = await supabase
        .from("follows")
        .select(
          `
          follower_id,
          profiles:follower_id (
            username,
            avatar_url
          )
        `,
          { count: "exact" }
        )
        .eq("following_id", id);

      const { data: following, count: followingCount } = await supabase
        .from("follows")
        .select(
          `
          following_id,
          profiles:following_id (
            username,
            avatar_url
          )
        `,
          { count: "exact" }
        )
        .eq("follower_id", id);

      return {
        followers: followers || [],
        followersCount: followersCount || 0,
        following: following || [],
        followingCount: followingCount || 0,
      };
    },
  });

  const { data: readingLists = [], isLoading: isReadingListsLoading } =
    useQuery({
      queryKey: ["readingLists", id],
      queryFn: async () => {
        console.log("Fetching reading lists for user:", id);

        // Use a policy that allows reading public booklists
        const { data: lists, error } = await supabase
          .from("booklists")
          .select(
            `
          id,
          name,
          user_id,
          booklist_books (
            book_id,
            title,
            author,
            cover_url,
            average_rating
          )
        `
          )
          .eq("user_id", id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching reading lists:", error);
          throw error;
        }

        console.log("Fetched lists:", lists);

        const mappedLists = lists.map((list: any) => ({
          id: list.id,
          name: list.name,
          books:
            list.booklist_books?.map((book: any) => ({
              id: book.book_id,
              title: book.title,
              author: book.author,
              coverUrl: book.cover_url,
              averageRating: book.average_rating,
              description: "",
              publishedDate: "",
              isbn: "",
            })) || [],
        }));

        console.log("Mapped lists:", mappedLists);
        return mappedLists;
      },
      enabled: !!id,
    });

  if (isProfileLoading || isReadingListsLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!profile) return <div>User not found</div>;

  return (
    <div className="bg-indigo-50 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <ProfileHeader profile={profile} followStats={followStats} />

        <div className="mt-8 space-y-8 bg-indigo-50">
          {readingLists.length > 0 ? (
            readingLists.map((list) => (
              <Card key={list.id} className="p-6 bg-indigo-50">
                <h2 className="text-2xl font-semibold mb-4">{list.name}</h2>

                {list.books.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 bg-indigo-50 gap-4">
                    {list.books.map((book) => (
                      <div
                        key={book.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/book/${book.id}`)}
                      >
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-48 object-cover rounded-md shadow-md hover:shadow-lg transition-shadow"
                        />
                        <h3 className="mt-2 text-sm font-medium line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600">{book.author}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No books in this list yet
                  </p>
                )}
              </Card>
            ))
          ) : (
            <Card className="p-6">
              <p className="text-gray-500 text-center">
                No booklists created yet
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
