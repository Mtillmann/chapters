import { Base } from './Base'
import { secondsToTimestamp, timestampToSeconds } from '../util'

export class WebVTT extends Base {
  filename = 'webvtt-chapters.vtt'
  mimeType = 'text/vtt'

  detect (inputString: string): boolean {
    return inputString.trim().slice(0, 6) === 'WEBVTT'
  }

  parse (string: string): void {
    if (!this.detect(string)) {
      throw new Error('WEBVTT header missing :(')
    }

    const lines = string.split(/\r?\n/)
      .filter(line => line.trim().length > 0)
      .map(line => line.trim())

    const header = lines.shift()!.split(/\s*-\s*/)

    if (header[1]) {
      this.meta.title = header[1]
    }

    const chapters: any[] = []

    lines.forEach(line => {
      if (/^\d+$/.test(line)) {
        chapters.push({})
        return
      }

      const index = chapters.length - 1
      const timestamps = /(.*)\s+-->\s+(.*)/.exec(line)
      if (timestamps && timestamps.length === 3) {
        chapters[index].startTime = timestampToSeconds(timestamps[1])
        chapters[index].endTime = timestampToSeconds(timestamps[2])
        return
      }

      chapters[index].title = line
    })

    this.chapters = chapters
  }

  toString (): string {
    const output = ['WEBVTT']
    if (this.meta.title!.trim().length > 0) {
      output[0] += ' - ' + this.meta.title!.trim()
    }
    const options = { hours: true, milliseconds: true }

    this.chapters.forEach((chapter, index) => {
      output.push('')
      output.push(...[
        String(index + 1),
        secondsToTimestamp(chapter.startTime, options) + ' --> ' + secondsToTimestamp(chapter.endTime!, options),
        this.ensureTitle(index)
      ].filter(line => String(line).trim().length > 0)
      )
    })

    return output.join('\n')
  }
}
