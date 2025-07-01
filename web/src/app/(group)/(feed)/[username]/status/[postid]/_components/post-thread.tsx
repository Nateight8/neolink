"use client";
import { usePost } from "@/hooks/api/use-post";

import { LoadingIndicator } from "@/components/loading-indicator";
// import { Comment } from "./comments-thread";
import FeedPost from "@/components/feed/post/feed-post";

interface PostParams {
  username: string;
  postid: string;
}

export default function PostThread({ postid, username }: PostParams) {
  const { data, isLoading, error } = usePost(username, postid);

  if (isLoading)
    return (
      <div className="h-[70vh] flex items-center justify-center w-full">
        <LoadingIndicator text="FETCHING THREAD..." />
      </div>
    );
  if (error) return <div>Error loading post</div>;
  if (!data) return <div>Post not found</div>;

  return (
    <>
      <div className="w-full">
        <FeedPost post={data} />
      </div>
      {/* Comments Section */}
      {/* <div className="space-y-6 p-4">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div> */}
    </>
  );
}

// const comments = [
//   {
//     id: "1",
//     author: "GHOST_IN_THE_CODE",
//     handle: "ghost",
//     avatar: "/placeholder.svg?text=GC",
//     timestamp: "3 hours ago",
//     bio: "Reverse-engineering the fabric of spacetime. One line of code at a time.",
//     content:
//       "I've been working on a similar project. The main bottleneck is decoherence. How are you maintaining qubit stability?",
//     upvotes: 99,
//     replies: [
//       {
//         id: "2",
//         author: "CYBER_SAVANT",
//         handle: "cyber_savant",
//         avatar: "/placeholder.svg?text=CS",
//         timestamp: "3 hours ago",
//         bio: "Quantum physicist and part-time chronomancer. I build things that bend the laws of reality.",
//         content:
//           "Using a combination of topological error correction and a cryo-stasis field. It's not perfect, but it holds for about 3.14 nanoseconds, long enough for a burst transmission.",
//         upvotes: 150,
//         replies: [],
//       },
//       {
//         id: "3",
//         author: "PIXEL_PUNK",
//         handle: "pixel_punk",
//         avatar: "/placeholder.svg?text=PP",
//         timestamp: "2 hours ago",
//         bio: "Digital artist painting with voltage and neon. If it ain't glowing, it ain't going.",
//         content:
//           "That's insane. Are you not worried about creating a micro black hole? I saw a guy on the dark net do that last week. Didn't end well.",
//         upvotes: 45,
//         replies: [],
//       },
//     ],
//   },
//   {
//     id: "4",
//     author: "VOID_RUNNER",
//     handle: "void_runner",
//     avatar: "/placeholder.svg?text=VR",
//     timestamp: "1 hour ago",
//     bio: "Professional data smuggler and joy-rider in the digital frontier.",
//     content:
//       "This is beyond my pay grade. I just overclock my GPU and call it a day.",
//     upvotes: 250,
//     replies: [],
//   },
// ];
