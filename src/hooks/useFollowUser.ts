import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export const useFollowUser = (userId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: isFollowing } = useQuery({
    queryKey: ["following", userId],
    queryFn: async () => {
      if (!user) return false;

      const { data } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", user.id)
        .eq("following_id", userId);

      return data && data.length > 0;
    },
    enabled: !!user && user.id !== userId,
  });

  const toggleFollow = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be logged in to follow users");

      if (isFollowing) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("follows")
          .insert([{ follower_id: user.id, following_id: userId }]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following", userId] });
      queryClient.invalidateQueries({ queryKey: ["followStats", userId] });
      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing
          ? "You unfollowed this user"
          : "You are now following this user",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    },
  });

  return {
    isFollowing,
    toggleFollow,
  };
};

export const useFollowStats = (userId: string) => {
  return useQuery({
    queryKey: ["followStats", userId],
    queryFn: async () => {
      // Explicitly request both the relation and profile fields
      const [followersResponse, followingResponse] = await Promise.all([
        supabase
          .from("follows")
          .select(
            `
            follower_id, 
            profiles:follower_id (
              id,
              username, 
              avatar_url
            )
          `
          )
          .eq("following_id", userId),
        supabase
          .from("follows")
          .select(
            `
            following_id, 
            profiles:following_id (
              id,
              username, 
              avatar_url
            )
          `
          )
          .eq("follower_id", userId),
      ]);

      console.log("Followers data:", followersResponse.data);
      console.log("Following data:", followingResponse.data);

      return {
        followers: followersResponse.data || [],
        followersCount: followersResponse.data?.length || 0,
        following: followingResponse.data || [],
        followingCount: followingResponse.data?.length || 0,
      };
    },
  });
};
