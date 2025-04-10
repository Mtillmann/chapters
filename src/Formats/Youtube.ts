import { TextGeneric } from './TextGeneric'

export class Youtube extends TextGeneric {
  filename = 'youtube-chapters.txt'
  mimeType = 'text/plain'

  toString (): string {
    return super.toString(false, { format: 'youtube' })
  }
}
