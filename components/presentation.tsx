"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react"
import { SlideFrame } from "./slide-frame"
import type { MenuSection } from "./slide-chrome"
import {
  SlideConclusiones,
  SlideCover,
  SlideMarcoTeorico,
  SlideMetodologia,
  SlideObjetivos,
  SlideProblema,
  SlideResultados1,
  SlideResultados2,
  SlideResultados3,
} from "./slides"

/** Fecha de la defensa (editable) */
const DEFENSE_DATE = "DEFENSA 2026"

type SlideDef = {
  id: string
  section: MenuSection
  showChrome?: boolean
  content: React.ReactNode
}

const SLIDES: SlideDef[] = [
  { id: "cover", section: "home", showChrome: false, content: <SlideCover /> },
  { id: "problema", section: "about", content: <SlideProblema /> },
  { id: "objetivos", section: "about", content: <SlideObjetivos /> },
  { id: "marco", section: "about", content: <SlideMarcoTeorico /> },
  { id: "metodologia", section: "about", content: <SlideMetodologia /> },
  { id: "res1", section: "results", content: <SlideResultados1 /> },
  { id: "res2", section: "results", content: <SlideResultados2 /> },
  { id: "res3", section: "results", content: <SlideResultados3 /> },
  { id: "conclusion", section: "conclusion", content: <SlideConclusiones /> },
]

export function Presentation() {
  const [current, setCurrent] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const total = SLIDES.length

  const goTo = useCallback(
    (i: number) => setCurrent((prev) => Math.min(total - 1, Math.max(0, i))),
    [total],
  )
  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault()
        next()
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault()
        prev()
      } else if (e.key === "Home") {
        goTo(0)
      } else if (e.key === "End") {
        goTo(total - 1)
      } else if (e.key.toLowerCase() === "f") {
        toggleFullscreen()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [next, prev, goTo, toggleFullscreen, total])

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", onFsChange)
    return () => document.removeEventListener("fullscreenchange", onFsChange)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-dvh w-full items-center justify-center bg-burgundy-dark p-3 sm:p-6"
    >
      {/* Stage: alto en mobile (vertical con scroll), 16:9 en pantallas grandes */}
      <div className="relative h-[82dvh] w-full max-w-[min(100%,177.78vh)] overflow-hidden rounded-lg shadow-2xl ring-1 ring-black/20 sm:h-auto sm:aspect-[16/9]">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-500 ease-out"
            style={{
              opacity: i === current ? 1 : 0,
              pointerEvents: i === current ? "auto" : "none",
            }}
            aria-hidden={i !== current}
          >
            <SlideFrame
              section={slide.section}
              index={i}
              total={total}
              date={DEFENSE_DATE}
              showChrome={slide.showChrome}
            >
              {slide.content}
            </SlideFrame>
          </div>
        ))}
      </div>

      {/* controls */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-20 flex items-center justify-center gap-3">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-cream/95 px-3 py-2 shadow-lg ring-1 ring-burgundy/10">
          <button
            type="button"
            onClick={prev}
            disabled={current === 0}
            aria-label="Diapositiva anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full text-burgundy transition hover:bg-burgundy hover:text-cream disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <span className="min-w-[3.5rem] text-center font-display text-sm tracking-[0.15em] text-burgundy">
            {current + 1} / {total}
          </span>

          <button
            type="button"
            onClick={next}
            disabled={current === total - 1}
            aria-label="Diapositiva siguiente"
            className="flex h-9 w-9 items-center justify-center rounded-full text-burgundy transition hover:bg-burgundy hover:text-cream disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <span className="mx-1 h-5 w-px bg-burgundy/20" />

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-burgundy transition hover:bg-burgundy hover:text-cream"
          >
            {isFullscreen ? (
              <Minimize className="h-5 w-5" />
            ) : (
              <Maximize className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* progress dots */}
      <div className="pointer-events-none fixed left-1/2 top-4 z-20 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir a diapositiva ${i + 1}`}
            className={`pointer-events-auto h-1.5 rounded-full transition-all ${
              i === current ? "w-6 bg-cream" : "w-1.5 bg-cream/40 hover:bg-cream/70"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
