import { Fragment, useState } from 'react'
import { useReveal } from '../../lib/useReveal'
import { PROJECTS, PROJECT_COUNT, SHIPPED_COUNT, WIP_COUNT } from '../../data/projects'

/**
 * Projects table. Content lives in src/data/projects.js — this file only
 * renders it, so adding a project never means touching a component.
 */

const STATUS = {
  shipped: ['chip-ok', 'bg-ok', 'Shipped'],
  wip: ['chip-warn', 'bg-warn', 'In progress'],
}

export default function Projects() {
  const ref = useReveal()
  const [open, setOpen] = useState('voxa')

  return (
    <section id="projects" className="mt-4 scroll-mt-24" ref={ref}>
      <div className="rv panel">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Projects</h2>
            <p className="mt-0.5 text-[0.72rem] text-ink3">
              {PROJECT_COUNT} entries · select a row to open its card
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="chip chip-ok">{SHIPPED_COUNT} shipped</span>
            {WIP_COUNT > 0 && <span className="chip chip-warn">{WIP_COUNT} in progress</span>}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="dt min-w-[760px]">
            <thead>
              <tr>
                <th className="w-8"></th>
                <th>Project</th>
                <th>Type</th>
                <th>Result</th>
                <th>Stack</th>
                <th className="text-right">Year</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map((r) => {
                const isOpen = open === r.id
                const [chipCls, dotCls] = STATUS[r.status]
                return (
                  <Fragment key={r.id}>
                    <tr onClick={() => setOpen(isOpen ? null : r.id)} className="cursor-pointer">
                      <td className="!pr-0">
                        <span
                          className={`inline-block h-1.5 w-1.5 rounded-full ${dotCls} ${
                            r.status === 'wip' ? 'animate-pulseDot' : ''
                          }`}
                        />
                      </td>
                      <td>
                        <span className="block font-mono text-[0.82rem] font-medium text-ink">
                          {r.name}
                        </span>
                        <span className="mt-0.5 block text-[0.74rem] text-ink3">{r.org}</span>
                      </td>
                      <td>
                        <span className={`chip ${chipCls}`}>{r.kind}</span>
                      </td>
                      <td className="font-medium text-ink">{r.metric}</td>
                      <td>
                        <span className="font-mono text-[0.7rem] text-ink3">
                          {r.stack.slice(0, 3).join(' · ')}
                          {r.stack.length > 3 && ` +${r.stack.length - 3}`}
                        </span>
                      </td>
                      <td className="tnum text-right font-mono text-[0.74rem]">{r.year}</td>
                      <td className="text-right">
                        <span
                          className={`inline-block text-ink3 transition-transform duration-m ease-sys ${
                            isOpen ? 'rotate-90' : ''
                          }`}
                          aria-hidden="true"
                        >
                          ›
                        </span>
                      </td>
                    </tr>

                    {isOpen && (
                      <tr>
                        <td colSpan={7} className="!px-0 !py-0">
                          <div className="border-y border-line bg-sunk/50 px-4 py-5 md:px-6">
                            <h3 className="mb-4 text-[1rem] font-semibold text-ink">{r.title}</h3>
                            <div className="grid gap-5 md:grid-cols-3">
                              {[
                                ['Problem', r.problem],
                                ['Approach', r.approach],
                                ['Result', r.result],
                              ].map(([k, v]) => (
                                <div key={k}>
                                  <p className="lab mb-1.5">{k}</p>
                                  <p className="text-[0.82rem] leading-relaxed text-ink2">{v}</p>
                                </div>
                              ))}
                            </div>

                            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-line pt-4">
                              <span className="lab">Stack</span>
                              <ul className="flex flex-wrap gap-1.5">
                                {r.stack.map((s) => (
                                  <li key={s} className="chip">
                                    {s}
                                  </li>
                                ))}
                              </ul>

                              {r.links?.length > 0 && (
                                <div className="ml-auto flex flex-wrap gap-2">
                                  {r.links.map((l, i) => (
                                    <a
                                      key={l.url}
                                      href={l.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className={
                                        i === 0
                                          ? 'btn !py-1.5 !text-[0.78rem]'
                                          : 'btn-sec !py-1.5 !text-[0.78rem]'
                                      }
                                    >
                                      {l.label} ↗
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
