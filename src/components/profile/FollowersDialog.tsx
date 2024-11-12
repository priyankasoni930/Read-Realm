import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

interface FollowersDialogProps {
  followers: any[];
  followersCount: number;
  isFollowing?: boolean;
}

export const FollowersDialog = ({
  followers,
  followersCount,
  isFollowing,
}: FollowersDialogProps) => {
  const navigate = useNavigate();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <span className="font-bold mr-1">{followersCount}</span>
          {isFollowing ? "following" : "followers"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isFollowing ? "Following" : "Followers"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {followers.map((follow) => {
              const user = follow.profiles;
              const userId = isFollowing ? follow.following_id : follow.follower_id;
              return (
                <div
                  key={userId}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/profile/${userId}`)}
                >
                  <Avatar>
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback>
                      {user?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user?.username}</span>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};