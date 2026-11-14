'use client'

import { useState } from 'react'
import PastelHome from './pastel-home'
import PastelArchive from './pastel-archive'

export default function PastelWelcome({ onStartChat }: { onStartChat: () => void }) {
  const [view, setView] = useState<'home' | 'archive'>('home')
  const [initialQuery, setInitialQuery] = useState('')

  const openArchive = (query: string) => {
    setInitialQuery(query)
    setView('archive')
  }

  return view === 'home'
    ? <PastelHome onSearch={openArchive} onStartChat={onStartChat} />
    : <PastelArchive initialQuery={initialQuery} onBack={() => setView('home')} onStartChat={onStartChat} />
}
