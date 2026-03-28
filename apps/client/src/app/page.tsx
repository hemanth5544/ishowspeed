import ThemeSwitcherDemo  from "@/components/theme"

export default function BarsPage() {
  return (
<div className="min-h-screen p-8">
      <div className="fixed top-6 right-6">
        <ThemeSwitcherDemo />
      </div>
    </div>
  )
}