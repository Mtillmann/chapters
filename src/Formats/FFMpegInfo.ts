import { Base } from './Base'
import { enforceMilliseconds } from '../util'

export class FFMpegInfo extends Base {
  detect (inputString: string): boolean {
    return /^frame:\d/.test(inputString.trim())
  }

  parse (input: string): void {
    if (!this.detect(input)) {
      throw new Error('input must start with frame:')
    }

    const matches = Array.from(input.matchAll(/frame:(\d+).*pts_time:([\d.]+)\r?\n/g))
    this.chapters = matches.map(match => {
      const startTime = enforceMilliseconds(parseFloat(match[2]))
      return {
        startTime
      }
    })

    this.rebuildChapterTitles()
  }

  toString (): string {
    throw new Error('this class won\'t generate actual output')
  }
}
