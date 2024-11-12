import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useFollowUser } from "@/hooks/useFollowUser";
import { FollowersDialog } from "./FollowersDialog";

interface ProfileHeaderProps {
  profile: any;
  followStats: any;
}

export const ProfileHeader = ({ profile, followStats }: ProfileHeaderProps) => {
  const { user: currentUser } = useAuth();
  const { isFollowing, toggleFollow } = useFollowUser(profile.id);

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="mb-8 max-w-lg border-none w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <div className="flex gap-6 mt-1">
              <FollowersDialog
                followers={followStats?.followers || []}
                followersCount={followStats?.followersCount || 0}
              />
              <FollowersDialog
                followers={followStats?.following || []}
                followersCount={followStats?.followingCount || 0}
                isFollowing
              />
            </div>
          </div>
          {currentUser && currentUser.id !== profile.id && (
            <Button
              variant={isFollowing ? "outline" : "default"}
              onClick={() => toggleFollow.mutate()}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.bio && (
            <div>
              <h3 className="font-medium">Bio</h3>
              <p>{profile.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
