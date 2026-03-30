import * as React from "react"
import SpeedTest from "@cloudflare/speedtest"

export type Metric = "download" | "upload" | "latency"
export type Status = "idle" | "running" | "finished"

export type Point = {
  index: number
  download?: number
  upload?: number
  latency?: number
}

export type Summary = {
  download: number
  upload: number
  latency: number
  jitter: number
  packetLoss: number
}

export function quality(dl: number): string {
  if (dl > 100) return "Excellent"
  if (dl > 50)  return "Good"
  if (dl > 10)  return "Fair"
  if (dl > 0)   return "Slow"
  return "—"
}

export function useSpeedTest() {
  const [data, setData]       = React.useState<Point[]>([])
  const [status, setStatus]   = React.useState<Status>("idle")
  const [progress, setProgress] = React.useState(0)
  const [summary, setSummary] = React.useState<Summary>({
    download: 0, upload: 0, latency: 0, jitter: 0, packetLoss: 0,
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
      const dl  = r.download   ? parseFloat((r.download  / 1e6).toFixed(2)) : undefined
      const ul  = r.upload     ? parseFloat((r.upload    / 1e6).toFixed(2)) : undefined
      const lat = r.latency    ? parseFloat(r.latency.toFixed(1))            : undefined
      const jit = r.jitter     ? parseFloat(r.jitter.toFixed(1))             : undefined
      const pl  = r.packetLoss !== undefined
        ? parseFloat(r.packetLoss.toFixed(2))
        : undefined

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

  return { data, status, progress, summary, startTest }
}