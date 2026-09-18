import { useId, useState } from 'react'
import { ArrowUpRight, Plus } from 'lucide-react'
import { Collapse } from '@/components/ui/Disclosure'
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

/*
 * A tile: cover, status and title always visible; the description, stack and
 * link fold away. Five of these fit in two rows instead of running the length
 * of a screen and a half.
 */
function ProjectTile({ project }: { project: PersonalProject }) {
  const [open, setOpen] = useState(Boolean(project.featured))
  const contentId = useId()
  const buttonId = useId()

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border bg-surface/40 transition-colors duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
        open ? 'border-line-strong' : 'border-line hover:border-line-strong',
      )}
    >
      {/*
        The button lives inside the heading rather than the heading being
        display:contents — that trick can drop the heading out of the
        accessibility tree entirely in some browsers.
      */}
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((value) => !value)}
          className="block w-full text-left"
        >
          <span className="relative block aspect-[16/9] overflow-hidden border-b border-line bg-canvas">
            <ProjectCover
              motif={project.motif}
              src={project.cover}
              alt={`${project.name} interface`}
            />
          </span>

          <span className="flex items-start gap-3 px-4 py-3.5">
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full border px-1.5 py-px font-mono text-[10px] tracking-tight transition-colors duration-300',
                    statusTone[project.status],
                  )}
                >
                  {project.status}
                </span>
                <span className="font-mono text-[11px] text-ink-faint">{project.year}</span>
              </span>

              <span
                className={cn(
                  'mt-1.5 block text-[0.9375rem] font-medium leading-snug text-ink transition-colors duration-300',
                  !open && 'group-hover:text-accent',
                )}
              >
                {project.name}
              </span>
            </span>

            <span
              aria-hidden
              className={cn(
                'mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
                open
                  ? 'rotate-45 border-accent-line bg-accent-soft text-accent'
                  : 'border-line text-ink-faint group-hover:border-line-strong group-hover:text-ink',
              )}
            >
              <Plus className="size-3" />
            </span>
          </span>
        </button>
      </h3>

      <Collapse open={open} id={contentId} labelledBy={buttonId}>
        <div className="px-4 pb-4">
          <p className="text-sm leading-relaxed text-ink-muted">{project.blurb}</p>

          <ul className="mt-3.5 flex flex-wrap gap-1.5">
            {project.stack.map((item) => (
              <li key={item}>
                <Tag>{item}</Tag>
              </li>
            ))}
          </ul>

          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors duration-200 hover:text-ink"
            >
              Visit
              <ArrowUpRight aria-hidden className="size-3.5" />
            </a>
          ) : null}
        </div>
      </Collapse>
    </article>
  )
}

export function Projects() {
  return (
    <Section
      id="projects"
      index="04"
      title="Things nobody asked me to build"
      lead="Side projects — where I try an idea before it has to survive real users. Open one for the detail."
    >
      {/*
        items-start matters: grid rows stretch by default, so opening one tile
        would drag its neighbours to the same height and leave them with a
        block of dead space under the title.
      */}
      <ul className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {personalProjects.map((project, i) => (
          <Reveal as="li" key={project.id} delay={i * 0.05} y={16}>
            <ProjectTile project={project} />
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
