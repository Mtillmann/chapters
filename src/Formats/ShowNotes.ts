import { TextGeneric } from './TextGeneric'

export class ShowNotes extends TextGeneric {
  filename = 'shownote-chapters.txt'
  mimeType = 'text/plain'

  detect (inputString: string): boolean {
    return /^\((?<ts>\d?\d:\d\d(?::\d\d)?)\)\n\n(?<title>[^\n]+)/.test(inputString.trim())
  }

  toString (): string {
    return super.toString(false, { format: 'shownotes' })
  }
}
