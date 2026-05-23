import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <div className="py-6">0 Posts</div>;
  }

  return (
    <div className="py-6 space-y-6">
      <p>{posts.length} Posts</p>

      {posts.map((post) => (
        <div key={`blog-post-${post.urlId}`} style={{ marginBottom: "20px" }}>
          <BlogListItem post={post} />
        </div>
      ))}
    </div>
  );
}

export default BlogList;
