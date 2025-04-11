import { AppleChapters } from './AppleChapters'
import { ChaptersJson } from './ChaptersJson'
import { FFMetadata } from './FFMetadata'
import { FFMpegInfo } from './FFMpegInfo'
import { MKVMergeSimple } from './MKVMergeSimple'
import { MKVMergeXML } from './MKVMergeXML'
import { MatroskaXML } from './MatroskaXML'
import { PySceneDetect } from './PySceneDetect'
import { VorbisComment } from './VorbisComment'
import { WebVTT } from './WebVTT'
import { Youtube } from './Youtube'
import { ShutterEDL } from './ShutterEDL'
import { PodloveSimpleChapters } from './PodloveSimpleChapters'
import { MP4Chaps } from './MP4Chaps'
import { PodloveJson } from './PodloveJson'
import { AppleHLS } from './AppleHLS'
import { Scenecut } from './Scenecut'
import { Audible } from './Audible'
import { Podigee } from './Podigee'
import { type MediaItem } from '../Types/MediaItem'
import { PodigeeText } from './PodigeeText'
import { ShowNotes } from './ShowNotes'
import { SpotifyA } from './SpotifyA'
import { SpotifyB } from './SpotifyB'
import { PodcastPage } from './PodcastPage'
import { TransistorFM } from './TransistorFM'

const classMap: Record<string, any> = {
  chaptersjson: ChaptersJson,
  ffmetadata: FFMetadata,
  matroskaxml: MatroskaXML,
  mkvmergexml: MKVMergeXML,
  mkvmergesimple: MKVMergeSimple,
  webvtt: WebVTT,
  youtube: Youtube,
  ffmpeginfo: FFMpegInfo,
  pyscenedetect: PySceneDetect,
  vorbiscomment: VorbisComment,
  applechapters: AppleChapters,
  shutteredl: ShutterEDL,
  psc: PodloveSimpleChapters,
  mp4chaps: MP4Chaps,
  podlovejson: PodloveJson,
  applehls: AppleHLS,
  scenecut: Scenecut,
  audible: Audible,
  podigee: Podigee,
  podigeetext: PodigeeText,
  shownotes: ShowNotes,
  spotifya: SpotifyA,
  spotifyb: SpotifyB,
  podcastpage: PodcastPage,
  transistorfm: TransistorFM
}

export const AutoFormat = {
  classMap,
  detect (inputString: string, returnWhat: 'instance' | 'key' | 'class' = 'instance'): any {
    let detected: any

    for (const [key, className] of Object.entries(this.classMap)) {
      try {
        detected = className.create(inputString)
        if (detected) {
          if (returnWhat === 'class') {
            return className
          } else if (returnWhat === 'key') {
            return key
          }

          return detected
        }
      } catch (e) {

        // do nothing
      }
    }

    if (!detected) {
      throw new Error('failed to detect type of given input :(')
    }
  },

  from (inputString: string): MediaItem {
    return this.detect(inputString)
  },

  as (classKeyOrClass: any, input: string): MediaItem {
    if (typeof classKeyOrClass === 'string') {
      if (!(classKeyOrClass in this.classMap)) {
        throw new Error(`invalid class key "${classKeyOrClass}"`)
      }
      return this.classMap[classKeyOrClass].create(input)
    }

    return classKeyOrClass.create(input)
  }

}
