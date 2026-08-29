'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Headphones, Pause, Play, Settings2, SkipBack, SkipForward, Square } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Reads a topic aloud using the browser's own speech synthesis.
 *
 * The site is a static export with no server, so cloud TTS is not an option —
 * it would mean shipping an API key. The Web Speech API is free, needs no
 * network round trip on most platforms, and nothing said here leaves the
 * device. Voice quality comes from the operating system, which is why the
 * picker ranks the neural voices first rather than presenting a flat list.
 */

const VOICE_KEY = 'bm:tts-voice'
const RATE_KEY = 'bm:tts-rate'

/** Elements worth reading, in document order. */
const READABLE = 'h2, h3, h4, p, li, blockquote, figcaption, pre'

/** Inside these, the text is not prose and should not be read out. */
const SKIP_INSIDE = 'pre, .code-window, [role="region"], .term-popover, [data-no-tts]'

type Chunk = { el: HTMLElement; text: string }

/**
 * Ranks voices so the best ones surface first.
 *
 * Platform naming is the only signal available: Microsoft's neural voices carry
 * "Natural" or "Online", Apple's better ones are "Premium" or "Enhanced", and a
 * non-local voice is generally a server-side neural model.
 */
function rank(voice: SpeechSynthesisVoice): number {
  const n = voice.name.toLowerCase()
  let score = 0
  if (/natural|neural/.test(n)) score += 60
  if (/premium|enhanced/.test(n)) score += 45
  if (/online/.test(n)) score += 25
  if (!voice.localService) score += 20
  if (/google/.test(n)) score += 18
  if (/siri/.test(n)) score += 15
  if (voice.lang.toLowerCase().startsWith('en-gb')) score += 6
  if (voice.lang.toLowerCase().startsWith('en')) score += 10
  if (/compact|eloquence|espeak/.test(n)) score -= 40
  return score
}

/** Trims a platform voice name down to something readable in a menu. */
function prettyName(voice: SpeechSynthesisVoice): string {
  const name = voice.name
    .replace(/^Microsoft\s+/i, '')
    .replace(/\s*-\s*English.*$/i, '')
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .trim()
  return `${name} · ${voice.lang}`
}

