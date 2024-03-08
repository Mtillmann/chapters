import { type Chapter } from './Chapter'
import { type MediaItemMeta } from './MediaItemMeta'
export interface MediaItem {
  chapters: Chapter[]
  meta: MediaItemMeta
  supportsPrettyPrint: boolean
  chapterTitleTemplate: string
  defaultMeta: MediaItemMeta
  filename: string
  mimeType: string
  duration: number
  isChapterFormat: boolean

  to: (format: any) => any
  rebuildChapterTitles: () => void
  toString: (pretty?: boolean, exportOptions?: any) => string
  detect: (inputString: string) => boolean
  from: (input: string | MediaItem) => MediaItem
  add: (chapter: Chapter) => void
  expandFirstToStart: () => void
  remove: (index: number) => void
  applyImgUri: (prefix: string) => void
  ensureUniqueFilenames: () => void
  chapterIndexFromTime: (time: number | string) => number | null
  chapterIndexFromStartTime: (time: number | string) => number
  updateChapterStartTime: (index: number, time: string | number) => number | 'timeInUse'
  addChapterAt: (index: number, chapter?: object) => number
  addChapterAtTime: (time: number | string, chapter?: object) => boolean
}
