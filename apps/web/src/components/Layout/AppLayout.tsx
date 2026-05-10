import type { Post } from "@repo/db/data";
import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";

export async function AppLayout({
  children,
  query,
  posts,
}: PropsWithChildren<{ query?: string; posts: Post[] }>) {
  return (
    <>
      <LeftMenu posts={posts} />
      <Content>
        <TopMenu query={query} />
        {children}
      </Content>
    </>
  );
}