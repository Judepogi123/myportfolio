import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { Tag } from '@/components/ui/Tag'
import { ProjectCover } from '@/components/ui/ProjectCover'
import { personalProjects, type PersonalProject } from '@/data/profile'
import { cn } from '@/lib/cn'

const statusTone: Record<PersonalProject['status'], string> = {
  Live: 'border-accent-line bg-accent-soft text-accent',
  'In progress': 'border-line bg-raised text-ink-muted',
  Prototype: 'border-line bg-raised text-ink-faint',
}

/** A card is a link only when there is somewhere to go. */
function CardShell({
  href,
  className,
  children,
}: {
  href?: string
  className?: string
  children: ReactNode
}) {
  const shared = cn(
    'group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/50 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-line-strong hover:bg-surface',
    className,
  )

  if (!href) return <div className={shared}>{children}</div>

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(shared, 'hover:border-accent-line')}
    >
      {children}
    </a>
  )
}

function ProjectCard({ project }: { project: PersonalProject }) {
  const { featured } = project

  return (
    <CardShell href={project.href}>
      <div
        className={cn(
          'relative overflow-hidden border-b border-line bg-canvas',
          featured ? 'aspect-[16/7] sm:aspect-[21/8]' : 'aspect-[16/10]',
        )}
      >
        <ProjectCover
          motif={project.motif}
          src={project.cover}
          alt={`${project.name} interface`}
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11px] tracking-tight transition-colors duration-300',
              statusTone[project.status],
            )}
          >
            {project.status}
          </span>
          <span className="font-mono text-xs text-ink-faint">{project.year}</span>
        </div>

        <h3 className="mt-3.5 flex items-center gap-1.5 text-lg font-medium tracking-[-0.015em] text-ink transition-colors duration-300 group-hover:text-accent sm:text-xl">
          {project.name}
          {project.href ? (
            <ArrowUpRight
              aria-hidden
              className="size-4 -translate-x-1 opacity-0 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100"
            />
          ) : null}
        </h3>

        <p
          className={cn(
            'mt-2.5 text-base leading-relaxed text-ink-muted',
            featured && 'max-w-2xl',
          )}
        >
          {project.blurb}
        </p>

        <ul className="mt-5 flex flex-wrap gap-1.5 pt-1">
          {project.stack.map((item) => (
            <li key={item}>
              <Tag>{item}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </CardShell>
  )
}

export function Projects() {
  return (
    <Section
      id="projects"
      index="04"
      title="Things nobody asked me to build"
      lead="Side projects — where I try the idea before it has to survive a municipal office."
    >
      <ul className="grid gap-4 sm:gap-5 md:grid-cols-2">
        {personalProjects.map((project, i) => (
          <Reveal
            as="li"
            key={project.id}
            delay={i * 0.06}
            y={18}
            className={cn(project.featured && 'md:col-span-2')}
          >
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
