import { cn } from '@/lib/cn'
import { Parallax } from './Parallax'

export type Motif = 'device' | 'ledger' | 'form' | 'sync' | 'feed'

/*
 * Line-art stand-ins for a screenshot. Drawn in hairlines like the rest of the
 * page, so a card reads as finished rather than as a missing asset. Each motif
 * says something about what the project does; swap one out by giving the
 * project a `cover` image path instead.
 */
const motifs: Record<Motif, React.ReactNode> = {
  /* Phone frames in perspective — a device mockup studio. */
  device: (
    <g>
      <rect x="118" y="26" width="52" height="98" rx="9" opacity="0.35" />
      <rect x="86" y="18" width="60" height="114" rx="10" opacity="0.6" />
      <rect x="50" y="10" width="68" height="130" rx="12" />
      <line x1="72" y1="24" x2="96" y2="24" />
      <circle cx="84" cy="120" r="6" />
      <path d="M178 60h26m-13-13v26" opacity="0.5" />
    </g>
  ),

  /* Ruled ledger with paired debit and credit columns. */
  ledger: (
    <g>
      <rect x="34" y="16" width="172" height="118" rx="8" />
      <line x1="34" y1="42" x2="206" y2="42" />
      <line x1="128" y1="42" x2="128" y2="134" opacity="0.5" />
      {[58, 76, 94, 112].map((y) => (
        <g key={y}>
          <line x1="48" y1={y} x2="112" y2={y} opacity="0.55" />
          <line x1="142" y1={y} x2="192" y2={y} opacity="0.55" />
        </g>
      ))}
      <line x1="142" y1="124" x2="192" y2="124" strokeWidth="2.5" />
    </g>
  ),

  /* A document with fields and a signature. */
  form: (
    <g>
      <rect x="46" y="12" width="112" height="126" rx="8" />
      <rect x="62" y="34" width="80" height="14" rx="4" opacity="0.55" />
      <rect x="62" y="58" width="80" height="14" rx="4" opacity="0.55" />
      <rect x="62" y="82" width="44" height="14" rx="4" opacity="0.55" />
      <path d="M64 118c8-10 14 6 22-2s12-12 20-4 14 2 20-6" strokeWidth="2" />
      <path d="M176 44l18 18-34 34-22 4 4-22z" opacity="0.6" />
    </g>
  ),

  /* Device and server reconciling — offline-first sync. */
  sync: (
    <g>
      <rect x="28" y="44" width="56" height="76" rx="8" />
      <line x1="28" y1="60" x2="84" y2="60" opacity="0.55" />
      <rect x="156" y="30" width="64" height="34" rx="7" />
      <rect x="156" y="76" width="64" height="34" rx="7" opacity="0.5" />
      <path d="M96 68h48" strokeDasharray="5 5" />
      <path d="M138 62l8 6-8 6" />
      <path d="M144 96H96" strokeDasharray="5 5" opacity="0.6" />
      <path d="M102 90l-8 6 8 6" opacity="0.6" />
    </g>
  ),

  /* Stacked posts with an avatar — an activity feed. */
  feed: (
    <g>
      <rect x="60" y="8" width="120" height="46" rx="8" opacity="0.35" />
      <rect x="48" y="40" width="144" height="52" rx="8" opacity="0.6" />
      <rect x="34" y="76" width="172" height="62" rx="8" />
      <circle cx="58" cy="100" r="10" />
      <line x1="78" y1="96" x2="140" y2="96" opacity="0.7" />
      <line x1="78" y1="108" x2="186" y2="108" opacity="0.45" />
      <line x1="34" y1="124" x2="206" y2="124" opacity="0.35" />
    </g>
  ),
}

type ProjectCoverProps = {
  motif: Motif
  /** A real screenshot, once there is one. */
  src?: string
  alt: string
  className?: string
}

export function ProjectCover({ motif, src, alt, className }: ProjectCoverProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(
          'size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]',
          className,
        )}
      />
    )
  }

  return (
    // A span, not a div: these covers sit inside a <button>, whose content
    // model only allows phrasing content.
    <span
      aria-hidden
      className={cn('dot-grid relative block size-full overflow-hidden bg-raised/50', className)}
    >
      {/*
        The motif drifts inside its frame as the card scrolls. scale-125 gives
        it room to move without exposing an edge.
      */}
      <Parallax as="span" distance={44} className="absolute inset-0 block scale-125">
      <svg
        viewBox="0 0 240 150"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute inset-0 size-full text-ink-faint/70 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:text-accent"
      >
        {motifs[motif]}
      </svg>
      </Parallax>
    </span>
  )
}
