import { type Chapter } from '../Types/Chapter'
import { enforceMilliseconds, escapeRegExpCharacters, stringToLines } from '../util'
import { Base } from './Base'

export class FFMetadata extends Base {
  filename = 'FFMpegdata.txt'
  mimeType = 'text/plain'

  characters = ['=', ';', '#', '\\', '\n']
  safeCharacters = this.characters.map(char => escapeRegExpCharacters(char)).join('|')

  unescapeRegexp = new RegExp('\\\\(' + this.safeCharacters + ')', 'g')
  escapeRegexp = new RegExp('(' + this.safeCharacters + ')', 'g')

  detect (inputString: string): boolean {
    return inputString.trim().slice(0, 12) === ';FFMETADATA1'
  }

  parse (string: string): void {
    if (!this.detect(string)) {
      throw new Error(';FFMETADATA1 header missing :(')
    }
    const lines = stringToLines(string)

    const chapters: Chapter[] = []
    let ignoreAllUntilNextChapter = false
    let isMultilineTitle = false

    lines.forEach(line => {
      const [key, value] = line.split('=')
      if (chapters.length === 0 && key === 'title') {
        this.meta.title = this.unescape(value)
        return
      }

      if (line === '[CHAPTER]') {
        const c: Chapter = { startTime: 0 }
        chapters.push(c)
        ignoreAllUntilNextChapter = false
        return
      }
      if (line.slice(0, 1) === '[') {
        ignoreAllUntilNextChapter = true
      }
      if (chapters.length === 0 || ignoreAllUntilNextChapter) {
        return
      }

      if (!/[^\\]=/.test(line) && isMultilineTitle) {
        // should I keep the multilines?!
        chapters[chapters.length - 1].title += ' ' + line
        return
      }
      isMultilineTitle = false

      if (key === 'title') {
        chapters[chapters.length - 1].title = this.unescape(value)
        if (/\\$/.test(value)) {
          isMultilineTitle = true
        }
      } else if (key === 'START') {
        chapters[chapters.length - 1].startTime = enforceMilliseconds(parseFloat(value) * 1e-3)
      } else if (key === 'END') {
        chapters[chapters.length - 1].endTime = enforceMilliseconds(parseFloat(value) * 1e-3)
      }
    })

    this.chapters = chapters
  }

  unescape (string: string): string {
    return string.replace(this.unescapeRegexp, '$1').replace(/\\$/g, '')
  }

  escape (string: string): string {
    return string.replace(this.escapeRegexp, '\\$1')
  }

  toString (): string {
    const output = [';FFMETADATA1']
    if (this.meta.title!.trim().length > 0) {
      output.push(`title=${this.escape(this.meta.title!)}`)
    }
    output.push('')
    this.chapters.forEach(chapter => {
      output.push('[CHAPTER]', 'TIMEBASE=1/1000')
      output.push('START=' + (enforceMilliseconds(chapter.startTime) * 1000))
      output.push('END=' + (enforceMilliseconds(chapter.endTime!) * 1000))
      if (chapter.title && chapter.title.trim().length > 0) {
        output.push(`title=${this.escape(chapter.title)}`)
      }
      output.push('')
    })

    return output.join('\n')
  }
}
