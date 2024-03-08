import { type Chapter } from '../Types/Chapter'
import { Int, secondsToTimestamp, timestampToSeconds, zeroPad } from '../util'
import { Base } from './Base'

export class MKVMergeSimple extends Base {
  filename = 'mkvmerge-chapters.txt'
  mimeType = 'text/plain'

  protected zeroPad: number = 2

  detect (inputString: string): boolean {
    const re = new RegExp(`^CHAPTER${zeroPad(1, this.zeroPad)}`)

    return re.test(inputString.trim())
  }

  parse (string: string): void {
    if (!this.detect(string)) {
      throw new Error(`File must start with CHAPTER${zeroPad(1, this.zeroPad)}`)
    }

    const lines = string.split(/\r?\n/)
      .filter(line => line.trim().length > 0)
      .map(line => line.trim())

    const chapters: Chapter[] = []
    lines.forEach(line => {
      const match = /^CHAPTER(?<index>\d+)(?<key>NAME)?=(?<value>.*)/.exec(line)
      if (!match?.groups) {
        /* istanbul ignore next */
        return true
      }

      const index = Int(match.groups.index) - 1
      const key: keyof Chapter = match.groups.key === 'NAME' ? 'title' : 'startTime'
      const value = key === 'startTime' ? timestampToSeconds(match.groups.value) : match.groups.value

      if (chapters[index]) {
        // @ts-expect-error: index is a number
        chapters[index][key] = value
      } else {
        // @ts-expect-error: index is a number
        chapters[index] = { [key]: value }
      }
    })

    this.chapters = chapters
  }

  toString (): string {
    return this.chapters.map((chapter, index) => {
      const i = zeroPad(index + 1, this.zeroPad)
      const options = {
        hours: true,
        milliseconds: true
      }
      const output = [
                `CHAPTER${i}=${secondsToTimestamp(chapter.startTime, options)}`
      ]
      if (chapter.title && chapter.title.trim().length > 0) {
        output.push(`CHAPTER${i}NAME=${chapter.title}`)
      }
      return output.join('\n')
    }).join('\n')
  }
}
