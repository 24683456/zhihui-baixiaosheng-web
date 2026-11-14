'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import {
  ArrowRightIcon,
  BookmarkIcon,
  BookOpenIcon,
  BuildingLibraryIcon,
  ClockIcon,
  HeartIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  MapIcon,
  StarIcon,
  TagIcon,
} from '@heroicons/react/24/outline'
import styles from './pastel-welcome.module.css'

type Category = 'all' | 'policy' | 'service' | 'life'

interface ArchiveItem {
  id: string
  title: string
  category: Exclude<Category, 'all'>
  categoryLabel: string
  summary: string
  meta: string
  time: string
}

const archiveItems: ArchiveItem[] = [
  { id: 'policy', title: '奖助学金政策检索', category: 'policy', categoryLabel: '政策档案', summary: '演示条目：从这里进入 Dify 问答，继续查询奖助政策、申请条件与材料要求。', meta: 'CAMPUS · POLICY', time: '09:20' },
  { id: 'process', title: '校园办事流程导航', category: 'service', categoryLabel: '办事档案', summary: '演示条目：整理办事入口、流程节点与常见问题，正式内容以学校官方发布为准。', meta: 'CAMPUS · GUIDE', time: '10:35' },
  { id: 'life', title: '宿舍与生活服务手帐', category: 'life', categoryLabel: '生活档案', summary: '演示条目：汇集校园生活服务的查询方向，并可将问题带入智能体继续咨询。', meta: 'CAMPUS · DAILY', time: '11:42' },
  { id: 'academic', title: '教务信息分类索引', category: 'policy', categoryLabel: '教务档案', summary: '演示条目：按选课、考试与成绩等主题组织问题，便于后续接入校园知识库。', meta: 'CAMPUS · ACADEMIC', time: '13:16' },
  { id: 'reminder', title: '校园通知定时提醒', category: 'service', categoryLabel: '提醒档案', summary: '演示条目：任务按钮可保存本机提醒配置；真实执行仍需接入 Dify Workflow 与服务端调度。', meta: 'CAMPUS · SCHEDULE', time: '16:20' },
]

const filters: { value: Category, label: string, english: string }[] = [
  { value: 'all', label: '全部', english: 'ALL' },
  { value: 'policy', label: '政策', english: 'POLICY' },
  { value: 'service', label: '办事', english: 'GUIDE' },
  { value: 'life', label: '生活', english: 'DAILY' },
]

const twoDigits = (value: number) => String(value).padStart(2, '0')

