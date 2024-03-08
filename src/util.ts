export function zeroPad (num: string | number, len = 3): string {
  return String(num).padStart(len, '0')
}

export function secondsToTimestamp (seconds: number | string, options: any = {}): string {
  options = {
    hours: true,
    milliseconds: false,
    ...options
  }

  const date = new Date(Int(seconds) * 1000).toISOString()

  if (date.slice(11, 13) !== '00') {
    options.hours = true
  }
  const hms = date.slice(options.hours ? 11 : 14, 19)

  if (options.milliseconds) {
    let fraction = '000'
    if (seconds.toString().includes('.')) {
      fraction = (String(seconds).split('.').pop() + '000').slice(0, 3)
    }
    return hms + '.' + fraction
  }
  return hms
}

/**
 * Converts a NPT (normal play time) to seconds, used by podlove simple chapters
 */
export function NPTToSeconds (npt: string): number {
  const parts = npt.split('.')
  const hms: string[] = parts[0].split(':')
  const ms = parts.length > 1 ? Int(parts[1]) : 0

  while (hms.length < 3) {
    hms.unshift('0')
  }

  const [hours, minutes, seconds] = Ints(hms)

  return timestampToSeconds(`${zeroPad(hours.toString(), 2)}:${zeroPad(minutes.toString(), 2)}:${zeroPad(seconds.toString(), 2)}.${zeroPad(ms.toString(), 3)}`)
}

export function secondsToNPT (seconds: number): string {
  if (seconds === 0) {
    return '0'
  }

  const regularTimestamp = secondsToTimestamp(seconds, { milliseconds: true })
  let [hoursAndMinutesAndSeconds, milliseconds] = regularTimestamp.split('.')
  const [hours, minutes, secondsOnly] = Ints(hoursAndMinutesAndSeconds.split(':'))

  if (milliseconds === '000') {
    milliseconds = ''
  } else {
    milliseconds = '.' + milliseconds
  }

  if (hours === 0 && minutes === 0) {
    return `${secondsOnly}${milliseconds}`
  }

  const secondsString: string = zeroPad(secondsOnly, 2)

  if (hours === 0) {
    return `${minutes}:${secondsString}${milliseconds}`
  }

  const minutesString = zeroPad(minutes, 2)

  return `${hours}:${minutesString}:${secondsString}${milliseconds}`
}

export function timestampToSeconds (timestamp: string, fixedString = false): number {
  let [seconds, minutes, hours] = Ints(timestamp.split(':')).reverse()
  let milliseconds = timestamp.split('.').length > 1 ? Int(timestamp.split('.').pop()) : 0

  if (!hours) {
    hours = 0
  }
  if (!minutes) {
    minutes = 0
  }
  if (!seconds) {
    seconds = 0
  }

  if (milliseconds > 0) {
    milliseconds = milliseconds / 1000
  }

  if (seconds > 59) {
    const extraMinutes = Math.floor(seconds / 60)
    minutes += extraMinutes
    seconds -= extraMinutes * 60
  }

  if (minutes > 59) {
    const extraHours = Math.floor(minutes / 60)
    hours += extraHours
    minutes -= extraHours * 60
  }

  if (fixedString) {
    return Float((hours * 3600 + minutes * 60 + seconds + milliseconds).toFixed(3))
  }
  return hours * 3600 + minutes * 60 + seconds + milliseconds
}

export function hash (): string {
  return (Math.random() + 1).toString(16).substring(7)
}

export function escapeRegExpCharacters (text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

export function enforceMilliseconds (seconds: number): number {
  return Float(seconds.toFixed(3))
}

export function formatBytes (bytes: number, decimals: number = 2, format: 'kB' | 'KiB' = 'kB'): string {
  if (bytes < 1) {
    return '0 B'
  }
  const k = format === 'kB' ? 1000 : 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const sizes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
  const suffix = [format === 'kB' ? sizes[i].toLowerCase() : sizes[i], 'B']
  if (format === 'KiB') {
    suffix.splice(1, 0, 'i')
  }
  return Float(bytes / Math.pow(k, i)).toFixed(decimals) + ' ' + suffix.join('')
}

export function Int (value: unknown, defaultValue = 0): number {
  const i = parseInt(String(value || defaultValue))
  return Number.isNaN(i) ? defaultValue : i
}

export function Float (value: unknown, defaultValue = 0): number {
  const f = parseFloat(String(value || defaultValue))
  return Number.isNaN(f) ? defaultValue : f
}

export function Ints (value: unknown[], defaultValue = 0): number[] {
  return value.map(i => Int(i, defaultValue))
}

export function Floats (value: unknown[], defaultValue = 0): number[] {
  return value.map(i => Float(i, defaultValue))
}

export function indenter (spacesPerDepth = 2): (depth: number, string: string) => string {
  const character: string = spacesPerDepth === 0 ? '' : ' '
  return function (depth: number, string: string): string {
    return character.repeat(depth * spacesPerDepth) + string
  }
}

export function stringToLines (string: string): string[] {
  return string.split(/\r?\n/)
    .filter(line => line.trim().length > 0)
    .map(line => line.trim())
}

export function toSeconds (input: number | string): number {
  if (typeof input === 'number') {
    return input
  }
  if (input.includes(':')) {
    return timestampToSeconds(input)
  }
  return Float(input)
}
