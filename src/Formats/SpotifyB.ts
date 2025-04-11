import { TextGeneric } from './TextGeneric'

export class SpotifyB extends TextGeneric {
  filename = 'spotify-chapters.txt'
  mimeType = 'text/plain'

  detect (inputString: string): boolean {
    return /^(?<ts>\d?\d:\d\d(?::\d\d)?)-(?<title>[^\n]+)/.test(inputString.trim())
  }

  toString (): string {
    return super.toString(false, { format: 'spotifyb' })
  }
}
