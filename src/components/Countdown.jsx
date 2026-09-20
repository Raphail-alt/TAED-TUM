import { useEffect, useState } from 'react'

const TARGET = new Date('2026-11-09T08:00:00+03:00').getTime()

function diff() {
  const ms = Math.max(0, TARGET - Date.now())
  return {
    Days: Math.floor(ms / 86400000),
    Hours: Math.floor(ms / 3600000) % 24,
    Minutes: Math.floor(ms / 60000) % 60,
    Seconds: Math.floor(ms / 1000) % 60,
  }
}

export default function Countdown() {
  const [t, setT] = useState(diff)

  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {Object.entries(t).map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-line bg-white px-2 py-3 text-center shadow-sm sm:px-4 sm:py-4">
          <div className="font-display text-2xl font-bold tabular-nums text-brand sm:text-4xl">
            {String(value).padStart(2, '0')}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-mute sm:text-xs">{label}</div>
        </div>
      ))}
    </div>
  )
}
