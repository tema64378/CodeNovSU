"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";

type Mode = "login" | "register";

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
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
        router.push("/career-test");
      } else {
        await login({ email, password });
        router.push("/dashboard");
      }
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Не удалось выполнить запрос.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="detail-card">
      <div className="eyebrow">Вход в маршрут</div>
      <h1 style={{ marginTop: 0 }}>{mode === "login" ? "С возвращением в CodeNovsu" : "Создай аккаунт и начни путь"}</h1>
      <p>
        Аккаунт нужен не ради формальности. Он сохраняет прогресс, открывает кабинет, позволяет возвращаться к
        задачам и делает обучение непрерывным.
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

      <form onSubmit={onSubmit} className="auth-form">
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
            ? "После входа ты сразу попадёшь в кабинет с прогрессом, картой трека и достижениями."
            : "После регистрации аккаунт сразу открывает кабинет и закрепляет твою учебную траекторию."}
        </div>

        {error ? <div className="auth-error">{error}</div> : null}

        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? "Отправляем…" : mode === "login" ? "Войти" : "Создать аккаунт"}
        </button>
      </form>
    </div>
  );
}
