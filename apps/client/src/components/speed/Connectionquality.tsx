"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tv2, Gamepad2, Video, Globe } from "lucide-react";
import type { Summary } from "@/components/hooks/useSpeedTest";

interface Props {
  summary: Summary;
}

type Rating = "Excellent" | "Good" | "Fair" | "Poor" | "—";

interface UseCase {
  key: string;
  label: string;
  icon: React.ReactNode;
  rate: (s: Summary) => Rating;
  req: string; // shown on hover / subtitle
}

function getRating(download: number, upload: number, latency: number, thresholds: {
  excellent: { dl: number; ul: number; lat: number };
  good:      { dl: number; ul: number; lat: number };
  fair:      { dl: number; ul: number; lat: number };
}): Rating {
  if (download === 0) return "—";
  const { excellent, good, fair } = thresholds;
  if (download >= excellent.dl && upload >= excellent.ul && latency <= excellent.lat) return "Excellent";
  if (download >= good.dl      && upload >= good.ul      && latency <= good.lat)      return "Good";
  if (download >= fair.dl      && upload >= fair.ul      && latency <= fair.lat)      return "Fair";
  return "Poor";
}

const USE_CASES: UseCase[] = [
  {
    key: "streaming",
    label: "Streaming",
    icon: <Tv2 className="h-4 w-4" />,
    req: "25 Mbps for 4K",
    rate: (s) => getRating(s.download, s.upload, s.latency, {
      excellent: { dl: 25, ul: 0,  lat: 999 },
      good:      { dl: 10, ul: 0,  lat: 999 },
      fair:      { dl: 5,  ul: 0,  lat: 999 },
    }),
  },
  {
    key: "gaming",
    label: "Gaming",
    icon: <Gamepad2 className="h-4 w-4" />,
    req: "<20ms latency",
    rate: (s) => getRating(s.download, s.upload, s.latency, {
      excellent: { dl: 15, ul: 5,  lat: 20  },
      good:      { dl: 10, ul: 3,  lat: 50  },
      fair:      { dl: 5,  ul: 1,  lat: 100 },
    }),
  },
  {
    key: "videocall",
    label: "Video calls",
    icon: <Video className="h-4 w-4" />,
    req: "10 Mbps + 3 up",
    rate: (s) => getRating(s.download, s.upload, s.latency, {
      excellent: { dl: 10, ul: 5,  lat: 50  },
      good:      { dl: 5,  ul: 3,  lat: 100 },
      fair:      { dl: 2,  ul: 1,  lat: 150 },
    }),
  },
  {
    key: "browsing",
    label: "Browsing",
    icon: <Globe className="h-4 w-4" />,
    req: "1 Mbps min",
    rate: (s) => getRating(s.download, s.upload, s.latency, {
      excellent: { dl: 10, ul: 1,  lat: 100 },
      good:      { dl: 5,  ul: 1,  lat: 200 },
      fair:      { dl: 1,  ul: 0,  lat: 999 },
    }),
  },
];

const RATING_CONFIG: Record<Rating, { label: string; bar: number; color: string; bg: string; text: string }> = {
  "Excellent": { label: "Excellent", bar: 100, color: "#10b981", bg: "bg-emerald-50 dark:bg-emerald-950/40",  text: "text-emerald-600 dark:text-emerald-400" },
  "Good":      { label: "Good",      bar: 70,  color: "#3b82f6", bg: "bg-blue-50 dark:bg-blue-950/40",        text: "text-blue-600 dark:text-blue-400"       },
  "Fair":      { label: "Fair",      bar: 40,  color: "#f59e0b", bg: "bg-amber-50 dark:bg-amber-950/40",      text: "text-amber-600 dark:text-amber-400"     },
  "Poor":      { label: "Poor",      bar: 15,  color: "#ef4444", bg: "bg-red-50 dark:bg-red-950/40",          text: "text-red-600 dark:text-red-400"         },
  "—":         { label: "—",         bar: 0,   color: "#d1d5db", bg: "bg-muted/40",                           text: "text-muted-foreground"                  },
};

function QualityCard({
  useCase,
  summary,
  index,
}: {
  useCase: UseCase;
  summary: Summary;
  index: number;
}) {
  const rating  = useCase.rate(summary);
  const config  = RATING_CONFIG[rating];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: "easeOut" }}
      className={`flex flex-col gap-3 rounded-xl p-4 border border-border/50 ${config.bg} transition-colors`}
    >
      {/* Icon + label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          {useCase.icon}
          <span className="text-[12px] font-medium text-foreground">{useCase.label}</span>
        </div>
        <span className={`text-[11px] font-semibold ${config.text}`}>
          {config.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-border/60 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: config.color }}
          initial={{ width: 0 }}
          animate={{ width: `${config.bar}%` }}
          transition={{ delay: index * 0.06 + 0.2, duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Req hint */}
      <span className="text-[10px] text-muted-foreground">{useCase.req}</span>
    </motion.div>
  );
}

export function ConnectionQuality({ summary }: Props) {
  const hasData = summary.download > 0;

  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <p className="text-sm font-semibold tracking-tight">Connection quality</p>
        {!hasData && (
          <span className="text-[11px] text-muted-foreground px-2 py-0.5 rounded-full bg-muted border border-border">
            Run a test first
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {USE_CASES.map((uc, i) => (
          <QualityCard key={uc.key} useCase={uc} summary={summary} index={i} />
        ))}
      </div>
    </Card>
  );
}