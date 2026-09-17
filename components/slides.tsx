import Image from "next/image"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Droplets,
  Filter,
  Flame,
  GraduationCap,
  LayoutGrid,
  Leaf,
  Microscope,
  ScrollText,
  Search,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  Waves,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

/* ---------------- shared bits ---------------- */

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 font-display text-sm font-600 tracking-[0.35em] text-burgundy-soft">
      {children}
    </p>
  )
}

function TitleXL({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-display font-700 uppercase leading-[0.92] tracking-tight text-burgundy text-balance text-[clamp(2.2rem,6vw,5rem)]">
      {children}
    </h1>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-700 uppercase leading-[0.95] tracking-tight text-burgundy text-balance text-[clamp(1.7rem,4vw,3.2rem)]">
      {children}
    </h2>
  )
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-burgundy px-6 py-5 text-cream shadow-md sm:px-7 sm:py-6">
      {children}
    </div>
  )
}

/* ======================= SLIDE 1 - PORTADA ======================= */

export function SlideCover() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="flex aspect-square h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-burgundy/15 bg-white p-1 shadow-sm">
          <Image
            src="/logo-ugr.png"
            alt="Logo Universidad del Gran Rosario"
            width={200}
            height={200}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="font-display text-xs tracking-[0.28em] text-burgundy/70">
          UNIVERSIDAD DEL GRAN ROSARIO
          <br />
          LIC. EN COSMETOLOGÍA FACIAL Y CORPORAL · 2026
        </div>
      </div>

      <h1 className="font-display font-700 uppercase leading-[0.95] tracking-tight text-burgundy text-balance text-[clamp(1.9rem,4.4vw,3.8rem)]">
        Cosmetología y acupuntura en el acné leve a moderado
      </h1>

      <p className="max-w-2xl text-[clamp(1rem,1.6vw,1.4rem)] font-500 leading-snug text-burgundy-soft text-pretty">
        Relación interdisciplinaria desde una revisión bibliográfica con
        perspectiva holística
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 font-display text-sm tracking-[0.12em] text-burgundy">
        <span>GASPARETTI, MICAELA</span>
        <span className="text-burgundy/30">·</span>
        <span>ROMERO, LUDMILA</span>
        <span className="text-burgundy/30">·</span>
        <span>VIZCAINO TORRES, LUNA FLORENCIA</span>
      </div>
    </div>
  )
}

/* ======================= SLIDE 2 - PROBLEMA ======================= */

export function SlideProblema() {
  const items: { icon: LucideIcon; text: string }[] = [
    { icon: Stethoscope, text: "Acné: consulta frecuente en gabinete" },
    {
      icon: Sparkles,
      text: "Impacto más allá de la piel: autoestima, imagen corporal, calidad de vida",
    },
    { icon: TrendingUp, text: "Demanda creciente de terapias complementarias" },
  ]
  return (
    <div className="flex flex-col gap-7">
      <TitleXL>
        Problema
        <br />y justificación
      </TitleXL>

      <div className="grid gap-4 sm:grid-cols-3">
        {items.map(({ icon: Icon, text }, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-burgundy/15 bg-card p-5 shadow-sm"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
              <Icon size={24} strokeWidth={1.75} />
            </span>
            <p className="text-[clamp(0.95rem,1.35vw,1.15rem)] font-500 leading-snug text-burgundy">
              {text}
            </p>
          </div>
        ))}
      </div>

      <Highlight>
        <p className="font-display text-xs tracking-[0.3em] text-cream/60">
          PREGUNTA DE INVESTIGACIÓN
        </p>
        <p className="mt-2 text-[clamp(1.05rem,1.9vw,1.6rem)] font-500 leading-snug text-pretty">
          {"\u201C"}¿Cómo articula la bibliografía especializada la cosmetología
          y la acupuntura para abordar el acné desde una perspectiva
          holística?{"\u201D"}
        </p>
      </Highlight>
    </div>
  )
}

/* ======================= SLIDE 3 - OBJETIVOS ======================= */

