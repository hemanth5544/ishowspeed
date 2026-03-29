"use client"

import * as React from "react"
import SpeedTest from "@cloudflare/speedtest"
import {
  Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Metric = "download" | "upload" | "latency"
type Status = "idle" | "running" | "finished"

type Point = { index: number; download?: number; upload?: number; latency?: number }

const METRICS: { key: Metric; label: string; unit: string; color: string }[] = [
  { key: "download", label: "Download", unit: "Mbps", color: "#378ADD" },
  { key: "upload",   label: "Upload",   unit: "Mbps", color: "#1D9E75" },
  { key: "latency",  label: "Latency",  unit: "ms",   color: "#BA7517" },
]

function quality(dl: number) {
  if (dl > 100) return "Excellent"
  if (dl > 50)  return "Good"
  if (dl > 10)  return "Fair"
  if (dl > 0)   return "Slow"
  return "—"
}

export function ChartLineInteractive() {
  const [active, setActive]   = React.useState<Metric>("download")
  const [data, setData]       = React.useState<Point[]>([])
  const [status, setStatus]   = React.useState<Status>("idle")
  const [progress, setProgress] = React.useState(0)
  const [summary, setSummary] = React.useState({
    download: 0, upload: 0, latency: 0, jitter: 0, packetLoss: 0
  })
  const progRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const idxRef  = React.useRef(0)

  const startTest = React.useCallback(() => {
    setData([])
    setSummary({ download: 0, upload: 0, latency: 0, jitter: 0, packetLoss: 0 })
    setProgress(0)
    setStatus("running")
    idxRef.current = 0

    if (progRef.current) clearInterval(progRef.current)
    progRef.current = setInterval(() => {
      setProgress(p => Math.min(p + 1.2, 92))
    }, 400)

    const engine = new SpeedTest({ autoStart: true })

    engine.onResultsChange = () => {
      const r = engine.results.getSummary()
      const dl  = r.download  ? parseFloat((r.download  / 1e6).toFixed(2)) : undefined
      const ul  = r.upload    ? parseFloat((r.upload    / 1e6).toFixed(2)) : undefined
      const lat = r.latency   ? parseFloat(r.latency.toFixed(1))            : undefined
      const jit = r.jitter    ? parseFloat(r.jitter.toFixed(1))             : undefined
      const pl  = r.packetLoss !== undefined ? parseFloat(r.packetLoss.toFixed(2)) : undefined

      setSummary(prev => ({
        download:   dl  ?? prev.download,
        upload:     ul  ?? prev.upload,
        latency:    lat ?? prev.latency,
        jitter:     jit ?? prev.jitter,
        packetLoss: pl  ?? prev.packetLoss,
      }))

      setData(prev => {
        const idx = idxRef.current++
        return [...prev, { index: idx, download: dl, upload: ul, latency: lat }]
      })
    }

    engine.onFinish = () => {
      if (progRef.current) clearInterval(progRef.current)
      setProgress(100)
      setStatus("finished")
    }

    engine.onError = () => {
      if (progRef.current) clearInterval(progRef.current)
      setStatus("finished")
    }
  }, [])

  const activeColor = METRICS.find(m => m.key === active)!.color
  const activeUnit  = METRICS.find(m => m.key === active)!.unit

  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-2xl">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <div>
          <p className="text-sm font-semibold tracking-tight">Network Speed</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {status === "idle"     && "Run a test to measure your connection"}
            {status === "running"  && "Measuring your connection…"}
            {status === "finished" && "Test complete"}
          </p>
        </div>
        <button
          onClick={startTest}
          disabled={status === "running"}
          className={cn(
            "text-xs font-semibold tracking-wide px-4 py-2 rounded-lg border transition-colors",
            "hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed",
            status === "running" && "text-green-600 border-green-600/40"
          )}
        >
          {status === "running" ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Running…
            </span>
          ) : status === "finished" ? "Re-run test" : "Run test"}
        </button>
      </div>

      {/* Stat tabs */}
      <div className="grid grid-cols-3 border-b">
        {METRICS.map(({ key, label, unit, color }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={cn(
              "flex flex-col gap-1 px-5 py-4 text-left border-r last:border-r-0",
              "relative transition-colors hover:bg-muted/40",
              active === key && "bg-muted/30"
            )}
          >
            {/* active indicator bar */}
            {active === key && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                style={{ background: color }}
              />
            )}
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              {label}
            </span>
            <span
              className="font-mono text-2xl font-medium leading-none tabular-nums"
              style={{ color: summary[key] > 0 ? color : undefined }}
            >
              {summary[key] > 0 ? summary[key].toFixed(key === "latency" ? 0 : 1) : "—"}
            </span>
            <span className="text-[11px] text-muted-foreground">{unit}</span>
          </button>
        ))}
      </div>

      {/* Chart area */}
      <CardContent className="flex-1 p-0">
        {data.length === 0 ? (
          <div className="h-52 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <svg className="w-8 h-8 opacity-25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span className="text-sm">No data yet</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="sdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={activeColor} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={activeColor} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(128,128,128,0.1)" />
              <XAxis dataKey="index" hide />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#888" }}
                tickFormatter={v => v.toFixed(0)}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "0.5px solid rgba(128,128,128,0.2)",
                  background: "var(--background)",
                }}
                formatter={(v: number) => [`${v.toFixed(1)} ${activeUnit}`, active]}
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

      {/* Footer mini stats */}
      <div className="grid grid-cols-4 gap-2 px-4 pb-4">
        {[
          { label: "Jitter",       val: summary.jitter     > 0 ? `${summary.jitter.toFixed(1)} ms`  : "—" },
          { label: "Packet loss",  val: summary.packetLoss > 0 ? `${summary.packetLoss.toFixed(1)}%` : "—" },
          { label: "Server",       val: "Cloudflare" },
          { label: "Quality",      val: quality(summary.download) },
        ].map(({ label, val }) => (
          <div key={label} className="bg-muted/50 rounded-lg px-3 py-2">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
            <p className="font-mono text-sm font-medium mt-1">{val}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}