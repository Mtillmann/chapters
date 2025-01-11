import { MatroskaXML } from './MatroskaXML'
import { secondsToTimestamp, timestampToSeconds } from '../util'

export class MKVMergeXML extends MatroskaXML {
  supportsPrettyPrint = true
  filename = 'mkvmerge-chapters.xml'
  mimeType = 'text/xml'
  chapterStringNodeName = 'ChapterString'

  inputTimeToSeconds (string: string): number {
    string = string.replace(/\.(\d{3}).*$/, '.$1')
    return timestampToSeconds(string)
  }

  secondsToOutputTime (seconds: number): string {
    return secondsToTimestamp(seconds, { hours: true, milliseconds: true })
  }
}
