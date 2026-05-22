"use client";

import { useEffect, useState } from "react";
import styles from "./admin-ui.module.css";

export function LogoutButton() {
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <button
      className={styles.logoutButton}
      type="button"
      disabled={isSubmitting}
      onClick={async () => {
        setIsSubmitting(true);

        try {
          const response = await fetch("/api/auth", {
            method: "DELETE",
          });

          await response.json().catch(() => null);
          await new Promise((resolve) => window.setTimeout(resolve, 100));
        } finally {
          window.location.assign("/");
        }
      }}
    >
      Logout
    </button>
  );
}
