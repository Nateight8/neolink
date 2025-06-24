import ChessClient from "./_components/client";

interface Props {
  params: Promise<{ roomid: string }>;
}

export default async function Page({ params }: Props) {
  const { roomid } = await params;

  return <ChessClient roomid={roomid} />;
}
