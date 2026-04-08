"use client";

import { fallbackTrackDetails } from "@/lib/mock-data";
import { getLocalTrackProgress } from "@/lib/progress-store";
import type { AchievementListData, DashboardData } from "@/lib/types";

function getLocalProgressSummary() {
  const progressList = Object.values(fallbackTrackDetails).map((track) => getLocalTrackProgress(track));
  const completedLessons = progressList.reduce((sum, track) => sum + track.completed_lessons, 0);
  const activeLessons = progressList.reduce(
    (sum, track) => sum + track.lessons.filter((lesson) => lesson.status === "in_progress").length,
    0,
  );
  const totalLessons = progressList.reduce((sum, track) => sum + track.total_lessons, 0);

  return {
    completedLessons,
    activeLessons,
    totalLessons,
  };
}

export function getLocalDashboardFallback(): DashboardData {
  const summary = getLocalProgressSummary();
  return {
    stats: [
      { label: "Уроков завершено", value: String(summary.completedLessons) },
      { label: "Активных уроков", value: String(summary.activeLessons) },
      { label: "Всего в маршруте", value: String(summary.totalLessons) },
      { label: "AI-подсказок сегодня", value: summary.completedLessons > 0 ? "1" : "0" },
    ],
    recent_submissions: [],
  };
}

export function getLocalAchievementFallback(): AchievementListData {
  const summary = getLocalProgressSummary();

  const achievements = [
    {
      id: "first-steps",
      title: "Первые шаги",
      description: "Заверши первый урок и почувствуй ритм платформы.",
      reward: "+1 AI-подсказка",
      status: summary.completedLessons >= 1 ? "unlocked" : "locked",
      progress_current: summary.completedLessons,
      progress_target: 1,
    },
    {
      id: "rising-star",
      title: "Восходящая звезда",
      description: "Закрой большой пласт контента и открой серьёзный темп обучения.",
      reward: "Рамка аватара",
      status: summary.completedLessons >= 25 ? "unlocked" : "locked",
      progress_current: summary.completedLessons,
      progress_target: 25,
    },
    {
      id: "practice-engine",
      title: "Двигатель практики",
      description: "Держи движение по маршруту и не теряй темп практики.",
      reward: "Сундук с наградой",
      status: summary.activeLessons >= 1 ? "unlocked" : "locked",
      progress_current: summary.activeLessons,
      progress_target: 1,
    },
  ] as const;

  return {
    achievements: achievements.map((achievement) => ({
      ...achievement,
      status: achievement.status,
    })),
  };
}
