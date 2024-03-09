import filenamify from 'filenamify'
import { enforceMilliseconds, hash, secondsToTimestamp, toSeconds, Float } from '../util'
import { type MediaItemMeta } from '../Types/MediaItemMeta'
import { type Chapter } from '../Types/Chapter'
import { type MediaItem } from '../Types/MediaItem'

export abstract class Base implements MediaItem {
  supportsPrettyPrint: boolean = false
  chapterTitleTemplate: string = 'Chapter $chapter of $total'
  chapters: Chapter[] = []
  defaultMeta: MediaItemMeta = {
    author: '',
    title: '',
    podcastName: '',
    description: '',
    fileName: '',
    waypoints: false,
    version: '1.2.0'
  }

  // why?!
  meta: MediaItemMeta = { ...this.defaultMeta }

  // meta:MediaItemMeta = {...this.defaultMeta};

  filename: string = 'chapters.json'
  mimeType: string = 'application/json'

  duration: number = 0

  isChapterFormat: boolean = true

  constructor (duration: number = 3600) {
    this.duration = Float(duration)
  }

  static create (input?: string | MediaItem, duration?: number): MediaItem {
    // @ts-expect-error: this will be the final class
    return (new this(duration)).from(input)
  }

  from (input?: string | MediaItem): MediaItem {
    if (!input) {
      throw new Error('No input provided')
      // do nothing
    } else if (typeof input === 'string') {
      this.parse(input)
    } else if ('isChapterFormat' in input) {
      this.chapters = JSON.parse(JSON.stringify(input.chapters))
      this.meta = { ...this.meta, ...JSON.parse(JSON.stringify(input.meta)) }
    }

    if (this.chapters.length > 0) {
      const chapter = this.chapters.at(-1)!
      if (chapter.endTime) {
        this.duration = chapter.endTime
      } else if (chapter.startTime) {
        this.duration = chapter.startTime
      }
    }

    this.bump()
    return this
  }

  detect (inputString: string): boolean {
    try {
      const data = JSON.parse(inputString)
      const { errors } = this.test(data as object)
      if (errors.length > 0) {
        throw new Error('data test failed')
      }
    } catch (e) {
      return false
    }
    return true
  }

  test (data: object): { errors: string[] } {
    if (!('chapters' in data)) {
      return { errors: ['JSON Structure: missing "chapters"'] }
    }
    if (!('version' in data)) {
      return { errors: ['JSON Structure: missing "version"'] }
    }
    return { errors: [] }
  }

  bump (keepDuration: boolean = false): void {
    this.chapters.sort((a, b) => a.startTime - b.startTime)
    const lastChapter = this.chapters.at(-1)

    if (lastChapter && !keepDuration) {
      this.duration = Math.max(parseFloat(String(this.duration || 0)), parseFloat(String(lastChapter.endTime ?? 0)), parseFloat(String(lastChapter.startTime ?? 0)))
    }

    this.chapters = this.chapters.map((chapter, index) => {
      const endTime = this.endTime(index)
      const duration = endTime - this.chapters[index].startTime
      const timestampOptions = { hours: false }
      return {
        ...{
          id: hash(),
          startTime: 0
        },
        ...chapter,
        ...{
          endTime,
          duration,
          startTime_hr: secondsToTimestamp(chapter.startTime, timestampOptions),
          endTime_hr: secondsToTimestamp(endTime, timestampOptions),
          duration_hr: secondsToTimestamp(duration, timestampOptions)
        },
        ...('toc' in chapter ? {} : { toc: true })
      }
    })
  }

  endTime (index: number): number {
    return this.chapters[index + 1] ? (this.chapters[index + 1].startTime - 0.001) : this.duration
  }

  expandFirstToStart (): void {
    this.chapters[0].startTime = 0
    this.bump()
  }

  add (chapter: Chapter): void {
    this.chapters.push(chapter)
    this.bump()
  }

  remove (index: number): void {
    /* istanbul ignore next */
    if (this.chapters[index]?.img?.slice(0, 5) === 'blob:') {
      /* istanbul ignore next */
      URL.revokeObjectURL(String(this.chapters[index].img))
    }
    this.chapters.splice(index, 1)
    this.bump()
  }

  to (className: any): MediaItem {
    return className.create(this)
  }

  parse (string: string): void {
    const data = JSON.parse(string)
    const { errors } = this.test(data as object)
    if (errors.length > 0) {
      throw new Error(errors.join(''))
    }

    this.chapters = data.chapters
    this.chapters = this.chapters.map(chapter => {
      if ('img' in chapter) {
        if (chapter.img?.slice(0, 4) === 'http') {
          chapter.img_type = 'absolute'
        } else {
          chapter.img_type = 'relative'
          chapter.img_filename = chapter.img
        }
      }
      return chapter
    })

    this.meta = Object.fromEntries(Object.entries(this.meta).map(([key, value]) => [key, data[key] || value]))
  }

