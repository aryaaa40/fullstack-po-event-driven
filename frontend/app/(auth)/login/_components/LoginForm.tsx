"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, UserRound, Users, Briefcase, DollarSign } from "lucide-react";
import { authRepository } from "@/lib/repositories/authRepository";
import { useAuthStore } from "@/lib/store/authStore";
import { Role } from "@/types/auth";

type RoleOption = {
  key: Role;
  label: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

const ROLE_CREDENTIALS: Record<Role, { username: string; password: string }> = {
  REQUESTER: { username: "requesterpub", password: "requester123" },
  MANAGER: { username: "managerpub", password: "manager123" },
  FINANCE: { username: "financepub", password: "finance123" },
};

const ROLES: RoleOption[] = [
  { key: "REQUESTER", label: "Requester", Icon: Users },
  { key: "MANAGER", label: "Manager", Icon: Briefcase },
  { key: "FINANCE", label: "Finance", Icon: DollarSign },
];

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  const justRegistered = searchParams.get("registered") === "true";

  const [selectedRole, setSelectedRole] = useState<Role>("REQUESTER");
  const [username, setUsername] = useState(ROLE_CREDENTIALS.REQUESTER.username);
  const [password, setPassword] = useState(ROLE_CREDENTIALS.REQUESTER.password);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authRepository.login({ username, password });
      setAuth(res.token, res.user.username, res.user.role, res.user.departmentId ?? null, res.user.departmentName ?? null);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function handleRoleSelect(role: Role) {
    setSelectedRole(role);
    const creds = ROLE_CREDENTIALS[role];
    setUsername(creds.username);
    setPassword(creds.password);
  }

  return (
    <div
      className="flex w-full flex-col items-center justify-between lg:w-[40%]"
      style={{ backgroundColor: "#f7f9fb" }}
    >
      <div className="flex w-full flex-1 items-center justify-center px-6 py-10">
        <div className="w-full" style={{ maxWidth: "380px" }}>
          {/* Success banner setelah register */}
          {justRegistered && (
            <div
              className="mb-6 rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor: "#e6ffee",
                color: "#006d4a",
                border: "1px solid rgba(0,109,74,0.2)",
              }}
            >
              Account created! Please log in to continue.
            </div>
          )}

          {/* Title */}
          <div className="mb-8">
            <h2
              className="text-2xl font-bold"
              style={{
                color: "#2a3439",
                fontFamily: "var(--font-manrope), Manrope, sans-serif",
              }}
            >
              Hi, Welcome.
            </h2>
            <p className="mt-1 text-sm" style={{ color: "#566166" }}>
              Select your role and enter credentials to continue.
            </p>
          </div>

          {/* Role selector */}
          <div className="mb-6 grid grid-cols-3 gap-2">
            {ROLES.map(({ key, label, Icon }) => {
              const isActive = selectedRole === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleRoleSelect(key)}
                  className="flex flex-col items-center gap-1.5 rounded-xl py-3 text-center transition-colors"
                  style={{
                    backgroundColor: isActive ? "#ffffff" : "#f0f4f7",
                    border: isActive
                      ? "1.5px solid rgba(0,83,219,0.35)"
                      : "1.5px solid transparent",
                    color: isActive ? "#0053db" : "#566166",
                  }}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span
                    className="text-xs font-semibold tracking-wider"
                    style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                  >
                    {label.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="username"
                className="text-xs font-semibold tracking-widest"
                style={{ color: "#2a3439" }}
              >
                USERNAME
              </label>
              <div
                className="flex items-center gap-2 rounded-lg px-3"
                style={{ backgroundColor: "#f0f4f7" }}
              >
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#9ca3af]"
                  style={{ color: "#2a3439" }}
                />
                <UserRound size={16} style={{ color: "#9ca3af" }} />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold tracking-widest"
                  style={{ color: "#2a3439" }}
                >
                  PASSWORD
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold"
                  style={{ color: "#0053db" }}
                >
                  FORGOT?
                </button>
              </div>
              <div
                className="flex items-center gap-2 rounded-lg px-3"
                style={{ backgroundColor: "#f0f4f7" }}
              >
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#9ca3af]"
                  style={{ color: "#2a3439" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="flex items-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={16} style={{ color: "#9ca3af" }} />
                  ) : (
                    <Eye size={16} style={{ color: "#9ca3af" }} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex cursor-pointer items-center gap-2.5">
              <input type="checkbox" className="h-4 w-4 rounded accent-[#0053db]" />
              <span className="text-sm" style={{ color: "#566166" }}>
                Keep me logged in for 30 days
              </span>
            </label>

            {/* Error */}
            {error && (
              <p
                className="rounded-lg px-3 py-2 text-sm"
                style={{
                  backgroundColor: "#fff7f6",
                  color: "#9f403d",
                  border: "1px solid rgba(159,64,61,0.2)",
                }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl py-3.5 text-sm font-semibold tracking-wide transition-opacity disabled:opacity-60"
              style={{
                backgroundColor: "#0053db",
                color: "#f8f7ff",
                fontFamily: "var(--font-manrope), Manrope, sans-serif",
              }}
            >
              {loading ? "Signing in…" : "Login to Dashboard"}
            </button>
          </form>

          {/* Support */}
          <p className="mt-6 text-center text-sm" style={{ color: "#566166" }}>
            Don&apos;t have an account?{" "}
            <a href="/register" className="font-semibold" style={{ color: "#0053db" }}>
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="flex w-full items-center justify-center gap-3 py-5 text-xs tracking-wider"
        style={{ color: "#9ca3af" }}
      >
        <button type="button" className="transition-opacity hover:opacity-70">
          TERMS OF SERVICE
        </button>
        <span>·</span>
        <button type="button" className="transition-opacity hover:opacity-70">
          PRIVACY POLICY
        </button>
        <span>·</span>
        <span>V4.2.0-ALPHA</span>
      </footer>
    </div>
  );
}
