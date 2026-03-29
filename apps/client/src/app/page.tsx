import ThemeSwitcherDemo from "@/components/theme";
import { MapControlsExample } from "@/components/map";
import { ChartLineInteractive } from "@/components/chart";

export default function BarsPage() {
  return (
    <div className="min-h-screen p-8">
      {/* Top bar */}
      <div className="mb-6 flex justify-end">
        <ThemeSwitcherDemo />
      </div>

      {/* Main row — items-stretch makes both cards equal height */}
      <div className="flex gap-6 items-stretch">
        {/* Chart grows to fill */}
        <div className="flex-1 min-w-0">
          <ChartLineInteractive />
        </div>

        {/* Map — same height as chart */}
        <div className="w-[450px] shrink-0">
          <MapControlsExample />
        </div>
      </div>
    </div>
  );
}