import { useCallback, useEffect, useState } from 'react'
import { keysApi } from '../api'
import type { Key } from '../types'

type CreateKeyInput = {
  name: string
  degreeChords: Record<string, string>
}

export function useKeys() {
  const [keys, setKeys] = useState<Key[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadKeys = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const rows = await keysApi.list()
      setKeys(rows)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load key mappings'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadKeys()
  }, [loadKeys])

  const createKey = useCallback(async ({ name, degreeChords }: CreateKeyInput) => {
    const trimmedName = name.trim()
    if (!trimmedName) throw new Error('Key name is required')

    const requiredDegrees = ['1', '2', '3', '4', '5', '6', '7', '8']
    const normalized: Record<string, string> = {}

    for (const degree of requiredDegrees) {
      const value = (degreeChords[degree] ?? '').trim()
      if (!value) throw new Error(`Degree ${degree} chord is required`)
      normalized[degree] = value
    }

    const created = await keysApi.create({
      name: trimmedName,
      degree_chords: normalized,
    })

    setKeys((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
    return created
  }, [])

  return { keys, loading, error, loadKeys, createKey }
}
