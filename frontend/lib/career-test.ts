import type { TrackListItem } from "@/lib/types";

export interface CareerTestOption {
  value: string;
  label: string;
}

export interface CareerTestQuestion {
  id: string;
  prompt: string;
  options: CareerTestOption[];
}

export interface CareerTestResult {
  recommended_track_slug: string;
  recommended_track_title: string;
  recommended_path_title: string;
  foundation_track_slug: string | null;
  explanation: string;
  created_at?: string | null;
}

export interface CareerTestState {
  questions: CareerTestQuestion[];
  has_attempt: boolean;
  can_retake: boolean;
  next_available_at: string | null;
  result: CareerTestResult | null;
  answers: Record<string, string>;
}

export const careerTestQuestions: CareerTestQuestion[] = [
  {
    id: "build",
    prompt: "Что ты хочешь создавать?",
    options: [
      { value: "games", label: "Игры (геймдев)" },
      { value: "websites", label: "Сайты и веб-сервисы" },
      { value: "data", label: "Анализировать данные и строить графики" },
      { value: "automation", label: "Автоматизировать рутину" },
      { value: "security", label: "Защищать системы (кибербезопасность)" },
    ],
  },
  {
    id: "study_style",
    prompt: "Как тебе удобнее учиться?",
    options: [
      { value: "theory", label: "Пошагово с теорией" },
      { value: "practice", label: "Сразу много практики" },
      { value: "projects", label: "С проектами в конце" },
      { value: "ai_hints", label: "С подсказками от ИИ" },
    ],
  },
  {
    id: "math_level",
    prompt: "Какой уровень математики тебе комфортен?",
    options: [
      { value: "basic", label: "Базовый (логика, арифметика)" },
      { value: "medium", label: "Средний (алгебра, функции)" },
      { value: "advanced", label: "Продвинутый (статистика, линал)" },
    ],
  },
  {
    id: "ai_interest",
    prompt: "Хочешь ли ты работать с ИИ?",
    options: [
      { value: "goal", label: "Да, это моя цель" },
      { value: "tool", label: "Да, как инструментом" },
      { value: "no", label: "Нет, чистая разработка" },
    ],
  },
  {
    id: "motivation",
    prompt: "Какая мотивация у тебя?",
    options: [
      { value: "dream_job", label: "Работа мечты" },
      { value: "salary", label: "Высокая зарплата" },
      { value: "startup", label: "Свои проекты/стартап" },
      { value: "self", label: "Для себя" },
    ],
  },
];

export function recommendTrackClient(
  answers: Record<string, string>,
  tracks: TrackListItem[],
): CareerTestResult {
  const bySlug = Object.fromEntries(tracks.map((track) => [track.slug, track]));
  const build = answers.build;
  const style = answers.study_style;
  const math = answers.math_level;
  const aiInterest = answers.ai_interest;

  let trackSlug = "python";
  let pathTitle = "Универсальный старт в разработке";
  let foundationTrackSlug: string | null = "python";
  let explanation =
    "Для мягкого старта лучше начать с Python: он снижает порог входа и помогает быстро увидеть результат.";

  if (build === "games" && math === "basic" && aiInterest === "tool") {
    trackSlug = "cpp";
    pathTitle = "ИИ в геймдеве";
    foundationTrackSlug = "cpp";
    explanation =
      "Тебе важны игры, умеренный порог математики и практический взгляд на ИИ. C++ даст сильную основу для геймдева и инженерного роста.";
  } else if (build === "websites" && style === "practice" && aiInterest === "no") {
    trackSlug = "javascript";
    pathTitle = "Профессиональный фронтенд";
    foundationTrackSlug = "javascript";
    explanation =
      "Тебя тянет к вебу и быстрому практическому циклу. JavaScript даст прямой путь к интерфейсам, фронтенду и пользовательским продуктам.";
  } else if (build === "data" && math === "advanced" && aiInterest === "goal") {
    trackSlug = "ai-specialist";
    pathTitle = "Специалист в области ИИ";
    foundationTrackSlug = "python";
    explanation =
      "У тебя сильный интерес к данным, высокая комфортность с математикой и фокус на ИИ как главной цели. Лучше всего тебе подойдёт AI-направление с опорой на Python.";
  } else if (build === "security" && style === "theory" && aiInterest === "no") {
    trackSlug = "cybersecurity";
    pathTitle = "Кибербезопасность для разработчика";
    foundationTrackSlug = "python";
    explanation =
      "Тебе подходит последовательное обучение и интерес к защите систем. Трек по кибербезопасности даст структурный путь к secure development и AppSec.";
  } else if (build === "games") {
    trackSlug = "cpp";
    pathTitle = "Системное программирование и геймдев";
    foundationTrackSlug = "cpp";
    explanation =
      "Игровая разработка лучше всего раскрывается через сильную инженерную базу, производительность и контроль над логикой приложения.";
  } else if (build === "websites") {
    trackSlug = "javascript";
    pathTitle = "Frontend и интерактивные интерфейсы";
    foundationTrackSlug = "javascript";
    explanation =
      "Веб-направление требует быстрого цикла обратной связи и удобной среды для построения интерфейсов. JavaScript здесь самый естественный старт.";
  } else if (build === "data") {
    if (aiInterest === "goal" || aiInterest === "tool") {
      trackSlug = "ai-specialist";
      pathTitle = "Данные и прикладной ИИ";
      foundationTrackSlug = "python";
      explanation =
        "Тебя привлекают данные и ИИ, поэтому стоит идти через Python-мышление к моделям, метрикам и прикладным сценариям.";
    } else {
      trackSlug = "data-analysis";
      pathTitle = "Аналитика и работа с данными";
      foundationTrackSlug = "python";
      explanation =
        "Тебе близка аналитическая работа с таблицами, метриками и выводами. Data Analysis даст практичный путь без лишнего перегруза.";
    }
  } else if (build === "automation") {
    trackSlug = "python";
    pathTitle = "Автоматизация и прикладной Python";
    foundationTrackSlug = "python";
    explanation =
      "Автоматизация лучше всего стартует через Python: он даёт быстрый результат, понятный синтаксис и сильную прикладную базу.";
  } else if (build === "security") {
    trackSlug = "cybersecurity";
    pathTitle = "Безопасная разработка";
    foundationTrackSlug = "python";
    explanation =
      "Если тебя тянет к защите систем, удобнее всего идти через практику secure development, логи, уязвимости и мышление защитника.";
  }

  const track = bySlug[trackSlug];

  return {
    recommended_track_slug: trackSlug,
    recommended_track_title: track?.title ?? trackSlug,
    recommended_path_title: pathTitle,
    foundation_track_slug: foundationTrackSlug,
    explanation,
    created_at: new Date().toISOString(),
  };
}

export function createCareerTestFallbackState(tracks: TrackListItem[]): CareerTestState {
  return {
    questions: careerTestQuestions,
    has_attempt: false,
    can_retake: true,
    next_available_at: null,
    result: null,
    answers: {},
  };
}