export function SlideObjetivos() {
  const especificos = [
    "Caracterizar el acné leve y moderado desde la perspectiva de la Medicina Tradicional China",
    "Comparar el abordaje occidental con el enfoque holístico de la Medicina Tradicional China",
    "Analizar los beneficios de la acupuntura como tratamiento complementario del acné, considerando sus efectos sobre las manifestaciones cutáneas y su impacto en el bienestar físico y emocional del paciente",
  ]
  return (
    <div className="flex flex-col gap-6">
      <TitleXL>Objetivos</TitleXL>

      <Highlight>
        <p className="font-display text-xs tracking-[0.3em] text-cream/60">
          OBJETIVO GENERAL
        </p>
        <p className="mt-2 text-[clamp(1rem,1.6vw,1.35rem)] font-500 leading-snug text-pretty">
          Analizar, desde la bibliografía científica, la relación
          interdisciplinaria entre cosmetología y acupuntura en el acné leve a
          moderado.
        </p>
      </Highlight>

      <div className="grid gap-4 sm:grid-cols-3">
        {especificos.map((text, i) => (
          <div
            key={i}
            className="flex flex-col rounded-xl border border-burgundy/15 bg-card p-5 shadow-sm"
          >
            <span className="font-display text-[2.75rem] font-700 leading-none text-burgundy-soft">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="mt-2 mb-3 h-px w-10 bg-burgundy/25" />
            <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-snug text-burgundy">
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ======================= SLIDE 4 - MARCO TEÓRICO ======================= */

function ConceptRow({
  icon: Icon,
  children,
  tone,
}: {
  icon: LucideIcon
  children: React.ReactNode
  tone: "cream" | "burgundy"
}) {
  const iconWrap =
    tone === "cream"
      ? "bg-cream/15 text-cream"
      : "bg-burgundy/10 text-burgundy"
  const textColor = tone === "cream" ? "text-cream" : "text-burgundy"
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconWrap}`}
      >
        <Icon size={18} strokeWidth={1.75} />
      </span>
      <span
        className={`text-[clamp(0.85rem,1.15vw,1.05rem)] leading-snug ${textColor}`}
      >
        {children}
      </span>
    </li>
  )
}

export function SlideMarcoTeorico() {
  return (
    <div className="flex flex-col gap-6">
      <TitleXL>Marco teórico</TitleXL>

      <div className="grid overflow-hidden rounded-2xl shadow-md md:grid-cols-2">
        {/* Columna izquierda: crema sobre borgoña */}
        <div className="flex flex-col gap-4 bg-burgundy p-6 text-cream md:border-r md:border-cream/20">
          <p className="font-display text-sm font-700 tracking-[0.2em] text-cream/80">
            DERMATOLOGÍA OCCIDENTAL
          </p>
          <ul className="flex flex-col gap-4">
            <ConceptRow icon={Microscope} tone="cream">
              Enfermedad inflamatoria de la unidad pilosebácea
            </ConceptRow>
            <ConceptRow icon={Activity} tone="cream">
              Hiperqueratinización folicular, aumento de sebo, Cutibacterium
              acnes, inflamación
            </ConceptRow>
            <ConceptRow icon={Stethoscope} tone="cream">
              Manifestaciones clínicas: pápulas, pústulas, comedones
            </ConceptRow>
          </ul>
        </div>

        {/* Columna derecha: borgoña sobre crema, con mapa de fondo */}
        <div className="relative flex flex-col gap-4 bg-card p-6 text-burgundy">
          <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
            <Image
              src="/acupuntura-mapa.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="relative flex flex-col gap-4">
            <p className="font-display text-sm font-700 tracking-[0.2em] text-burgundy-soft">
              MEDICINA TRADICIONAL CHINA
            </p>
            <ul className="flex flex-col gap-4">
              <ConceptRow icon={Leaf} tone="burgundy">
                Manifestación externa de un desequilibrio interno
              </ConceptRow>
              <ConceptRow icon={Waves} tone="burgundy">
                Alteraciones del Qi, equilibrio Yin y Yang, funcionamiento de los
                órganos
              </ConceptRow>
              <ConceptRow icon={Flame} tone="burgundy">
                Patrones frecuentes: exceso de calor, acumulación de humedad,
                estasis de sangre (Xue)
              </ConceptRow>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ======================= SLIDE 5 - METODOLOGÍA (LÍNEA DE TIEMPO) ======================= */

type Hito = {
  icon: LucideIcon
  title: string
  note?: string
  big?: string
  highlight?: boolean
}

const HITOS: Hito[] = [
  { icon: Target, title: "Problema de investigación" },
  { icon: Search, title: "Búsqueda bibliográfica", note: "PubMed · Google Académico" },
  { icon: Filter, title: "Selección en etapas", note: "título · resumen · lectura completa" },
  { icon: BookOpen, title: "artículos", note: "2020 a 2025", big: "10", highlight: true },
  { icon: LayoutGrid, title: "Matriz bibliográfica" },
  { icon: ScrollText, title: "Síntesis narrativa" },
  { icon: Sparkles, title: "Resultados" },
]

function HitoLabel({ hito }: { hito: Hito }) {
  return (
    <div className="flex flex-col">
      {hito.big && (
        <span className="font-display text-3xl font-700 leading-none text-burgundy">
          {hito.big}
        </span>
      )}
      <span className="font-display text-[0.78rem] font-600 uppercase tracking-[0.08em] leading-tight text-burgundy">
        {hito.title}
      </span>
      {hito.note && (
        <span className="mt-0.5 text-[0.68rem] leading-tight text-burgundy/60">
          {hito.note}
        </span>
      )}
    </div>
  )
}

function HitoNode({ hito }: { hito: Hito }) {
  return (
    <span
      className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${
        hito.highlight
          ? "border-burgundy bg-burgundy text-cream"
          : "border-burgundy/40 bg-cream text-burgundy"
      }`}
    >
      <hito.icon size={20} strokeWidth={1.75} />
    </span>
  )
}

export function SlideMetodologia() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="inline-block rounded-full bg-burgundy/10 px-3 py-1 font-display text-[0.62rem] font-600 tracking-[0.2em] text-burgundy-soft">
          REVISIÓN BIBLIOGRÁFICA · CUALITATIVA, DESCRIPTIVA Y EXPLORATORIA
        </span>
      </div>
      <TitleXL>Metodología</TitleXL>

      {/* Timeline horizontal (desktop) */}
      <div className="relative mt-2 hidden lg:block">
        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-burgundy/25" />
        <div className="relative grid grid-cols-7">
          {HITOS.map((hito, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="flex h-24 w-full items-end justify-center pb-3 text-center">
                {i % 2 === 0 ? <HitoLabel hito={hito} /> : null}
              </div>
              <div className="relative flex w-full items-center justify-center">
                <HitoNode hito={hito} />
                {i < HITOS.length - 1 && (
                  <ArrowRight
                    size={16}
                    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 text-burgundy/50"
                  />
                )}
              </div>
              <div className="flex h-24 w-full items-start justify-center pt-3 text-center">
                {i % 2 === 1 ? <HitoLabel hito={hito} /> : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline vertical (mobile / tablet) */}
      <ol className="mt-1 flex flex-col lg:hidden">
        {HITOS.map((hito, i) => (
          <li key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <HitoNode hito={hito} />
              {i < HITOS.length - 1 && (
                <span className="my-1 w-0.5 flex-1 bg-burgundy/25" />
              )}
            </div>
            <div className="pb-4 pt-1.5">
              <HitoLabel hito={hito} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ======================= SLIDE 6 - RESULTADOS OE1 ======================= */

export function SlideResultados1() {
  const patrones = [
    { icon: Flame, label: "CALOR" },
    { icon: Droplets, label: "HUMEDAD" },
    { icon: Waves, label: "ESTASIS DE SANGRE" },
  ]
  return (
    <div className="flex flex-col gap-5">
      <Kicker>RESULTADOS · OBJETIVO 1</Kicker>
      <SectionTitle>El acné desde la Medicina Tradicional China</SectionTitle>

      {/* Contraste de paradigmas */}
      <div className="flex items-stretch gap-3">
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-burgundy/15 bg-card px-4 py-5 text-center shadow-sm">
          <span className="font-display text-lg font-700 tracking-[0.12em] text-burgundy">
            OCCIDENTE
          </span>
        </div>
        <div className="flex items-center font-display text-lg font-700 text-burgundy-soft">
          VS
        </div>
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-burgundy px-4 py-5 text-center text-cream shadow-md">
          <span className="font-display text-lg font-700 tracking-[0.12em]">
            MTC
          </span>
        </div>
      </div>
      <p className="text-center text-[clamp(0.85rem,1.15vw,1.05rem)] text-burgundy/70">
        No explican el acné desde el mismo lugar
      </p>

      <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
        {/* Chips de patrones */}
        <div className="flex flex-col gap-3 rounded-xl border border-burgundy/15 bg-card p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {patrones.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-2 rounded-full bg-burgundy/10 px-3 py-1.5 font-display text-[0.72rem] font-600 tracking-[0.08em] text-burgundy"
              >
                <Icon size={15} strokeWidth={2} />
                {label}
              </span>
            ))}
          </div>
          <p className="text-[0.72rem] leading-tight text-burgundy/55">
            No son equivalentes a conceptos biomédicos
          </p>
        </div>

        {/* Bloque destacado: heterogeneidad */}
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-burgundy/40 bg-card p-4 shadow-sm">
          <AlertTriangle size={22} strokeWidth={1.75} className="shrink-0 text-burgundy-soft" />
          <p className="text-[clamp(0.82rem,1.1vw,1rem)] leading-snug text-burgundy">
            No existe un protocolo único de acupuntura: gran heterogeneidad en
            puntos, frecuencia y técnica
          </p>
        </div>
      </div>

      <Highlight>
        <p className="text-[clamp(0.95rem,1.5vw,1.3rem)] font-600 leading-snug text-pretty">
          La MTC tiene una lógica diagnóstica propia que hay que respetar
        </p>
      </Highlight>
    </div>
  )
}

/* ======================= SLIDE 7 - RESULTADOS OE2 ======================= */

export function SlideResultados2() {
  return (
    <div className="flex flex-col gap-5">
      <Kicker>RESULTADOS · OBJETIVO 2</Kicker>
      <SectionTitle>Abordaje occidental vs. enfoque holístico</SectionTitle>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-xl border border-burgundy/15 bg-card p-5 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
            <Stethoscope size={22} strokeWidth={1.75} />
          </span>
          <p className="font-display text-sm font-700 tracking-[0.15em] text-burgundy-soft">
            TRATAMIENTO CONVENCIONAL
          </p>
          <p className="text-[clamp(0.85rem,1.2vw,1.05rem)] leading-snug text-burgundy">
            Protocolos estandarizados y con evidencia científica
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-xl bg-burgundy p-5 text-cream shadow-md">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream/15 text-cream">
            <Leaf size={22} strokeWidth={1.75} />
          </span>
          <p className="font-display text-sm font-700 tracking-[0.15em] text-cream/80">
            ACUPUNTURA
          </p>
          <p className="text-[clamp(0.85rem,1.2vw,1.05rem)] leading-snug">
            No solo trata la lesión, busca equilibrar el organismo. Los pacientes
            buscan terapias complementarias con una visión integral de la salud
          </p>
        </div>
      </div>

      {/* Punto de encuentro */}
      <div className="flex flex-col gap-3 rounded-2xl border-2 border-burgundy/25 bg-card p-5 shadow-sm">
        <span className="flex items-center gap-2 font-display text-xs font-700 tracking-[0.22em] text-burgundy-soft">
          <Users size={16} strokeWidth={2} />
          PUNTO DE ENCUENTRO
        </span>
        <div className="grid gap-3 md:grid-cols-2">
          <p className="flex items-start gap-2 text-[clamp(0.82rem,1.1vw,1rem)] leading-snug text-burgundy">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-burgundy-soft" strokeWidth={2} />
            La integración requiere respeto por las incumbencias profesionales y
            comunicación interdisciplinaria
          </p>
          <p className="flex items-start gap-2 text-[clamp(0.82rem,1.1vw,1rem)] leading-snug text-burgundy">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-burgundy-soft" strokeWidth={2} />
            Rol del profesional: acompañar y educar al paciente
          </p>
        </div>
      </div>
    </div>
  )
}

/* ======================= SLIDE 8 - RESULTADOS OE3 ======================= */

export function SlideResultados3() {
  const beneficios = [
    "Menos lesiones inflamatorias",
    "Mejor calidad de vida",
    "Bienestar emocional",
  ]
  const limitaciones = [
    "Muestras pequeñas",
    "Protocolos diferentes",
    "Evidencia heterogénea",
  ]
  return (
    <div className="flex flex-col gap-5">
      <Kicker>RESULTADOS · OBJETIVO 3</Kicker>
      <SectionTitle>Beneficios y límites de la evidencia</SectionTitle>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Beneficios */}
        <div className="flex flex-col gap-3 rounded-xl border border-burgundy/15 bg-card p-5 shadow-sm">
          <span className="flex items-center gap-2 font-display text-sm font-700 tracking-[0.18em] text-burgundy-soft">
            <CheckCircle2 size={20} strokeWidth={2} />
            BENEFICIOS
          </span>
          <ul className="flex flex-col gap-3">
            {beneficios.map((t) => (
              <li
                key={t}
                className="flex items-start gap-2 text-[clamp(0.88rem,1.2vw,1.1rem)] leading-snug text-burgundy"
              >
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-burgundy" strokeWidth={2} />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Limitaciones */}
        <div className="flex flex-col gap-3 rounded-xl border border-burgundy/15 bg-card p-5 shadow-sm">
          <span className="flex items-center gap-2 font-display text-sm font-700 tracking-[0.18em] text-burgundy-soft">
            <AlertTriangle size={20} strokeWidth={2} />
            LIMITACIONES
          </span>
          <ul className="flex flex-col gap-3">
            {limitaciones.map((t) => (
              <li
                key={t}
                className="flex items-start gap-2 text-[clamp(0.88rem,1.2vw,1.1rem)] leading-snug text-burgundy"
              >
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-burgundy" strokeWidth={2} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Highlight>
        <p className="font-display text-xs tracking-[0.3em] text-cream/60">
          POSTURA CRÍTICA
        </p>
        <p className="mt-2 text-[clamp(1rem,1.6vw,1.4rem)] font-600 leading-snug text-pretty">
          Analizar la evidencia y reconocer sus límites
        </p>
      </Highlight>
    </div>
  )
}

/* ======================= SLIDE 9 - CONCLUSIONES ======================= */

export function SlideConclusiones() {
  const bloques: { icon: LucideIcon; text: string }[] = [
    {
      icon: Users,
      text: "Existen puntos de encuentro entre cosmetología y acupuntura, desde una mirada crítica e interdisciplinaria",
    },
    {
      icon: Sparkles,
      text: "El acné no se aborda solo desde las lesiones visibles: impacta calidad de vida y autoestima",
    },
    {
      icon: Activity,
      text: "Evidencia prometedora pero limitada: ni descartarla ni presentarla como solución definitiva",
    },
  ]
  return (
    <div className="flex h-full flex-col gap-5">
      <TitleXL>Conclusiones</TitleXL>

      <div className="grid gap-4 sm:grid-cols-3">
        {bloques.map(({ icon: Icon, text }, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-burgundy/15 bg-card p-5 shadow-sm"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
              <Icon size={22} strokeWidth={1.75} />
            </span>
            <p className="text-[clamp(0.85rem,1.15vw,1.05rem)] leading-snug text-burgundy">
              {text}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-burgundy p-5 text-cream shadow-md sm:flex-row sm:items-center sm:gap-6">
        <span className="flex items-center gap-2 font-display text-xs font-700 tracking-[0.24em] text-cream/70">
          <GraduationCap size={18} strokeWidth={1.75} />
          FUTURAS INVESTIGACIONES
        </span>
        <div className="flex flex-1 flex-col gap-2 text-[clamp(0.85rem,1.15vw,1.05rem)] leading-snug sm:flex-row sm:gap-6">
          <p className="flex items-start gap-2">
            <ArrowRight size={16} className="mt-1 shrink-0 text-cream/70" />
            Acupuntura en otras áreas de la estética, por ejemplo el
            envejecimiento cutáneo
          </p>
          <p className="flex items-start gap-2">
            <ArrowRight size={16} className="mt-1 shrink-0 text-cream/70" />
            Cosmetología basada en evidencia y trabajo interdisciplinario
          </p>
        </div>
      </div>

      <div className="mt-auto pt-2">
        <p className="font-display font-700 uppercase leading-none tracking-tight text-burgundy text-[clamp(3rem,9vw,7rem)]">
          Gracias
        </p>
      </div>
    </div>
  )
}
