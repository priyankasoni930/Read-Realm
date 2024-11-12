import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import GroupList from "@/components/groups/GroupList";
import GroupChat from "@/components/groups/GroupChat";
import { supabase } from "@/lib/supabase";
import { Group } from "@/lib/types";

const GroupsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching groups",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setGroups(data);
  };

  const handleCreateGroup = async (name: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("groups")
      .insert([{ name, created_by: user.id }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating group",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setGroups([data, ...groups]);
  };

  const handleShareGroup = (groupId: string) => {
    const shareLink = `https://read-realm-theta.vercel.app/groups/join/${groupId}`;
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link copied!",
      description: "Share this link with others to join the group",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-100">Forum</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="bg-white hover:bg-gray-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Forum
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-gray-100">
                <DialogHeader>
                  <DialogTitle>Create New Forum</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleCreateGroup(formData.get("name") as string);
                  }}
                >
                  <Input
                    name="name"
                    placeholder="Group name"
                    className="mb-4 bg-gray-700 border-gray-600 text-gray-100"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    className="bg-white hover:bg-gray-500"
                  >
                    Create
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
            <div className="col-span-1 bg-gray-800 rounded-lg shadow-lg p-4">
              <h2 className="font-semibold mb-4 text-gray-300">All Forums</h2>
              <GroupList
                groups={groups}
                selectedGroupId={selectedGroup?.id || null}
                onGroupSelect={setSelectedGroup}
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              {selectedGroup ? (
                <GroupChat group={selectedGroup} />
              ) : (
                <div className="bg-gray-800 rounded-lg shadow-lg h-full flex items-center justify-center text-gray-400">
                  Select a group to start chatting
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
