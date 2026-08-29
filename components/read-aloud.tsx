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
 * picker curates rather than lists: a Linux box running speech-dispatcher
 * offers over thirteen thousand voices, nearly all of them the same eSpeak
 * engine wearing different names.
 */

const VOICE_KEY = 'bm:tts-voice'
const RATE_KEY = 'bm:tts-rate'
const MAX_VOICES = 5

/** Elements worth reading, in document order. */
const READABLE = 'h2, h3, h4, p, li, blockquote, figcaption, pre'

/** Inside these, the text is not prose and should not be read out. */
const SKIP_INSIDE = 'pre, .code-window, [role="region"], .term-popover, [data-no-tts]'

/**
 * Joke and effect voices that ship with desktop speech engines, plus eSpeak's
 * "+Name" variant syntax. None of them are usable for listening to an article.
 */
const NOVELTY =
  /\+|demonic|whisper|croak|klatt|auntie|uncle|grandma|grandpa|zarvox|trinoids|boing|bubbles|bells|cellos|organ|jester|wobble|deranged|hysterical|bahh|bad news|good news|albert|bruce|junior|kathy|princess|ralph|superstar|pipe organ|max headroom/i

/** Engines that predate neural synthesis and sound obviously mechanical. */
const BASIC_ENGINE = /espeak|festival|flite|pico|mbrola|dispatcher|compact|eloquence/i

type Chunk = { el: HTMLElement; text: string; block: number }

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
  if (/^en-(us|gb)/i.test(voice.lang)) score += 8
  if (BASIC_ENGINE.test(n)) score -= 40
  return score
}

/** True when the platform has nothing better than a formant synthesiser. */
function isBasic(voice: SpeechSynthesisVoice): boolean {
  return rank(voice) < 15
}

