import NotFound from "@/app/not-found";
import ProfileClient from "./_components/client";

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export default async function Page({ params }: Props) {
  const username = (await params).username;
  const decodedUsername = decodeURIComponent(username);

  // Only accept usernames that start with @
  if (!decodedUsername.startsWith("@")) {
    return <NotFound />;
  }

  const actualUsername = decodedUsername.slice(1); // Remove @

  return <ProfileClient username={actualUsername} />;
}
