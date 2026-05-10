"use client";

import { FormEvent, useState } from "react";
import styles from "./admin-ui.module.css";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError("Invalid password");
        return;
      }

      // Refresh the page to show the admin list
      window.location.reload();
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    }
  };

  return (
    <section className={styles.loginCard}>
      <div className={styles.loginHeader}>
        <h1 className={styles.loginTitle}>Admin Access</h1>
        <p className={styles.loginText}>Sign in to your account</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            className={styles.input}
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        <button className={styles.primaryButton} type="submit">
          Sign In
        </button>
      </form>
    </section>
  );
}
