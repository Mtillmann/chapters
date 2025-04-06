import { type Chapter } from '../Types/Chapter'
import { secondsToTimestamp, timestampToSeconds } from '../util'
import { Base } from './Base'

export class Podigee extends Base {
  supportsPrettyPrint = true

  test (data: object[]): { errors: string[] } {
    if (!Array.isArray(data)) {
      return { errors: ['JSON Structure: must be an array'] }
    }

    if (data.length === 0) {
      return { errors: ['JSON Structure: must not be empty'] }
    }

    if (!data.every(chapter => 'start_time' in chapter && 'title' in chapter)) {
      return { errors: ['JSON Structure: every chapter must have a start_time and title property'] }
    }

    return { errors: [] }
  }

  parse (string: string): void {
    const data = JSON.parse(string)
    const { errors } = this.test(data as object[])
    if (errors.length > 0) {
      throw new Error(errors.join(''))
    }

    this.chapters = data.map((raw: Record<string, any>) => {
      const { start_time: start, title, image, url } = raw
      const chapter: Chapter = {
        startTime: timestampToSeconds(start as string)
      }
      if (title) {
        chapter.title = title
      }
      if (image) {
        chapter.img = image
      }
      if (url) {
        chapter.url = url
      }
      return chapter
    })
  }

  toString (pretty = false): string {
    return JSON.stringify(this.chapters.map((chapter, i) => {
      const output: Record<string, any> = {
        start_time: secondsToTimestamp(chapter.startTime),
        title: this.ensureTitle(i)
      }
      if (chapter.img) {
        output.image = chapter.img
      }
      if (chapter.url) {
        output.url = chapter.url
      }
      return output
    }), null, pretty ? 2 : 0)
  }
}
