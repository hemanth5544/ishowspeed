"use client";
import ThemeSwitcherDemo from "@/components/theme";
import { GlobeMarkersCard } from "@/components/map";
import { ChartLineInteractive } from "@/components/speed/chart";
import { useSpeedTest, quality } from "@/components/hooks/useSpeedTest";
import { HeaderStats } from "@/components/speed/headerStats";

export default function BarsPage() {
  const { data, status, progress, summary, startTest } = useSpeedTest();

  return (
    <div className="min-h-screen p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <HeaderStats
          items={[
            {
              label: "Jitter",
              val: summary.jitter > 0 ? `${summary.jitter.toFixed(1)} ms` : "—",
            },
            {
              label: "Packet loss",
              val: summary.packetLoss > 0 ? `${summary.packetLoss.toFixed(1)}%` : "0",
            },
            { label: "Server", val: "Cloudflare" },
            { label: "Quality", val: quality(summary.download) },
          ]}
        />

        <ThemeSwitcherDemo />
      </div>
      <div className="flex h-[400px] items-stretch gap-6">
        <div className="h-full min-w-0 flex-[2]">
          <ChartLineInteractive
            data={data}
            status={status}
            progress={progress}
            summary={summary}
            startTest={startTest}
          />
        </div>
        <div className="h-full min-w-[260px] max-w-[560px] flex-1">
          <GlobeMarkersCard />
        </div>
      </div>
   
    </div>
  );
}
