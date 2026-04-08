"use client";

import { useAuth } from "@/components/providers/auth-provider";

const dashboardStats = [
  { label: "Уроков в процессе", value: "1" },
  { label: "Доступных AI hints", value: "3" },
  { label: "Активный трек", value: "C++" },
  { label: "Следующая цель", value: "Hello, World!" },
];

export function DashboardClient() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <section className="detail-card">
      <div className="eyebrow">Dashboard</div>
      <h1 style={{ marginTop: 0 }}>Привет, {user.display_name}</h1>
      <p>
        Это новый production‑кабинет, который уже знает текущего пользователя через JWT и client auth provider.
      </p>

      <div className="detail-chip-row" style={{ marginBottom: 18 }}>
        <span className="chip">{user.email}</span>
        <span className="chip">{user.role}</span>
        <span className={`chip ${user.email_verified ? "chip--free" : "chip--premium"}`}>
          {user.email_verified ? "Email verified" : "Email pending"}
        </span>
      </div>

      <div className="stat-grid">
        {dashboardStats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