export function ReadAloud({ targetId, className }: { targetId: string; className?: string }) {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceURI, setVoiceURI] = useState<string>('')
  const [rate, setRate] = useState(1)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [index, setIndex] = useState(0)
  const [total, setTotal] = useState(0)

  const chunks = useRef<Chunk[]>([])
  const cursor = useRef(0)
  const stopping = useRef(false)
  const keepAlive = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const panelId = useId()

  // ---- Capability and voices ---------------------------------------------
  useEffect(() => {
    // Some browsers expose the object but no working engine behind it, so
    // probe for the method rather than trusting the property to exist.
    if (typeof window === 'undefined' || typeof window.speechSynthesis?.speak !== 'function') {
      setSupported(false)
      return
    }
    setSupported(true)
    const load = () => {
      const list = window.speechSynthesis.getVoices()
      if (list.length) setVoices([...list].sort((a, b) => rank(b) - rank(a)))
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  // Restore the reader's saved preferences.
  useEffect(() => {
    try {
      const savedRate = Number(window.localStorage.getItem(RATE_KEY))
      if (savedRate >= 0.6 && savedRate <= 2) setRate(savedRate)
      const savedVoice = window.localStorage.getItem(VOICE_KEY)
      if (savedVoice) setVoiceURI(savedVoice)
    } catch {
      /* storage blocked — defaults are fine */
    }
  }, [])

  // Default to the best-ranked English voice once the list arrives.
  useEffect(() => {
    if (voiceURI || voices.length === 0) return
    const best = voices.find((v) => v.lang.toLowerCase().startsWith('en')) ?? voices[0]
    if (best) setVoiceURI(best.voiceURI)
  }, [voices, voiceURI])

  const voice = useMemo(
    () => voices.find((v) => v.voiceURI === voiceURI),
    [voices, voiceURI],
  )

  // ---- Reading -------------------------------------------------------------
  const highlight = useCallback((i: number) => {
    for (const c of chunks.current) c.el.removeAttribute('data-reading')
    const chunk = chunks.current[i]
    if (!chunk) return
    chunk.el.setAttribute('data-reading', 'true')

    // Scrolling on every paragraph makes the page twitch under the reader and
    // drags the controls out of reach. Only move when the current paragraph
    // has actually left the comfortable band below the sticky header.
    const box = chunk.el.getBoundingClientRect()
    const top = 140
    const bottom = window.innerHeight - 120
    if (box.top >= top && box.bottom <= bottom) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollBy({
      top: box.top - top,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }, [])

  const collect = useCallback(() => {
    const root = document.getElementById(targetId)
    if (!root) return [] as Chunk[]
    const out: Chunk[] = []
    for (const el of root.querySelectorAll<HTMLElement>(READABLE)) {
      if (el.tagName === 'PRE') {
        // Reading source aloud is useless; say that one is here and move on.
        out.push({ el, text: 'Code sample.' })
        continue
      }
      if (el.closest(SKIP_INSIDE)) continue
      // innerText on a block already covers everything nested inside it, so a
      // paragraph within a blockquote or list item must not be read again.
      const outer = el.parentElement?.closest(READABLE)
      if (outer && root.contains(outer)) continue
      const text = (el.innerText || '').replace(/\s+/g, ' ').trim()
      if (text.length < 2) continue
      out.push({ el, text })
    }
    return out
  }, [targetId])

  const stop = useCallback(() => {
    stopping.current = true
    window.speechSynthesis.cancel()
    clearInterval(keepAlive.current)
    for (const c of chunks.current) c.el.removeAttribute('data-reading')
    setPlaying(false)
    setPaused(false)
    setIndex(0)
    cursor.current = 0
  }, [])

  const speakFrom = useCallback(
    (start: number) => {
      const list = chunks.current
      if (start >= list.length) {
        stop()
        return
      }
      stopping.current = false
      cursor.current = start
      setIndex(start)
      highlight(start)

      const utterance = new SpeechSynthesisUtterance(list[start].text)
      if (voice) utterance.voice = voice
      utterance.rate = rate
      utterance.pitch = 1
      utterance.onend = () => {
        if (stopping.current) return
        speakFrom(cursor.current + 1)
      }
      utterance.onerror = () => {
        if (!stopping.current) speakFrom(cursor.current + 1)
      }
      window.speechSynthesis.speak(utterance)
    },
    [highlight, rate, stop, voice],
  )

  const play = useCallback(() => {
    if (paused) {
      window.speechSynthesis.resume()
      setPaused(false)
      setPlaying(true)
      return
    }
    const list = collect()
    chunks.current = list
    setTotal(list.length)
    if (list.length === 0) return
    window.speechSynthesis.cancel()
    setPlaying(true)
    // Chrome stops long sessions unless it is nudged; utterances are already
    // short, and this keeps a paused-by-the-engine queue moving.
    clearInterval(keepAlive.current)
    keepAlive.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      }
    }, 9000)
    speakFrom(0)
  }, [collect, paused, speakFrom])

  const pause = useCallback(() => {
    window.speechSynthesis.pause()
    setPaused(true)
    setPlaying(false)
  }, [])

  const skip = useCallback(
    (delta: number) => {
      if (chunks.current.length === 0) return
      const next = Math.max(0, Math.min(cursor.current + delta, chunks.current.length - 1))
      stopping.current = true
      window.speechSynthesis.cancel()
      setPaused(false)
      setPlaying(true)
      // Give the engine a tick to finish cancelling before queueing again.
      window.setTimeout(() => speakFrom(next), 60)
    },
    [speakFrom],
  )

  // Changing voice or speed restarts the current paragraph so it takes effect.
  const applyAndRestart = useCallback(() => {
    if (!playing && !paused) return
    const at = cursor.current
    stopping.current = true
    window.speechSynthesis.cancel()
    setPaused(false)
    setPlaying(true)
    window.setTimeout(() => speakFrom(at), 60)
  }, [paused, playing, speakFrom])

  // Always stop when the reader leaves the page.
  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis?.cancel()
      } catch {
        /* nothing to cancel */
      }
      clearInterval(keepAlive.current)
    }
  }, [])

  if (supported === false) return null

  const english = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
  const others = voices.filter((v) => !v.lang.toLowerCase().startsWith('en'))
  const noVoices = supported === true && voices.length === 0

  return (
    <section
      aria-label="Listen to this topic"
      data-no-tts
      className={cn(
        'not-prose card p-4',
        // While it is reading, the controls follow you down the page — you
        // should never have to scroll back up to pause.
        (playing || paused) && 'sticky top-20 z-30 shadow-lg',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 inline-flex items-center gap-2 text-sm font-medium text-fg">
          <Headphones aria-hidden className="size-4 text-accent" />
          Listen
        </span>

        <button
          type="button"
          onClick={playing ? pause : play}
          disabled={noVoices}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm transition-colors hover:border-line-strong hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
        >
          {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
          {playing ? 'Pause' : paused ? 'Resume' : 'Play'}
        </button>

        <button
          type="button"
          onClick={() => skip(-1)}
          disabled={!playing && !paused}
          aria-label="Previous paragraph"
          className="inline-flex cursor-pointer items-center rounded-lg border border-line p-1.5 transition-colors hover:border-line-strong disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SkipBack aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => skip(1)}
          disabled={!playing && !paused}
          aria-label="Next paragraph"
          className="inline-flex cursor-pointer items-center rounded-lg border border-line p-1.5 transition-colors hover:border-line-strong disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SkipForward aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          onClick={stop}
          disabled={!playing && !paused}
          aria-label="Stop"
          className="inline-flex cursor-pointer items-center rounded-lg border border-line p-1.5 transition-colors hover:border-line-strong disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Square aria-hidden className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => setShowSettings((v) => !v)}
          aria-expanded={showSettings}
          aria-controls={panelId}
          className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:border-line-strong hover:text-fg"
        >
          <Settings2 aria-hidden className="size-3.5" />
          Voice
        </button>
      </div>

      {(playing || paused) && total > 0 && (
        <p className="mt-2 font-mono text-[0.7rem] text-subtle" aria-live="polite">
          paragraph {index + 1} of {total}
        </p>
      )}

      {noVoices && (
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Your browser reports no speech voices installed. On Windows they come from
          Settings → Time &amp; language → Speech; on Linux, from a speech-dispatcher package.
        </p>
      )}

      <div id={panelId} hidden={!showSettings} className="mt-3 border-t border-line pt-3">
        <label
          htmlFor={`${panelId}-voice`}
          className="block font-mono text-[0.7rem] uppercase tracking-wider text-subtle"
        >
          Voice
        </label>
        <select
          id={`${panelId}-voice`}
          value={voiceURI}
          onChange={(e) => {
            setVoiceURI(e.target.value)
            try {
              window.localStorage.setItem(VOICE_KEY, e.target.value)
            } catch {
              /* ignore */
            }
            applyAndRestart()
          }}
          className="mt-1.5 w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
        >
          {english.length > 0 && (
            <optgroup label="English — best first">
              {english.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {prettyName(v)}
                </option>
              ))}
            </optgroup>
          )}
          {others.length > 0 && (
            <optgroup label="Other languages">
              {others.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {prettyName(v)}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <p className="mt-1.5 text-xs leading-relaxed text-subtle">
          Voices come from your operating system. The ones marked Natural, Neural, Premium or
          Online are the modern models and sound markedly better for long listening.
        </p>

        <label
          htmlFor={`${panelId}-rate`}
          className="mt-3 block font-mono text-[0.7rem] uppercase tracking-wider text-subtle"
        >
          Speed · {rate.toFixed(2)}×
        </label>
        <input
          id={`${panelId}-rate`}
          type="range"
          min={0.6}
          max={1.8}
          step={0.05}
          value={rate}
          onChange={(e) => {
            const next = Number(e.target.value)
            setRate(next)
            try {
              window.localStorage.setItem(RATE_KEY, String(next))
            } catch {
              /* ignore */
            }
          }}
          onMouseUp={applyAndRestart}
          onTouchEnd={applyAndRestart}
          onKeyUp={applyAndRestart}
          className="mt-1.5 w-full accent-[var(--accent)]"
        />
      </div>
    </section>
  )
}
