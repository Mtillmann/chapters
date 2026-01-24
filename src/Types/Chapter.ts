export interface Chapter {
  startTime: number
  endTime?: number
  img?: string
  img_type?: string
  img_filename?: string
  id?: string
  duration?: number
  title?: string
  url?: string
  location?: ChapterLocation
  toc?: boolean
}

export interface ChapterLocation {
  name: string
  geo: string
  osm?: string
}
