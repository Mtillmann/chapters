import { TextGeneric } from './TextGeneric'

export class ShowNotes extends TextGeneric {
  filename = 'shownote-chapters.txt'
  mimeType = 'text/plain'

  toString (): string {
    return super.toString(false, { format: 'shownotes' })
  }
}
