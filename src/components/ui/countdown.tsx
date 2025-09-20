'use client'

import * as React from 'react'

import { cn } from '@/src/lib/utils'

type TimeParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMs: number
}

export type CountdownProps = React.ComponentProps<'div'> & {
  /** Target date/time. Accepts Date, date string, or epoch ms. */
  targetDate: Date | string | number
  /** Hide the days unit if not needed. */
  showDays?: boolean
  /** Render unit labels under values. */
  showLabels?: boolean
  /** Custom labels for units. */
  labels?: {
    days?: string
    hours?: string
    minutes?: string
    seconds?: string
  }
  /** Pad hours/minutes/seconds with leading zeros. */
  leadingZeros?: boolean
  /** Size of the countdown blocks. */
  size?: 'sm' | 'md' | 'lg'
  /** Optional custom renderer. */
  render?: (time: TimeParts) => React.ReactNode
  /** Called once when countdown reaches zero. */
  onComplete?: () => void
  /** Update interval in milliseconds (defaults to 1000). */
  intervalMs?: number
}

function getTimeParts(msRemaining: number): TimeParts {
  const totalMs = Math.max(0, msRemaining)
  const dayMs = 24 * 60 * 60 * 1000
  const hourMs = 60 * 60 * 1000
  const minuteMs = 60 * 1000
  const secondMs = 1000

  const days = Math.floor(totalMs / dayMs)
  const hours = Math.floor((totalMs % dayMs) / hourMs)
  const minutes = Math.floor((totalMs % hourMs) / minuteMs)
  const seconds = Math.floor((totalMs % minuteMs) / secondMs)

  return { days, hours, minutes, seconds, totalMs }
}

function useCountdown(target: Date | string | number, intervalMs = 1000, onComplete?: () => void) {
  const targetMs = React.useMemo(() => {
    return typeof target === 'number' ? target : new Date(target).getTime()
  }, [target])

  const computeRemaining = React.useCallback(() => Math.max(0, targetMs - Date.now()), [targetMs])
  const [remainingMs, setRemainingMs] = React.useState<number>(computeRemaining)
  const completedRef = React.useRef<boolean>(false)

  React.useEffect(() => {
    setRemainingMs(computeRemaining())
    completedRef.current = false
  }, [computeRemaining])

  React.useEffect(() => {
    if (remainingMs <= 0 && !completedRef.current) {
      completedRef.current = true
      onComplete?.()
    }
  }, [remainingMs, onComplete])

    // Tick
  React.useEffect(() => {
    if (intervalMs <= 0) return
    const id = setInterval(() => {
      setRemainingMs(computeRemaining())
    }, intervalMs)
    return () => clearInterval(id)
  }, [computeRemaining, intervalMs])

  return getTimeParts(remainingMs)
}

export function Countdown({
  className,
  targetDate,
  showDays = true,
  showLabels = true,
  labels,
  leadingZeros = true,
  size = 'md',
  render,
  onComplete,
  intervalMs = 1000,
  ...props
}: CountdownProps) {
  const time = useCountdown(targetDate, intervalMs, onComplete)

  const resolvedLabels = {
    days: labels?.days ?? 'Days',
    hours: labels?.hours ?? 'Hours',
    minutes: labels?.minutes ?? 'Minutes',
    seconds: labels?.seconds ?? 'Seconds',
  }

  if (render) {
    return (
      <div className={cn('inline-flex items-stretch', className)} {...props}>
        {render(time)}
      </div>
    )
  }

  const sizeClasses = {
    sm: {
      value: 'text-base',
      block: 'px-2 py-1',
      label: 'text-[10px] mt-0.5',
    },
    md: {
      value: 'text-2xl',
      block: 'px-3 py-1.5',
      label: 'text-xs mt-1',
    },
    lg: {
      value: 'text-3xl',
      block: 'px-4 py-2',
      label: 'text-sm mt-1.5',
    },
  }[size]

  const format = (n: number, pad: boolean) => (pad ? String(n).padStart(2, '0') : String(n))

  const units: Array<{
    key: keyof typeof resolvedLabels
    value: number
    label: string
    hidden?: boolean
  }> = [
    { key: 'days', value: time.days, label: resolvedLabels.days, hidden: !showDays },
    { key: 'hours', value: time.hours, label: resolvedLabels.hours },
    { key: 'minutes', value: time.minutes, label: resolvedLabels.minutes },
    { key: 'seconds', value: time.seconds, label: resolvedLabels.seconds },
  ]

  return (
    <div
      data-slot="countdown"
      className={cn('inline-flex items-stretch gap-2', className)}
      aria-live="polite"
      {...props}
    >
      {units
        .filter(u => !u.hidden)
        .map((u, idx) => (
          <div
            key={u.key}
            className={cn(
              'bg-muted text-foreground/90 rounded-md text-center',
              sizeClasses.block,
            )}
          >
            <div className={cn('font-mono tabular-nums font-semibold', sizeClasses.value)}>
              {u.key === 'days' ? String(u.value) : format(u.value, leadingZeros)}
            </div>
            {showLabels && (
              <div className={cn('text-muted-foreground', sizeClasses.label)}>{u.label}</div>
            )}
          </div>
        ))}
    </div>
  )
}


