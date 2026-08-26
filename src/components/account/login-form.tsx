"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { signIn } from "@/server/actions/auth";
import styles from "./password-field.module.css";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <form
      className="auth-form login-form"
      action={async () => {
        setBusy(true);
        setMessage("");
        try {
          const result = await signIn({ email, password });
          if (!result.ok) setMessage(result.message);
        } catch (error) {
          if (isRedirectError(error)) throw error;
          setMessage("Unable to sign in. Check your details and database configuration.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label>
        Email address
        <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
      </label>

      <label className={styles.field}>
        Password
        <input required minLength={8} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" />
        <button className={styles.toggle} type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </label>

      <div className="auth-inline-row">
        <label className="remember-me">
          <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
          <span>Remember me</span>
        </label>

        <Link className="password-reset-link" href="/forgot-password">Forgot password?</Link>
      </div>

      <button type="button" className="button button-light auth-secondary-button" aria-label="Continue with Google">
        Continue with Google
      </button>

      <button className="button button-dark" disabled={busy}>
        {busy ? <LoaderCircle className="spin" size={16} /> : <ArrowUpRight size={16} />}
        {busy ? "Signing in..." : "Sign in"}
      </button>

      {message && <p className="account-message">{message}</p>}
    </form>
  );
}

function isRedirectError(error: unknown): error is { digest: string } {
  return typeof error === "object" && error !== null && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT");
}
