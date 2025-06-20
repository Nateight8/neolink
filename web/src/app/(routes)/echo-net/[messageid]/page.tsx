import ChatClient from "./_components/chat-client";

interface PageProps {
  params: Promise<{
    messageid: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const conversationId = (await params).messageid;

  return <ChatClient conversationId={conversationId} />;
}
