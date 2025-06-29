import PostThread from "./_components/post-thread";

interface PageProps {
  params: Promise<{
    username: string;
    postid: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const postParams = await params;

  return (
    <div className="">
      <PostThread username={postParams.username} postid={postParams.postid} />
    </div>
  );
}
