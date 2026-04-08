"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { buildDefaultTrackProgress } from "@/lib/progress-utils";
import type { ProgressStatus, TrackDetail, TrackProgressData } from "@/lib/types";

interface TrackCanvasMapProps {
  track: TrackDetail;
  progress?: TrackProgressData;
  interactive?: boolean;
  showDecorations?: boolean;
}

interface IslandLayout {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  icon: string;
  color: string;
}

interface NodeLayout {
  key: string;
  x: number;
  y: number;
  label: string;
  title: string;
  href: string;
  status: ProgressStatus;
  isBoss: boolean;
  isProject: boolean;
  accessTier: string;
}

interface BadgeLayout {
  key: string;
  x: number;
  y: number;
  label: string;
  tone: "npc" | "chest";
}

interface MapLayout {
  width: number;
  height: number;
  islands: IslandLayout[];
  nodes: NodeLayout[];
  badges: BadgeLayout[];
}

const statusPalette: Record<ProgressStatus, { fill: string; glow: string; stroke: string }> = {
  locked: { fill: "#b0aba3", glow: "rgba(31, 26, 19, 0.12)", stroke: "#8b857c" },
  available: { fill: "#2f7de1", glow: "rgba(47, 125, 225, 0.2)", stroke: "#225faf" },
  in_progress: { fill: "#d9822b", glow: "rgba(217, 130, 43, 0.22)", stroke: "#b36a1f" },
  completed: { fill: "#1c7c54", glow: "rgba(28, 124, 84, 0.2)", stroke: "#14553a" },
};

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((char) => `${char}${char}`).join("") : value;
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getPreviewProgress(track: TrackDetail): TrackProgressData {
  const fallback = buildDefaultTrackProgress(track);
  const nextLessons = fallback.lessons.map((lesson, index) => {
    if (index === 0) {
      return { ...lesson, status: "completed" as ProgressStatus, score: 100 };
    }
    if (index === 1) {
      return { ...lesson, status: "in_progress" as ProgressStatus, score: 62 };
    }
    if (index === 2) {
      return { ...lesson, status: "available" as ProgressStatus, score: 0 };
    }
    return lesson;
  });

  return {
    ...fallback,
    completed_lessons: nextLessons.filter((lesson) => lesson.status === "completed").length,
    current_lesson_slug: nextLessons.find((lesson) => lesson.status === "in_progress")?.lesson_slug ?? fallback.current_lesson_slug,
    lessons: nextLessons,
  };
}

function buildLayout(track: TrackDetail, progress: TrackProgressData, width: number, showDecorations: boolean): MapLayout {
  const safeWidth = Math.max(width, 320);
  const height = Math.max(560, 220 + track.levels.length * 170);
  const islands: IslandLayout[] = [];
  const nodes: NodeLayout[] = [];
  const badges: BadgeLayout[] = [];
  const progressBySlug = Object.fromEntries(progress.lessons.map((lesson) => [lesson.lesson_slug, lesson]));
  const leftX = safeWidth * 0.28;
  const rightX = safeWidth * 0.72;
  const centerX = safeWidth * 0.5;

  track.levels.forEach((level, levelIndex) => {
    const islandY = 120 + levelIndex * 170;
    const islandX = levelIndex % 2 === 0 ? leftX : rightX;
    const nodeBandY = islandY + 56;
    const lessonCount = Math.max(level.lessons.length, 1);
    const nodeStartX = islandX - ((lessonCount - 1) * 88) / 2;

    islands.push({
      key: level.id,
      x: islandX,
      y: islandY,
      width: 220 + Math.max(0, lessonCount - 1) * 28,
      height: 92,
      title: level.title,
      icon: level.icon,
      color: level.theme_color,
    });

    if (showDecorations) {
      badges.push({
        key: `${level.id}-npc`,
        x: islandX - 94,
        y: islandY - 42,
        label: levelIndex === 0 ? "NPC" : "Guide",
        tone: "npc",
      });
      badges.push({
        key: `${level.id}-chest`,
        x: islandX + 94,
        y: islandY + 30,
        label: "Chest",
        tone: "chest",
      });
    }

    level.lessons.forEach((lesson, lessonIndex) => {
      const progressEntry = progressBySlug[lesson.slug];
      const waveOffset = Math.sin((lessonIndex / Math.max(lessonCount, 1)) * Math.PI) * 18;

      nodes.push({
        key: lesson.id,
        x: lessonCount === 1 ? centerX : nodeStartX + lessonIndex * 88,
        y: nodeBandY + waveOffset,
        label: String(lessonIndex + 1),
        title: lesson.title,
        href: `/tracks/${track.slug}/lessons/${lesson.slug}`,
        status: progressEntry?.status ?? "locked",
        isBoss: lesson.has_boss_task,
        isProject: lesson.has_project_task,
        accessTier: lesson.access_tier,
      });
    });
  });

  return { width: safeWidth, height, islands, nodes, badges };
}

