"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, router, user]);

  if (isLoading) {
    return (
      <main className="container" style={{ padding: "64px 0" }}>
        <div className="detail-card">
          <div className="eyebrow">Auth</div>
          <h1 style={{ margin: 0 }}>Проверяем доступ</h1>
          <p>Загружаем пользовательскую сессию и профиль.</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container" style={{ padding: "64px 0" }}>
        <div className="detail-card">
          <div className="eyebrow">Auth required</div>
          <h1 style={{ margin: 0 }}>Нужен вход в аккаунт</h1>
          <p>Для доступа к кабинету и прогрессу требуется авторизация.</p>
          <Link href="/login" className="button button--primary">
            Перейти ко входу
          </Link>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
