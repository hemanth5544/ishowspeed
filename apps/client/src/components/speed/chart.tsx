"use client"

import * as React from "react"
import {
  Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { NativeStartNow } from "@/components/uitripled/native-start-now-shadcnui"
import { METRICS } from "../constats/speedTestConstants"
import type { Metric, Status, Point, Summary } from "../hooks/useSpeedTest"
import { useAnimatedNumber } from "@/components/speed/Useanimatednumber"

interface ChartLineInteractiveProps {
  data: Point[]
  status: Status
  progress: number
  summary: Summary
  startTest: () => void
}

function AnimatedStat({
  value,
  metricKey,
  color,
  isActive,
}: {
  value: number
  metricKey: Metric
  color: string
  isActive: boolean
}) {
  const display = useAnimatedNumber(value, {
    decimals: metricKey === "latency" ? 0 : 1,
    duration: 500,
  })

  return (
    <span
      className="font-mono text-xl font-medium leading-none tabular-nums"
      style={{ color: isActive && value > 0 ? color : undefined }}
    >
      {display}
    </span>
  )
}

export function ChartLineInteractive({ data, status, progress, summary, startTest }: ChartLineInteractiveProps) {
  const [active, setActive] = React.useState<Metric>("download")

  const activeMetric = METRICS.find(m => m.key === active)!
  const activeColor  = activeMetric.color
  const activeUnit   = activeMetric.unit

  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-2xl shadow-sm">

      {/* ── Compact header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold tracking-tight leading-none">Network Speed</p>
          {status !== "idle" && (
            <span className={cn(
              "text-[11px] px-2 py-0.5 rounded-full border leading-none",
              status === "running"
                ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                : "bg-muted text-muted-foreground border-border"
            )}>
              {status === "running" ? "Running…" : "Complete"}
            </span>
          )}
        </div>
        <NativeStartNow
          size="sm"
          onStart={async () => { await startTest() }}
        />
      </div>

      {/* ── Metric tabs ── */}
      <div className="flex gap-2 px-3 py-2.5 bg-muted/30 border-b">
        {METRICS.map(({ key, label, unit, color }) => {
          const isActive = active === key
          const val      = summary[key]
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={cn(
                "flex-1 flex flex-col items-start gap-0.5 px-3 py-2 rounded-xl text-left transition-all",
                "border",
                isActive ? "shadow-sm" : "border-border bg-transparent hover:bg-muted/50"
              )}
              style={isActive ? { borderColor: color, backgroundColor: color + "18" } : {}}
            >
              <span
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-medium"
                style={{ color: isActive ? color : "var(--muted-foreground)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                {label}
              </span>

              <AnimatedStat value={val} metricKey={key} color={color} isActive={isActive} />

              <span
                className="text-[10px]"
                style={{ color: isActive ? color : "var(--muted-foreground)", opacity: isActive ? 0.7 : 1 }}
              >
                {unit}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Chart ── */}
      <CardContent className="flex-1 p-0">
        {data.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <svg className="w-7 h-7 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span className="text-xs">No data yet</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="sdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={activeColor} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={activeColor} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(128,128,128,0.08)" />
              <XAxis dataKey="index" hide />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#888" }}
                tickFormatter={v => v.toFixed(0)}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "0.5px solid rgba(128,128,128,0.2)",
                  background: "var(--background)",
                }}
                formatter={(value) => {
                  const numericValue =
                    typeof value === "number"
                      ? value
                      : Number.isFinite(Number(value)) ? Number(value) : 0
                  return [`${numericValue.toFixed(1)} ${activeUnit}`, active]
                }}
                labelFormatter={() => ""}
              />
              <Area
                type="monotone"
                dataKey={active}
                stroke={activeColor}
                strokeWidth={2}
                fill="url(#sdGrad)"
                dot={false}
                isAnimationActive={false}
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* Progress bar */}
        {status === "running" && (
          <div className="h-0.5 bg-border mx-4 mb-3 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: activeColor }}
            />
          </div>
        )}
      </CardContent>

    </Card>
  )
}
