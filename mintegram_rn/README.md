# 🎮 Mintegram Next.js - Frontend Jucăuș și Modern

Un frontend jucăuș și colorat pentru aplicația Mintegram, construit cu **Next.js 16**, **Tailwind CSS 4**, **Framer Motion** și **Zustand**.

## ✨ Caracteristici

### 🎨 Design Modern și Jucăuș

- **Gradient-uri colorate** pentru butoane, carduri și fundal
- **Animații fluide** cu Framer Motion pentru toate componentele
- **UI interactiv** cu hover effects și tranziții
- **Design responsive** optimizat pentru mobile și desktop
- **Paletă de culori vibrantă** cu tonuri de purple, pink, blue, orange

### 🧩 Funcționalități Principale

- **Home Page dinamic** cu hero section animat și puzzle cards
- **Listă de integrame** cu filtrare și căutare
- **Joc de Crossword interactiv** cu grid dinamic
- **Header cu navigație** și avatar user
- **Sistema de autentificare** cu Zustand store
- **Game state management** pentru progresul în joc

### Funcționalități implementate
- Salvare a progresului utilizatorului
- Leaderboard pentru competiție
- Opțiuni de dificultate variate
- Teme personalizate
- Sistem de feedback și sugestii
- Tutoriale și ajutoare
- Generare aleatorie de integrame/rebusuri
- Partajare socială
- Mod de joc multiplayer
- Statistici și analize

### 🚀 Tehnologii Folosite

```json
{
  "framework": "Next.js 16 (App Router)",
  "styling": "Tailwind CSS 4",
  "animations": "Framer Motion",
  "state": "Zustand",
  "http": "Axios",
  "icons": "Lucide React",
  "typescript": "TypeScript 5"
}
```

## 📁 Structura Proiectului

```
mintegram_next/
├── app/
│   ├── globals.css              # Stiluri globale cu animații custom
│   ├── layout.tsx               # Layout principal cu Header
│   ├── page.tsx                 # Home page cu hero section
│   └── integrame/
│       ├── page.tsx             # Listă integrame cu filtre
│       └── [slug]/
│           └── page.tsx         # Pagina de joc crossword
├── components/
│   ├── Header.tsx               # Navigație și user menu
│   └── ui/
│       ├── Button.tsx           # Buton cu variante și animații
│       ├── Card.tsx             # Card component cu hover
│       ├── Badge.tsx            # Badge colorat
│       └── Input.tsx            # Input cu validare
├── stores/
│   ├── authStore.ts             # Zustand store pentru autentificare
│   └── gameStore.ts             # Zustand store pentru joc
├── lib/
│   ├── axios.ts                 # Configurare axios cu interceptors
│   └── utils.ts                 # Utilități (cn, formatTime, etc.)
├── types/
│   └── index.ts                 # TypeScript types
└── public/                      # Assets statice
```

## 🎯 Componente UI

### Button

```tsx
<Button variant="primary" size="lg" icon={<Icon />}>
  Text
</Button>

// Variante: primary, secondary, accent, outline, ghost
// Sizes: sm, md, lg
```

### Card

```tsx
<Card hover gradient>
  Conținut
</Card>
```

### Badge

```tsx
<Badge variant="success" size="md">
  Ușor
</Badge>

// Variante: primary, secondary, success, warning, danger, info
```

## 🎮 Game Features

### Crossword Grid

- **Grid interactiv** cu celule selectabile
- **Highlight direction** (horizontal/vertical)
- **Validare răspunsuri** cu indicații vizuale
- **Navigare cu taste** (săgeți, spațiu, backspace)
- **Timer** pentru urmărirea timpului
- **Progress tracking** cu verificare completare

## 🔧 Setup și Rulare

### Instalare

```bash
cd mintegram_next
npm install
```

### Development

```bash
npm run dev
# Acces la http://localhost:3000
```

### Build pentru producție

```bash
npm run build
npm start
```

## 🌈 Paletă de Culori

```css
Primary: #667eea -> #764ba2 (Purple gradient)
Secondary: #f093fb -> #f5576c (Pink gradient)
Accent: #4facfe -> #00f2fe (Blue gradient)
Success: #22c55e (Green)
Warning: #f97316 (Orange)
Danger: #ef4444 (Red)
```

## 📱 Responsive Design

- **Mobile First** approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid adaptiv** pentru puzzle-uri
- **Menu mobil** cu animații

## 🔐 State Management

### Auth Store (Zustand)

```typescript
const { user, login, logout, fetchMe } = useAuthStore();
```

### Game Store (Zustand)

```typescript
const { puzzle, letters, selectedCell, checkComplete } = useGameStore();
```

## 🌐 API Integration

```typescript
import { api } from "@/lib/axios";
const { data } = await api.get("/api/puzzles");
```

## 📊 Environment Variables

Creează `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

**Dezvoltat cu ❤️ folosind Next.js și Tailwind CSS**

🎮 **Happy Puzzling!** 🧩

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Sugestii de îmbunătățire a proiectului
- Funcționalitate de salvare a progresului
- Leaderboard pentru competiție
- Opțiuni de dificultate variate
- Teme personalizate
- Feedback și sugestii
- Tutoriale și ajutoare
- Generare aleatorie de integrame/rebusuri
- Partajare socială
- Mod de joc multiplayer
- Statistici și analize
