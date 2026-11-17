'use client'

import { useEffect, useRef, useState } from 'react'
import ThemeToggle from '@/app/components/theme/ThemeToggle'

const TRIANON_URL = '/trianon/index.html#empty'
const CANVAS_WIDTH = 1440
const CANVAS_HEIGHT = 900
const PHONE_BREAKPOINT = 768

interface StageFit {
  scale: number
  phone: boolean
}

function getStageFit(width: number, height: number): StageFit {
  if (width <= 0 || height <= 0) { return { scale: 1, phone: false } }

  const isPhone = width < PHONE_BREAKPOINT && height >= width
  if (isPhone) { return { scale: 1, phone: true } }

  const gutter = width < 640 ? 8 : 24
  const widthRatio = (width - gutter * 2) / CANVAS_WIDTH
  const heightRatio = (height - gutter * 2) / CANVAS_HEIGHT

  return { scale: Math.max(0.1, Math.min(widthRatio, heightRatio)), phone: false }
}

const overlayStyle = {
  paddingLeft: 'max(1rem, env(safe-area-inset-left))',
  paddingBottom: 'max(5rem, env(safe-area-inset-bottom))',
}

export default function TrianonShowcase() {
  const stageRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState<StageFit>({ scale: 1, phone: false })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) { return }

    let frameId = 0

    const measure = () => {
      frameId = 0
      setFit(getStageFit(stage.clientWidth || window.innerWidth, stage.clientHeight || window.innerHeight))
      setReady(true)
    }

    const scheduleMeasure = () => {
      if (frameId) { return }
      frameId = window.requestAnimationFrame(measure)
    }

    measure()

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleMeasure)
    observer?.observe(stage)
    window.addEventListener('resize', scheduleMeasure)
    window.addEventListener('orientationchange', scheduleMeasure)

    return () => {
      if (frameId) { window.cancelAnimationFrame(frameId) }
      observer?.disconnect()
      window.removeEventListener('resize', scheduleMeasure)
      window.removeEventListener('orientationchange', scheduleMeasure)
    }
  }, [])

  // 手机竖屏只保留场景内的演示声明，避免浮层压住底部输入区；读屏仍通过 aria-describedby 获取说明。
  const showCompactChrome = ready && !fit.phone && fit.scale < 0.85

  return (
    <div
      ref={stageRef}
      className="trianon-stage relative h-[100dvh] w-full overflow-hidden bg-[var(--ui-page)]"
      data-view="trianon"
      data-layout={fit.phone ? 'phone' : 'fit'}
    >
      <div
        className={fit.phone ? 'absolute inset-0 h-full w-full' : 'absolute left-1/2 top-1/2 h-[900px] w-[1440px]'}
        style={fit.phone
          ? { visibility: ready ? 'visible' : 'hidden' }
          : {
            transform: `translate(-50%, -50%) scale(${fit.scale})`,
            transformOrigin: 'center center',
            visibility: ready ? 'visible' : 'hidden',
          }}
      >
        <iframe
          src={TRIANON_URL}
          title="Trianon 手账界面演示（郑大百晓生，校园回答仅作示例）"
          aria-describedby="trianon-demo-note"
          className="block h-full w-full border-0 bg-transparent"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-wrap items-end justify-between gap-2 p-3 pr-16 sm:p-4 sm:pr-20"
        style={overlayStyle}
      >
        <p
          id="trianon-demo-note"
          className={showCompactChrome ? 'max-w-full rounded-full border border-white/50 bg-[#2C3A57]/85 px-3 py-1.5 text-xs leading-5 text-[#FBF9F4] shadow-sm backdrop-blur-sm sm:text-sm' : 'sr-only'}
        >
          Trianon 手账界面演示 · 校园回答仅作示例
        </p>
        {showCompactChrome && (
          <a
            href={TRIANON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex min-h-11 items-center rounded-full border border-white/70 bg-[#FBF9F4] px-4 text-sm font-medium text-[#24305A] shadow-sm transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24305A]"
          >
            在新标签打开手账展示
          </a>
        )}
      </div>

      <div className={fit.phone ? '[&_.theme-egg-toggle]:bottom-24' : undefined}>
        <ThemeToggle />
      </div>
    </div>
  )
}
