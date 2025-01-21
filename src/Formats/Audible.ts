import { type Chapter } from '../Types/Chapter'
import { Base } from './Base'

export class Audible extends Base {
  filename = 'audible-chapters.json'
  mimeType = 'application/json'

  test (data: Record<string, any>): { errors: string[] } {
    if (!('content_license' in data)) {
      return { errors: ['JSON Structure: key content_license missing'] }
    }

    if (!('content_metadata' in data.content_license)) {
      return { errors: ['JSON Structure: key content_license.content_metadata missing'] }
    }

    if (!('chapter_info' in data.content_license.content_metadata)) {
      return { errors: ['JSON Structure: key content_license.content_metadata.chapter_info missing'] }
    }

    if (!('chapters' in data.content_license.content_metadata.chapter_info)) {
      return { errors: ['JSON Structure: key content_license.content_metadata.chapter_info.chapters missing'] }
    }

    if (!Array.isArray(data.content_license.content_metadata.chapter_info.chapters)) {
      return { errors: ['JSON Structure: content_license.content_metadata.chapter_info.chapters must be an array'] }
    }

    if (!data.content_license.content_metadata.chapter_info.chapters.every((chapter: Record<string, any>) => 'start_offset_sec' in chapter)) {
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

    this.duration = data.content_license.content_metadata.chapter_info.runtime_length_ms

    this.chapters = data.content_license.content_metadata.chapter_info.chapters.map((raw: any) => {
      const { start_offset_ms: startTime, title } = raw
      const chapter: Chapter = {
        startTime
      }
      if (title) {
        chapter.title = title
      }
      return chapter
    })

    this.bump()
  }

  toString (pretty = false): string {
    return JSON.stringify({
      content_license: {
        content_metadata: {
          chapter_info: {
            brandIntroDurationMs: 2043,
            brandOutroDurationMs: 5061,
            chapters: this.chapters.map((chapter, i) => ({
              length_ms: Math.round(chapter.duration!),
              start_offset_ms: chapter.startTime,
              start_offset_sec: Math.round(chapter.startTime / 1000),
              title: this.ensureTitle(i)
            }))
          }
        }
      }
    }, null, pretty ? 2 : 0)
  }
}
