import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Message } from "@/lib/types";

export const useMessages = (groupId: string) => {
  return useQuery({
    queryKey: ['messages', groupId],
    queryFn: async () => {
      // First fetch messages
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          id,
          text,
          user_id,
          created_at,
          group_id
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: false }); // Changed to descending order

      if (error) throw error;

      // Then fetch user profiles for all message authors
      const userIds = [...new Set(messages.map(msg => msg.user_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of user IDs to usernames
      const userMap = new Map(profiles.map(profile => [profile.id, profile.username]));

      // Combine messages with user data
      return messages.map(msg => ({
        id: msg.id,
        text: msg.text,
        userId: msg.user_id,
        userEmail: userMap.get(msg.user_id) || 'U',
        timestamp: msg.created_at,
        group_id: msg.group_id
      })) as Message[];
    },
    refetchInterval: 3000,
  });
};