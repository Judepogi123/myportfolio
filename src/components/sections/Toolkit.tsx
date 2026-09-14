import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { Tag } from '@/components/ui/Tag'
import { toolkit } from '@/data/profile'

export function Toolkit() {
  return (
    <Section
      id="toolkit"
      index="05"
      title="Toolkit"
      lead="Everything listed here is in something currently running, not something I read about."
    >
      <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
        {toolkit.map((group, i) => (
          <Reveal key={group.id} delay={i * 0.05} y={14} className="bg-canvas">
            <div className="group h-full px-5 py-6 transition-colors duration-300 hover:bg-surface sm:px-6 sm:py-7">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-xs text-ink-faint transition-colors duration-300 group-hover:text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-base font-medium text-ink">{group.title}</h3>
              </div>

              <p className="mt-1.5 pl-[26px] text-xs text-ink-faint">{group.note}</p>

              <ul className="mt-4 flex flex-wrap gap-1.5 pl-[26px]">
                {group.items.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
