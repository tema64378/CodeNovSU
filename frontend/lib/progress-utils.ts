import type { ProgressStatus, TrackDetail, TrackProgressData } from "@/lib/types";

export function buildDefaultTrackProgress(track: TrackDetail): TrackProgressData {
  const orderedLessons = track.levels.flatMap((level) => level.lessons);
  let nextUnlocked = true;

  const lessons = orderedLessons.map((lesson) => {
    const status: ProgressStatus = nextUnlocked ? "available" : "locked";
    nextUnlocked = false;

    return {
      lesson_id: lesson.id,
      lesson_slug: lesson.slug,
      status,
      score: 0,
    };
  });

  return {
    track_slug: track.slug,
    total_lessons: orderedLessons.length,
    completed_lessons: 0,
    current_lesson_slug: lessons.find((lesson) => lesson.status === "available")?.lesson_slug ?? null,
    lessons,
  };
}
