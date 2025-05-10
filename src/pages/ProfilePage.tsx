import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFollowStats } from "@/hooks/useFollowUser";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, ChevronRight, Edit, Palette, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";

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
    mainBackground: "from-pink-50 to-pink-100",
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
    mainBackground: "from-indigo-50 to-indigo-100",
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
    mainBackground: "from-emerald-50 to-emerald-100",
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
    mainBackground: "from-amber-50 to-amber-100",
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
    mainBackground: "from-sky-50 to-sky-100 ",
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
    mainBackground: "from-violet-50 to-violet-100 ",
    headingText: "text-violet-900",
    subheadingText: "text-violet-700",
    border: "border-violet-100",
    cardGradient: "from-violet-100 to-fuchsia-50",
    footerGradient: "from-violet-50 to-fuchsia-50",
    linkText: "text-violet-600 hover:text-violet-800",
    separator: "border-violet-200",
  },
};

// Add an array of avatar options using public avatar APIs
const avatarOptions = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=d1d4f9",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Cleo&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha&backgroundColor=c1e1c5",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Nova&backgroundColor=d1d4f9",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bailey&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Ash&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Jasper&backgroundColor=ffdfbf",
  "https://api.dicebear.com/9.x/micah/svg?seed=Leah&backgroundColor=ffd5dc",
  "https://api.dicebear.com/9.x/micah/svg?seed=Liam&backgroundColor=c1e1c5",
  "https://api.dicebear.com/9.x/micah/svg?seed=Olivia&backgroundColor=ffd5dc",
  "https://api.dicebear.com/9.x/micah/svg?seed=Ethan&backgroundColor=c0aede",
  "https://api.dicebear.com/9.x/micah/svg?seed=Ava&backgroundColor=c1e1c5",
  "https://api.dicebear.com/9.x/micah/svg?seed=Mason&backgroundColor=b6e3f4",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Aidan&backgroundColor=ffd5dc",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Aiden&backgroundColor=d1d4f9",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Sawyer&backgroundColor=c0aede",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Avery&backgroundColor=ffd5dc",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Alexander&backgroundColor=ffdfbf",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Leah&backgroundColor=d1d4f9",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Caleb&backgroundColor=c0aede",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Jack&backgroundColor=c1e1c5",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Brooklyn&backgroundColor=ffdfbf",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Katherine&backgroundColor=ffd5dc",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Kimberly&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Pepper&backgroundColor=c1e1c5",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Aidan&backgroundColor=b6e3f4",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Christian&backgroundColor=ffdfbf",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Jack&backgroundColor=ffd5dc",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Aiden&backgroundColor=c0aede",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Jade&backgroundColor=ffd5dc",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Liliana&backgroundColor=ffdfbf",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Broklynn&backgroundColor=b6e3f4",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Katherine&backgroundColor=c0aede",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Kimberly&backgroundColor=c1e1c5",
  // Default placeholder
  "https://api.dicebear.com/7.x/identicon/svg?seed=ReadRealm",
];

// Fix the UserListDialogProps type
interface UserListDialogProps {
  title: string;
  userList: Array<{
    id?: string;
    follower_id?: string;
    following_id?: string;
    profiles?:
      | {
          username?: string;
          avatar_url?: string;
        }
      | Array<{
          username?: string;
          avatar_url?: string;
        }>;
    username?: string;
    avatar_url?: string;
    profile?: {
      username?: string;
      avatar_url?: string;
    };
  }>;
  theme?: ThemeConfig;
}

