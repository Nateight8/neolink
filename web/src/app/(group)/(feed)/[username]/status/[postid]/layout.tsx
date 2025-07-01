import { PropsWithChildren } from "react";
import PostAppBar from "./_components/post-appbar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <PostAppBar />
      {children}
    </>
  );
}
