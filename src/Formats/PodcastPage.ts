import { TextGeneric } from './TextGeneric'

export class PodcastPage extends TextGeneric {
  filename = 'podcastpage-chapters.txt'
  mimeType = 'text/plain'

  toString (): string {
    return super.toString(false, { format: 'podcastpage' })
  }
}
