import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useFollowUser } from "@/hooks/useFollowUser";
import { FollowersDialog } from "./FollowersDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, BookOpen, Users } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  verified?: boolean;
}

interface FollowStats {
  followers: any[];
  followersCount: number;
  following: any[];
  followingCount: number;
}

interface ProfileHeaderProps {
  profile: Profile;
  followStats?: FollowStats;
}

export const ProfileHeader = ({ profile, followStats }: ProfileHeaderProps) => {
  const { user: currentUser } = useAuth();
  const { isFollowing, toggleFollow } = useFollowUser(profile.id);

  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";
  };

  return (
    <Card className="overflow-hidden bg-white shadow-lg rounded-xl border-0">
      {/* Cover Photo - Gradient Background */}
      <div className="h-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 flex items-center justify-center">
          <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
            <AvatarImage
              src={profile.avatar_url}
              alt={profile.username || profile.full_name}
            />
            <AvatarFallback className="text-2xl bg-indigo-600 text-white">
              {getInitials(profile.full_name || profile.username || "")}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Profile Info */}
        <div className="mt-20 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.full_name || profile.username}
              </h1>
              {profile.verified && (
                <BadgeCheck className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <p className="text-gray-500">@{profile.username}</p>
          </div>

          {currentUser && currentUser.id !== profile.id && (
            <Button
              className="mt-3 md:mt-0"
              variant={isFollowing ? "outline" : "default"}
              onClick={() => toggleFollow.mutate()}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-6">
            <p className="text-gray-700">{profile.bio}</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 flex gap-8">
          <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors">
            <Users className="h-5 w-5" />
            <FollowersDialog
              followers={followStats?.followers || []}
              followersCount={followStats?.followersCount || 0}
            />
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors">
            <Users className="h-5 w-5" />
            <FollowersDialog
              followers={followStats?.following || []}
              followersCount={followStats?.followingCount || 0}
              isFollowing={true}
            />
          </div>

          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <div>
              <span className="font-semibold">0</span>
              <span className="text-gray-600 ml-1">Books Read</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
