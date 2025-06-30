import ProfileClient from "./_components/client";

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export default async function Page({ params }: Props) {
  const username = (await params).username;
  console.log(username);

  return <ProfileClient username={username} />;
}