  toString (pretty = false, exportOptions = {}): string {
    const options = {
      ...{
        imagePrefix: '',
        writeRedundantToc: false,
        writeEndTimes: false
      },
      ...exportOptions
    }
    const defaultMetaProperties = Object.keys(this.defaultMeta)
    return JSON.stringify(
      {
        ...Object.fromEntries(
          Object.entries(this.meta).filter(([key, value]) => {
            return defaultMetaProperties.includes(key) && value !== '' && value !== false
          })
        ),
        ...{
          chapters: this.chapters.map((chapter: Chapter) => {
            const filtered: Record<string, unknown> = {
              startTime: enforceMilliseconds(chapter.startTime)
            }

            if (options.writeEndTimes) {
              filtered.endTime = enforceMilliseconds(chapter.endTime!)
            }

            if ('toc' in chapter && chapter.toc === false) {
              filtered.toc = false
            }
            if (!('toc' in filtered) && options.writeRedundantToc) {
              filtered.toc = true
            }

            ['location', 'img', 'url', 'title'].forEach((property: string) => {
              const key = property as keyof Chapter
              if (key in chapter && String(chapter[key]!).trim().length > 0) {
                filtered[key] = chapter[key]
              }
            })

            if ('img_filename' in chapter && 'img' in filtered && chapter.img_type === 'relative') {
              filtered.img = filenamify(chapter.img_filename!)
            }

            if (options.imagePrefix.trim().length > 0 && 'img' in filtered && ['relative', 'blob'].includes(chapter.img_type!)) {
              filtered.img = options.imagePrefix + String(filtered.img)
            }

            return filtered
          })
        }
      }
      , null, pretty ? 2 : 0)
  }

  applyChapterMinLength (seconds: number): object {
    const originalIdMap: string[] = this.chapters.map(chapter => String(chapter.id))
    const newChapters: Chapter[] = []
    let elapsed: number = 0
    let currentChapter: Chapter | null

    this.chapters.forEach((chapter: Chapter) => {
      elapsed += chapter.duration!
      if (!currentChapter) {
        currentChapter = chapter
      }
      if (elapsed >= seconds) {
        delete currentChapter.endTime
        delete currentChapter.duration
        newChapters.push(currentChapter)
        currentChapter = null
        elapsed = 0
      }
    })

    this.chapters = newChapters
    this.bump()

    const newIdMap = Object.fromEntries(this.chapters.map((c, i) => [c.id, i]))
    return Object.fromEntries(originalIdMap.map((id, index) => {
      return [index, id in newIdMap ? newIdMap[id] : 'deleted']
    }))
  }

  addChapterAt (index: number, chapter: object = {}): number {
    let startTime = 0
    if (index > this.chapters.length) {
      const start = this.chapters.at(-1) ? this.chapters.at(-1)!.startTime : 0
      startTime = start + (this.duration - start) * 0.5
    } else if (index === 0) {
      startTime = 0
    } else {
      const start = this.chapters.at(index - 1)!.startTime
      const end = this.chapters.at(index) ? this.chapters.at(index)!.startTime : this.duration
      startTime = start + (end - start) * 0.5
    }

    if (chapter && 'startTime' in chapter) {
      delete chapter.startTime
    }

    this.chapters.push({
      ...chapter,
      id: hash(),
      startTime
    })

    this.bump()
    return startTime
  }

  addChapterAtTime (time: number | string, chapter: object = {}): boolean {
    const startTime: number = toSeconds(time)

    if (this.chapterExistsAtStartTime(startTime)) {
      return false
    }

    this.chapters.push({
      ...chapter,
      id: hash(),
      startTime
    })

    this.bump()

    return true
  }

  rebuildChapterTitles (template?: string): void {
    this.chapters.forEach((chapter: Chapter, index: number) => {
      this.chapters[index].title = this.getChapterTitle(index, template)
    })
  }

  ensureTitle (index: number): string {
    return this.chapters[index].title ?? this.getChapterTitle(index)
  }

  getChapterTitle (index: number, template?: string): string {
    template = template ?? this.chapterTitleTemplate
    return template
      .replace('$chapter', String(index + 1))
      .replace('$total', String(this.chapters.length))
  }

  chapterExistsAtStartTime (time: number): boolean {
    time = toSeconds(time)
    return this.chapters.filter(c => c.startTime === time).length > 0
  }

  updateChapterStartTime (index: number, startTime: number | string): number | 'timeInUse' {
    const newStartTime = toSeconds(startTime)
    if (this.chapterExistsAtStartTime(newStartTime)) {
      return 'timeInUse'
    }

    if (newStartTime > this.duration) {
      this.duration = newStartTime
    }

    this.chapters[index].startTime = newStartTime
    this.bump()
    return newStartTime
  }

  chapterIndexFromStartTime (startTime: number | string): number {
    startTime = toSeconds(startTime)
    return this.chapters.reduce((newIndex, chapter, index) => {
      if (chapter.startTime === startTime) {
        newIndex = index
      }
      return newIndex
    }, 0)
  }

  chapterIndexFromTime (time: number | string): null | number {
    const timeStamp: number = toSeconds(time)
    return this.chapters.reduce((newIndex: number | null, chapter: Chapter, index: number) => {
      if (timeStamp > chapter.startTime) {
        newIndex = index
      }
      return newIndex
    }, null)
  }

  ensureUniqueFilenames (): void {
    const usedFilenames: string[] = []
    this.chapters = this.chapters.map(chapter => {
      if (chapter.img_type !== 'blob') {
        return chapter
      }

      chapter.img_filename = filenamify(chapter.img_filename!)

      let filename = chapter.img_filename
      if (usedFilenames.includes(filename)) {
        filename = filename.replace(/(\.\w+)$/, `_${hash()}$1`)
        chapter.img_filename = filename
      }
      usedFilenames.push(filename)

      return chapter
    })
  }

  applyImgUri (imgUri: string): void {
    this.chapters.forEach((chapter, i) => {
      if ('img' in chapter) {
        this.chapters[i].img = imgUri.replace(/\/*$/, '') + '/' + chapter.img!.replace(/^\/*/, '')
      }
    })
  }
}
