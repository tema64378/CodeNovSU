export type AccessTier = "free" | "premium" | "module_paid";
export type ProgressStatus = "locked" | "available" | "in_progress" | "completed";

export interface LessonSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  estimated_minutes: number;
  access_tier: AccessTier;
  order_index: number;
  task_count: number;
  has_project_task: boolean;
  has_boss_task: boolean;
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

export interface TaskSummary {
  id: string;
  slug: string;
  title: string;
  language: string;
  difficulty: string;
  access_tier: AccessTier;
  estimated_minutes: number;
  max_hints: number;
  is_project_step: boolean;
  is_boss: boolean;
}

export interface LessonDetail {
  id: string;
  slug: string;
  title: string;
  summary: string;
  theory_md: string;
  estimated_minutes: number;
  access_tier: AccessTier;
  order_index: number;
  tasks: TaskSummary[];
}

export interface TaskTestCase {
  id: string;
  kind: string;
  input_payload: string;
  expected_output: string;
  weight: number;
}

export interface TaskDetail {
  id: string;
  slug: string;
  title: string;
  description_md: string;
  language: string;
  difficulty: string;
  starter_code: string;
  solution_template: string | null;
  max_hints: number;
  access_tier: AccessTier;
  estimated_minutes: number;
  is_project_step: boolean;
  is_boss: boolean;
  visible_test_cases: TaskTestCase[];
}

export interface SubmissionResult {
  id: string;
  task_id: string;
  user_id: string;
  language: string;
  status: string;
  score: number;
  stdout: string | null;
  stderr: string | null;
  execution_time_ms: number | null;
  memory_kb: number | null;
}

export interface DashboardStat {
  label: string;
  value: string;
}

export interface RecentSubmission {
  id: string;
  task_id: string;
  language: string;
  status: string;
  score: number;
  created_at: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  recent_submissions: RecentSubmission[];
}

export interface HintResponse {
  id: string;
  level: number;
  response_text: string;
  remaining_hints: number;
}

export interface LessonProgressSnapshot {
  lesson_id: string;
  lesson_slug: string;
  status: ProgressStatus;
  score: number;
}

export interface TrackProgressData {
  track_slug: string;
  total_lessons: number;
  completed_lessons: number;
  current_lesson_slug: string | null;
  lessons: LessonProgressSnapshot[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: string;
  status: "locked" | "unlocked";
  progress_current: number;
  progress_target: number;
}

export interface AchievementListData {
  achievements: Achievement[];
}
