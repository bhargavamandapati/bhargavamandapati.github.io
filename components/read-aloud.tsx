'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Headphones, Loader2, Pause, Play, Settings2, SkipBack, SkipForward, Sparkles, Square } from 'lucide-react'
import {
  NATURAL_VOICES,
  VOICE_SIZE_MB,
  cachedVoices,
  fetchVoice,
  isNaturalVoice,
  synthesize,
} from '@/lib/natural-voice'
import { cn } from '@/lib/utils'

/**
 * Reads a topic aloud, with two engines behind one set of controls.
 *
 * "Natural" voices are a small neural model downloaded once and run locally —
 * clear and consistent on every platform. "System" voices are whatever the
 * operating system provides: instant and free, but on a stock Linux desktop
 * that means eSpeak, which sounds like a robot.
 *
 * Neither sends anything to a server. The site is a static export, so cloud
 * TTS would mean shipping an API key in the bundle.
 */

const VOICE_KEY = 'bm:tts-voice'
const RATE_KEY = 'bm:tts-rate'
const MAX_SYSTEM_VOICES = 5
/** Sentences rendered in front of playback, so speech never waits on the model. */
const LOOKAHEAD = 2

const READABLE = 'h2, h3, h4, p, li, blockquote, figcaption, pre'
const SKIP_INSIDE = 'pre, .code-window, [role="region"], .term-popover, [data-no-tts]'

const NOVELTY =
  /\+|demonic|whisper|croak|klatt|auntie|uncle|grandma|grandpa|zarvox|trinoids|boing|bubbles|bells|cellos|organ|jester|wobble|deranged|hysterical|bahh|bad news|good news|albert|bruce|junior|kathy|princess|ralph|superstar|pipe organ|max headroom/i
const BASIC_ENGINE = /espeak|festival|flite|pico|mbrola|dispatcher|compact|eloquence/i

type Chunk = { el: HTMLElement; text: string; block: number }

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

