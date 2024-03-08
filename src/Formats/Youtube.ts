import { Base } from './Base'
import { secondsToTimestamp, stringToLines, timestampToSeconds } from '../util'

export class Youtube extends Base {
  filename = 'youtube-chapters.txt'
  mimeType = 'text/plain'

  detect (inputString: string): boolean {
    return /^0?0:00(:00)?\s/.test(inputString.trim())
  }

  parse (string: string): void {
    if (!this.detect(string)) {
      throw new Error('Youtube Chapters *MUST* begin with (0)0:00(:00), received: ' + string.substr(0, 10) + '...')
    }
    this.chapters = stringToLines(string).map(line => {
      const l = line.split(' ')
      const timestamp = String(l.shift())
      return {
        startTime: timestampToSeconds(timestamp),
        title: l.join(' ')
      }
    })
  }

  toString (): string {
    const options = {
      milliseconds: false,
      hours: this.chapters.at(-1)!.startTime > 3600
    }

    return this.chapters.map((chapter, index) => {
      const startTime = index === 0 && chapter.startTime !== 0 ? 0 : chapter.startTime
      return `${secondsToTimestamp(startTime, options)} ${this.ensureTitle(index)}`
    }).join('\n')
  }
}
