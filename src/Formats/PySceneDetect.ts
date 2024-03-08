import { Base } from './Base'
import { Int, secondsToTimestamp, timestampToSeconds } from '../util'

export class PySceneDetect extends Base {
  filename = 'psd-scenes.csv'
  mimeType = 'text/csv'

  detect (inputString: string): boolean {
    return ['Scene Number', 'Timecode Lis'].includes(inputString.trim().slice(0, 12))
  }

  parse (string: string): void {
    if (!this.detect(string)) {
      throw new Error('File must start with "Scene Number" or "Timecode List"')
    }

    const lines = string.split(/\r?\n/)
      .filter(line => line.trim().length > 0)
      .map(line => line.trim())

    if (/^Timecode/.test(lines[0])) {
      lines.shift()
    }
    lines.shift()

    this.chapters = lines.map(line => {
      const cols = line.split(',')

      return {
        startTime: timestampToSeconds(cols[2]),
        endTime: timestampToSeconds(cols[5])
      }
    })
  }

  toString (pretty = false, exportOptions: any = {}): string {
    const framerate = exportOptions.psdFramerate || 23.976
    const omitTimecodes = !!exportOptions.psdOmitTimecodes

    const lines = this.chapters.map((chapter, index) => {
      const next = this.chapters[index + 1]
      const endTime = next?.startTime || this.duration
      // use next chapter's start time for maximum native PySceneDetect compatibility
      const l = endTime - chapter.startTime

      return [
        index + 1, // Scene Number
        Math.round(chapter.startTime * framerate) + 1, // Start Frame
        secondsToTimestamp(chapter.startTime, { hours: true, milliseconds: true }), // Start Timecode
        Int(chapter.startTime * 1000), // Start Time (seconds)
        Math.round(endTime * framerate), // End Frame
        secondsToTimestamp(endTime, { hours: true, milliseconds: true }), // End Timecode
        Int(endTime * 1000), // End Time (seconds)
        Math.round((endTime - chapter.startTime) * framerate), // Length (frames)
        secondsToTimestamp(l, { hours: true, milliseconds: true }), // Length (timecode)
        Int(Math.ceil(l * 1000))// Length (seconds)
      ]
    })

    const tl = 'Timecode List:' + lines.slice(1).map(l => l[2]).join(',')

    const outputLines: string[] = lines.map(l => l.join(','))

    outputLines.unshift('Scene Number,Start Frame,Start Timecode,Start Time (seconds),End Frame,End Timecode,End Time (seconds),Length (frames),Length (timecode),Length (seconds)')

    if (!omitTimecodes) {
      outputLines.unshift(tl)
    }

    return outputLines.join('\n')
  }
}
