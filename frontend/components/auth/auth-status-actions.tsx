"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";

export function AuthStatusActions() {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const onLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading) {
    return <span className="badge-inline">Проверяем сессию…</span>;
  }

  if (!user) {
    return (
      <>
        <span className="badge-inline">Гость</span>
        {pathname !== "/login" ? (
          <Link href="/login" className="button button--primary">
            Войти
          </Link>
        ) : null}
      </>
    );
  }

  return (
    <>
      <span className="badge-inline">{user.display_name}</span>
      {pathname !== "/dashboard" ? (
        <Link href="/dashboard" className="button button--ghost">
          Кабинет
        </Link>
      ) : null}
      <button type="button" className="button button--primary" onClick={onLogout}>
        Выйти
      </button>
    </>
  );
}
