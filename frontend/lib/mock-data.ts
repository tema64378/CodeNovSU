import type { TrackDetail, TrackListItem } from "@/lib/types";

export const fallbackTracks: TrackListItem[] = [
  {
    id: "track-cpp",
    slug: "cpp",
    title: "C++",
    description: "Системное программирование, алгоритмы и уверенная инженерная база.",
    category: "programming",
    is_premium: false,
    is_published: true,
  },
  {
    id: "track-python",
    slug: "python",
    title: "Python",
    description: "Автоматизация, backend и инструменты для задач с данными и ИИ.",
    category: "programming",
    is_premium: false,
    is_published: true,
  },
  {
    id: "track-ai",
    slug: "ai-specialist",
    title: "AI Specialist",
    description: "Нейросети, эксперименты с моделями и проектные сценарии.",
    category: "ai",
    is_premium: true,
    is_published: true,
  },
  {
    id: "track-security",
    slug: "cybersecurity",
    title: "Cybersecurity",
    description: "Безопасная разработка, практика анализа уязвимостей и защитные подходы.",
    category: "security",
    is_premium: true,
    is_published: true,
  },
];

export const fallbackTrackDetails: Record<string, TrackDetail> = {
  cpp: {
    ...fallbackTracks[0],
    levels: [
      {
        id: "level-beginner",
        title: "Beginner Island",
        difficulty: "beginner",
        order_index: 1,
        theme_color: "#4CAF50",
        icon: "🌱",
        lessons: [
          {
            id: "lesson-hello",
            slug: "hello-world-and-structure",
            title: "Hello, World! и структура программы",
            summary: "Разбираем точку входа, вывод в консоль и минимальную структуру C++ программы.",
            estimated_minutes: 15,
            access_tier: "free",
            order_index: 1,
          },
        ],
      },
    ],
  },
};
