import { MKVMergeSimple } from './MKVMergeSimple'

export class VorbisComment extends MKVMergeSimple {
  filename = 'vorbis-comment.txt'
  mimeType = 'text/plain'

  zeroPad: number = 3
}