function drawMap(canvas: HTMLCanvasElement, layout: MapLayout) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  canvas.width = layout.width * dpr;
  canvas.height = layout.height * dpr;
  canvas.style.width = `${layout.width}px`;
  canvas.style.height = `${layout.height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, layout.width, layout.height);

  const bg = ctx.createLinearGradient(0, 0, layout.width, layout.height);
  bg.addColorStop(0, "#fdf8ee");
  bg.addColorStop(1, "#f4ecde");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, layout.width, layout.height);

  ctx.fillStyle = "rgba(28, 124, 84, 0.08)";
  ctx.beginPath();
  ctx.arc(80, 90, 64, 0, Math.PI * 2);
  ctx.arc(layout.width - 110, 140, 52, 0, Math.PI * 2);
  ctx.fill();

  if (layout.nodes.length > 1) {
    ctx.beginPath();
    ctx.moveTo(layout.nodes[0].x, layout.nodes[0].y);
    for (let index = 1; index < layout.nodes.length; index += 1) {
      const prev = layout.nodes[index - 1];
      const current = layout.nodes[index];
      const midX = (prev.x + current.x) / 2;
      ctx.bezierCurveTo(midX, prev.y - 30, midX, current.y + 30, current.x, current.y);
    }
    ctx.lineWidth = 12;
    ctx.strokeStyle = "rgba(31, 26, 19, 0.08)";
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(layout.nodes[0].x, layout.nodes[0].y);
    for (let index = 1; index < layout.nodes.length; index += 1) {
      const prev = layout.nodes[index - 1];
      const current = layout.nodes[index];
      const midX = (prev.x + current.x) / 2;
      ctx.bezierCurveTo(midX, prev.y - 30, midX, current.y + 30, current.x, current.y);
    }
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(47, 125, 225, 0.26)";
    ctx.setLineDash([10, 12]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  layout.islands.forEach((island) => {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(island.x, island.y, island.width / 2, island.height / 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(island.color, 0.18);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = hexToRgba(island.color, 0.38);
    ctx.stroke();

    ctx.fillStyle = "#1f1a13";
    ctx.font = "700 16px 'Avenir Next', 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${island.icon} ${island.title}`, island.x, island.y + 4);
    ctx.restore();
  });

  layout.badges.forEach((badge) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(badge.x - 28, badge.y - 14, 56, 28, 14);
    ctx.fillStyle = badge.tone === "npc" ? "rgba(47, 125, 225, 0.12)" : "rgba(217, 130, 43, 0.14)";
    ctx.fill();
    ctx.strokeStyle = badge.tone === "npc" ? "rgba(47, 125, 225, 0.24)" : "rgba(217, 130, 43, 0.26)";
    ctx.stroke();
    ctx.fillStyle = badge.tone === "npc" ? "#2f7de1" : "#d9822b";
    ctx.font = "700 12px 'IBM Plex Mono', 'SFMono-Regular', monospace";
    ctx.textAlign = "center";
    ctx.fillText(badge.label, badge.x, badge.y + 4);
    ctx.restore();
  });

  layout.nodes.forEach((node) => {
    const palette = statusPalette[node.status];
    ctx.save();
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.isBoss ? 24 : 20, 0, Math.PI * 2);
    ctx.fillStyle = palette.glow;
    ctx.fill();

    if (node.isBoss) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 28, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(217, 130, 43, 0.3)";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.isBoss ? 20 : 16, 0, Math.PI * 2);
    ctx.fillStyle = palette.fill;
    ctx.fill();
    ctx.strokeStyle = palette.stroke;
    ctx.lineWidth = 2;
    ctx.stroke();

    if (node.isProject) {
      ctx.beginPath();
      ctx.arc(node.x + 15, node.y - 14, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#2f7de1";
      ctx.fill();
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 12px 'IBM Plex Mono', 'SFMono-Regular', monospace";
    ctx.textAlign = "center";
    ctx.fillText(node.isBoss ? "B" : node.label, node.x, node.y + 4);
    ctx.restore();
  });
}

export function TrackCanvasMap({
  track,
  progress,
  interactive = true,
  showDecorations = true,
}: TrackCanvasMapProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [layout, setLayout] = useState<MapLayout | null>(null);
  const effectiveProgress = useMemo(
    () => progress ?? getPreviewProgress(track),
    [progress, track],
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    const updateLayout = () => {
      const nextLayout = buildLayout(track, effectiveProgress, wrapper.clientWidth, showDecorations);
      setLayout(nextLayout);
    };

    updateLayout();
    const observer = new ResizeObserver(() => updateLayout());
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [effectiveProgress, showDecorations, track]);

  useEffect(() => {
    if (!canvasRef.current || !layout) {
      return;
    }
    drawMap(canvasRef.current, layout);
  }, [layout]);

  if (!layout) {
    return <div className="canvas-map-shell">Подготавливаем карту трека...</div>;
  }

  return (
    <div className="canvas-map-shell" ref={wrapperRef}>
      <canvas ref={canvasRef} className="canvas-map-surface" aria-hidden="true" />
      <div className="canvas-map-overlay">
        {layout.nodes.map((node) => {
          const body = (
            <>
              <span className="canvas-map-node__title">{node.title}</span>
              <span className="canvas-map-node__meta">
                {node.status}
                {node.isBoss ? " · boss" : ""}
              </span>
            </>
          );

          const style = {
            left: `${node.x}px`,
            top: `${node.y}px`,
          };

          if (interactive && node.status !== "locked") {
            return (
              <Link
                key={node.key}
                href={node.href}
                className={`canvas-map-node canvas-map-node--${node.status}`}
                style={style}
              >
                {body}
              </Link>
            );
          }

          return (
            <span
              key={node.key}
              className={`canvas-map-node canvas-map-node--${node.status} canvas-map-node--static`}
              style={style}
            >
              {body}
            </span>
          );
        })}
      </div>
    </div>
  );
}
