import { TextGeneric } from './TextGeneric'

export class SpotifyB extends TextGeneric {
  filename = 'spotify-chapters.txt'
  mimeType = 'text/plain'

  toString (): string {
    return super.toString(false, { format: 'spotifyb' })
  }
}
