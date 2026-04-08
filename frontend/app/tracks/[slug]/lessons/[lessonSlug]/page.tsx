import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LessonOverview } from "@/components/lessons/lesson-overview";
import { getLesson } from "@/lib/api/codenovsu";

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params;
  const lesson = await getLesson(slug, lessonSlug);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="section">
        <div className="container">
          <LessonOverview trackSlug={slug} lesson={lesson} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
