import { useEffect, useRef } from 'react'

export default function GlowCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)

    const isInteractive = (el) => {
      if (!el) return false
      const tag = el.tagName?.toLowerCase()
      return (
        tag === 'button' || tag === 'a' || tag === 'input' ||
        tag === 'textarea' || tag === 'select' || tag === 'canvas' ||
        el.classList?.contains('cursor-none') ||
        el.style?.cursor === 'pointer' || el.style?.cursor === 'crosshair' || el.style?.cursor === 'text'
      )
    }

    const onEnter = (e) => {
      if (isInteractive(e.target)) ringRef.current?.classList.add('hovered')
    }
    const onLeave = (e) => {
      if (isInteractive(e.target)) ringRef.current?.classList.remove('hovered')
    }
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    let raf
    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px)`
      }
      // Ring follows with lag
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px)`
      }
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
