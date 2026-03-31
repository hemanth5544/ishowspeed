"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

interface PingResult {
  ms: number | null;
  timestamp: number;
}

interface Region {
  key: string;
  label: string;
  flag: string;
  url: string;
}

const REGIONS: Region[] = [
  { key: "us-east",    label: "US East",       flag: "🇺🇸", url: "https://dynamodb.us-east-1.amazonaws.com" },
  { key: "eu-west",    label: "EU West",        flag: "🇩🇪", url: "https://dynamodb.eu-west-1.amazonaws.com" },
  { key: "ap-south",   label: "Asia South",     flag: "🇸🇬", url: "https://dynamodb.ap-southeast-1.amazonaws.com" },
  { key: "ap-east",    label: "Asia East",      flag: "🇯🇵", url: "https://dynamodb.ap-northeast-1.amazonaws.com" },
  { key: "us-west",    label: "US West",        flag: "🇺🇸", url: "https://dynamodb.us-west-2.amazonaws.com" },
  { key: "sa-east",    label: "South America",  flag: "🇧🇷", url: "https://dynamodb.sa-east-1.amazonaws.com" },
];

const MAX_HISTORY = 30;
const PING_INTERVAL = 4000;

function getColor(ms: number | null): string {
  if (ms === null) return "#6b7280";
  if (ms < 80)  return "#10b981";
  if (ms < 150) return "#f59e0b";
  if (ms < 300) return "#f97316";
  return "#ef4444";
}

function getLabel(ms: number | null): string {
  if (ms === null) return "Timeout";
  if (ms < 80)  return "Excellent";
  if (ms < 150) return "Good";
  if (ms < 300) return "Fair";
  return "Poor";
}

async function pingRegion(url: string): Promise<number | null> {
  try {
    const start = performance.now();
    await fetch(`${url}/ping`, {
      method: "GET",
      mode: "no-cors",
      cache: "no-store",
    });
    return Math.round(performance.now() - start);
  } catch {
    return null;
  }
}

interface TooltipData {
  ms: number | null;
  timestamp: number;
  x: number;
  y: number;
}

function Tooltip({ data }: { data: TooltipData }) {
  const color = getColor(data.ms);
  const label = getLabel(data.ms);
  const time  = new Date(data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ duration: 0.12 }}
      className="fixed z-50 pointer-events-none"
      style={{ left: data.x, top: data.y - 56, transform: "translateX(-50%)" }}
    >
      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-center min-w-[90px]">
        <p className="font-mono text-[13px] font-semibold" style={{ color }}>
          {data.ms !== null ? `${data.ms} ms` : "Timeout"}
        </p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{time}</p>
      </div>
    </motion.div>
  );
}

function PingBar({
  history,
  regionIndex,
}: {
  history: PingResult[];
  regionIndex: number;
}) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const filled = [...Array(MAX_HISTORY - history.length).fill(null), ...history];

  return (
    <div className="flex items-center gap-[2px] flex-1">
      {filled.map((item, i) => {
        const isEmpty = item === null;
        const color   = isEmpty ? "transparent" : getColor(item.ms);
        const delay   = isEmpty ? 0 : (i / MAX_HISTORY) * 0.3;

        return (
          <motion.div
            key={i}
            className="relative flex-1 rounded-[2px] cursor-default"
            style={{
              height: 28,
              background: isEmpty ? "var(--border)" : color,
              opacity: isEmpty ? 0.2 : 1,
            }}
            initial={isEmpty ? false : { scaleY: 0, opacity: 0 }}
            animate={isEmpty ? false : { scaleY: 1, opacity: 1 }}
            transition={{ delay, duration: 0.25, ease: "easeOut" }}
            onMouseEnter={(e) => {
              if (!isEmpty) {
                setTooltip({
                  ms: item.ms,
                  timestamp: item.timestamp,
                  x: e.clientX,
                  y: e.clientY,
                });
              }
            }}
            onMouseMove={(e) => {
              if (tooltip) {
                setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
              }
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        );
      })}

      <AnimatePresence>
        {tooltip && <Tooltip data={tooltip} />}
      </AnimatePresence>
    </div>
  );
}

function CurrentPing({ ms }: { ms: number | null | undefined }) {
  if (ms === undefined) return <span className="text-[12px] font-mono text-muted-foreground w-14 text-right">—</span>;

  return (
    <motion.span
      key={ms}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="text-[12px] font-mono font-semibold w-14 text-right tabular-nums"
      style={{ color: getColor(ms) }}
    >
      {ms !== null ? `${ms} ms` : "—"}
    </motion.span>
  );
}

export function PingRegions() {
  const [histories, setHistories] = useState<Record<string, PingResult[]>>(
    Object.fromEntries(REGIONS.map(r => [r.key, []]))
  );
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function runPings() {
    setRunning(true);
    const results = await Promise.all(
      REGIONS.map(async (r) => ({ key: r.key, ms: await pingRegion(r.url) }))
    );
    setHistories(prev => {
      const next = { ...prev };
      results.forEach(({ key, ms }) => {
        const entry: PingResult = { ms, timestamp: Date.now() };
        next[key] = [...(next[key] ?? []).slice(-(MAX_HISTORY - 1)), entry];
      });
      return next;
    });
    setRunning(false);
  }

  useEffect(() => {
    runPings();
    intervalRef.current = setInterval(runPings, PING_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold tracking-tight">Ping to regions</p>
          <AnimatePresence>
            {running && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-muted border border-border"
              >
                pinging…
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3">
          {[
            { label: "<80ms",  color: "#10b981" },
            { label: "<150ms", color: "#f59e0b" },
            { label: "<300ms", color: "#f97316" },
            { label: "300ms+", color: "#ef4444" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-[2px]" style={{ background: color }} />
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Region rows */}
      <div className="px-4 py-3 flex flex-col gap-3">
        {REGIONS.map((region, ri) => {
          const hist    = histories[region.key] ?? [];
          const latest  = hist[hist.length - 1];

          return (
            <motion.div
              key={region.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: ri * 0.05, duration: 0.3 }}
              className="flex items-center gap-3"
            >
              {/* Region label */}
              <div className="flex items-center gap-1.5 w-[130px] shrink-0">
                <span className="text-base leading-none">{region.flag}</span>
                <span className="text-[12px] font-medium text-foreground truncate">{region.label}</span>
              </div>

              {/* Ping bar */}
              <PingBar history={hist} regionIndex={ri} />

              {/* Current ms */}
              <CurrentPing ms={latest?.ms} />
            </motion.div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="px-4 pb-3">
        <p className="text-[10px] text-muted-foreground">
          Updates every {PING_INTERVAL / 1000}s · Hover bars for details · Last {MAX_HISTORY} pings shown
        </p>
      </div>
    </Card>
  );
}