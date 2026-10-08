import { useEffect } from 'react'

// Jump back to the top whenever `watch` changes (e.g. the route), like a normal page load would.
export function useScrollToTop(watch) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [watch])
}
