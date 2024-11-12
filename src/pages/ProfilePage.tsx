import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { useFollowStats } from "@/hooks/useFollowUser";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: followStats } = useFollowStats(user?.id || "");

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="bg-cyan-950 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center">
          <Card className="mt-8 mb-8 max-w-lg w-full">
            <CardContent className="pt-6 space-y-4">
              {profile?.username && (
                <div>
                  <h3 className="font-medium text-xl text-gray-700">
                    Username :{" "}
                  </h3>
                  <h4 className="font-bold text-2xl text-gray-900">
                    {profile.username}
                  </h4>
                </div>
              )}
              {profile?.full_name && (
                <div>
                  <h3 className="font-medium text-xl text-gray-700">
                    Full Name :
                  </h3>
                  <p className="font-bold text-2xl text-gray-900">
                    {profile.full_name}
                  </p>
                </div>
              )}
              {profile?.bio && (
                <div>
                  <h3 className="font-medium text-xl text-gray-700">Bio : </h3>
                  <p className="font-bold text-2xl text-gray-900">
                    {profile.bio}
                  </p>
                </div>
              )}
            </CardContent>

            <ProfileHeader profile={user} followStats={followStats} />
          </Card>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={() => navigate("/profile/edit")} variant="outline">
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
