export type AccessTier = "free" | "premium" | "module_paid";

export interface LessonSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  estimated_minutes: number;
  access_tier: AccessTier;
  order_index: number;
}

export interface Level {
  id: string;
  title: string;
  difficulty: string;
  order_index: number;
  theme_color: string;
  icon: string;
  lessons: LessonSummary[];
}

export interface TrackListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  is_premium: boolean;
  is_published: boolean;
}

export interface TrackDetail extends TrackListItem {
  levels: Level[];
}
