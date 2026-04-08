"use client";

import { buildDefaultTrackProgress } from "@/lib/progress-utils";
import type { ProgressStatus, TrackDetail, TrackProgressData } from "@/lib/types";

const PROGRESS_STORAGE_KEY = "codenovsu.progress";

type StoredTrackProgress = Record<string, ProgressStatus>;
type StoredProgress = Record<string, StoredTrackProgress>;

function readStoredProgress(): StoredProgress {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as StoredProgress;
  } catch {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
    return {};
  }
}

function writeStoredProgress(value: StoredProgress) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(value));
}

function mergeProgress(track: TrackDetail, overrides: StoredTrackProgress): TrackProgressData {
  const orderedLessons = track.levels.flatMap((level) => level.lessons);
  let nextUnlocked = true;
  let currentLessonSlug: string | null = null;

  const lessons = orderedLessons.map((lesson) => {
    const explicitStatus = overrides[lesson.slug];
    let status: ProgressStatus;

    if (explicitStatus === "completed") {
      status = "completed";
      nextUnlocked = true;
    } else if (explicitStatus === "in_progress") {
      status = "in_progress";
      nextUnlocked = false;
    } else if (nextUnlocked) {
      status = "available";
      nextUnlocked = false;
    } else {
      status = "locked";
    }

    if (currentLessonSlug === null && (status === "available" || status === "in_progress")) {
      currentLessonSlug = lesson.slug;
    }

    return {
      lesson_id: lesson.id,
      lesson_slug: lesson.slug,
      status,
      score: status === "completed" ? 100 : 0,
    };
  });

  return {
    track_slug: track.slug,
    total_lessons: orderedLessons.length,
    completed_lessons: lessons.filter((lesson) => lesson.status === "completed").length,
    current_lesson_slug: currentLessonSlug,
    lessons,
  };
}

export function getLocalTrackProgress(track: TrackDetail): TrackProgressData {
  const stored = readStoredProgress();
  const trackProgress = stored[track.slug];
  if (!trackProgress) {
    return buildDefaultTrackProgress(track);
  }
  return mergeProgress(track, trackProgress);
}

export function markLessonCompletedLocally(trackSlug: string, lessonSlug: string) {
  const stored = readStoredProgress();
  const nextTrackProgress = {
    ...(stored[trackSlug] ?? {}),
    [lessonSlug]: "completed" as ProgressStatus,
  };

  writeStoredProgress({
    ...stored,
    [trackSlug]: nextTrackProgress,
  });
}

export function markLessonInProgressLocally(trackSlug: string, lessonSlug: string) {
  const stored = readStoredProgress();
  const currentTrack = stored[trackSlug] ?? {};
  if (currentTrack[lessonSlug] === "completed") {
    return;
  }

  writeStoredProgress({
    ...stored,
    [trackSlug]: {
      ...currentTrack,
      [lessonSlug]: "in_progress",
    },
  });
}
