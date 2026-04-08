import { appConfig } from "@/lib/config";
import { fallbackTrackDetails, fallbackTracks } from "@/lib/mock-data";
import type { TrackDetail, TrackListItem } from "@/lib/types";

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
