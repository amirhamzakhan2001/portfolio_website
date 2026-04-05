import { useState, useEffect } from 'react'

const WORDS = [
  'Voice AI Systems',
  'RAG Pipelines',
  'LLM Applications',
  'AI Agents',
  'NLP Systems',
  'Generative AI',
  'Production ML',
]

export default function TypedText({ words = WORDS, speed = 80, deleteSpeed = 40, pause = 1800, className = '' }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex % words.length]
    let timeout

    if (!isDeleting && displayed === current) {
      timeout = setTimeout(() => setIsDeleting(true), pause)
    } else if (isDeleting && displayed === '') {
      setIsDeleting(false)
      setWordIndex((i) => i + 1)
    } else if (isDeleting) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), deleteSpeed)
    } else {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), speed)
    }

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, wordIndex, words, speed, deleteSpeed, pause])

  return (
    <span className={className}>
      {displayed}
      <span className="animate-blink text-accent-cyan">|</span>
    </span>
  )
}
