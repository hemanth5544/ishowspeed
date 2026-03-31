"use client";
import ThemeSwitcherDemo from "@/components/theme";
import { GlobeMarkersCard } from "@/components/map";
import { ChartLineInteractive } from "@/components/speed/chart";
import { useSpeedTest, quality } from "@/components/hooks/useSpeedTest";
import { HeaderStats } from "@/components/speed/headerStats";

// Sidebar width: 260px
// Right margin: half of sidebar = 130px
// Stripes are 5px wide, sitting just inside those margins

export default function BarsPage() {
  const { data, status, progress, summary, startTest } = useSpeedTest();

  return (
    <div className="relative min-h-screen">

      {/* Left stripe — sits at the right edge of the sidebar space (260px from left) */}
      <div
        className="diagonal-stripes pointer-events-none absolute inset-y-0 hidden w-5 lg:block"
        style={{ left: "260px" }}
        aria-hidden="true"
      />

      {/* Right stripe — sits 130px from right edge (half sidebar width) */}
      <div
        className="diagonal-stripes pointer-events-none absolute inset-y-0 hidden w-5 lg:block"
        style={{ right: "130px" }}
        aria-hidden="true"
      />

      <div className="flex min-h-screen">

        {/* Sidebar placeholder — 260px wide, replace with <Sidebar /> later */}
        <div className="hidden lg:block shrink-0" style={{ width: "260px" }} />

        {/* Main content — padded right to match the 130px right margin */}
        <main className="flex-1 min-w-0 py-8 pl-6" style={{ paddingRight: "150px" }}>

          {/* Top stats bar */}
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

          {/* Chart + map row */}
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

        </main>
      </div>
    </div>
  );
}