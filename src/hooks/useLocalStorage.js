import { useState, useEffect, useRef } from 'react'

const API = '/api/data'

// Cache local para evitar flickering — la UI responde inmediato
// y sincroniza con D1 en background
const memCache = {}

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    // Primero intentar memoria en caché (evita flicker en re-renders)
    if (memCache[key] !== undefined) return memCache[key]
    // Fallback a localStorage mientras carga D1
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const isMounted = useRef(true)

  // Al montar: cargar desde D1
  useEffect(() => {
    isMounted.current = true
    fetch(`${API}?key=${encodeURIComponent(key)}`)
      .then(r => r.json())
      .then(data => {
        if (!isMounted.current) return
        if (data !== null && data !== undefined) {
          memCache[key] = data
          setValue(data)
          // Sincronizar también en localStorage como respaldo offline
          try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
        }
      })
      .catch(() => {
        // Sin conexión → quedarse con localStorage (ya cargado en el init)
      })
    return () => { isMounted.current = false }
  }, [key]) // eslint-disable-line

  const setValueAndSync = (updater) => {
    setValue(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      memCache[key] = next

      // Guardar en localStorage inmediato (UX sin lag)
      try { localStorage.setItem(key, JSON.stringify(next)) } catch {}

      // Guardar en D1 en background
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: next }),
      }).catch(() => {
        // Offline — quedó guardado en localStorage, se sincronizará en próxima carga
      })

      return next
    })
  }

  return [value, setValueAndSync]
}
