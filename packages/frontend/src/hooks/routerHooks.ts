import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export const useSearchParams = (): Record<string, string> => {
  const location = useLocation()
  return useMemo(() => {
    const params = new URLSearchParams(location.search)
    return [...params.entries()].reduce(
      (result, [key, value]) => ({ ...result, [key]: value }),
      {}
    )
  }, [location.search])
}