export default function PastelArchive({ initialQuery, onBack, onStartChat }: { initialQuery: string, onBack: () => void, onStartChat: () => void }) {
  const [query, setQuery] = useState(initialQuery)
  const [filter, setFilter] = useState<Category>('all')
  const [selectedId, setSelectedId] = useState(archiveItems[0].id)
  const [favorites, setFavorites] = useState<string[]>([])
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    rootRef.current?.focus()
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return archiveItems.filter((item) => {
      const matchesCategory = filter === 'all' || item.category === filter
      const matchesFavorites = !onlyFavorites || favorites.includes(item.id)
      const matchesKeyword = !keyword || `${item.title} ${item.summary} ${item.meta}`.toLowerCase().includes(keyword)
      return matchesCategory && matchesFavorites && matchesKeyword
    })
  }, [query, filter, favorites, onlyFavorites])

  const selected = results.find(item => item.id === selectedId) || results[0]
  const selectedIndex = selected ? results.findIndex(item => item.id === selected.id) : -1
  const selectedIsFavorite = selected ? favorites.includes(selected.id) : false

  const selectRelative = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key) || results.length === 0) { return }
    event.preventDefault()
    const direction = event.key === 'ArrowDown' ? 1 : -1
    const nextIndex = (selectedIndex + direction + results.length) % results.length
    const next = results[nextIndex]
    setSelectedId(next.id)
    document.getElementById(`archive-result-${next.id}`)?.focus()
  }

  const toggleFavorite = () => {
    if (!selected) { return }
    setFavorites(current => current.includes(selected.id) ? current.filter(id => id !== selected.id) : [...current, selected.id])
  }

  const clearFilters = () => {
    setQuery('')
    setFilter('all')
    setOnlyFavorites(false)
  }

  const date = `${now.getFullYear()}/${twoDigits(now.getMonth() + 1)}/${twoDigits(now.getDate())}`
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(now).toUpperCase()
  const time = `${twoDigits(now.getHours())}:${twoDigits(now.getMinutes())}`

  return (
    <section
      ref={rootRef}
      tabIndex={-1}
      className={`${styles.welcome} ${styles.archive}`}
      aria-label="智汇百晓生校园档案搜索"
      onKeyDown={(event) => { if (event.key === 'Escape') { onBack() } }}
    >
      <nav className={styles.charmRail} aria-label="档案导航">
        <span className={styles.charmString} aria-hidden="true" />
        <button type="button" onClick={onBack} aria-label="返回拼贴首页" title="返回拼贴首页"><HomeIcon /></button>
        <button type="button" className={filter === 'all' && !onlyFavorites ? styles.charmActive : ''} onClick={() => { setFilter('all'); setOnlyFavorites(false) }} aria-label="全部档案" aria-pressed={filter === 'all' && !onlyFavorites}><MagnifyingGlassIcon /></button>
        <button type="button" className={filter === 'policy' ? styles.charmActive : ''} onClick={() => { setFilter('policy'); setOnlyFavorites(false) }} aria-label="政策档案" aria-pressed={filter === 'policy'}><BookOpenIcon /></button>
        <button type="button" className={filter === 'service' ? styles.charmActive : ''} onClick={() => { setFilter('service'); setOnlyFavorites(false) }} aria-label="办事档案" aria-pressed={filter === 'service'}><MapIcon /></button>
        <button type="button" className={filter === 'life' ? styles.charmActive : ''} onClick={() => { setFilter('life'); setOnlyFavorites(false) }} aria-label="生活档案" aria-pressed={filter === 'life'}><HeartIcon /></button>
        <button type="button" className={onlyFavorites ? styles.charmActive : ''} onClick={() => setOnlyFavorites(value => !value)} aria-label="仅看收藏" aria-pressed={onlyFavorites}><StarIcon /></button>
        <span className={styles.charmDecoration} aria-hidden="true"><ClockIcon /></span>
        <span className={styles.charmDecoration} aria-hidden="true"><TagIcon /></span>
        <span className={styles.charmDecoration} aria-hidden="true"><BookmarkIcon /></span>
        <span className={styles.charmDecoration} aria-hidden="true"><BuildingLibraryIcon /></span>
        <span className={styles.charmDecoration} aria-hidden="true"><ArrowRightIcon /></span>
      </nav>

      <div className={styles.archiveLayout}>
        <aside className={styles.archiveLeft} aria-label="档案搜索标题">
          <span className={styles.archiveColumns} aria-hidden="true"><img src="/images/pastel-archive-reference.jpg" alt="" /></span>
          <div className={styles.archiveNumber}>09</div>
          <div className={styles.archiveTitle}>
            <span>RECHERCHE · 09</span>
            <h1>搜索</h1>
            <small>SESSIONS &amp; MESSAGES · DIFY AGENT</small>
          </div>
          <p className={styles.leftQuote}>Chercher dans<br />les archives du campus</p>
        </aside>

        <section className={styles.archiveCenter} aria-label="档案检索与详情">
          <span className={styles.archLadder} aria-hidden="true" />
          <p className={styles.archScript}>Chercher de</p>
          <form className={styles.archiveSearch} onSubmit={event => event.preventDefault()} role="search">
            <span className={styles.searchScript} aria-hidden="true">Chercher…</span>
            <input value={query} onChange={event => setQuery(event.target.value)} aria-label="搜索档案、政策与服务" placeholder="搜索档案、政策与服务" />
            <kbd>Esc</kbd>
          </form>
          <div className={styles.archiveTabs} aria-label="按档案类型筛选">
            {filters.map((item, index) => (
              <button key={item.value} type="button" className={filter === item.value && !onlyFavorites ? styles.tabActive : ''} onClick={() => { setFilter(item.value); setOnlyFavorites(false) }} aria-pressed={filter === item.value && !onlyFavorites}>
                <small>0{index + 1}</small>{item.label}
              </button>
            ))}
          </div>

          <div className={styles.archiveWheel} aria-live="polite">
            <span className={styles.wheelTop}>01 TOUT · 全部</span>
            <span className={styles.wheelRight}>02 SEARCH</span>
            <span className={styles.wheelBottom}>03 MESSAGES</span>
            <span className={styles.wheelLeft}>04 DATES</span>
            <div className={styles.diamond}>
              <div className={styles.diamondContent}>
                <small>N° {selected ? twoDigits(selectedIndex + 1) : '00'} · {twoDigits(results.length)} MSG</small>
                <strong>Souvenir</strong>
                <span>{selected?.categoryLabel || '暂无档案'}</span>
              </div>
            </div>
            <span className={styles.wheelNumber}>{selected ? twoDigits(selectedIndex + 1) : '00'}</span>
          </div>

          <article className={styles.archiveDetail}>
            <div className={styles.detailBar}><span>02</span> DÉTAIL · 选中条目 <small>N° {selected ? twoDigits(selectedIndex + 1) : '00'}</small></div>
            {selected
              ? (
                <>
                  <div className={styles.detailMeta}>{selected.meta}<span>{selected.time}</span></div>
                  <h2>{selected.title}</h2>
                  <p title={selected.summary}>{selected.summary}</p>
                  <div className={styles.detailActions}>
                    <button type="button" onClick={toggleFavorite} aria-pressed={selectedIsFavorite}><StarIcon />{selectedIsFavorite ? '取消收藏' : '收藏条目'}</button>
                    <button type="button" onClick={onStartChat}>打开 Dify 问答<ArrowRightIcon /></button>
                  </div>
                </>
              )
              : (
                <div className={styles.emptyResult}>
                  <BuildingLibraryIcon aria-hidden="true" />
                  <h2>没有找到对应档案</h2>
                  <p>试试更短的关键词，或清除当前筛选。</p>
                  <button type="button" onClick={clearFilters}>清除筛选</button>
                </div>
              )}
          </article>
        </section>

        <aside className={styles.archiveRight} aria-label="档案搜索结果">
          <div className={styles.dateBlock}>
            <time dateTime={now.toISOString()}>{date}<small>{weekday}</small></time>
            <span className={styles.giantCharacter} aria-hidden="true"><span>百</span><span>晓</span><span>生</span></span>
            <p>{date.replaceAll('/', '.')} {weekday}.<br />Chercher · en veille · {time}</p>
          </div>
          <div className={styles.resultsPanel}>
            <div className={styles.resultsBar}><span>01</span> RÉSULTATS · 结果</div>
            <p className={styles.resultsCaption}>Souvenirs · 校园档案 <span>{twoDigits(results.length)} / 05</span></p>
            <div className={styles.resultTags} aria-label="当前检索范围">
              <span>校园政策</span><span>生活服务</span><span>Dify 问答</span>
            </div>
            <div className={styles.resultList} onKeyDown={selectRelative}>
              {results.map((item, index) => (
                <button
                  id={`archive-result-${item.id}`}
                  key={item.id}
                  type="button"
                  className={selected?.id === item.id ? styles.resultActive : ''}
                  onClick={() => setSelectedId(item.id)}
                  aria-pressed={selected?.id === item.id}
                >
                  <span className={styles.resultNumber}>{twoDigits(index + 1)}</span>
                  <span className={styles.resultText}><strong>{item.title}</strong><small>{item.meta} · {item.categoryLabel}</small></span>
                  <time>{item.time}</time>
                </button>
              ))}
              {results.length === 0 && <p className={styles.resultsEmpty}>当前筛选下没有条目</p>}
            </div>
            <div className={styles.resultFooter}>DIFY ARCHIVE <span>{onlyFavorites ? 'FAVORITES' : 'INDEX 05 ITEMS'}</span></div>
          </div>
        </aside>
      </div>

      <footer className={styles.archiveFooter}>
        <span><kbd>Esc</kbd> 返回</span>
        <span><kbd>↑↓</kbd> 在结果中选择</span>
        <span>DIFY · CAMPUS ARCHIVE · {time}</span>
        <i aria-hidden="true" />
      </footer>
    </section>
  )
}
