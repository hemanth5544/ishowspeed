import * as React from "react"
import { Badge } from "@/components/ui/badge"

type StatItem = {
  label: string
  val: string
}

interface headerStatsProps {
  items: StatItem[]
}

export function HeaderStats({ items }: headerStatsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
      {items.map(({ label, val }) => (
        <Badge
          key={label}
          variant="secondary"
          className="gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-normal"
        >
          <span className="text-muted-foreground">{label}:</span>
          <span className="font-mono font-medium">{val}</span>
        </Badge>
      ))}
    </div>
  )
}

// Backward-compatible alias for older imports.
export const headerStats = HeaderStats
