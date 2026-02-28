import { useState, useEffect, useCallback, useRef } from 'react'

export type SlugStatus = 'idle' | 'checking' | 'available' | 'taken'

export function useSlugCheck(
  slug: string,
  endpoint: 'filmes' | 'pessoas' | 'posts',
  excludeId?: string
) {
  const [slugStatus, setSlugStatus] = useState<SlugStatus>('idle')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestSlugRef = useRef(slug)

  const checkSlug = useCallback(async (slugToCheck?: string) => {
    const value = slugToCheck ?? latestSlugRef.current
    if (!value.trim()) { setSlugStatus('idle'); return }

    setSlugStatus('checking')
    try {
      const params = new URLSearchParams({ slug: value })
      if (excludeId) params.set('excludeId', excludeId)
      const res = await fetch(`/api/admin/${endpoint}/slug-check?${params}`)
      if (!res.ok) { setSlugStatus('idle'); return }
      const { available } = await res.json() as { available: boolean }
      setSlugStatus(available ? 'available' : 'taken')
    } catch {
      setSlugStatus('idle')
    }
  }, [endpoint, excludeId])

  useEffect(() => {
    latestSlugRef.current = slug
    if (!slug.trim()) { setSlugStatus('idle'); return }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      checkSlug(slug)
    }, 400)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [slug, checkSlug])

  return { slugStatus, checkSlug: () => checkSlug() }
}
