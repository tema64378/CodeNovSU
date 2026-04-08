import { curriculumCatalog } from "@/lib/curriculum-catalog";
import type { LessonDetail, TaskDetail, TrackDetail, TrackListItem } from "@/lib/types";

const fallbackTrackDetailsEntries = curriculumCatalog.map((track) => {
  const levels = track.levels.map((level) => ({
    id: `level-${track.slug}-${level.difficulty}`,
    title: level.title,
    difficulty: level.difficulty,
    order_index: level.order_index,
    theme_color: level.theme_color,
    icon: level.icon,
    lessons: level.lessons.map((lesson) => ({
      id: `lesson-${track.slug}-${lesson.slug}`,
      slug: lesson.slug,
      title: lesson.title,
      summary: lesson.summary,
      estimated_minutes: lesson.estimated_minutes,
      access_tier: lesson.access_tier,
      order_index: lesson.order_index,
      task_count: lesson.tasks.length,
      has_project_task: lesson.tasks.some((task) => task.is_project_step),
      has_boss_task: lesson.tasks.some((task) => task.is_boss),
    })),
  }));

  const detail: TrackDetail = {
    id: `track-${track.slug}`,
    slug: track.slug,
    title: track.title,
    description: track.description,
    category: track.category,
    is_premium: track.is_premium,
    is_published: track.is_published,
    levels,
  };

  return [track.slug, detail] as const;
});

export const fallbackTrackDetails: Record<string, TrackDetail> = Object.fromEntries(fallbackTrackDetailsEntries);

export const fallbackTracks: TrackListItem[] = curriculumCatalog.map((track) => ({
  id: `track-${track.slug}`,
  slug: track.slug,
  title: track.title,
  description: track.description,
  category: track.category,
  is_premium: track.is_premium,
  is_published: track.is_published,
}));

export const fallbackLessonDetails: Record<string, LessonDetail> = Object.fromEntries(
  curriculumCatalog.flatMap((track) =>
    track.levels.flatMap((level) =>
      level.lessons.map((lesson) => [
        `${track.slug}:${lesson.slug}`,
        {
          id: `lesson-${track.slug}-${lesson.slug}`,
          slug: lesson.slug,
          title: lesson.title,
          summary: lesson.summary,
          theory_md: lesson.theory_md,
          estimated_minutes: lesson.estimated_minutes,
          access_tier: lesson.access_tier,
          order_index: lesson.order_index,
          tasks: lesson.tasks.map((task) => ({
            id: `task-${track.slug}-${lesson.slug}-${task.slug}`,
            slug: task.slug,
            title: task.title,
            language: task.language,
            difficulty: task.difficulty,
            access_tier: task.access_tier,
            estimated_minutes: task.estimated_minutes,
            max_hints: task.max_hints,
            is_project_step: task.is_project_step,
            is_boss: task.is_boss,
          })),
        } satisfies LessonDetail,
      ]),
    ),
  ),
);

export const fallbackTaskDetails: Record<string, TaskDetail> = Object.fromEntries(
  curriculumCatalog.flatMap((track) =>
    track.levels.flatMap((level) =>
      level.lessons.flatMap((lesson) =>
        lesson.tasks.map((task) => [
          `${track.slug}:${lesson.slug}:${task.slug}`,
          {
            id: `task-${track.slug}-${lesson.slug}-${task.slug}`,
            slug: task.slug,
            title: task.title,
            description_md: task.description_md,
            language: task.language,
            difficulty: task.difficulty,
            starter_code: task.starter_code,
            solution_template: task.solution_template,
            max_hints: task.max_hints,
            access_tier: task.access_tier,
            estimated_minutes: task.estimated_minutes,
            is_project_step: task.is_project_step,
            is_boss: task.is_boss,
            visible_test_cases: task.visible_test_cases.map((testCase, index) => ({
              id: `case-${track.slug}-${lesson.slug}-${task.slug}-${index + 1}`,
              kind: testCase.kind,
              input_payload: testCase.input_payload,
              expected_output: testCase.expected_output,
              weight: testCase.weight,
            })),
          } satisfies TaskDetail,
        ]),
      ),
    ),
  ),
);
