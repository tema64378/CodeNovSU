import { appConfig } from "@/lib/config";
import type { CareerTestState } from "@/lib/career-test";
import { fallbackLessonDetails, fallbackTaskDetails, fallbackTrackDetails, fallbackTracks } from "@/lib/mock-data";
import type {
  AchievementListData,
  DashboardData,
  HintResponse,
  LessonDetail,
  TrackProgressData,
  SubmissionResult,
  TaskDetail,
  TrackDetail,
  TrackListItem,
} from "@/lib/types";

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    next: { revalidate: 60 },
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getTracks(): Promise<TrackListItem[]> {
  try {
    return await apiFetch<TrackListItem[]>("/tracks");
  } catch {
    return fallbackTracks;
  }
}

export async function getTrack(slug: string): Promise<TrackDetail | null> {
  try {
    return await apiFetch<TrackDetail>(`/tracks/${slug}`);
  } catch {
    return fallbackTrackDetails[slug] ?? null;
  }
}

export async function getLesson(trackSlug: string, lessonSlug: string): Promise<LessonDetail | null> {
  try {
    return await apiFetch<LessonDetail>(`/tracks/${trackSlug}/lessons/${lessonSlug}`);
  } catch {
    return fallbackLessonDetails[`${trackSlug}:${lessonSlug}`] ?? null;
  }
}

export async function getTask(trackSlug: string, lessonSlug: string, taskSlug: string): Promise<TaskDetail | null> {
  try {
    return await apiFetch<TaskDetail>(`/tracks/${trackSlug}/lessons/${lessonSlug}/tasks/${taskSlug}`);
  } catch {
    return fallbackTaskDetails[`${trackSlug}:${lessonSlug}:${taskSlug}`] ?? null;
  }
}

export async function createSubmission(
  taskId: string,
  payload: { language: string; source_code: string },
  token: string,
): Promise<SubmissionResult> {
  const response = await fetch(`${appConfig.apiBaseUrl}/tracks/tasks/${taskId}/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as SubmissionResult | { detail?: string } | null;
  if (!response.ok) {
    const detail =
      data && typeof data === "object" && "detail" in data && data.detail ? data.detail : "Submission failed.";
    throw new Error(detail);
  }

  return data as SubmissionResult;
}

export async function getDashboard(token: string): Promise<DashboardData> {
  const response = await fetch(`${appConfig.apiBaseUrl}/progress/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = (await response.json().catch(() => null)) as DashboardData | { detail?: string } | null;
  if (!response.ok) {
    const detail =
      data && typeof data === "object" && "detail" in data && data.detail ? data.detail : "Dashboard request failed.";
    throw new Error(detail);
  }
  return data as DashboardData;
}

export async function getTrackProgress(trackSlug: string, token: string): Promise<TrackProgressData> {
  const response = await fetch(`${appConfig.apiBaseUrl}/progress/tracks/${trackSlug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = (await response.json().catch(() => null)) as TrackProgressData | { detail?: string } | null;
  if (!response.ok) {
    const detail =
      data && typeof data === "object" && "detail" in data && data.detail ? data.detail : "Track progress request failed.";
    throw new Error(detail);
  }
  return data as TrackProgressData;
}

export async function getAchievements(token: string): Promise<AchievementListData> {
  const response = await fetch(`${appConfig.apiBaseUrl}/progress/achievements`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = (await response.json().catch(() => null)) as AchievementListData | { detail?: string } | null;
  if (!response.ok) {
    const detail =
      data && typeof data === "object" && "detail" in data && data.detail ? data.detail : "Achievements request failed.";
    throw new Error(detail);
  }
  return data as AchievementListData;
}

export async function getCareerTestState(token: string): Promise<CareerTestState> {
  const response = await fetch(`${appConfig.apiBaseUrl}/career-test`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = (await response.json().catch(() => null)) as CareerTestState | { detail?: string } | null;
  if (!response.ok) {
    const detail =
      data && typeof data === "object" && "detail" in data && data.detail ? data.detail : "Career test request failed.";
    throw new Error(detail);
  }
  return data as CareerTestState;
}

export async function submitCareerTest(
  token: string,
  answers: Record<string, string>,
): Promise<CareerTestState> {
  const response = await fetch(`${appConfig.apiBaseUrl}/career-test/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers }),
  });
  const data = (await response.json().catch(() => null)) as CareerTestState | { detail?: string } | null;
  if (!response.ok) {
    const detail =
      data && typeof data === "object" && "detail" in data && data.detail ? data.detail : "Career test submit failed.";
    throw new Error(detail);
  }
  return data as CareerTestState;
}

export async function completeLesson(lessonId: string, token: string) {
  const response = await fetch(`${appConfig.apiBaseUrl}/progress/lessons/${lessonId}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: "completed" }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail =
      data && typeof data === "object" && "detail" in data && data.detail ? data.detail : "Lesson completion failed.";
    throw new Error(detail);
  }
  return data;
}

export async function requestHint(
  taskId: string,
  payload: {
    code: string;
    level: number;
    submission_id?: string | null;
    task_context?: {
      id: string;
      title: string;
      description: string;
      language: string;
      difficulty: string;
      max_hints: number;
      hint_count: number;
      visible_tests: Array<{
        kind: string;
        input_payload: string;
        expected_output: string;
      }>;
    };
  },
  token: string,
): Promise<HintResponse> {
  const requestLessonOnlyHint = async () => {
    if (!payload.task_context) {
      throw new Error("Lesson AI context is missing.");
    }

    const response = await fetch("/api/lesson-ai/hint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        level: payload.level,
        code: payload.code,
        hintCount: payload.task_context.hint_count,
        task: {
          id: payload.task_context.id,
          title: payload.task_context.title,
          description: payload.task_context.description,
          language: payload.task_context.language,
          difficulty: payload.task_context.difficulty,
          maxHints: payload.task_context.max_hints,
          visibleTests: payload.task_context.visible_tests.map((testCase) => ({
            kind: testCase.kind,
            input: testCase.input_payload,
            expectedOutput: testCase.expected_output,
          })),
        },
      }),
    });

    const data = (await response.json().catch(() => null)) as HintResponse | { detail?: string } | null;
    if (!response.ok) {
      const detail =
        data && typeof data === "object" && "detail" in data && data.detail ? data.detail : "Lesson AI request failed.";
      throw new Error(detail);
    }

    return data as HintResponse;
  };

  if (token.startsWith("local-auth:")) {
    return requestLessonOnlyHint();
  }

  const response = await fetch(`${appConfig.apiBaseUrl}/ai/tasks/${taskId}/hint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      code: payload.code,
      level: payload.level,
      submission_id: payload.submission_id,
    }),
  });
  const data = (await response.json().catch(() => null)) as HintResponse | { detail?: string } | null;
  if (!response.ok) {
    const detail =
      data && typeof data === "object" && "detail" in data && data.detail ? data.detail : "Hint request failed.";

    if (
      payload.task_context &&
      (response.status >= 500 || /database is unavailable/i.test(detail) || /failed to fetch/i.test(detail))
    ) {
      return requestLessonOnlyHint();
    }

    throw new Error(detail);
  }
  return data as HintResponse;
}
