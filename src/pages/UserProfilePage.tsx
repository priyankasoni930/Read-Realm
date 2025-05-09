import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BookOpen, ChevronRight, Users, X, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useFollowUser } from "@/hooks/useFollowUser";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Interface for the reading list component
interface ReadingListProps {
  title: string;
  description: string;
  count: number;
  books: {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    rating: number;
  }[];
  theme: ThemeConfig;
}

// Interface for review data structure
interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  books: {
    id: string;
    title: string;
    author: string;
    cover_url: string;
  };
}

// User follow dialog component
interface UserListDialogProps {
  title: string;
  userList: {
    follower_id?: string;
    following_id?: string;
    profiles:
      | {
          username: string;
          avatar_url: string;
        }
      | Array<{
          username: string;
          avatar_url: string;
        }>;
  }[];
  theme?: ThemeConfig;
}

function UserListDialog({ title, userList, theme }: UserListDialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Debug the structure
  console.log(`${title} data:`, userList);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={`text-center cursor-pointer hover:${
            theme?.accent || "bg-pink-50"
          } rounded-lg p-2 transition-colors`}
        >
          <div className="flex items-center justify-center gap-1">
            <Users
              size={16}
              className={theme?.subheadingText || "text-pink-500"}
            />
            <span
              className={`font-semibold ${
                theme?.headingText || "text-pink-900"
              }`}
            >
              {userList.length}
            </span>
          </div>
          <p className="text-xs text-gray-500">{title}</p>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {title} ({userList.length})
          </DialogTitle>
          <p className="text-center text-sm text-gray-500">
            {title === "Followers"
              ? "People who follow this user"
              : "People this user follows"}
          </p>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto px-1 py-4">
          {userList.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No {title.toLowerCase()} yet
            </div>
          ) : (
            <div className="space-y-4">
              {userList.map((user, index) => {
                // Get the correct ID depending on if it's a follower or following list
                const userId =
                  title === "Followers" ? user.follower_id : user.following_id;
                const userProfile = user.profiles;

                console.log(`User ${index}:`, { userId, userProfile });

                // Handle both single profiles and profile arrays
                const profileData = Array.isArray(userProfile)
                  ? userProfile[0]
                  : userProfile;
                const username = profileData?.username || "Unknown";
                const avatarUrl = profileData?.avatar_url || "/placeholder.svg";

                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (userId) {
                        // Fix the route to match the app's structure - use /profile instead of /user
                        navigate(`/profile/${userId}`);
                        setOpen(false);
                      }
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg hover:${
                      theme?.accent || "bg-pink-50"
                    } cursor-pointer transition-colors`}
                  >
                    <Avatar
                      className={`h-10 w-10 ${
                        theme?.border || "border-pink-100"
                      } border`}
                    >
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback
                        className={`${theme?.accent || "bg-pink-100"} ${
                          theme?.headingText || "text-pink-800"
                        }`}
                      >
                        {username.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div
                        className={`font-medium ${
                          theme?.headingText || "text-pink-900"
                        }`}
                      >
                        @{username}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Reading list component
function ReadingList({
  title,
  description,
  count,
  books,
  theme,
}: ReadingListProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  // Initial display shows only 4 books, expanded view shows all
  const displayedBooks = expanded ? books : books.slice(0, 4);

  return (
    <Card
      className={`${theme.border} overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white`}
    >
      <CardContent className="p-0">
        <div
          className={`p-5 bg-gradient-to-r ${theme.cardGradient} relative overflow-hidden`}
        >
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "15px 15px",
              }}
            ></div>
          </div>

          <div className="flex justify-between items-start relative z-10">
            <div>
              <h3 className={`text-xl font-bold ${theme.headingText}`}>
                {title}
              </h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <Badge
              variant="outline"
              className={`${theme.badge} backdrop-blur-sm px-3 py-1 rounded-full`}
            >
              {count} books
            </Badge>
          </div>
        </div>

        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-5">
          {displayedBooks.map((book, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              onClick={() => navigate(`/book/${book.id}`)}
            >
              <div className="space-y-3">
                <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 relative">
                  <img
                    src={book.coverUrl || "/placeholder.svg"}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  {book.rating > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1.5 px-2 flex items-center justify-center">
                      {"★".repeat(book.rating)}
                      {"☆".repeat(5 - book.rating)}
                    </div>
                  )}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    style={{
                      background: `linear-gradient(to top, rgba(var(--theme-color), 0.2), transparent)`,
                    }}
                  ></div>
                </div>
                <div>
                  <h4
                    className={`text-sm font-medium text-gray-900 line-clamp-1 group-hover:${theme.subheadingText} transition-colors`}
                  >
                    {book.title}
                  </h4>
                  <p className="text-xs text-gray-500">{book.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {books.length > 4 && (
          <div
            className={`p-3 bg-gradient-to-r ${theme.footerGradient} border-t ${theme.border}`}
          >
            <button
              onClick={() => setExpanded(!expanded)}
              className={`text-sm ${theme.linkText} font-medium flex justify-center items-center w-full`}
            >
              {expanded ? (
                <>
                  Show less
                  <ChevronRight className="h-4 w-4 ml-1 rotate-90" />
                </>
              ) : (
                <>
                  View all {count} books
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Type for profile theme
type ProfileTheme =
  | "pink"
  | "lavender"
  | "mint"
  | "sunset"
  | "ocean"
  | "galaxy";

// Theme configuration type
interface ThemeConfig {
  header: string;
  badge: string;
  button: string;
  accent: string;
  mainBackground: string;
  headingText: string;
  subheadingText: string;
  border: string;
  cardGradient: string;
  footerGradient: string;
  linkText: string;
  separator: string;
}

// Theme configuration
const themeConfig: Record<ProfileTheme, ThemeConfig> = {
  pink: {
    header: "from-pink-300 via-purple-200 to-pink-200",
    badge: "border-pink-200 text-pink-700 bg-white/50",
    button:
      "from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600",
    accent: "bg-pink-100",
    mainBackground: "from-pink-50 to-white",
    headingText: "text-pink-900",
    subheadingText: "text-pink-700",
    border: "border-pink-100",
    cardGradient: "from-pink-100 to-purple-50",
    footerGradient: "from-pink-50 to-purple-50",
    linkText: "text-pink-600 hover:text-pink-800",
    separator: "border-pink-200",
  },
  lavender: {
    header: "from-indigo-200 via-purple-200 to-indigo-100",
    badge: "border-indigo-200 text-indigo-700 bg-white/50",
    button:
      "from-indigo-500 to-purple-400 hover:from-indigo-600 hover:to-purple-500",
    accent: "bg-indigo-100",
    mainBackground: "from-indigo-50 to-white",
    headingText: "text-indigo-900",
    subheadingText: "text-indigo-700",
    border: "border-indigo-100",
    cardGradient: "from-indigo-100 to-purple-50",
    footerGradient: "from-indigo-50 to-purple-50",
    linkText: "text-indigo-600 hover:text-indigo-800",
    separator: "border-indigo-200",
  },
  mint: {
    header: "from-emerald-200 via-teal-100 to-emerald-100",
    badge: "border-emerald-200 text-emerald-700 bg-white/50",
    button:
      "from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500",
    accent: "bg-emerald-100",
    mainBackground: "from-emerald-50 to-white",
    headingText: "text-emerald-900",
    subheadingText: "text-emerald-700",
    border: "border-emerald-100",
    cardGradient: "from-emerald-100 to-teal-50",
    footerGradient: "from-emerald-50 to-teal-50",
    linkText: "text-emerald-600 hover:text-emerald-800",
    separator: "border-emerald-200",
  },
  sunset: {
    header: "from-orange-200 via-amber-100 to-rose-100",
    badge: "border-amber-200 text-amber-700 bg-white/50",
    button: "from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600",
    accent: "bg-amber-100",
    mainBackground: "from-amber-50 to-white",
    headingText: "text-amber-900",
    subheadingText: "text-amber-700",
    border: "border-amber-100",
    cardGradient: "from-amber-100 to-rose-50",
    footerGradient: "from-amber-50 to-rose-50",
    linkText: "text-amber-600 hover:text-amber-800",
    separator: "border-amber-200",
  },
  ocean: {
    header: "from-sky-200 via-cyan-100 to-blue-100",
    badge: "border-sky-200 text-sky-700 bg-white/50",
    button: "from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600",
    accent: "bg-sky-100",
    mainBackground: "from-sky-50 to-white",
    headingText: "text-sky-900",
    subheadingText: "text-sky-700",
    border: "border-sky-100",
    cardGradient: "from-sky-100 to-blue-50",
    footerGradient: "from-sky-50 to-cyan-50",
    linkText: "text-sky-600 hover:text-sky-800",
    separator: "border-sky-200",
  },
  galaxy: {
    header: "from-violet-300 via-purple-200 to-fuchsia-200",
    badge: "border-violet-200 text-violet-700 bg-white/50",
    button:
      "from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600",
    accent: "bg-violet-100",
    mainBackground: "from-violet-50 to-white",
    headingText: "text-violet-900",
    subheadingText: "text-violet-700",
    border: "border-violet-100",
    cardGradient: "from-violet-100 to-fuchsia-50",
    footerGradient: "from-violet-50 to-fuchsia-50",
    linkText: "text-violet-600 hover:text-violet-800",
    separator: "border-violet-200",
  },
};

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { isFollowing, toggleFollow } = useFollowUser(id || "");
  const queryClient = useQueryClient();

  // Initialize theme from localStorage or use pink as default
  const [selectedTheme, setSelectedTheme] = useState<ProfileTheme>(() => {
    // Try to get saved theme from localStorage
    const savedTheme = localStorage.getItem("userPreferredTheme");
    // Check if the saved theme is a valid ProfileTheme
    return savedTheme && Object.keys(themeConfig).includes(savedTheme)
      ? (savedTheme as ProfileTheme)
      : "pink";
  });

  // Current theme config
  const theme = themeConfig[selectedTheme];

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Set the theme from profile data if profile owner is viewing their own profile
      // Otherwise, keep the viewer's preferred theme
      if (currentUser && currentUser.id === id && data?.theme) {
        setSelectedTheme(data.theme as ProfileTheme);
      }

      return data;
    },
  });

  // Mutation to update the theme
  const updateTheme = useMutation({
    mutationFn: async (newTheme: ProfileTheme) => {
      // Save theme preference to localStorage for all profile pages
      localStorage.setItem("userPreferredTheme", newTheme);

      // Only update in database if viewing own profile
      if (currentUser && currentUser.id === id) {
        const { error } = await supabase
          .from("profiles")
          .update({ theme: newTheme })
          .eq("id", id);

        if (error) throw error;
      }

      return newTheme;
    },
    onSuccess: () => {
      // Only invalidate the query if updating own profile
      if (currentUser && currentUser.id === id) {
        queryClient.invalidateQueries({ queryKey: ["profile", id] });
      }
    },
  });

  // Handler for theme change
  const handleThemeChange = (newTheme: ProfileTheme) => {
    setSelectedTheme(newTheme);
    updateTheme.mutate(newTheme);
  };

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

      console.log("Followers data:", followers);
      console.log("Following data:", following);

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

        return lists.map((list) => ({
          id: list.id,
          name: list.name,
          description: list.name, // Use name as description for now
          books:
            list.booklist_books?.map((book) => ({
              id: book.book_id,
              title: book.title,
              author: book.author,
              coverUrl: book.cover_url,
              rating: Math.round(book.average_rating || 0),
            })) || [],
        }));
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

  // User display name - prefer full name, fall back to username
  const displayName = profile.full_name || profile.username;
  const username = profile.username;

  // Check if current user is viewing their own profile
  const isOwnProfile = currentUser && currentUser.id === id;

  return (
    <div
      className={`container mx-auto px-4 py-8 max-w-full bg-gradient-to-b ${theme.mainBackground} min-h-screen overflow-x-hidden`}
    >
      {/* Decorative elements */}
      <div
        className={`absolute top-0 right-0 w-64 h-64 ${theme.accent} rounded-full opacity-30 -translate-y-1/2 translate-x-1/2 blur-3xl`}
      ></div>
      <div
        className={`absolute bottom-0 left-0 w-96 h-96 ${theme.accent} rounded-full opacity-30 translate-y-1/2 -translate-x-1/2 blur-3xl`}
      ></div>

      {/* Profile header */}
      <div
        className={`w-full h-60 rounded-2xl max-w-5xl mx-auto bg-gradient-to-r ${theme.header} relative shadow-lg`}
      >
        {/* Decorative patterns */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute bottom-10 left-0 w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        {/* Theme selector - only visible to profile owner */}
        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleThemeChange("pink")}
                  className="cursor-pointer"
                >
                  <div className="w-4 h-4 rounded-full bg-pink-400 mr-2"></div>
                  Pink Theme
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleThemeChange("lavender")}
                  className="cursor-pointer"
                >
                  <div className="w-4 h-4 rounded-full bg-indigo-400 mr-2"></div>
                  Lavender Theme
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleThemeChange("mint")}
                  className="cursor-pointer"
                >
                  <div className="w-4 h-4 rounded-full bg-emerald-400 mr-2"></div>
                  Mint Theme
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleThemeChange("sunset")}
                  className="cursor-pointer"
                >
                  <div className="w-4 h-4 rounded-full bg-amber-400 mr-2"></div>
                  Sunset Theme
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleThemeChange("ocean")}
                  className="cursor-pointer"
                >
                  <div className="w-4 h-4 rounded-full bg-sky-400 mr-2"></div>
                  Ocean Theme
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleThemeChange("galaxy")}
                  className="cursor-pointer"
                >
                  <div className="w-4 h-4 rounded-full bg-violet-400 mr-2"></div>
                  Galaxy Theme
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Avatar container positioned separately */}
      <div className="w-full max-w-5xl mx-auto flex justify-center -mt-20 mb-16">
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
            <img
              src={profile.avatar_url || "/placeholder.svg"}
              alt="Profile picture"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4 text-center">
            <h1 className={`text-2xl font-bold ${theme.headingText}`}>
              {displayName}
            </h1>
            <p className={`text-sm ${theme.subheadingText}`}>@{username}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-8">
        <div className="md:col-span-1">
          <Card
            className={`shadow-md rounded-xl overflow-hidden bg-white ${theme.border}`}
          >
            <div className={`h-3 bg-gradient-to-r ${theme.button}`}></div>
            <CardContent className="pt-6">
              <div className="space-y-5">
                <div>
                  <h2
                    className={`text-lg font-semibold ${theme.headingText} mb-2 flex items-center`}
                  >
                    <span className="mr-2">✨</span> About Me
                  </h2>
                  <p className="text-gray-600">
                    {profile.bio || "No bio available"}
                  </p>
                </div>

                <Separator className={theme.separator} />

                <div className="flex justify-between">
                  <UserListDialog
                    title="Followers"
                    userList={followStats?.followers || []}
                    theme={theme}
                  />
                  <UserListDialog
                    title="Following"
                    userList={followStats?.following || []}
                    theme={theme}
                  />
                </div>

                <Separator className={theme.separator} />

                {currentUser && currentUser.id !== id && (
                  <Button
                    onClick={() => toggleFollow.mutate()}
                    className={`w-full bg-gradient-to-r ${theme.button} rounded-xl shadow-md hover:shadow-lg transition-all duration-300 py-6`}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-2xl font-bold ${theme.headingText} flex items-center`}
            >
              <span className="mr-2">📖</span> Reading Lists
            </h2>
          </div>

          <div className="space-y-8">
            {readingLists.length > 0 ? (
              readingLists.map((list) => (
                <ReadingList
                  key={list.id}
                  title={list.name}
                  description={list.description || "My book collection"}
                  count={list.books.length}
                  books={list.books}
                  theme={theme}
                />
              ))
            ) : (
              <Card
                className={`${theme.border} p-8 text-center rounded-xl shadow-md bg-white`}
              >
                <p className="text-gray-500">No reading lists created yet</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

// Add a global style to prevent horizontal scrolling
const style = document.createElement("style");
style.innerHTML = `
  body {
    overflow-x: hidden;
  }
`;
document.head.appendChild(style);
