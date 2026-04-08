import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TaskWorkspace } from "@/components/tasks/task-workspace";
import { getTask } from "@/lib/api/codenovsu";

interface TaskPageProps {
  params: Promise<{ slug: string; lessonSlug: string; taskSlug: string }>;
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { slug, lessonSlug, taskSlug } = await params;
  const task = await getTask(slug, lessonSlug, taskSlug);

  if (!task) {
    notFound();
  }

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="section">
        <div className="container">
          <TaskWorkspace trackSlug={slug} lessonSlug={lessonSlug} task={task} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
