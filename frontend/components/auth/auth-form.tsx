"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";

type Mode = "login" | "register";

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    const displayName = String(formData.get("displayName") || "").trim();

    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await register({
          email,
          password,
          display_name: displayName,
        });
      } else {
        await login({ email, password });
      }
      router.push("/dashboard");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Не удалось выполнить запрос.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="detail-card">
      <div className="eyebrow">Auth flow</div>
      <h1 style={{ marginTop: 0 }}>{mode === "login" ? "Вход в CodeNovsu" : "Создание аккаунта"}</h1>
      <p>
        Это уже production‑страница, подключённая к backend API. Дальше сюда можно спокойно добавлять OAuth,
        подтверждение почты и onboarding без переписывания маршрута.
      </p>

      <div className="detail-chip-row" style={{ marginBottom: 18 }}>
        <button
          type="button"
          className={`button ${mode === "login" ? "button--primary" : "button--ghost"}`}
          onClick={() => setMode("login")}
        >
          Вход
        </button>
        <button
          type="button"
          className={`button ${mode === "register" ? "button--primary" : "button--ghost"}`}
          onClick={() => setMode("register")}
        >
          Регистрация
        </button>
      </div>

      <form action={onSubmit} className="auth-form">
        {mode === "register" ? (
          <label className="auth-field">
            <span>Как вас называть</span>
            <input name="displayName" type="text" placeholder="Артём" minLength={2} required />
          </label>
        ) : null}
        <label className="auth-field">
          <span>Email</span>
          <input name="email" type="email" placeholder="you@example.com" required />
        </label>
        <label className="auth-field">
          <span>Пароль</span>
          <input name="password" type="password" placeholder="Минимум 8 символов" minLength={8} required />
        </label>

        <div className="auth-note">
          {mode === "login"
            ? "Войдите, чтобы открыть кабинет, видеть прогресс и дальше подключать lesson/task flow."
            : "После регистрации backend сразу возвращает JWT и пользователь попадает в кабинет."}
        </div>

        {error ? <div className="auth-error">{error}</div> : null}

        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? "Отправляем…" : mode === "login" ? "Войти" : "Создать аккаунт"}
        </button>
      </form>
    </div>
  );
}
