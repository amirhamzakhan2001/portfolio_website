import { SOCIALS, SocialIcon } from '../../data/socials'

export default function Topbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-[var(--top-h)] border-b border-line bg-app/92 backdrop-blur lg:left-[var(--rail-w)]">
      <div className="flex h-full items-center justify-between gap-4 px-4 lg:px-6">
        {/* breadcrumb */}
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[5px] bg-ink font-mono text-[0.6rem] font-bold text-white">
            A
          </span>
          <span className="truncate font-mono text-[0.7rem] text-ink3">
            amirhamzakhan
            <span className="mx-1.5 text-line2">/</span>
            <span className="text-ink">portfolio</span>
          </span>
          <span className="chip chip-ok ml-1 hidden sm:inline-flex">v1.0</span>
        </div>

        {/* right cluster */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden font-mono text-[0.66rem] text-ink3 md:inline">
            Last updated Aug 2026
          </span>
          {SOCIALS.map(({ label, href, viewBox, path }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="btn-sec grid h-[30px] w-[30px] place-items-center !p-0 text-ink2 transition-colors duration-q hover:text-brand"
            >
              <SocialIcon viewBox={viewBox} path={path} size="0.95rem" />
            </a>
          ))}
          <a
            href="mailto:amirhamzakhan2001@gmail.com"
            className="btn !px-3 !py-1.5 !text-[0.78rem]"
          >
            Hire me
          </a>
        </div>
      </div>
    </header>
  )
}
