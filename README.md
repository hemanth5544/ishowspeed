

<h2 align="center">
  ISHOWSPEED
</h2>

<p align="center">
  A modern network speed dashboard with live test metrics, global ping regions, map-based location, and connection quality insights.
</p>

<div align="center">
  <img src="./apps/client/public/demo.gif" alt="Ishowspeed Demo" />
</div>

---


---

## Features

- Automatic speed test on initial page load
- Live download/upload/latency visualization
- Connection quality scoring by use-case (streaming, gaming, calls, browsing)
- Global ping monitor with rolling history bars
- IP and network metadata card
- Interactive globe map with location marker
- Theme switcher and smooth UI motion
- Sidebar GitHub stars button + profile notch

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **UI:** Tailwind CSS v4, shadcn/ui, Lucide
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Maps:** MapLibre GL
- **Network Speed Engine:** `@cloudflare/speedtest`
- **Monorepo:** Turborepo + Bun Workspaces
- **Runtime / Package Manager:** Bun

---

## Project Structure

```bash
ishowspeed/
├── apps/
│   ├── client/      # Next.js speed dashboard
│   └── server/      # backend workspace
├── packages/        # shared packages (optional)
├── turbo.json
├── package.json
└── bun.lock
```

---

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Run all workspaces (via Turbo)

```bash
bun run dev
```

### 3. Run frontend only

```bash
bun run dev:frontend
```

Open: `http://localhost:3000`

---

## Build

### Build all apps

```bash
bun run build
```

### Build frontend only

```bash
bun run build:frontend
```

---

## Notes

- Replace demo assets in `apps/client/public/`:
  - `ishowspeed-demo.gif`
  - `poc-1.png`
  - `poc-2.png`
  - `architecture.png`
- You can update the architecture link once your final Excalidraw is ready.

