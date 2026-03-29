"use client"

import * as React from "react"
import SpeedTest from "@cloudflare/speedtest"
import { motion } from "framer-motion"
import {
  Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Metric = "download" | "upload" | "latency"
type Status = "idle" | "running" | "finished"

type Point = { index: number; download?: number; upload?: number; latency?: number }

const METRICS = [
  { key: "download", label: "Download", unit: "Mbps", color: "#378ADD" },
  { key: "upload",   label: "Upload",   unit: "Mbps", color: "#1D9E75" },
  { key: "latency",  label: "Latency",  unit: "ms",   color: "#BA7517" },
] as const

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

      const dl  = r.download  ? +(r.download / 1e6).toFixed(2) : undefined
      const ul  = r.upload    ? +(r.upload   / 1e6).toFixed(2) : undefined
      const lat = r.latency   ? +r.latency.toFixed(1)          : undefined
      const jit = r.jitter    ? +r.jitter.toFixed(1)           : undefined
      const pl  = r.packetLoss !== undefined ? +r.packetLoss.toFixed(2) : undefined

      setSummary(prev => ({
        download: dl  ?? prev.download,
        upload:   ul  ?? prev.upload,
        latency:  lat ?? prev.latency,
        jitter:   jit ?? prev.jitter,
        packetLoss: pl ?? prev.packetLoss,
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

  const activeMeta = METRICS.find(m => m.key === active)!
  const qualityLabel = quality(summary.download)

  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-2xl backdrop-blur-xl bg-background/60 border border-white/10 shadow-xl">
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          

          <button
            onClick={startTest}
            disabled={status === "running"}
            className="text-xs font-semibold px-4 py-2 rounded-lg border hover:bg-muted disabled:opacity-50"
          >
            {status === "running" ? (
              <span className="flex items-center gap-2">
                <motion.span
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
                Running…
              </span>
            ) : status === "finished" ? "Re-run" : "Run test"}
          </button>
        </div>

        {/* Hero speed */}
        <div className="flex flex-col items-center justify-center py-6">
          <motion.h1
            key={summary[active]}
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-bold"
            style={{ color: activeMeta.color }}
          >
            {summary[active] > 0
              ? summary[active].toFixed(active === "latency" ? 0 : 1)
              : "--"}
          </motion.h1>
          <p className="text-xs text-muted-foreground">{activeMeta.unit}</p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 border-b">
          {METRICS.map(({ key, label, unit, color }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={cn("relative px-5 py-4 text-left hover:bg-muted/40", active === key && "bg-muted/30")}
            >
              {active === key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg blur-xl opacity-20"
                  style={{ background: color }}
                />
              )}

              <p className="text-xs text-muted-foreground">{label}</p>

              <motion.p
                key={summary[key]}
                className="font-mono text-xl"
                style={{ color: summary[key] > 0 ? color : undefined }}
              >
                {summary[key] > 0
                  ? summary[key].toFixed(key === "latency" ? 0 : 1)
                  : "—"}
              </motion.p>

              <p className="text-[10px] text-muted-foreground">{unit}</p>
            </button>
          ))}
        </div>

        {/* Chart */}
        <CardContent className="flex-1 p-0 relative">
          {data.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-muted-foreground">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeMeta.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={activeMeta.color} stopOpacity={0}/>
                  </linearGradient>

                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feMerge>
                      <feMergeNode in="blur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                <CartesianGrid vertical={false} stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="index" hide />
                <YAxis hide />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey={active}
                  stroke={activeMeta.color}
                  strokeWidth={2.5}
                  fill="url(#grad)"
                  filter="url(#glow)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* Progress */}
          {status === "running" && (
            <div className="h-1 mx-4 mt-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full"
                style={{ background: activeMeta.color }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <div className="grid grid-cols-4 gap-2 px-4 pb-4">
          <Stat label="Jitter" val={summary.jitter ? `${summary.jitter.toFixed(1)} ms` : "—"} />
          <Stat label="Loss" val={summary.packetLoss ? `${summary.packetLoss.toFixed(1)}%` : "—"} />
          <Stat label="Server" val="Cloudflare" />
          <Stat label="Quality" val={qualityLabel} highlight />
        </div>

      </motion.div>
    </Card>
  )
}

function Stat({ label, val, highlight }: { label: string; val: string; highlight?: boolean }) {
  return (
    <div className="bg-muted/50 rounded-lg px-3 py-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={cn("font-mono text-sm mt-1", highlight && "text-green-500")}>
        {val}
      </p>
    </div>
  )
}