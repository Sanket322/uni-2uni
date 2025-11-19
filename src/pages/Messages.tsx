import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import FarmerLayout from "@/components/FarmerLayout";
import { useUserRole } from "@/hooks/useUserRole";
import AdminLayout from "@/components/AdminLayout";
import { format } from "date-fns";

interface Conversation {
  id: string;
  last_message_at: string;
  participants: {
    user_id: string;
    profile: {
      full_name: string;
    };
  }[];
}

interface Message {
  id: string;
  message_text: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
}

const Messages = () => {
  const { user } = useAuth();
  const { isAdmin, isVeterinaryOfficer } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [newChatRecipientId, setNewChatRecipientId] = useState("");

  // Fetch all conversations
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      const { data: convData, error: convError } = await supabase
        .from("conversation_participants")
        .select(`
          conversation_id,
          conversations!inner(
            id,
            last_message_at
          )
        `)
        .eq("user_id", user?.id);

      if (convError) throw convError;

      const conversationIds = convData.map((c) => c.conversation_id);

      if (conversationIds.length === 0) return [];

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name");

      if (profilesError) throw profilesError;

      const profilesMap = new Map(profiles?.map((p) => [p.id, p]));

      const { data: participants, error: participantsError } = await supabase
        .from("conversation_participants")
        .select("conversation_id, user_id")
        .in("conversation_id", conversationIds)
        .neq("user_id", user?.id);

      if (participantsError) throw participantsError;

      const conversationsMap = new Map();
      convData.forEach((c) => {
        conversationsMap.set(c.conversation_id, {
          id: c.conversation_id,
          last_message_at: c.conversations.last_message_at,
          participants: [],
        });
      });

      participants?.forEach((p) => {
        const conv = conversationsMap.get(p.conversation_id);
        const profile = profilesMap.get(p.user_id);
        if (conv && profile) {
          conv.participants.push({
            user_id: p.user_id,
            profile: { full_name: profile.full_name },
          });
        }
      });

      return Array.from(conversationsMap.values()).sort(
        (a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      );
    },
    enabled: !!user,
  });

  // Fetch messages for selected conversation
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", selectedConversation],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConversation)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedConversation,
  });

  // Fetch all users for starting new chats
  const { data: users } = useQuery({
    queryKey: ["users-for-chat"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .neq("id", user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const { error } = await supabase.from("messages").insert({
        conversation_id: selectedConversation,
        sender_id: user?.id,
        message_text: text,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setMessageText("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Create new conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (recipientId: string) => {
      const { data: convData, error: convError } = await supabase
        .from("conversations")
        .insert({})
        .select()
        .single();

      if (convError) throw convError;

      const { error: participantsError } = await supabase
        .from("conversation_participants")
        .insert([
          { conversation_id: convData.id, user_id: user?.id },
          { conversation_id: convData.id, user_id: recipientId },
        ]);

      if (participantsError) throw participantsError;

      return convData.id;
    },
    onSuccess: (conversationId) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setSelectedConversation(conversationId);
      setNewChatRecipientId("");
      toast({
        title: "Success",
        description: "Conversation started",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    sendMessageMutation.mutate(messageText);
  };

  const handleStartNewChat = () => {
    if (!newChatRecipientId) return;
    createConversationMutation.mutate(newChatRecipientId);
  };

  const content = (
    <div className="container mx-auto py-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* New Chat Section */}
            <div className="mb-4 space-y-2">
              <label className="text-sm font-medium">Start New Chat</label>
              <div className="flex gap-2">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newChatRecipientId}
                  onChange={(e) => setNewChatRecipientId(e.target.value)}
                >
                  <option value="">Select user...</option>
                  {users?.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleStartNewChat}
                  disabled={!newChatRecipientId || createConversationMutation.isPending}
                  size="sm"
                >
                  Start
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[400px]">
              {conversationsLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : conversations?.length === 0 ? (
                <p className="text-center text-muted-foreground p-4">No conversations yet</p>
              ) : (
                <div className="space-y-2">
                  {conversations?.map((conv) => (
                    <div
                      key={conv.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation === conv.id
                          ? "bg-primary/10"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedConversation(conv.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {conv.participants[0]?.profile.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {conv.participants[0]?.profile.full_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(conv.last_message_at), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Messages Panel */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedConversation
                ? conversations?.find((c) => c.id === selectedConversation)?.participants[0]
                    ?.profile.full_name
                : "Select a conversation"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedConversation ? (
              <div className="space-y-4">
                <ScrollArea className="h-[400px] pr-4">
                  {messagesLoading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : messages?.length === 0 ? (
                    <p className="text-center text-muted-foreground p-4">
                      No messages yet. Start the conversation!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {messages?.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender_id === user?.id ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              msg.sender_id === user?.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{msg.message_text}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {format(new Date(msg.created_at), "h:mm a")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendMessageMutation.isPending}
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[450px] text-muted-foreground">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (isAdmin || isVeterinaryOfficer) {
    return <AdminLayout>{content}</AdminLayout>;
  }

  return <FarmerLayout>{content}</FarmerLayout>;
};

export default Messages;
