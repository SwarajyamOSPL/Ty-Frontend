import { useEffect, useState } from 'react'

const SHOW_AFTER = 300 // px scrolled before the button appears

// Round floating button (bottom right) that appears after scrolling down and scrolls back to the top
export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' })
  }

  return (
    <button
      onClick={toTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-5 right-5 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition duration-200 hover:bg-indigo-700 sm:bottom-6 sm:right-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M12 19V5m-7 7l7-7 7 7" />
      </svg>
    </button>
  )
}
