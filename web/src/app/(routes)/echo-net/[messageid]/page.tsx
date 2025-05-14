"use client";

import { LoadingScreen } from "@/components/loading-screen";
import { useAuthUser } from "@/hooks/use-auth";
import getStreamToken from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
} from "stream-chat-react";
import ChatHeader from "./_components/chat-header";

interface Props {
  params: {
    messageid: string;
  };
}

export default function Page({ params }: Props) {
  const { messageid: targetUserId } = params;
  console.log(targetUserId);
  const { user } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["stream-token"],
    queryFn: getStreamToken,
    enabled: !!user, //<==run when user is available
  });

  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const streamApi = "vujgntgr235j";

  useEffect(() => {
    const initChat = async () => {
      console.log("initChat started");
      console.log("tokenData:", tokenData);
      console.log("user:", user);

      if (!tokenData || !user) {
        console.log("Missing tokenData or user, returning early");
        return;
      }

      try {
        console.log("initializing stream");

        const client = StreamChat.getInstance(streamApi);
        console.log("Stream API Key:", process.env.STREAM_API_KEY);

        await client.connectUser(
          {
            id: user._id,
            name: user.fullName,
          },
          tokenData.token
        );
        console.log("User connected successfully");

        const channelId = [user._id, targetUserId].sort().join("_");
        console.log("Channel ID:", channelId);

        const channel = client.channel("messaging", channelId, {
          members: [user._id, targetUserId],
        });

        await channel.watch();
        console.log("Channel watched successfully");

        setChatClient(client);
        setChannel(channel);
      } catch (error) {
        console.error("Detailed Error initializing chat:", error);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [targetUserId, tokenData, user]);

  if (loading || !chatClient || !channel) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-[80vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
        </Channel>
      </Chat>
    </div>
  );
}
