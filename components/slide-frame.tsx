import type { ReactNode } from "react"
import {
  ConcentricRings,
  DotGrid,
  SideBar,
  TopMenu,
  type MenuSection,
} from "./slide-chrome"

export function SlideFrame({
  children,
  section,
  index,
  total,
  date,
  showChrome = true,
}: {
  children: ReactNode
  section: MenuSection
  index: number
  total: number
  date: string
  showChrome?: boolean
}) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-cream sm:flex-row">
      {/* decorations (solo en pantallas grandes, nunca sobre la barra) */}
      <ConcentricRings className="pointer-events-none absolute -bottom-16 -left-16 z-0 hidden h-52 w-52 sm:block" />
      <div className="pointer-events-none absolute right-[18%] top-24 z-0 hidden sm:block">
        <DotGrid rows={3} cols={4} />
      </div>

      {/* main column */}
      <div className="relative z-10 order-2 flex min-w-0 flex-1 flex-col overflow-y-auto px-[clamp(1.25rem,5vw,5rem)] py-[clamp(1.25rem,4vh,3rem)] sm:order-1">
        {showChrome && (
          <header className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:mb-6">
            <TopMenu active={section} />
            <span className="font-display text-[0.6rem] tracking-[0.3em] text-burgundy/50 sm:text-[0.7rem]">
              TIF · 2026
            </span>
          </header>
        )}

        <div className="flex flex-col justify-start sm:min-h-0 sm:flex-1 sm:justify-center">
          {children}
        </div>

        <footer className="mt-4 flex items-center justify-end">
          <span className="font-display text-sm tracking-[0.2em] text-burgundy/60">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </footer>
      </div>

      {/* sidebar (franja horizontal arriba en mobile) */}
      <SideBar date={date} />
    </div>
  )
}
