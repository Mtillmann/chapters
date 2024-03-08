import { type Chapter } from '../Types/Chapter'
import { Float } from '../util'
import { Base } from './Base'

export class Scenecut extends Base {
  filename = 'scene-cuts.json'
  mimeType = 'application/json'

  frameRate = 30

  /**
     * The number "1001" in the context of video processing and multimedia, especially in relation to frame rates and timecodes, is often associated with the NTSC color system used in North America and Japan.
     * In this system, the frame rate is often described as "29.97 frames per second", but it's technically 30000/1001 frames per second, which is approximately 29.97 but not exactly. This is known as a "drop frame" rate, and the "1001" comes from this fractional frame rate.
    */
  ptsScale = 1
  score = 0.5

  test (data: object[]): { errors: string[] } {
    if (!Array.isArray(data)) {
      return { errors: ['JSON Structure: must be an array'] }
    }

    if (data.length === 0) {
      return { errors: ['JSON Structure: must not be empty'] }
    }

    if (!data.every(chapter => 'pts_time' in chapter)) {
      return { errors: ['JSON Structure: every chapter must have a start property'] }
    }

    return { errors: [] }
  }

  parse (string: string): void {
    const data = JSON.parse(string)
    const { errors } = this.test(data as object[])
    if (errors.length > 0) {
      throw new Error(errors.join(''))
    }

    this.chapters = data.map((raw: any): Chapter => {
      const chapter: Chapter = {
        startTime: Float(raw.pts_time)
      }

      this.frameRate = raw.pts / raw.pts_time
      return chapter
    })
  }

  toString (pretty = false, exportOptions = { }): string {
    const frameRate: number = Float('frameRate' in exportOptions ? exportOptions.frameRate : this.frameRate)
    const ptsScale: number = Float('ptsScale' in exportOptions ? exportOptions.ptsScale : this.ptsScale)
    const score: number = Float('score' in exportOptions ? exportOptions.score : this.score)

    return JSON.stringify(this.chapters.map(chapter => ({
      frame: Math.round(chapter.startTime * frameRate),
      pts: Math.round(chapter.startTime * frameRate * ptsScale).toFixed(3),
      pts_time: chapter.startTime,
      score
    })), null, pretty ? 2 : 0)
  }
}
