import type { Metric } from "../hooks/useSpeedTest"

export const METRICS: { key: Metric; label: string; unit: string; color: string }[] = [
  { key: "download", label: "Download", unit: "Mbps", color: "#378ADD" },
  { key: "upload",   label: "Upload",   unit: "Mbps", color: "#1D9E75" },
  { key: "latency",  label: "Latency",  unit: "ms",   color: "#BA7517" },
]