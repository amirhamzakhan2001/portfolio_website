import { Suspense, lazy, useEffect, useState, useRef } from 'react'

const AvatarStage = lazy(() => import('./AvatarStage'))

const MODEL_URL = '/models/avatar.glb'

/**
 * The hero subject.
 *
 * Probes for a real 3D model. If Amir has dropped one at /models/avatar.glb
 * it lazy-loads the three.js stage; otherwise it renders the photo treatment,
 * so the page is never broken or blocked waiting on an asset. Swapping in the
 * model later is a file copy, not a code change.
 */
export default function Stage() {
  const [hasModel, setHasModel] = useState(null) // null = still checking

  useEffect(() => {
    let alive = true
    fetch(MODEL_URL, { method: 'HEAD' })
      .then((r) => alive && setHasModel(r.ok && !r.headers.get('content-type')?.includes('text/html')))
      .catch(() => alive && setHasModel(false))
    return () => {
      alive = false
    }
  }, [])

  if (hasModel === true) {
    return (
      <Suspense fallback={<PhotoStage muted />}>
        <AvatarStage url={MODEL_URL} />
      </Suspense>
    )
  }
  return <PhotoStage />
}

/**
 * Photo treatment: hard duotone, angled crop, parallax on pointer.
 * Deliberately graphic rather than a fake cut-out — a bad mask around hair
 * looks worse than an honest, styled frame.
 */
function PhotoStage({ muted = false }) {
  const wrap = useRef(null)
  const imgRef = useRef(null)
  const plateRef = useRef(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf
    const cur = { x: 0, y: 0 }
    const tgt = { x: 0, y: 0 }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      tgt.x = ((e.clientX - r.left) / r.width - 0.5) * 2
      tgt.y = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    const onLeave = () => {
      tgt.x = 0
      tgt.y = 0
    }
    const tick = () => {
      cur.x += (tgt.x - cur.x) * 0.07
      cur.y += (tgt.y - cur.y) * 0.07
      if (imgRef.current)
        imgRef.current.style.transform = `translate3d(${cur.x * 14}px, ${cur.y * 10}px, 0) scale(1.06)`
      if (plateRef.current)
        plateRef.current.style.transform = `translate3d(${cur.x * -22}px, ${cur.y * -14}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={wrap} className={`relative h-full w-full ${muted ? 'opacity-50' : ''}`}>
      {/* blaze plate behind — parallaxes opposite the photo for depth */}
      <div
        ref={plateRef}
        aria-hidden="true"
        className="absolute left-[8%] top-[10%] h-[76%] w-[74%] bg-blaze"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 0 100%)' }}
      />
      <div
        aria-hidden="true"
        className="hatch absolute bottom-[6%] right-[4%] h-24 w-40 opacity-70"
      />

      {/* the photo */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: 'polygon(14% 4%, 96% 0, 88% 96%, 6% 100%)' }}
      >
        <img
          ref={imgRef}
          src="/ahk_profile_pic.png"
          alt="Amir Hamza Khan"
          width="580"
          height="580"
          className="h-full w-full object-cover object-top"
          style={{ filter: 'grayscale(1) contrast(1.35) brightness(1.04)' }}
        />
        {/* duotone: blaze into the shadows, paper into the highlights */}
        <div className="absolute inset-0 bg-blaze mix-blend-multiply opacity-[0.22]" />
        <div className="absolute inset-0 bg-volt mix-blend-screen opacity-[0.10]" />
      </div>

      {/* corner brackets — the launch-page framing device */}
      <span className="absolute left-[12%] top-[2%] h-8 w-8 border-l-2 border-t-2 border-ink" />
      <span className="absolute bottom-[2%] right-[10%] h-8 w-8 border-b-2 border-r-2 border-ink" />
    </div>
  )
}
