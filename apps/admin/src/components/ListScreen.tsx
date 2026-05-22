"use client";

import { useEffect, useMemo, useState } from "react";
import type { Post } from "@repo/db/data";
import styles from "./admin-ui.module.css";

type SortOption = "title-asc" | "title-desc" | "date-asc" | "date-desc";
type VisibilityOption = "all" | "active" | "inactive";

function normalizeFilterValue(value: string) {
  return value.trim().toLowerCase();
}

function getNormalizedTags(value: string) {
  return value
    .split(",")
    .map((tag) => normalizeFilterValue(tag))
    .filter(Boolean);
}

function formatDateAsMmddyyyy(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear());

  return `${month}${day}${year}`;
}

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
    setPostStates(initialPosts);
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
        const searchTerm = normalizeFilterValue(contentFilter);
        const searchText = [
          post.title,
          post.description,
          post.content,
          post.category,
          post.tags,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchText.includes(searchTerm)) {
          return false;
        }
      }

      if (tagFilter) {
        const searchTerm = normalizeFilterValue(tagFilter);
        const productTags = getNormalizedTags(post.tags);

        if (!productTags.some((tag) => tag.includes(searchTerm))) {
          return false;
        }
      }

      if (dateFilter) {
        const searchTerm = dateFilter.trim();

        if (!/^\d{8}$/.test(searchTerm)) {
          return false;
        }

        if (formatDateAsMmddyyyy(new Date(post.date)) !== searchTerm) {
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
          View all store products, including active and inactive items.
        </p>
        <div className={styles.toolbarActions}>
          <a className={styles.linkButton} href="/posts/create">
            Create Product
          </a>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterField}>
          <label className={styles.filterLabel} htmlFor="content-filter">
            Filter by Product Details:
          </label>
          <input
            className={styles.filterInput}
            id="content-filter"
            type="text"
            value={contentFilter}
            onChange={(e) => setContentFilter(e.target.value)}
            placeholder="Search product name, summary, or details"
          />
        </div>

        <div className={styles.filterField}>
          <label className={styles.filterLabel} htmlFor="tag-filter">
            Filter by Collection:
          </label>
          <input
            className={styles.filterInput}
            id="tag-filter"
            type="text"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            placeholder="Front-End"
          />
        </div>

        <div className={styles.filterField}>
          <label className={styles.filterLabel} htmlFor="date-filter">
            Filter by Date Added:
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
                  Added on{" "}
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
