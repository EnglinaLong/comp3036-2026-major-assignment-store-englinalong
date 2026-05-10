"use client";

import { useState } from "react";
import styles from "./admin-ui.module.css";

export function LogoutButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <button
      className={styles.logoutButton}
      type="button"
      disabled={isSubmitting}
      onClick={async () => {
        setIsSubmitting(true);

        try {
          await fetch("/api/auth", {
            method: "DELETE",
          });
        } finally {
          window.location.reload();
        }
      }}
    >
      Logout
    </button>
  );
}
