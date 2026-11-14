'use client'

import { SwatchIcon } from '@heroicons/react/24/outline'
import { useUITheme } from './theme-context'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useUITheme()
  const isPastel = theme === 'pastel'
  const targetLabel = isPastel ? '经典酒红' : '淡色手帐'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isPastel}
      aria-label={`切换到${targetLabel}主题`}
      title={`切换到${targetLabel}主题`}
      className="theme-toggle inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#DCD4D6] bg-[#FFFDFC] px-2.5 text-sm font-medium text-[#62575B] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#AFA2A7] hover:bg-[#F7F2F3] hover:text-[#7A202C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A202C] active:translate-y-0 md:px-3"
    >
      <SwatchIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="hidden lg:inline">{targetLabel}</span>
    </button>
  )
}
