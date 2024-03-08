import { type Chapter } from '../Types/Chapter'
import { secondsToTimestamp, timestampToSeconds } from '../util'
import { Base } from './Base'

export class PodloveJson extends Base {
  filename = 'podlove-chapters.json'
  mimeType = 'application/json'

  test (data: object[]): { errors: string[] } {
    if (!Array.isArray(data)) {
      return { errors: ['JSON Structure: must be an array'] }
    }

    if (data.length === 0) {
      return { errors: ['JSON Structure: must not be empty'] }
    }

    if (!data.every(chapter => 'start' in chapter)) {
      return { errors: ['JSON Structure: every chapter must have a start property'] }
    }

    return { errors: [] }
  }

  parse (string: string): void {
    const data = JSON.parse(string)
    const { errors } = this.test(data as object[])
    if (errors.length > 0) {
      throw new Error(errors.join(''))
    }

    this.chapters = data.map((raw: any) => {
      const { start, title, image, href } = raw
      const chapter: Chapter = {
        startTime: timestampToSeconds(start as string)
      }
      if (title) {
        chapter.title = title
      }
      if (image) {
        chapter.img = image
      }
      if (href) {
        chapter.url = href
      }
      return chapter
    })
  }

  toString (pretty = false): string {
    return JSON.stringify(this.chapters.map((chapter, i) => ({
      start: secondsToTimestamp(chapter.startTime, { milliseconds: true }),
      title: this.ensureTitle(i),
      image: chapter.img ?? '',
      href: chapter.url ?? ''
    })), null, pretty ? 2 : 0)
  }
}
