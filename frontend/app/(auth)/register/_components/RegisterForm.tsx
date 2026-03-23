"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserRound, Mail, Users, Briefcase, DollarSign } from "lucide-react";
import { authRepository } from "@/lib/repositories/authRepository";
import { departmentRepository } from "@/lib/repositories/departmentRepository";
import { Role } from "@/types/auth";
import { Department } from "@/types/po";

type RoleOption = {
  key: Role;
  label: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

const ROLES: RoleOption[] = [
  { key: "REQUESTER", label: "Requester", Icon: Users },
  { key: "MANAGER",   label: "Manager",   Icon: Briefcase },
  { key: "FINANCE",   label: "Finance",   Icon: DollarSign },
];

export default function RegisterForm() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<Role>("REQUESTER");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsDepartment = selectedRole === "REQUESTER" || selectedRole === "MANAGER";

  useEffect(() => {
    departmentRepository.getAll().then(setDepartments).catch(() => setDepartments([]));
  }, []);

  // Reset department saat role berubah ke FINANCE
  useEffect(() => {
    if (!needsDepartment) setDepartmentId(null);
  }, [selectedRole, needsDepartment]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (needsDepartment && !departmentId) {
      setError("Please select a department");
      return;
    }

    setLoading(true);
    try {
      await authRepository.register({
        username,
        email,
        password,
        role: selectedRole,
        departmentId: needsDepartment ? departmentId : null,
      });
      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex w-full flex-col items-center justify-between lg:w-[40%]"
      style={{ backgroundColor: "#f7f9fb" }}
    >
      <div className="flex w-full flex-1 items-center justify-center px-6 py-10">
        <div className="w-full" style={{ maxWidth: "380px" }}>
          {/* Title */}
          <div className="mb-8">
            <h2
              className="text-2xl font-bold"
              style={{
                color: "#2a3439",
                fontFamily: "var(--font-manrope), Manrope, sans-serif",
              }}
            >
              Create Account
            </h2>
            <p className="mt-1 text-sm" style={{ color: "#566166" }}>
              Select your role and fill in your details to get started.
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
                  onClick={() => setSelectedRole(key)}
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
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#9ca3af]"
                  style={{ color: "#2a3439" }}
                />
                <UserRound size={16} style={{ color: "#9ca3af" }} />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold tracking-widest"
                style={{ color: "#2a3439" }}
              >
                EMAIL
              </label>
              <div
                className="flex items-center gap-2 rounded-lg px-3"
                style={{ backgroundColor: "#f0f4f7" }}
              >
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#9ca3af]"
                  style={{ color: "#2a3439" }}
                />
                <Mail size={16} style={{ color: "#9ca3af" }} />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold tracking-widest"
                style={{ color: "#2a3439" }}
              >
                PASSWORD
              </label>
              <div
                className="flex items-center gap-2 rounded-lg px-3"
                style={{ backgroundColor: "#f0f4f7" }}
              >
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
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

            {/* Department — hanya untuk REQUESTER dan MANAGER */}
            {needsDepartment && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="department"
                  className="text-xs font-semibold tracking-widest"
                  style={{ color: "#2a3439" }}
                >
                  DEPARTMENT
                </label>
                <div
                  className="flex items-center gap-2 rounded-lg px-3"
                  style={{ backgroundColor: "#f0f4f7" }}
                >
                  <select
                    id="department"
                    value={departmentId ?? ""}
                    onChange={(e) =>
                      setDepartmentId(e.target.value ? Number(e.target.value) : null)
                    }
                    className="flex-1 bg-transparent py-3 text-sm outline-none"
                    style={{ color: departmentId ? "#2a3439" : "#9ca3af" }}
                  >
                    <option value="" disabled>
                      Select department
                    </option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id} style={{ color: "#2a3439" }}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>
                {departments.length === 0 && (
                  <p className="text-xs" style={{ color: "#9ca3af" }}>
                    No departments available. Contact your administrator.
                  </p>
                )}
              </div>
            )}

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
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          {/* Link ke login */}
          <p className="mt-6 text-center text-sm" style={{ color: "#566166" }}>
            Already have an account?{" "}
            <a href="/login" className="font-semibold" style={{ color: "#0053db" }}>
              Sign in
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
