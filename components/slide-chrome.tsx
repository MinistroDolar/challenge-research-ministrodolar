import Image from "next/image"

/* ---------------------------------------------------------------- */
/* Decorative concentric rings (top-right + bottom-left)            */
/* ---------------------------------------------------------------- */

export function ConcentricRings({
  className = "",
  color = "var(--burgundy)",
}: {
  className?: string
  color?: string
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      {[92, 74, 56, 38].map((r) => (
        <circle
          key={r}
          cx="100"
          cy="100"
          r={r}
          stroke={color}
          strokeWidth="1.5"
          opacity="0.5"
        />
      ))}
      <circle cx="100" cy="100" r="10" fill={color} opacity="0.5" />
    </svg>
  )
}

/* ---------------------------------------------------------------- */
/* Small dot grid pattern                                           */
/* ---------------------------------------------------------------- */

export function DotGrid({
  className = "",
  rows = 5,
  cols = 6,
  color = "var(--burgundy)",
}: {
  className?: string
  rows?: number
  cols?: number
  color?: string
}) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: "10px",
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: 9999,
            backgroundColor: color,
            opacity: 0.45,
          }}
        />
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* Top navigation menu (decorative)                                 */
/* ---------------------------------------------------------------- */

const MENU = [
  { label: "INICIO", section: "home" },
  { label: "CONTEXTO", section: "about" },
  { label: "RESULTADOS", section: "results" },
  { label: "CONCLUSIÓN", section: "conclusion" },
] as const

export type MenuSection = (typeof MENU)[number]["section"]

export function TopMenu({ active }: { active: MenuSection }) {
  return (
    <nav
      aria-hidden="true"
      className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-[0.58rem] tracking-[0.16em] sm:gap-6 sm:text-[0.72rem] sm:tracking-[0.28em]"
    >
      {MENU.map((item) => {
        const isActive = item.section === active
        return (
          <span
            key={item.label}
            className={
              isActive
                ? "text-burgundy border-b-2 border-burgundy pb-1"
                : "text-burgundy/40 pb-1"
            }
          >
            {item.label}
          </span>
        )
      })}
    </nav>
  )
}

/* ---------------------------------------------------------------- */
/* Right sidebar with logo + institution + date                     */
/* ---------------------------------------------------------------- */

export function SideBar({ date }: { date: string }) {
  return (
    <aside className="relative z-20 order-1 flex w-full shrink-0 flex-row items-center justify-between gap-3 bg-burgundy px-4 py-3 text-cream sm:order-2 sm:h-full sm:w-[clamp(160px,14%,230px)] sm:flex-col sm:justify-between sm:px-5 sm:py-8">
      <div className="flex min-w-0 flex-row items-center gap-3 sm:w-full sm:flex-col sm:gap-4">
        <div className="flex aspect-square w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5 shadow-md ring-2 ring-cream/25 sm:w-[clamp(88px,80%,132px)] sm:p-1 sm:ring-4">
          <Image
            src="/logo-ugr.png"
            alt="Logo Universidad del Gran Rosario"
            width={200}
            height={200}
            className="h-full w-full object-contain"
          />
        </div>
        <p className="font-display text-[0.6rem] font-700 leading-snug tracking-[0.14em] text-white sm:text-center sm:text-[0.74rem] sm:tracking-[0.16em]">
          UNIVERSIDAD DEL GRAN ROSARIO
        </p>
      </div>

      <div className="hidden sm:block">
        <DotGrid rows={4} cols={4} color="var(--cream)" className="opacity-80" />
      </div>

      <div className="flex shrink-0 flex-col items-center gap-1 text-center">
        <span className="hidden h-px w-10 bg-cream/40 sm:block" />
        <p className="font-display text-[0.58rem] tracking-[0.18em] text-cream/80 sm:text-[0.68rem] sm:tracking-[0.22em]">
          {date}
        </p>
      </div>
    </aside>
  )
}
