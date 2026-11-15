'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowRightIcon,
  BuildingLibraryIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { IS_DEMO } from '@/config'
import styles from './pastel-welcome.module.css'

interface PastelHomeProps {
  onSearch: (query: string) => void
  onStartChat: () => void
}

function ReferenceCrop({ className }: { className: string }) {
  return (
    <span className={`${styles.crop} ${className}`} aria-hidden="true">
      <img src="/images/pastel-home-reference.jpg" alt="" draggable="false" />
    </span>
  )
}

const shortcuts: Array<{ label: string, query: string, directChat?: boolean }> = [
  { label: '查询政策', query: '政策' },
  { label: '办事指引', query: '校园办事流程' },
  { label: '随便聊聊', query: '', directChat: true },
]

export default function PastelHome({ onSearch, onStartChat }: PastelHomeProps) {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'search' | 'chat'>('search')
  const [showGuide, setShowGuide] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (mode === 'chat') { onStartChat() }
    else { onSearch(query.trim()) }
  }

  return (
    <section className={`${styles.welcome} ${styles.home}`} aria-label="智汇百晓生淡色手帐首页">
      <div className={styles.paperGrain} aria-hidden="true" />
      <div className={styles.homeBrand}>
        <span>智汇百晓生</span>
        <small>CAMPUS ARCHIVE</small>
      </div>

      <div className={styles.collage} aria-label="校园手帐拼贴">
        <img
          className={styles.collageReference}
          src="/images/pastel-home-reference.jpg"
          alt="淡蓝色建筑、花卉、邮戳、埃菲尔铁塔与茶壶组成的校园手帐拼贴"
          draggable="false"
        />
        <article className={styles.greetingCard}>
          <BuildingLibraryIcon className={styles.crest} aria-hidden="true" />
          <p className={styles.scriptLine}>Bon après-midi,</p>
          <h1>Bai Xiao Sheng</h1>
          <p className={styles.chineseTitle}>智汇百晓生 · 校园知识手帐</p>
          <span className={styles.cardRule} aria-hidden="true" />
        </article>
      </div>

      <div className={styles.shortcuts} aria-label="快捷问题">
        {shortcuts.map(item => (
          <button
            key={item.label}
            type="button"
            onClick={() => (item.directChat ? onStartChat() : onSearch(item.query))}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={styles.composerWrap}>
        <ReferenceCrop className={styles.penCrop} />
        <ReferenceCrop className={styles.clockCrop} />
        <form className={styles.homeComposer} onSubmit={submit} aria-label="校园档案搜索">
          <div className={styles.composerInputRow}>
            <span className={styles.composerSignature} aria-hidden="true">Baixiaosheng</span>
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="写下一句话，检索校园档案…"
              aria-label="搜索校园档案"
            />
            <button className={styles.composerSubmit} type="submit" aria-label={mode === 'search' ? '检索档案' : '进入 Dify 对话'}>
              {mode === 'search' ? <MagnifyingGlassIcon aria-hidden="true" /> : <ArrowRightIcon aria-hidden="true" />}
            </button>
          </div>
          <div className={styles.composerTools}>
            <button type="button" onClick={() => setShowGuide(value => !value)} aria-expanded={showGuide} aria-label="使用说明">
              <PlusIcon aria-hidden="true" />
            </button>
            <span>{IS_DEMO ? '界面演示 · 本地数据' : 'Dify 校园智能体'}</span>
            <button
              type="button"
              className={styles.modeButton}
              onClick={() => setMode(value => value === 'search' ? 'chat' : 'search')}
              aria-label="切换搜索或直接问答模式"
            >
              {mode === 'search' ? '档案检索' : '直接问答'}
              <ChevronUpDownIcon aria-hidden="true" />
            </button>
          </div>
          {showGuide && (
            <p className={styles.guide} role="status">
              输入关键词后按 Enter 检索；点右下角可切换为直接问答。快捷标签可打开对应档案，也可直接进入问答。
            </p>
          )}
        </form>
        <a
          className={styles.artCredit}
          href="https://commons.wikimedia.org/wiki/File:University_College,_London;_the_main_building._Engraving,_18_Wellcome_V0013660.jpg"
          target="_blank"
          rel="noreferrer"
        >
          建筑版画：Wellcome Collection · CC BY 4.0
        </a>
      </div>
    </section>
  )
}
