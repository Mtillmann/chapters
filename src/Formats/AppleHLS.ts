import type { Chapter } from '../Types/Chapter'
import { Base } from './Base'

export class AppleHLS extends Base {
  filename = 'apple-hls.json'
  mimeType = 'application/json'
  supportsPrettyPrint = true

  titleLanguage = 'en'
  imageDims = [1280, 720]

  test (data: object[]): { errors: string[] } {
    if (!Array.isArray(data)) {
      return { errors: ['JSON Structure: must be an array'] }
    }

    if (data.length === 0) {
      return { errors: ['JSON Structure: must not be empty'] }
    }

    if (!data.every(chapter => 'chapter' in chapter && 'start-time' in chapter)) {
      return { errors: ['JSON Structure: every chapter must have a chapter and a start-time property'] }
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
      const chapter: any = {
        startTime: parseFloat(raw['start-time'] as string)
      }

      if ('titles' in raw && raw.titles.length > 0) {
        chapter.title = raw.titles[0].title
      }

      if ('images' in raw && raw.images.length > 0) {
        chapter.img = raw.images[0].url
      }

      return chapter as Chapter
    })
  }

  toString (pretty = false): string {
    return JSON.stringify(this.chapters.map((c, i) => {
      const chapter: any = {
        'start-time': c.startTime,
        chapter: i + 1,
        titles: [
          {
            title: this.ensureTitle(i),
            language: this.titleLanguage
          }
        ]
      }

      if (c.img) {
        chapter.images = [
          {
            'image-category': 'chapter',
            url: c.img,
            'pixel-width': this.imageDims[0],
            'pixel-height': this.imageDims[1]
          }
        ]
      }

      return chapter
    }), null, pretty ? 2 : 0)
  }
}