/** Trims a platform voice name down to something readable in a menu. */
function prettyName(voice: SpeechSynthesisVoice): string {
  const name = voice.name
    .replace(/^(Microsoft|Google|Apple)\s+/i, '')
    .replace(/\s*-\s*English.*$/i, '')
    .replace(/\s*\((?:Natural|Premium|Enhanced|Online|United States|United Kingdom)\)\s*/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return name || voice.name
}

/**
 * Reduces whatever the platform offers to a handful of distinct English voices.
 *
 * Thirteen thousand entries is not a choice, it is a wall. Novelty voices go,
 * then near-duplicates of the same persona, then everything past the fifth
 * best — enough to pick a voice you get on with, few enough to read at a
 * glance.
 */
function curate(all: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  const english = all.filter(
    (v) => v.lang.toLowerCase().startsWith('en') && !NOVELTY.test(v.name),
  )
  const pool = english.length > 0 ? english : all.filter((v) => !NOVELTY.test(v.name))
  const seen = new Set<string>()
  const picked: SpeechSynthesisVoice[] = []
  for (const voice of [...pool].sort((a, b) => rank(b) - rank(a))) {
    // Collapse "Aria", "Aria Online" and "Aria Desktop" down to one entry.
    const key = prettyName(voice).toLowerCase().replace(/[^a-z]/g, '')
    if (seen.has(key)) continue
    seen.add(key)
    picked.push(voice)
    if (picked.length >= MAX_VOICES) break
  }
  return picked
}

/** Splits a block into sentence-sized pieces so pause and resume feel precise. */
function toSentences(text: string): string[] {
  const parts = text.match(/[^.!?]+(?:[.!?]+["')\]]*|$)/g) ?? [text]
  const out: string[] = []
  let buffer = ''
  for (const raw of parts) {
    const piece = raw.trim()
    if (!piece) continue
    if (buffer && buffer.length + piece.length > 240) {
      out.push(buffer)
      buffer = piece
    } else {
      buffer = buffer ? `${buffer} ${piece}` : piece
    }
  }
  if (buffer) out.push(buffer)
  return out
}

/** Platform-specific advice for readers stuck with a mechanical voice. */
function betterVoiceHint(): string {
  const ua = typeof navigator === 'undefined' ? '' : navigator.userAgent
  if (/Windows/i.test(ua)) {
    return 'Windows: Settings → Time & language → Speech → Manage voices, and add a "Natural" voice.'
  }
  if (/Mac OS X|Macintosh/i.test(ua)) {
    return 'macOS: System Settings → Accessibility → Spoken Content → System Voice → Manage Voices, and pick a Premium one.'
  }
  if (/Linux|X11/i.test(ua)) {
    return 'Linux: only eSpeak is installed. `sudo apt install rhvoice speech-dispatcher-rhvoice` gives a far more natural voice after a browser restart.'
  }
  return 'Your platform only exposes basic synthesiser voices.'
}

export function ReadAloud({ targetId, className }: { targetId: string; className?: string }) {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceURI, setVoiceURI] = useState<string>('')
  const [rate, setRate] = useState(1)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [block, setBlock] = useState(0)
  const [blockCount, setBlockCount] = useState(0)

  const chunks = useRef<Chunk[]>([])
  const cursor = useRef(0)
  /** Bumped on every stop or restart so stale utterance callbacks are ignored. */
  const run = useRef(0)
  const watchdog = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const lastEvent = useRef(0)
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
      if (list.length) setVoices(curate(list))
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

  // Fall back to the best voice whenever the saved one is not on offer here.
  useEffect(() => {
    if (voices.length === 0) return
    if (voices.some((v) => v.voiceURI === voiceURI)) return
    setVoiceURI(voices[0].voiceURI)
  }, [voices, voiceURI])

  const voice = useMemo(
    () => voices.find((v) => v.voiceURI === voiceURI),
    [voices, voiceURI],
  )

  // ---- Reading -------------------------------------------------------------
  const highlight = useCallback((i: number) => {
    const chunk = chunks.current[i]
    if (!chunk) return
    for (const c of chunks.current) {
      if (c.el !== chunk.el) c.el.removeAttribute('data-reading')
    }
    chunk.el.setAttribute('data-reading', 'true')

    // Scrolling on every sentence makes the page twitch under the reader and
    // drags the controls out of reach. Only move when the current block has
    // actually left the comfortable band below the sticky header.
    const box = chunk.el.getBoundingClientRect()
    const top = 140
    if (box.top >= top && box.bottom <= window.innerHeight - 120) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollBy({ top: box.top - top, behavior: reduced ? 'auto' : 'smooth' })
  }, [])

  const collect = useCallback(() => {
    const root = document.getElementById(targetId)
    if (!root) return [] as Chunk[]
    const out: Chunk[] = []
    let blockIndex = 0
    for (const el of root.querySelectorAll<HTMLElement>(READABLE)) {
      if (el.tagName === 'PRE') {
        // Reading source aloud is useless; say that one is here and move on.
        out.push({ el, text: 'Code sample.', block: blockIndex++ })
        continue
      }
      if (el.closest(SKIP_INSIDE)) continue
      // innerText on a block already covers everything nested inside it, so a
      // paragraph within a blockquote or list item must not be read again.
      const outer = el.parentElement?.closest(READABLE)
      if (outer && root.contains(outer)) continue
      const text = (el.innerText || '').replace(/\s+/g, ' ').trim()
      if (text.length < 2) continue
      for (const sentence of toSentences(text)) out.push({ el, text: sentence, block: blockIndex })
      blockIndex += 1
    }
    return out
  }, [targetId])

  const clearWatchdog = () => {
    clearInterval(watchdog.current)
    watchdog.current = undefined
  }

  const stop = useCallback(() => {
    run.current += 1
    window.speechSynthesis.cancel()
    clearWatchdog()
    for (const c of chunks.current) c.el.removeAttribute('data-reading')
    setPlaying(false)
    setPaused(false)
    setBlock(0)
    cursor.current = 0
  }, [])

  const speakFrom = useCallback(
    (start: number) => {
      const list = chunks.current
      if (start >= list.length) {
        stop()
        return
      }
      const token = run.current
      cursor.current = start
      setBlock(list[start].block)
      highlight(start)
      lastEvent.current = Date.now()

      const utterance = new SpeechSynthesisUtterance(list[start].text)
      if (voice) utterance.voice = voice
      utterance.rate = rate
      utterance.pitch = 1
      utterance.onstart = () => {
        lastEvent.current = Date.now()
      }
      utterance.onend = () => {
        if (token !== run.current) return
        lastEvent.current = Date.now()
        speakFrom(cursor.current + 1)
      }
      utterance.onerror = () => {
        if (token !== run.current) return
        speakFrom(cursor.current + 1)
      }
      window.speechSynthesis.speak(utterance)
    },
    [highlight, rate, stop, voice],
  )

  /** Starts (or restarts) reading at a given chunk and arms the stall watchdog. */
  const start = useCallback(
    (from: number) => {
      run.current += 1
      window.speechSynthesis.cancel()
      setPlaying(true)
      setPaused(false)
      clearWatchdog()
      // Engines occasionally drop an utterance without firing onend — Chrome
      // does it on long sessions, speech-dispatcher on rapid cancels. If
      // nothing is speaking and nothing is queued, move the queue along.
      watchdog.current = setInterval(() => {
        const s = window.speechSynthesis
        if (!s.speaking && !s.pending && Date.now() - lastEvent.current > 1600) {
          lastEvent.current = Date.now()
          speakFrom(cursor.current + 1)
        }
      }, 800)
      // Cancel is asynchronous in some engines; let it settle before queueing.
      window.setTimeout(() => speakFrom(from), 60)
    },
    [speakFrom],
  )

  const play = useCallback(() => {
    if (paused) {
      start(cursor.current)
      return
    }
    const list = collect()
    chunks.current = list
    setBlockCount(list.length ? list[list.length - 1].block + 1 : 0)
    if (list.length === 0) return
    start(0)
  }, [collect, paused, start])

  /**
   * Pauses by cancelling and remembering the place, rather than by calling
   * speechSynthesis.pause().
   *
   * That method is a no-op on Linux and unreliable on several Android
   * browsers: the button flipped to "Resume" while the voice kept talking.
   * Cancelling and replaying the current sentence works the same everywhere.
   */
  const pause = useCallback(() => {
    run.current += 1
    window.speechSynthesis.cancel()
    clearWatchdog()
    setPaused(true)
    setPlaying(false)
  }, [])

  const skip = useCallback(
    (delta: number) => {
      const list = chunks.current
      if (list.length === 0) return
      // Step by block, not by sentence, so the buttons move a paragraph at a
      // time however the prose happens to be punctuated.
      const here = list[cursor.current]?.block ?? 0
      const target = Math.max(0, Math.min(here + delta, (list[list.length - 1]?.block ?? 0)))
      const at = list.findIndex((c) => c.block === target)
      start(at === -1 ? 0 : at)
    },
    [start],
  )

  // Changing voice or speed restarts the current sentence so it takes effect.
  const applyAndRestart = useCallback(() => {
    if (!playing && !paused) return
    start(cursor.current)
  }, [paused, playing, start])

  // Always stop when the reader leaves the page.
  useEffect(() => {
    return () => {
      run.current += 1
      try {
        window.speechSynthesis?.cancel()
      } catch {
        /* nothing to cancel */
      }
      clearWatchdog()
    }
  }, [])

  if (supported === false) return null

  const noVoices = supported === true && voices.length === 0
  const onlyBasic = voices.length > 0 && voices.every(isBasic)

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

      {(playing || paused) && blockCount > 0 && (
        <p className="mt-2 font-mono text-[0.7rem] text-subtle" aria-live="polite">
          paragraph {block + 1} of {blockCount}
        </p>
      )}

      {noVoices && (
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Your browser reports no speech voices installed. {betterVoiceHint()}
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
          {voices.map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>
              {prettyName(v)} · {v.lang}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs leading-relaxed text-subtle">
          {onlyBasic
            ? `These are mechanical-sounding synthesiser voices — the only ones your system offers. ${betterVoiceHint()}`
            : 'The five clearest English voices your system offers, best first. Voices come from your operating system, not from this site.'}
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
