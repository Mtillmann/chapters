import { Base } from './Base'
import { secondsToTimestamp, stringToLines, timestampToSeconds } from '../util'
import { type Chapter } from '../Types/Chapter'

export class MP4Chaps extends Base {
  filename = 'mp4chaps.txt'
  mimeType = 'text/plain'

  detect (inputString: string): boolean {
    return /^\d\d:\d\d:\d\d.\d\d?\d?\s/.test(inputString.trim())
  }

  parse (string: string): void {
    if (!this.detect(string)) {
      throw new Error('MP4Chaps *MUST* begin with 00:00:00, received: ' + string.substr(0, 10) + '...')
    }
    this.chapters = stringToLines(string).map(line => {
      const l = line.split(' ')

      const startTime = timestampToSeconds(l.shift()!)
      const [title, href] = l.join(' ').split('<')
      const chapter: Chapter = {
        startTime,
        title: title.trim()
      }

      if (href) {
        chapter.url = href.replace('>', '')
      }

      return chapter
    })
  }

  toString (): string {
    return this.chapters.map((chapter) => {
      const line = []
      line.push(secondsToTimestamp(chapter.startTime, { milliseconds: true }))
      line.push(chapter.title)
      if (chapter.url) {
        line.push(`<${chapter.url}>`)
      }
      return line.join(' ')
    }).join('\n')
  }
}
