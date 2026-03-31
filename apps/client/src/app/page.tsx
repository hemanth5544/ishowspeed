"use client";
import ThemeSwitcherDemo from "@/components/theme";
import { GlobeMarkersCard } from "@/components/map";
import { ChartLineInteractive } from "@/components/speed/chart";
import { useSpeedTest, quality } from "@/components/hooks/useSpeedTest";
import { HeaderStats } from "@/components/speed/headerStats";
import { IPInfoCard } from "@/components/speed/Ipinfocard";
import { ConnectionQuality } from "@/components/speed/Connectionquality";
import { PingRegions } from "@/components/speed/Pingregions";

export default function BarsPage() {
  const { data, status, progress, summary, startTest } = useSpeedTest();

  return (
    <div className="relative min-h-screen">

      {/* Left stripe */}
      <div
        className="diagonal-stripes pointer-events-none absolute inset-y-0 hidden w-5 lg:block"
        style={{ left: "260px" }}
        aria-hidden="true"
      />

      {/* Right stripe */}
      <div
        className="diagonal-stripes pointer-events-none absolute inset-y-0 hidden w-5 lg:block"
        style={{ right: "130px" }}
        aria-hidden="true"
      />

      <div className="flex min-h-screen">

        {/* Sidebar placeholder */}
        <div className="hidden lg:block shrink-0" style={{ width: "260px" }} />

        {/* Main content */}
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

          {/* Row 1: Chart + Connection quality (left) | Map + IP info (right) */}
          <div className="flex items-start gap-6">

            {/* Left col */}
            <div className="flex-[2] min-w-0 flex flex-col gap-6">
              <ChartLineInteractive
                data={data}
                status={status}
                progress={progress}
                summary={summary}
                startTest={startTest}
              />
              <ConnectionQuality summary={summary} />
            </div>

            {/* Right col */}
            <div className="flex-1 min-w-[260px] max-w-[460px] flex flex-col gap-4">
              <div className="h-[400px]">
                <GlobeMarkersCard />
              </div>
              <IPInfoCard />
            </div>

          </div>

          {/* Row 2: Ping regions — full width */}
          <div className="mt-6 pb-8">
            <PingRegions />
          </div>

        </main>
      </div>
    </div>
  );
}