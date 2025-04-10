import { TextGeneric } from './TextGeneric'

export class TransistorFM extends TextGeneric {
  filename = 'transistorfm-chapters.txt'
  mimeType = 'text/plain'

  toString (): string {
    return super.toString(false, { format: 'transistorfm' })
  }
}
