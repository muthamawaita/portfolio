"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { createAccount } from "@/server/actions/accounts";
import styles from "./password-field.module.css";

export function SignupForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [account, setAccount] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const fullName = `${account.firstName} ${account.lastName}`.trim();

  return (
    <form
      className="auth-form signup-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setMessage("");

        if (!account.firstName || !account.lastName) {
          setMessage("Please add your first and last name.");
          setBusy(false);
          return;
        }

        if (account.password !== account.confirmPassword) {
          setMessage("The password confirmation does not match.");
          setBusy(false);
          return;
        }

        if (!account.acceptTerms) {
          setMessage("Please accept the terms to continue.");
          setBusy(false);
          return;
        }

        try {
          const created = await createAccount({
            name: fullName,
            email: account.email,
            password: account.password,
          });

          if (!created.ok) {
            setMessage(created.message);
            return;
          }

          router.push("/dashboard/onboarding");
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Please check your details and try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="signup-name-grid">
        <label>
          First Name
          <input required value={account.firstName} onChange={(event) => setAccount({ ...account, firstName: event.target.value })} placeholder="Jeremiah" />
        </label>
        <label>
          Last Name
          <input required value={account.lastName} onChange={(event) => setAccount({ ...account, lastName: event.target.value })} placeholder="Muthama" />
        </label>
      </div>

      <label>
        Email address
        <input required type="email" value={account.email} onChange={(event) => setAccount({ ...account, email: event.target.value })} placeholder="you@example.com" />
      </label>

      <label className={styles.field}>
        Create a password
        <input required minLength={8} type={showPassword ? "text" : "password"} value={account.password} onChange={(event) => setAccount({ ...account, password: event.target.value })} placeholder="At least 8 characters" />
        <button className={styles.toggle} type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </label>

      <label>
        Confirm password
        <input required minLength={8} type={showPassword ? "text" : "password"} value={account.confirmPassword} onChange={(event) => setAccount({ ...account, confirmPassword: event.target.value })} placeholder="Repeat your password" />
      </label>

      <label className="terms-row">
        <input type="checkbox" checked={account.acceptTerms} onChange={(event) => setAccount({ ...account, acceptTerms: event.target.checked })} />
        <span>I accept the terms and agree to the platform policy.</span>
      </label>

      <p className="signup-note">No payment is required to create your account. Explore the workspace first and refine your portfolio at your own pace.</p>

      <button className="button button-dark" disabled={busy}>
        {busy ? <LoaderCircle className="spin" size={16} /> : <ArrowUpRight size={16} />}
        {busy ? "Creating workspace..." : "Create my free workspace"}
      </button>

      {message && <p className="account-message">{message}</p>}
      <p className="account-switch">Already have an account? <Link href="/login">Log in</Link></p>
    </form>
  );
}
