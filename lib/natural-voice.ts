/**
 * Neural text-to-speech that runs entirely in the reader's browser.
 *
 * The operating system voices the Web Speech API exposes are a lottery. On
 * Windows and macOS they are good; on a stock Linux desktop the only engine
 * installed is eSpeak, a formant synthesiser that sounds like a robot and
 * cannot be reasoned with. This module offers a way out that does not require
 * a server or an API key: Piper, a small VITS model, downloaded once and run
 * locally with ONNX Runtime.
 *
 * A medium-quality voice is about 60 MB and synthesises at roughly two to
 * three times real time on a normal laptop CPU, which is enough to stay ahead
 * of playback if generation runs a sentence or two in front. Nothing is sent
 * anywhere: the text, the model and the audio all stay on the device.
 *
 * The library is fetched from a CDN at the moment it is first needed rather
 * than bundled, so readers who never turn this on pay nothing for it.
 */

const CDN = 'https://cdn.jsdelivr.net/npm/@diffusionstudio/vits-web@1.0.3/+esm'

export type NaturalVoice = {
  id: string
  label: string
  accent: string
}

/**
 * Five voices, not thirty-five.
 *
 * Piper publishes dozens of English models of wildly varying clarity. These
 * are the ones worth listening to an article in: two American, two British,
 * male and female, all "medium" quality — "low" is noticeably muddier and
 * "high" doubles the download for little gain at speech rates.
 */
export const NATURAL_VOICES: NaturalVoice[] = [
  { id: 'en_US-hfc_female-medium', label: 'Ava', accent: 'American · female' },
  { id: 'en_US-hfc_male-medium', label: 'Miles', accent: 'American · male' },
  { id: 'en_GB-alba-medium', label: 'Alba', accent: 'British · female' },
  { id: 'en_GB-northern_english_male-medium', label: 'Rowan', accent: 'British · male' },
  { id: 'en_US-lessac-medium', label: 'Clara', accent: 'American · female' },
]

/** Roughly the size of one voice model, for telling the reader before they commit. */
export const VOICE_SIZE_MB = 60

type VitsModule = {
  download: (id: string, cb?: (p: { loaded: number; total: number }) => void) => Promise<void>
  predict: (opts: { text: string; voiceId: string }) => Promise<Blob>
  stored: () => Promise<string[]>
}

let modulePromise: Promise<VitsModule> | null = null

function loadLibrary(): Promise<VitsModule> {
  modulePromise ??= import(/* webpackIgnore: true */ CDN).then((m) => m as VitsModule)
  return modulePromise
}

/** Which voices are already in the browser's cache, so no download is needed. */
export async function cachedVoices(): Promise<string[]> {
  try {
    const vits = await loadLibrary()
    return await vits.stored()
  } catch {
    return []
  }
}

/** Fetches a voice model, reporting progress from 0 to 1. Cached afterwards. */
export async function fetchVoice(
  id: string,
  onProgress?: (fraction: number) => void,
): Promise<void> {
  const vits = await loadLibrary()
  await vits.download(id, (p) => {
    if (p.total > 0) onProgress?.(Math.min(1, p.loaded / p.total))
  })
}

/**
 * Renders one piece of text to audio.
 *
 * Calls are serialised: the runtime holds a single inference session, and
 * overlapping requests make it slower rather than faster.
 */
let queue: Promise<unknown> = Promise.resolve()

export function synthesize(text: string, voiceId: string): Promise<Blob> {
  const run = queue.then(async () => {
    const vits = await loadLibrary()
    return vits.predict({ text, voiceId })
  })
  queue = run.catch(() => undefined)
  return run as Promise<Blob>
}

export function isNaturalVoice(id: string): boolean {
  return NATURAL_VOICES.some((v) => v.id === id)
}
