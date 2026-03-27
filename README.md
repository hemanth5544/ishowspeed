# 🚀 Ishowspeed Monorepo

A modern full-stack monorepo built with **Bun + TurboRepo + Next.js + NestJS + PostgreSQL (Prisma)**.

---

## 🧱 Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui

### Backend

* NestJS
* Bun (runtime)
* Prisma ORM
* PostgreSQL

### Monorepo

* TurboRepo
* Bun Workspaces

---

## 📁 Project Structure

```
ishowspeed/
│
├── apps/
│   ├── client/     # Next.js frontend (shadcn UI)
│   └── server/     # NestJS backend (Bun + Prisma)
│
├── packages/       # Shared packages (optional)
│
├── turbo.json
├── package.json
└── bun.lock
```

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd ishowspeed
```

---

### 2. Install dependencies (IMPORTANT)

```bash
bun install
```

> Always run installs at the **root** (monorepo workspace)

---

## ▶️ Running the Project

```bash
bun run dev
```

This will start:

* Frontend → http://localhost:3000
* Backend → http://localhost:3001 (or default Nest port)

---

## 🖥️ Frontend (Next.js)

Location:

```
apps/client
```

Run individually:

```bash
cd apps/client
bun run dev
```

---

## 🧠 Backend (NestJS + Bun)

Location:

```
apps/server
```

Run individually:

```bash
cd apps/server
bun run dev
```

---

## 🗄️ Database Setup (PostgreSQL + Prisma)

### 1. Configure environment

Create file:

```
apps/server/.env
```

Add:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ishowspeed"
```

---

### 2. Setup Prisma

```bash
cd apps/server

bunx prisma generate
bunx prisma db push
```

---

## 📦 Prisma Example Schema

```prisma
model User {
  id    String @id @default(uuid())
  email String @unique
  name  String?
}
```

---

## 🔁 Scripts

### Root

```bash
bun run dev     # run all apps
bun run build   # build all apps
```

---

## ⚠️ Important Notes

* This project uses **Bun as the runtime**
* NestJS is not officially Bun-native but works fine
* Always install dependencies from **root**
* Environment variables are scoped per app

---

## 🔐 Environment Variables

| Location         | Purpose                              |
| ---------------- | ------------------------------------ |
| apps/server/.env | Database + backend configs           |
| apps/client/.env | Frontend configs (use NEXT_PUBLIC_*) |

---

## 🚧 Future Improvements

* Shared types (`packages/types`)
* API client layer for frontend
* Authentication (JWT)
* Docker setup (Postgres + apps)
* CI/CD pipeline

---

