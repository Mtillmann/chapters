import { TextGeneric } from './TextGeneric'

export class PodigeeText extends TextGeneric {
  filename = 'podigee-chapters.txt'
  mimeType = 'text/plain'

  toString (): string {
    return super.toString(false, { format: 'podigeetext' })
  }
}
