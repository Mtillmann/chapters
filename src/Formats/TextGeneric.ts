import { Base } from './Base'
import { secondsToTimestamp, timestampToSeconds } from '../util'

export class TextGeneric extends Base {
  filename = 'chapters.txt'
  mimeType = 'text/plain'

  formats: Record<string, Record<string, any>> = {
    spotifya: {
      string: (title: string, start: string) => `(${start}) ${title}`,
      hours: 'default'
    },
    spotifyb: {
      string: (title: string, start: string) => `${start}-${title}`,
      hours: 'default'
    },
    youtube: {
      string: (title: string, start: string) => `${start} ${title}`,
      hours: 'whenOverOneHour',
      enforceZeroStartTime: true
    },
    shownotes: {
      string: (title: string, start: string) => [`(${start})`, '', title, ''].join('\n'),
      hours: 'default'
    },
    transistorfm: {
      string: (title: string, start: string) => `${start} - ${title}`,
      hours: 'default'
    },
    podigeetext: {
      string: (title: string, start: string) => `${start} - ${title}`,
      hours: 'always'
    },
    podcastpage: {
      string: (title: string, start: string) => `(${start}) - ${title}`,
      hours: 'default'
    }
  }

  detect (inputString: string): boolean {
    /*
      re: ^\(?(?<ts>\d?\d:\d\d(?::\d\d)?)\)?[\s-]+(?<title>[^\n]+)

      test content:

      (00:01) Chapter 1
      00:02-Chapter 1
      00:03 Chapter 1
      00:04 - Chapter 1
      00:00:05 - Chapter 1
      (00:06) - Chapter 1
      (00:07)

      Welcome to the show
    */

    return /^\(?(?<ts>\d?\d:\d\d(?::\d\d)?)\)?[\s-]+(?<title>[^\n]+)/.test(inputString.trim())
  }

  parse (string: string): void {
    if (!this.detect(string)) {
      throw new Error('Invalid format, see documentation for supported formats')
    }

    const matches = [...string.matchAll(/^\(?(?<ts>\d?\d:\d\d(?::\d\d)?)\)?[\s-]+(?<title>[^\n]+)/gm)]

    this.chapters = matches.map(match => {
      return {
        startTime: timestampToSeconds(match.groups!.ts),
        title: match.groups!.title
      }
    })
  }

  toString (pretty: boolean = false, exportOptions: string | Record<string, any> = 'youtube'): string {
    const formatKey: string = typeof exportOptions === 'string' ? exportOptions : exportOptions.format

    if (!(formatKey in this.formats)) {
      throw new Error('Invalid format: ' + formatKey)
    }

    const template = this.formats[formatKey]
    const exceedsOneHour = this.chapters.at(-1)!.startTime > 3600

    return this.chapters.map((chapter, index) => {
      const startTime = template.enforceZeroStartTime && index === 0 && chapter.startTime !== 0 ? 0 : chapter.startTime

      let hours

      if (startTime > 3600 || template.hours === 'always' || (template.hours === 'whenOverOneHour' && exceedsOneHour)) {
        hours = true
      } else {
        hours = false
      }

      return template.string(chapter.title, secondsToTimestamp(startTime, { hours }))
    }).join('\n')
  }
}