function UserListDialog({ title, userList, theme }: UserListDialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Add debug logging
  console.log(`${title} data in ProfilePage:`, userList);

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
              {userList.length || 0}
            </span>
          </div>
          <p className="text-xs text-gray-500">{title}</p>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {title} ({userList.length || 0})
          </DialogTitle>
          <p className="text-center text-sm text-gray-500">
            {title === "Followers"
              ? "People who follow you"
              : "People you follow"}
          </p>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto px-1 py-4">
          {!userList || userList.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No {title.toLowerCase()} yet
            </div>
          ) : (
            <div className="space-y-4">
              {userList.map((user, index) => {
                // Add debugging for each user
                console.log(`User ${index} data:`, user);

                // Get the ID based on whether it's a follower or following
                const userId =
                  title === "Followers" ? user.follower_id : user.following_id;

                // Safely extract profile data with additional fallbacks
                let profileData = null;

                // Check the most likely places for profile data based on our query
                if (user.profiles) {
                  if (Array.isArray(user.profiles)) {
                    // It's an array of profiles
                    profileData = user.profiles[0];
                  } else {
                    // It's a single profile object
                    profileData = user.profiles;
                  }
                } else if (user.profile) {
                  // Try the singular "profile" property as fallback
                  profileData = user.profile;
                }

                // Extract username and avatar with fallbacks
                const username =
                  profileData?.username || user.username || "User";
                const avatarUrl =
                  profileData?.avatar_url ||
                  user.avatar_url ||
                  "/placeholder.svg";

                console.log(
                  `Extracted for user ${index}: userId=${userId}, username=${username}`
                );

                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (userId) {
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

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: followStats } = useFollowStats(user?.id || "");
  const queryClient = useQueryClient();

  // Initialize with theme from localStorage or pink as fallback
  const [selectedTheme, setSelectedTheme] = useState<ProfileTheme>(() => {
    const savedTheme = localStorage.getItem("userPreferredTheme");
    return savedTheme && Object.keys(themeConfig).includes(savedTheme)
      ? (savedTheme as ProfileTheme)
      : "lavender";
  });

  // Add state for theme dialog
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);

  // Current theme config
  const theme = themeConfig[selectedTheme];

  // State for avatar selection dialog
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      // Set the theme from profile data if available and different from current
      if (data?.theme && data.theme !== selectedTheme) {
        setSelectedTheme(data.theme as ProfileTheme);
        // Update localStorage with the theme from database
        localStorage.setItem("userPreferredTheme", data.theme);
      } else if (!data?.theme) {
        // If no theme in database but exists in localStorage, use that
        const savedTheme = localStorage.getItem("userPreferredTheme");
        if (savedTheme && Object.keys(themeConfig).includes(savedTheme)) {
          // Update database with the theme from localStorage
          updateThemeInDatabase(savedTheme as ProfileTheme);
        }
      }

      return data;
    },
    enabled: !!user,
  });

  // Function to update theme in the database
  const updateThemeInDatabase = async (newTheme: ProfileTheme) => {
    if (!user) return Promise.resolve();

    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      let error = null;

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            theme: newTheme,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        error = updateError;
      } else {
        // Create new profile if it doesn't exist
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            theme: newTheme,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

        error = insertError;
      }

      if (error) {
        console.error("Error updating theme:", error);
        return Promise.reject(error);
      }

      return Promise.resolve();
    } catch (err) {
      console.error("Error in theme update:", err);
      return Promise.reject(err);
    }
  };

  // Handle theme change
  const handleThemeChange = (newTheme: ProfileTheme) => {
    // Update local state immediately
    setSelectedTheme(newTheme);

    // Update localStorage
    localStorage.setItem("userPreferredTheme", newTheme);

    // Update in database and then force a refetch
    updateThemeInDatabase(newTheme)
      .then(() => {
        // Force refetch data rather than just invalidating
        queryClient.refetchQueries({ queryKey: ["profile", user?.id] });
      })
      .catch((error) => {
        console.error("Failed to update theme:", error);
      });
  };

  // Handle avatar change with a proper query invalidation
  const handleAvatarChange = async (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);

    if (user) {
      try {
        // First check if profile exists
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id, theme")
          .eq("id", user.id)
          .single();

        let error = null;

        if (existingProfile) {
          // Update existing profile while preserving theme
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              avatar_url: avatarUrl,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

          error = updateError;
        } else {
          // Create new profile if it doesn't exist, set theme too
          const currentTheme =
            localStorage.getItem("userPreferredTheme") || "pink";

          const { error: insertError } = await supabase
            .from("profiles")
            .insert([
              {
                id: user.id,
                avatar_url: avatarUrl,
                theme: currentTheme,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ]);

          error = insertError;
        }

        if (error) {
          console.error("Error updating avatar:", error);
          alert("Failed to update avatar. Please try again.");
        } else {
          // Invalidate query to refresh data
          queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
          // Close dialog after successful update
          setAvatarDialogOpen(false);
        }
      } catch (err) {
        console.error("Error in avatar update:", err);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // User display name - prefer full name, fall back to username
  const displayName = profile?.full_name || profile?.username || user.email;
  const username = profile?.username || "User";

  return (
    <div
      className={`container mx-auto px-4 py-8 max-w-full bg-gradient-to-b ${theme.mainBackground} min-h-[900px] overflow-x-hidden`}
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

        {/* Theme selector */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm"
            onClick={() => navigate("/profile/edit")}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <div>
            <Dialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Choose Theme
                  </DialogTitle>
                </DialogHeader>
                <div className="p-4 grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      handleThemeChange("pink");
                      setThemeDialogOpen(false);
                    }}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-pink-50"
                  >
                    <div className="w-10 h-10 rounded-full bg-pink-400"></div>
                    <span className="text-sm">Pink</span>
                  </button>
                  <button
                    onClick={() => {
                      handleThemeChange("lavender");
                      setThemeDialogOpen(false);
                    }}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-indigo-50"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-400"></div>
                    <span className="text-sm">Lavender</span>
                  </button>
                  <button
                    onClick={() => {
                      handleThemeChange("mint");
                      setThemeDialogOpen(false);
                    }}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-emerald-50"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-400"></div>
                    <span className="text-sm">Mint</span>
                  </button>
                  <button
                    onClick={() => {
                      handleThemeChange("sunset");
                      setThemeDialogOpen(false);
                    }}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-amber-50"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-400"></div>
                    <span className="text-sm">Sunset</span>
                  </button>
                  <button
                    onClick={() => {
                      handleThemeChange("ocean");
                      setThemeDialogOpen(false);
                    }}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-sky-50"
                  >
                    <div className="w-10 h-10 rounded-full bg-sky-400"></div>
                    <span className="text-sm">Ocean</span>
                  </button>
                  <button
                    onClick={() => {
                      handleThemeChange("galaxy");
                      setThemeDialogOpen(false);
                    }}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-violet-50"
                  >
                    <div className="w-10 h-10 rounded-full bg-violet-400"></div>
                    <span className="text-sm">Galaxy</span>
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Avatar container positioned separately */}
      <div className="w-full max-w-5xl mx-auto flex justify-center -mt-20 mb-16">
        <div className="flex flex-col items-center">
          <div
            className="relative w-40 h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden"
            onMouseEnter={() => setIsHoveringAvatar(true)}
            onMouseLeave={() => setIsHoveringAvatar(false)}
          >
            <img
              src={profile?.avatar_url || "/placeholder.svg"}
              alt="Profile picture"
              className="w-full h-full object-cover"
            />

            {/* Edit overlay that appears on hover */}
            {isHoveringAvatar && (
              <div
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer"
                onClick={() => setAvatarDialogOpen(true)}
              >
                <Edit className="h-10 w-10 text-white" />
              </div>
            )}

            {/* Avatar selection dialog */}
            <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Choose Avatar
                  </DialogTitle>
                </DialogHeader>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-3 gap-4">
                    {avatarOptions.map((avatar, index) => (
                      <div
                        key={index}
                        className={`relative w-20 h-20 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                          selectedAvatar === avatar ||
                          (profile?.avatar_url === avatar && !selectedAvatar)
                            ? `border-${selectedTheme}-500 scale-110`
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleAvatarChange(avatar)}
                      >
                        <img
                          src={avatar}
                          alt={`Avatar option ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setAvatarDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
                    {profile?.bio || "No bio available"}
                  </p>
                </div>

                <Separator className={`border ${theme.separator}`} />

                <div className="flex justify-center gap-10">
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

                <Separator className={`border ${theme.separator}`} />

                <Button
                  onClick={() => navigate("/profile/edit")}
                  className={`w-full bg-gradient-to-r ${theme.button} rounded-xl shadow-md hover:shadow-lg transition-all duration-300 py-6`}
                >
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-2xl font-bold ${theme.headingText} flex items-center`}
            >
              <span className="mr-2">📖</span> Your Activity
            </h2>
          </div>

          <Card
            className={`${theme.border} p-8 text-center rounded-xl shadow-md bg-white`}
          >
            <div
              className={`p-5 bg-gradient-to-r ${theme.cardGradient} relative overflow-hidden rounded-lg mb-4`}
            >
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
              <div className="relative z-10">
                <h3 className={`text-xl font-bold ${theme.headingText}`}>
                  Welcome to Read Realm!
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Track your reading progress, join book discussions, and
                  connect with other book lovers.
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate("/library")}
              className={`bg-gradient-to-r ${theme.button} rounded-xl shadow-md hover:shadow-lg transition-all duration-300 mx-auto`}
            >
              Explore Your Library
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
