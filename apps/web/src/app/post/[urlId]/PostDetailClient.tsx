"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Post } from "@repo/db/data";

function markdownToHtml(markdown: string) {
  return markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/\n/g, "<br />");
}

function formatDate(date: Date | string) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export default function PostDetailClient({
  post,
  tags,
  initialLiked,
}: {
  post: Post;
  tags: { label: string; href: string }[];
  initialLiked: boolean;
}) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(initialLiked);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLike() {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/likes", {
        method: liked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post.id,
        }),
      });

      if (!response.ok) {
        return;
      }

      const result = (await response.json()) as {
        liked: boolean;
        likes: number;
      };

      setLiked(result.liked);
      setLikes(result.likes);
    } finally {
      setIsSubmitting(false);
    }
  }

  const html = useMemo(() => markdownToHtml(post.content), [post.content]);

  return (
    <article
      data-testid={`blog-post-${post.id}`}
      data-test-id={`blog-post-${post.id}`}
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <Link
        href={`/post/${post.urlId}`}
        style={{
          display: "block",
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "12px",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        {post.title}
      </Link>

      <p>{post.category}</p>

      <img
        src={post.imageUrl}
        alt={post.title}
        style={{
          width: "100%",
          borderRadius: "10px",
          margin: "10px 0",
        }}
      />

      <div style={{ margin: "10px 0" }}>
        {tags.map((tag) => (
          <Link
            key={tag.label}
            href={tag.href}
            style={{
              marginRight: "10px",
              color: "#0070f3",
              textDecoration: "none",
            }}
          >
            #{tag.label}
          </Link>
        ))}
      </div>

      <p>{formatDate(post.date)}</p>
      <p>{post.views} views</p>
      <p>{likes} likes</p>

      <button
        type="button"
        data-testid="like-button"
        data-test-id="like-button"
        onClick={handleLike}
        aria-pressed={liked}
        disabled={isSubmitting}
        style={{
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          cursor: "pointer",
          marginTop: "10px",
          marginBottom: "10px",
          display: "inline-block",
          background: "white",
          color: "black",
        }}
      >
        {liked ? "Unlike" : "Like"}
      </button>

      <div
        data-testid="content-markdown"
        data-test-id="content-markdown"
        style={{ marginTop: "20px" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
