"use client";

import { useEffect, useMemo, useState } from "react";
import type { Post } from "@repo/db/data";
import styles from "./admin-ui.module.css";

type SortOption = "title-asc" | "title-desc" | "date-asc" | "date-desc";
type VisibilityOption = "all" | "active" | "inactive";
const POST_OVERRIDES_STORAGE_KEY = "admin-post-overrides";
const CREATED_POSTS_STORAGE_KEY = "admin-created-posts";

export function ListScreen({ initialPosts }: { initialPosts: Post[] }) {
  const [postStates, setPostStates] = useState(initialPosts);
  const [contentFilter, setContentFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityOption>("all");
  const [sortBy, setSortBy] = useState<SortOption | "">("date-desc");
  const [savingPostId, setSavingPostId] = useState<number | null>(null);

  useEffect(() => {
    const storedCreatedPosts = window.localStorage.getItem(
      CREATED_POSTS_STORAGE_KEY,
    );
    const storedPostOverrides = window.localStorage.getItem(
      POST_OVERRIDES_STORAGE_KEY,
    );

    try {
      const postOverrides = storedPostOverrides
        ? (JSON.parse(storedPostOverrides) as Record<string, Partial<Post>>)
        : {};
      const createdPosts = storedCreatedPosts
        ? (JSON.parse(storedCreatedPosts) as Post[]).map(
            (post) => ({
              ...post,
              date: new Date(post.date),
            }),
          )
        : [];

      setPostStates((current) => {
        const mergedPosts = [
          ...createdPosts.filter(
            (createdPost) =>
              !current.some((post) => post.urlId === createdPost.urlId),
          ),
          ...current,
        ];

        return mergedPosts.map((post) => ({
          ...post,
          ...postOverrides[post.urlId],
          active: post.active,
        }));
      });
    } catch {
      window.localStorage.removeItem(CREATED_POSTS_STORAGE_KEY);
      window.localStorage.removeItem(POST_OVERRIDES_STORAGE_KEY);
    }
  }, [initialPosts]);

  const togglePostStatus = async (postId: number) => {
    const post = postStates.find((item) => item.id === postId);

    if (!post || savingPostId === postId) {
      return;
    }

    setSavingPostId(postId);

    try {
      const response = await fetch(`/api/posts/${postId}/active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          active: !post.active,
        }),
      });

      if (!response.ok) {
        const storedCreatedPosts = window.localStorage.getItem(
          CREATED_POSTS_STORAGE_KEY,
        );
        const createdPosts = storedCreatedPosts
          ? (JSON.parse(storedCreatedPosts) as Post[]).map((item) => ({
              ...item,
              date: new Date(item.date),
            }))
          : [];

        if (!createdPosts.some((item) => item.id === postId)) {
          return;
        }

        const nextActive = !post.active;
        const nextCreatedPosts = createdPosts.map((item) =>
          item.id === postId ? { ...item, active: nextActive } : item,
        );

        window.localStorage.setItem(
          CREATED_POSTS_STORAGE_KEY,
          JSON.stringify(nextCreatedPosts),
        );

        setPostStates((current) =>
          current.map((item) =>
            item.id === postId ? { ...item, active: nextActive } : item,
          ),
        );
        return;
      }

      const updatedPost = (await response.json()) as {
        id: number;
        active: boolean;
      };

      setPostStates((current) =>
        current.map((item) =>
          item.id === updatedPost.id
            ? { ...item, active: updatedPost.active }
            : item,
        ),
      );
    } finally {
      setSavingPostId(null);
    }
  };

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = postStates.filter((post) => {
      if (contentFilter) {
        const searchTerm = contentFilter.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(searchTerm);
        const matchesDescription = post.description
          .toLowerCase()
          .includes(searchTerm);
        const matchesContent = post.content.toLowerCase().includes(searchTerm);

        if (!matchesTitle && !matchesDescription && !matchesContent) {
          return false;
        }
      }

      if (tagFilter) {
        const searchTerm = tagFilter.toLowerCase();

        if (!post.tags.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      // Filter by date (MMDDYYYY format) - match posts on or after this date
      if (dateFilter) {
        if (dateFilter.length !== 8) {
          return true;
        }

        const month = parseInt(dateFilter.substring(0, 2), 10);
        const day = parseInt(dateFilter.substring(2, 4), 10);
        const year = parseInt(dateFilter.substring(4, 8), 10);

        if (
          Number.isNaN(month) ||
          Number.isNaN(day) ||
          Number.isNaN(year)
        ) {
          return true;
        }

        const filterDate = new Date(year, month - 1, day);
        const postDate = new Date(post.date);

        if (Number.isNaN(filterDate.getTime())) {
          return true;
        }

        if (postDate < filterDate) {
          return false;
        }
      }

      if (visibilityFilter === "active" && !post.active) {
        return false;
      }

      if (visibilityFilter === "inactive" && post.active) {
        return false;
      }

      return true;
    });

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "title-asc":
            return a.title.localeCompare(b.title);
          case "title-desc":
            return b.title.localeCompare(a.title);
          case "date-asc":
            return a.date.getTime() - b.date.getTime();
          case "date-desc":
            return b.date.getTime() - a.date.getTime();
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [contentFilter, tagFilter, dateFilter, postStates, visibilityFilter, sortBy]);

  return (
    <div>
      <div className={styles.toolbar}>
        <p className={styles.loginText}>
          View all posts, including active and inactive items.
        </p>
        <div className={styles.toolbarActions}>
          <a className={styles.linkButton} href="/posts/create">
            Create Post
          </a>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterField}>
          <label className={styles.filterLabel} htmlFor="content-filter">
            Filter by Content:
          </label>
          <input
            className={styles.filterInput}
            id="content-filter"
            type="text"
            value={contentFilter}
            onChange={(e) => setContentFilter(e.target.value)}
          />
        </div>

        <div className={styles.filterField}>
          <label className={styles.filterLabel} htmlFor="tag-filter">
            Filter by Tag:
          </label>
          <input
            className={styles.filterInput}
            id="tag-filter"
            type="text"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          />
        </div>

        <div className={styles.filterField}>
          <label className={styles.filterLabel} htmlFor="date-filter">
            Filter by Date Created:
          </label>
          <input
            className={styles.filterInput}
            id="date-filter"
            type="text"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="MMDDYYYY"
          />
        </div>

        <div className={styles.filterField}>
          <label className={styles.filterLabel} htmlFor="visibility-filter">
            Filter by Visibility:
          </label>
          <select
            className={styles.filterSelect}
            id="visibility-filter"
            value={visibilityFilter}
            onChange={(e) =>
              setVisibilityFilter(e.target.value as VisibilityOption)
            }
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className={styles.filterField}>
          <label className={styles.filterLabel} htmlFor="sort-select">
            Sort By:
          </label>
          <select
            className={styles.filterSelect}
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption | "")}
          >
            <option value="">Default Order</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="date-desc">Date (Newest First)</option>
          </select>
        </div>
      </div>

      <div className={styles.list}>
        {filteredAndSortedPosts.map((post) => (
          <article className={styles.postCard} key={post.id}>
            <img
              className={styles.postImage}
              src={post.imageUrl}
              alt={post.title}
            />
            <div className={styles.postBody}>
              <h2 className={styles.postTitle}>
                <a
                  className={styles.postTitleLink}
                  href={`/post/${post.urlId}`}
                >
                  {post.title}
                </a>
              </h2>
              <div className={styles.metaList}>
                <span>
                  #{post.tags.split(",").map((tag) => tag.trim()).join(", #")}
                </span>
                <span>
                  Posted on{" "}
                  {post.date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span>{post.category}</span>
              </div>
              <button
                className={`${styles.statusButton} ${
                  post.active ? styles.statusActive : styles.statusInactive
                }`}
                disabled={savingPostId === post.id}
                onClick={() => togglePostStatus(post.id)}
              >
                {post.active ? "Active" : "Inactive"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
