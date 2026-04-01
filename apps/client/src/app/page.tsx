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
import { ProductHuntButton } from "@/components/producthunt-button";
import { Suspense } from "react";

const SIDEBAR_W    = 200;  
const STRIPE_W     = 20;   
const RIGHT_MARGIN = 180;  
const GAP = 24;

export default function BarsPage() {
  const { data, status, progress, summary, startTest } = useSpeedTest();
  const hasAutoStarted = useRef(false);

  useEffect(() => {
    if (hasAutoStarted.current || status !== "idle") return;
    hasAutoStarted.current = true;
    const timer = setTimeout(() => { void startTest(); }, 0);
    return () => clearTimeout(timer);
  }, [startTest, status]);

  return (
    <div className="relative min-h-screen">

      {/* Left stripe — right edge of sidebar */}
      <div
        className="diagonal-stripes pointer-events-none absolute inset-y-0 hidden lg:block"
        style={{ left: `${SIDEBAR_W}px`, width: `${STRIPE_W}px` }}
        aria-hidden="true"
      />

      {/* Right stripe */}
      <div
        className="diagonal-stripes pointer-events-none absolute inset-y-0 hidden lg:block"
        style={{ right: `${RIGHT_MARGIN}px`, width: `${STRIPE_W}px` }}
        aria-hidden="true"
      />

      {/* NativeProfileNotch — top-right inside right margin */}
      <div
        className="hidden lg:flex fixed top-8 items-center justify-center z-20"
        style={{ right: 0, width: `${RIGHT_MARGIN}px` }}
      >
        <NativeProfileNotch
          imageSrc="https://avatars.githubusercontent.com/u/92920794?s=400&u=808d412bb97df1d136bcf665af8d844f376b2f16&v=4"
          name="Hemanth"
          username="hemanth5544"
          className="origin-top scale-90"
        />
      </div>

      {/* EyeTracking — centered inside right margin */}
      <div
        className="hidden lg:flex fixed bottom-8 items-center justify-center z-20"
        style={{ right: 0, width: `${RIGHT_MARGIN}px` }}
      >
        <EyeTracking eyeSize={50} gap={20} />
      </div>
 
      <div className="flex min-h-screen">

        {/* ── Sidebar ── */}
        <div
          className="hidden lg:flex flex-col shrink-0 border-r border-border overflow-visible"
          style={{ width: `${SIDEBAR_W}px` }}
        >
          <div className="px-4 py-7">
            <GitHubStarsButton
              owner="hemanth5544"
              repo="ishowspeed"
              variant="outline"
            />
            <span className="mx-2 text-sm text-muted-foreground">
              <Suspense fallback={null}>
                <ProductHuntButton slug="notion" upvotes={12843} name="Notion" variant="producthunt" />
              </Suspense>            </span>
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

        {/* ── Main content ──
            Left padding  = stripe width + gap  (clears the left stripe)
            Right padding = right margin + stripe width + gap  (clears right stripe + margin)
        -->*/}
        <main
          className="flex-1 min-w-0 py-8"
          style={{
            paddingLeft:  `${STRIPE_W + GAP}px`,
            paddingRight: `${RIGHT_MARGIN + STRIPE_W + GAP}px`,
          }}
        >

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
