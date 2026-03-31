<div align="center">
  <p>
    <img src="https://nextjs.org/static/favicon/safari-pinned-tab.svg" alt="Next.js" width="52" />
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="React" width="52" />
    <img src="https://bun.sh/logo.svg" alt="Bun" width="58" />
    <img src="./apps/client/public/turborepo-icon-seeklogo.svg" alt="Turborepo" width="52" />
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="TypeScript" width="52" />
    <img src="https://avatars.githubusercontent.com/u/139895814?s=200&v=4" alt="Cloudflare Speedtest" width="52" />
  </p>
</div>

<h2 align="center">
  ISHOWSPEED
</h2>

<p align="center">
  A modern network speed dashboard with live test metrics, global ping regions, map-based location, and connection quality insights.
</p>

<div align="center">
  <img src="./apps/client/public/ishowspeed-demo.gif" alt="Ishowspeed Demo" />
</div>

---

## Proof of Work
![poc](./apps/client/public/poc-1.png)
![poc2](./apps/client/public/poc-2.png)

---

## System Architecture

<div align="center">
  <img
    width="1634"
    height="735"
    alt="Ishowspeed Architecture Diagram"
    src="./apps/client/public/architecture.png"
  />
</div>

**Explore the full architecture here:**  
https://excalidraw.com/

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

