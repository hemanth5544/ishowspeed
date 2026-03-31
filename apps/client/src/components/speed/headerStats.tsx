import * as React from "react"
import { Badge } from "@/components/ui/badge"

type StatItem = {
  label: string
  val: string
}

interface headerStatsProps {
  items: StatItem[]
}

function getBadgeColors(label: string, value: string): string {
  const lowerLabel = label.toLowerCase()
  const lowerValue = value.toLowerCase()

  if (lowerLabel.includes("jitter")) {
    return "border-amber-500/30 bg-amber-500/12 text-amber-900 dark:text-amber-200"
  }

  if (lowerLabel.includes("packet")) {
    return "border-rose-500/30 bg-rose-500/12 text-rose-900 dark:text-rose-200"
  }

  if (lowerLabel.includes("server")) {
    return "border-sky-500/30 bg-sky-500/12 text-sky-900 dark:text-sky-200"
  }

  if (lowerLabel.includes("quality")) {
    if (lowerValue.includes("excellent")) {
      return "border-emerald-500/35 bg-emerald-500/12 text-emerald-900 dark:text-emerald-200"
    }
    if (lowerValue.includes("good")) {
      return "border-lime-500/35 bg-lime-500/12 text-lime-900 dark:text-lime-200"
    }
    if (lowerValue.includes("fair")) {
      return "border-amber-500/35 bg-amber-500/12 text-amber-900 dark:text-amber-200"
    }
    if (lowerValue.includes("slow")) {
      return "border-orange-500/35 bg-orange-500/12 text-orange-900 dark:text-orange-200"
    }
    return "border-zinc-500/30 bg-zinc-500/10 text-zinc-900 dark:text-zinc-200"
  }

  return "border-muted bg-muted/60"
}

export function HeaderStats({ items }: headerStatsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map(({ label, val }) => (
        <Badge
          key={label}
          variant="secondary"
          className={`gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-normal ${getBadgeColors(label, val)}`}
        >
          <span className="text-muted-foreground">{label}:</span>
          <span className="font-mono font-medium">{val}</span>
        </Badge>
      ))}
    </div>
  )
}
