"use client";
import { useEffect, useRef } from "react";
import ThemeSwitcherDemo from "@/components/theme";
import { GlobeMarkersCard } from "@/components/map";
import { ChartLineInteractive } from "@/components/speed/chart";
import { useSpeedTest, quality } from "@/components/hooks/useSpeedTest";
import { HeaderStats } from "@/components/speed/headerStats";
import { IPInfoCard } from "@/components/speed/Ipinfocard";
import { ConnectionQuality } from "@/components/speed/Connectionquality";
import { PingRegions } from "@/components/speed/Pingregions";
import { EyeTracking } from "@/components/ui/eye-tracking";
import { FadeInView } from "@/components/speed/Fadeinview";
import { GitHubStarsButton } from "@/components/github-stars-button";
import { NativeProfileNotch } from "@/components/uitripled/native-profile-notch-shadcnui";

export default function BarsPage() {
  const { data, status, progress, summary, startTest } = useSpeedTest();
  const hasAutoStarted = useRef(false);

  useEffect(() => {
    if (hasAutoStarted.current || status !== "idle") return;
    hasAutoStarted.current = true;
    const timer = setTimeout(() => {
      void startTest();
    }, 0);
    return () => clearTimeout(timer);
  }, [startTest, status]);

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

      {/* EyeTracking — fixed bottom right margin */}
      <div
        className="hidden lg:flex fixed bottom-8 items-center justify-center z-20"
        style={{ right: 0, width: "130px" }}
      >
        <EyeTracking eyeSize={50} gap={20} />
      </div>

      <div className="flex min-h-screen">

        {/* ── Sidebar ── */}
        <div
          className="hidden lg:flex flex-col shrink-0 border-r border-border overflow-visible"
          style={{ width: "260px" }}
        >
          <div className="border-b border-border px-4 py-4">
            <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Project
            </p>
            <GitHubStarsButton
              owner="hemanth5544"
              repo="ishowspeed"
              variant="outline"
              size="sm"
              showRepo
              className="w-full justify-between"
            />
          </div>

          <div className="mt-auto px-4 py-4">
            <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Dev
            </p>
            <NativeProfileNotch
              imageSrc="https://avatars.githubusercontent.com/u/92920794?s=400&u=808d412bb97df1d136bcf665af8d844f376b2f16&v=4"
              name="Hemanth"
              username="hemanth5544"
              className="w-full justify-start"
            />
          </div>
        </div>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 py-8 pl-6" style={{ paddingRight: "150px" }}>

          {/* Top stats bar */}
          <FadeInView delay={0}>
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
          </FadeInView>

          {/* Row 1 */}
          <div className="flex items-start gap-6">

            {/* Left col */}
            <div className="flex-[2] min-w-0 flex flex-col gap-6">
              <FadeInView delay={0.05}>
                <ChartLineInteractive
                  data={data}
                  status={status}
                  progress={progress}
                  summary={summary}
                  startTest={startTest}
                />
              </FadeInView>
              <FadeInView delay={0.1}>
                <ConnectionQuality summary={summary} />
              </FadeInView>
            </div>

            {/* Right col */}
            <div className="flex-1 min-w-[260px] max-w-[460px] flex flex-col gap-4">
              <FadeInView delay={0.08}>
                <div className="h-[400px]">
                  <GlobeMarkersCard />
                </div>
              </FadeInView>
              <FadeInView delay={0.13}>
                <IPInfoCard />
              </FadeInView>
            </div>

          </div>

          {/* Row 2: Ping regions */}
          <FadeInView delay={0} className="mt-6 pb-8">
            <PingRegions />
          </FadeInView>

        </main>
      </div>
    </div>
  );
}
