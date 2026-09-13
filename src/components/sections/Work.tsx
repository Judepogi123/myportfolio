import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { Tag } from '@/components/ui/Tag'
import { projects, type Project } from '@/data/profile'

function ProjectEntry({ project, index }: { project: Project; index: number }) {
  return (
    <article className="border-t border-line py-12 first:border-t-0 first:pt-0 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Stays alongside the detail while it scrolls past on wide screens. */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-16">
            <Reveal>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs tracking-tight text-ink-muted">
                  {project.period}
                </span>
                {project.status === 'current' ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-line bg-accent-soft px-2 py-0.5 font-mono text-[11px] tracking-tight text-accent">
                    <span aria-hidden className="size-1 rounded-full bg-accent" />
                    Live
                  </span>
                ) : null}
              </div>

              <h3 className="mt-3 text-xl font-medium leading-snug tracking-[-0.02em] text-ink sm:text-2xl">
                {project.name}
              </h3>

              <p className="mt-2 text-sm text-ink-muted">{project.client}</p>
              <p className="mt-0.5 font-mono text-xs text-ink-faint">{project.role}</p>

              <dl className="mt-6 space-y-2.5 border-t border-line pt-5">
                {project.facts.map((fact) => (
                  <div key={fact.label} className="flex items-baseline gap-2.5">
                    <dt className="sr-only">{fact.label}</dt>
                    <dd className="font-mono text-sm font-medium tabular-nums text-ink">
                      {fact.value}
                    </dd>
                    <dd className="text-xs text-ink-faint">{fact.label}</dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-6 flex flex-wrap gap-1.5">
                {project.stack.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-8">
          <Reveal delay={0.06}>
            <p className="text-lg leading-relaxed text-ink sm:text-xl sm:leading-relaxed">
              {project.premise}
            </p>
          </Reveal>

          <ul className="mt-10">
            {project.highlights.map((highlight, i) => (
              <Reveal as="li" key={highlight.title} delay={0.04 + i * 0.05} y={16}>
                <div className="group border-t border-line py-6 transition-colors duration-300">
                  <div className="flex gap-4 sm:gap-6">
                    <span className="mt-0.5 font-mono text-xs text-ink-faint transition-colors duration-300 group-hover:text-accent">
                      {index + 1}.{i + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-base font-medium text-ink sm:text-lg">
                        {highlight.title}
                      </h4>
                      <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-muted transition-colors duration-300 group-hover:text-ink">
                        {highlight.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

export function Work() {
  return (
    <Section
      id="work"
      index="02"
      title="Work"
      lead="Two platforms, both still doing the job they were built for. The short version — the full detail is in the résumé."
    >
      <div>
        {projects.map((project, i) => (
          <ProjectEntry key={project.id} project={project} index={i} />
        ))}
      </div>
    </Section>
  )
}
