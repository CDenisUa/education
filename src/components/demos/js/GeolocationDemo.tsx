'use client'

// Core
import { useState } from 'react'

interface Coords {
  latitude: number
  longitude: number
  accuracy: number
  altitude: number | null
  speed: number | null
}

export function GeolocationDemo() {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [watchId, setWatchId] = useState<number | null>(null)

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation не поддерживается в вашем браузере')
      return
    }
    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          speed: pos.coords.speed,
        })
        setLoading(false)
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Доступ к геолокации запрещён пользователем',
          2: 'Координаты недоступны',
          3: 'Время ожидания истекло',
        }
        setError(messages[err.code] ?? err.message)
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  const startWatch = () => {
    if (!navigator.geolocation) return
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          speed: pos.coords.speed,
        })
      },
      (err) => setError(err.message)
    )
    setWatchId(id)
  }

  const stopWatch = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={getLocation} disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-xs text-white rounded-lg transition-colors">
          {loading ? 'Определение...' : 'getCurrentPosition()'}
        </button>
        {watchId === null ? (
          <button onClick={startWatch}
            className="px-4 py-2 bg-emerald-600/80 hover:bg-emerald-500/80 text-xs text-white rounded-lg transition-colors">
            watchPosition()
          </button>
        ) : (
          <button onClick={stopWatch}
            className="px-4 py-2 bg-red-600/80 hover:bg-red-500/80 text-xs text-white rounded-lg transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-300 animate-pulse" />
            clearWatch()
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">{error}</div>
      )}

      {coords && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Широта', value: coords.latitude.toFixed(6), unit: '°' },
            { label: 'Долгота', value: coords.longitude.toFixed(6), unit: '°' },
            { label: 'Точность', value: Math.round(coords.accuracy), unit: 'м' },
            { label: 'Высота', value: coords.altitude?.toFixed(1) ?? 'N/A', unit: 'м' },
          ].map(({ label, value, unit }) => (
            <div key={label} className="p-3 rounded-xl bg-slate-800/60 border border-white/10">
              <div className="text-xs text-slate-500 mb-1">{label}</div>
              <div className="text-lg font-mono font-bold text-white">{value}<span className="text-slate-500 text-sm ml-1">{unit}</span></div>
            </div>
          ))}
        </div>
      )}

      {!coords && !error && !loading && (
        <div className="p-4 rounded-xl bg-slate-800/30 border border-white/8 text-center text-sm text-slate-600">
          Нажмите кнопку для получения геолокации (требуется разрешение)
        </div>
      )}
    </div>
  )
}