function prettyName(voice: SpeechSynthesisVoice): string {
  const name = voice.name
    .replace(/^(Microsoft|Google|Apple)\s+/i, '')
    .replace(/\s*-\s*English.*$/i, '')
    .replace(/\s*\((?:Natural|Premium|Enhanced|Online|United States|United Kingdom)\)\s*/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return name || voice.name
}

/** Reduces whatever the platform offers to a handful of distinct English voices. */
function curate(all: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  const english = all.filter((v) => v.lang.toLowerCase().startsWith('en') && !NOVELTY.test(v.name))
  const pool = english.length > 0 ? english : all.filter((v) => !NOVELTY.test(v.name))
  const seen = new Set<string>()
  const picked: SpeechSynthesisVoice[] = []
  for (const voice of [...pool].sort((a, b) => rank(b) - rank(a))) {
    const key = prettyName(voice).toLowerCase().replace(/[^a-z]/g, '')
    if (seen.has(key)) continue
    seen.add(key)
    picked.push(voice)
    if (picked.length >= MAX_SYSTEM_VOICES) break
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

export function ReadAloud({ targetId, className }: { targetId: string; className?: string }) {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceId, setVoiceId] = useState<string>('')
  const [downloaded, setDownloaded] = useState<string[]>([])
  const [downloading, setDownloading] = useState<number | null>(null)
  const [rate, setRate] = useState(1)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [failed, setFailed] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [block, setBlock] = useState(0)
  const [blockCount, setBlockCount] = useState(0)

  const chunks = useRef<Chunk[]>([])
  const cursor = useRef(0)
  /** Bumped on every stop or restart so stale callbacks from a cancelled read are ignored. */
  const run = useRef(0)
  const audio = useRef<HTMLAudioElement | null>(null)
  const rendered = useRef(new Map<number, string>())
  const panelId = useId()

  const natural = isNaturalVoice(voiceId)

  // ---- Capability, voices, preferences ------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return
    const speech = typeof window.speechSynthesis?.speak === 'function'
    setSupported(true)
    if (!speech) return
    const load = () => {
      const list = window.speechSynthesis.getVoices()
      if (list.length) setSystemVoices(curate(list))
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  useEffect(() => {
    try {
      const savedRate = Number(window.localStorage.getItem(RATE_KEY))
      if (savedRate >= 0.6 && savedRate <= 2) setRate(savedRate)
      const saved = window.localStorage.getItem(VOICE_KEY)
      if (saved) setVoiceId(saved)
    } catch {
      /* storage blocked — defaults are fine */
    }
  }, [])

  // Which natural voices are already on the device, so the label can say so.
  useEffect(() => {
    let alive = true
    cachedVoices().then((ids) => {
      if (alive) setDownloaded(ids)
    })
    return () => {
      alive = false
    }
  }, [])

  // Default to the best system voice until the reader chooses otherwise.
  useEffect(() => {
    if (voiceId) return
    if (systemVoices.length > 0) setVoiceId(systemVoices[0].voiceURI)
  }, [systemVoices, voiceId])

  const systemVoice = useMemo(
    () => systemVoices.find((v) => v.voiceURI === voiceId),
    [systemVoices, voiceId],
  )

  // ---- Shared reading machinery -------------------------------------------
  const highlight = useCallback((i: number) => {
    const chunk = chunks.current[i]
    if (!chunk) return
    for (const c of chunks.current) {
      if (c.el !== chunk.el) c.el.removeAttribute('data-reading')
    }
    chunk.el.setAttribute('data-reading', 'true')
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
        out.push({ el, text: 'Code sample.', block: blockIndex++ })
        continue
      }
      if (el.closest(SKIP_INSIDE)) continue
      const outer = el.parentElement?.closest(READABLE)
      if (outer && root.contains(outer)) continue
      const text = (el.innerText || '').replace(/\s+/g, ' ').trim()
      if (text.length < 2) continue
      for (const sentence of toSentences(text)) out.push({ el, text: sentence, block: blockIndex })
      blockIndex += 1
    }
    return out
  }, [targetId])

  const releaseAudio = useCallback(() => {
    for (const url of rendered.current.values()) URL.revokeObjectURL(url)
    rendered.current.clear()
    if (audio.current) {
      audio.current.pause()
      audio.current.removeAttribute('src')
      audio.current.load()
    }
  }, [])

  const stop = useCallback(() => {
    run.current += 1
    try {
      window.speechSynthesis?.cancel()
    } catch {
      /* nothing to cancel */
    }
    releaseAudio()
    for (const c of chunks.current) c.el.removeAttribute('data-reading')
    setPlaying(false)
    setPaused(false)
    setBuffering(false)
    setBlock(0)
    cursor.current = 0
  }, [releaseAudio])

  // ---- Natural voice ------------------------------------------------------
  /** Renders the next few sentences in the background so playback never waits. */
  const renderAhead = useCallback(
    async (from: number, token: number) => {
      for (let i = from; i < Math.min(from + LOOKAHEAD, chunks.current.length); i++) {
        if (token !== run.current) return
        if (rendered.current.has(i)) continue
        try {
          const blob = await synthesize(chunks.current[i].text, voiceId)
          if (token !== run.current) return
          rendered.current.set(i, URL.createObjectURL(blob))
        } catch {
          return
        }
      }
    },
    [voiceId],
  )

  const playNatural = useCallback(
    async (index: number, token: number) => {
      if (index >= chunks.current.length) {
        stop()
        return
      }
      cursor.current = index
      setBlock(chunks.current[index].block)
      highlight(index)

      if (!rendered.current.has(index)) {
        setBuffering(true)
        try {
          const blob = await synthesize(chunks.current[index].text, voiceId)
          if (token !== run.current) return
          rendered.current.set(index, URL.createObjectURL(blob))
        } catch {
          if (token === run.current) {
            setFailed('Could not generate audio. Switching back to a system voice may help.')
            stop()
          }
          return
        }
      }
      if (token !== run.current) return
      setBuffering(false)

      const el = audio.current
      if (!el) return
      el.src = rendered.current.get(index) as string
      el.playbackRate = rate
      el.preservesPitch = true
      void el.play().catch(() => undefined)

      // Drop audio well behind the cursor, and get ahead of the cursor.
      for (const [i, url] of rendered.current) {
        if (i < index - 1) {
          URL.revokeObjectURL(url)
          rendered.current.delete(i)
        }
      }
      void renderAhead(index + 1, token)
    },
    [highlight, rate, renderAhead, stop, voiceId],
  )

  // ---- System voice -------------------------------------------------------
  const speakSystem = useCallback(
    (index: number, token: number) => {
      if (index >= chunks.current.length) {
        stop()
        return
      }
      cursor.current = index
      setBlock(chunks.current[index].block)
      highlight(index)

      const utterance = new SpeechSynthesisUtterance(chunks.current[index].text)
      if (systemVoice) utterance.voice = systemVoice
      utterance.rate = rate
      utterance.onend = () => {
        if (token === run.current) speakSystem(cursor.current + 1, token)
      }
      utterance.onerror = () => {
        if (token === run.current) speakSystem(cursor.current + 1, token)
      }
      window.speechSynthesis.speak(utterance)
    },
    [highlight, rate, stop, systemVoice],
  )

  // ---- Transport ----------------------------------------------------------
  const start = useCallback(
    async (from: number) => {
      run.current += 1
      const token = run.current
      setFailed(null)
      setPlaying(true)
      setPaused(false)

      if (natural) {
        releaseAudio()
        if (!downloaded.includes(voiceId)) {
          setDownloading(0)
          try {
            await fetchVoice(voiceId, (f) => {
              if (token === run.current) setDownloading(f)
            })
          } catch {
            if (token === run.current) {
              setFailed('The voice could not be downloaded. Check your connection, or pick a system voice.')
              setDownloading(null)
              setPlaying(false)
            }
            return
          }
          if (token !== run.current) return
          setDownloading(null)
          setDownloaded((d) => (d.includes(voiceId) ? d : [...d, voiceId]))
        }
        void playNatural(from, token)
        return
      }

      window.speechSynthesis.cancel()
      // Cancel is asynchronous in some engines; let it settle before queueing.
      window.setTimeout(() => {
        if (token === run.current) speakSystem(from, token)
      }, 60)
    },
    [downloaded, natural, playNatural, releaseAudio, speakSystem, voiceId],
  )

  const play = useCallback(() => {
    if (paused) {
      if (natural && audio.current?.src) {
        setPaused(false)
        setPlaying(true)
        void audio.current.play().catch(() => undefined)
        return
      }
      void start(cursor.current)
      return
    }
    const list = collect()
    chunks.current = list
    setBlockCount(list.length ? list[list.length - 1].block + 1 : 0)
    if (list.length === 0) return
    void start(0)
  }, [collect, natural, paused, start])

  /**
   * Pauses without calling speechSynthesis.pause().
   *
   * That method is a no-op on Linux and unreliable on several Android
   * browsers: the button flipped to "Resume" while the voice kept talking.
   * The natural engine is an audio element, which pauses properly; the system
   * engine is cancelled and the current sentence replayed on resume.
   */
  const pause = useCallback(() => {
    if (natural) {
      audio.current?.pause()
    } else {
      run.current += 1
      window.speechSynthesis.cancel()
    }
    setPaused(true)
    setPlaying(false)
  }, [natural])

  const skip = useCallback(
    (delta: number) => {
      const list = chunks.current
      if (list.length === 0) return
      // Step by block, not by sentence, so the buttons move a paragraph at a
      // time however the prose happens to be punctuated.
      const here = list[cursor.current]?.block ?? 0
      const target = Math.max(0, Math.min(here + delta, list[list.length - 1]?.block ?? 0))
      const at = list.findIndex((c) => c.block === target)
      void start(at === -1 ? 0 : at)
    },
    [start],
  )

  const applyAndRestart = useCallback(() => {
    if (!playing && !paused) return
    void start(cursor.current)
  }, [paused, playing, start])

  // Always stop when the reader leaves the page.
  useEffect(() => {
    // The Map instance is stable, so capturing it here frees exactly the
    // object URLs this component created.
    const urls = rendered.current
    return () => {
      run.current += 1
      try {
        window.speechSynthesis?.cancel()
      } catch {
        /* nothing to cancel */
      }
      for (const url of urls.values()) URL.revokeObjectURL(url)
      urls.clear()
    }
  }, [])

  if (supported === false) return null

  const onlySystem = systemVoices.length > 0 && systemVoices.every((v) => rank(v) < 15)
  const busy = downloading !== null || buffering

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
      {/* The natural voice plays through a plain audio element, which pauses
          and seeks reliably on every platform, unlike speech synthesis. */}
      <audio
        ref={audio}
        hidden
        onEnded={() => {
          const token = run.current
          void playNatural(cursor.current + 1, token)
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 inline-flex items-center gap-2 text-sm font-medium text-fg">
          <Headphones aria-hidden className="size-4 text-accent" />
          Listen
        </span>

        <button
          type="button"
          onClick={playing ? pause : play}
          disabled={systemVoices.length === 0 && NATURAL_VOICES.length === 0}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm transition-colors hover:border-line-strong hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? (
            <Loader2 aria-hidden className="size-4 animate-spin" />
          ) : playing ? (
            <Pause aria-hidden className="size-4" />
          ) : (
            <Play aria-hidden className="size-4" />
          )}
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

      <div aria-live="polite" className="empty:hidden">
        {downloading !== null && (
          <p className="mt-2 font-mono text-[0.7rem] text-subtle">
            downloading natural voice · {Math.round(downloading * 100)}% of ~{VOICE_SIZE_MB} MB · once only
          </p>
        )}
        {downloading === null && buffering && (
          <p className="mt-2 font-mono text-[0.7rem] text-subtle">preparing audio…</p>
        )}
        {downloading === null && !buffering && (playing || paused) && blockCount > 0 && (
          <p className="mt-2 font-mono text-[0.7rem] text-subtle">
            paragraph {block + 1} of {blockCount}
          </p>
        )}
        {failed && <p className="mt-2 text-xs leading-relaxed text-fg">{failed}</p>}
      </div>

      <div id={panelId} hidden={!showSettings} className="mt-3 border-t border-line pt-3">
        <label
          htmlFor={`${panelId}-voice`}
          className="block font-mono text-[0.7rem] uppercase tracking-wider text-subtle"
        >
          Voice
        </label>
        <select
          id={`${panelId}-voice`}
          value={voiceId}
          onChange={(e) => {
            setVoiceId(e.target.value)
            try {
              window.localStorage.setItem(VOICE_KEY, e.target.value)
            } catch {
              /* ignore */
            }
            applyAndRestart()
          }}
          className="mt-1.5 w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-fg outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30"
        >
          <optgroup label="Natural — runs on your device">
            {NATURAL_VOICES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label} · {v.accent} ·{' '}
                {downloaded.includes(v.id) ? 'ready' : `${VOICE_SIZE_MB} MB download`}
              </option>
            ))}
          </optgroup>
          {systemVoices.length > 0 && (
            <optgroup label="System — instant, no download">
              {systemVoices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {prettyName(v)} · {v.lang}
                </option>
              ))}
            </optgroup>
          )}
        </select>

        <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-subtle">
          <Sparkles aria-hidden className="mt-0.5 size-3.5 shrink-0 text-accent" />
          <span>
            {natural
              ? `A neural voice that runs entirely in your browser — downloaded once, then it works offline. Nothing you listen to is sent anywhere.`
              : onlySystem
                ? `System voices come from your operating system, and yours only offers basic synthesiser voices. Pick a natural voice above for something clearer.`
                : `System voices come from your operating system and start instantly. The natural voices are clearer and sound the same on every device.`}
          </span>
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
            if (audio.current) audio.current.playbackRate = next
            try {
              window.localStorage.setItem(RATE_KEY, String(next))
            } catch {
              /* ignore */
            }
          }}
          onMouseUp={() => {
            if (!natural) applyAndRestart()
          }}
          onTouchEnd={() => {
            if (!natural) applyAndRestart()
          }}
          onKeyUp={() => {
            if (!natural) applyAndRestart()
          }}
          className="mt-1.5 w-full accent-[var(--accent)]"
        />
      </div>
    </section>
  )
}
