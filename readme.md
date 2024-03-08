![tests](https://github.com/Mtillmann/chapters/actions/workflows/tests.yaml/badge.svg?event=push)

# chapters

Create, manage and convert chapters for 17 chapters formats:

| class                               | description                  | key            | ext    | info                                                                                                                                                               |
|-------------------------------------|------------------------------|----------------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ChaptersJson | Podcasting 2.0 Chapters      | chaptersjson   | `json` | [spec](https://github.com/Podcastindex-org/podcast-namespace/blob/main/chapters/jsonChapters.md)                                                                   |
| FFMetadata | FFMetadata                   | ffmpegdata     | `txt`  | [spec](https://ffmpeg.org/ffmpeg-formats.html#Metadata-1)                                                                                                          |
| MatroskaXML | Matroska XML chapters        | matroskaxml    | `xml`  | [spec](https://www.matroska.org/technical/chapters.html)                                                                                                           |
| MKVMergeXML | MKVToolNix mkvmerge XML      | mkvmergexml    | `xml`  | [spec](https://mkvtoolnix.download/doc/mkvmerge.html#mkvmerge.chapters)                                                                                            |
| MKVMergeSimple | MKVToolNix mkvmerge _simple_ | mkvmergesimple | `txt`  | [spec](https://mkvtoolnix.download/doc/mkvmerge.html#mkvmerge.chapters)                                                                                            |
| WebVTT | WebVTT Chapters              | webvtt         | `vtt`  | [spec](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)                                                                                                |
| Youtube | Youtube Chapter Syntax       | youtube        | `txt`  |                                                                                                                                                                    |
| FFMpegInfo | FFMpegInfo                   | ffmpeginfo     | `txt`  | read only, used internally                                                                                                                                         |
| PySceneDetect | PySceneDetect                | pyscenedetect  | `csv`  | [project home](https://github.com/Breakthrough/PySceneDetect)                                                                                                      |
| VorbisComment | Vorbis Comment Format        | vorbiscomment  | `txt`  | [spec](https://wiki.xiph.org/Chapter_Extension)                                                                                                                    |
| AppleChapters | "Apple Chapters"             | applechapters  | `xml`  | [source](https://github.com/rigaya/NVEnc/blob/master/NVEncC_Options.en.md#--chapter-string:~:text=CHAPTER03NAME%3Dchapter%2D3-,apple%20format,-(should%20be%20in)) |
| ShutterEDL | Shutter EDL                  | edl            | `edl`  | [source](https://github.com/paulpacifico/shutter-encoder/blob/f3d6bb6dfcd629861a0b0a50113bf4b062e1ba17/src/application/SceneDetection.java)                        |
| PodloveSimpleChapters | Podlove Simple Chapters      | psc            | `xml`  | [spec](https://podlove.org/simple-chapters/)                                                                                                                       |
| PodloveJson | Podlove Simple Chapters JSON | podlovejson    | `json` | [source](https://github.com/podlove/chapters#:~:text=org/%3E-,Encode%20to%20JSON,-iex%3E%20Chapters)                                                               |
| MP4Chaps | MP4Chaps                     | mp4chaps       | `txt`  | [source](https://github.com/podlove/chapters#:~:text=%3Achapters%3E-,Encode%20to%20mp4chaps,-iex%3E%20Chapters)                                                    |
| AppleHLS | Apple HLS Chapters           | applehls       | `json` | [spec](https://developer.apple.com/documentation/http-live-streaming/providing-javascript-object-notation-json-chapters), partial support                          |
| Scenecut | Scenecut                     | scenecut       | `json` | [source](https://github.com/slhck/scenecut-extractor#:~:text=cuts%20in%20JSON-,format,-%3A)                                                                        |

## Installation

`npm i @mtillmann/chapters`

## Usage

```javascript
import { ChaptersJson } from '@mtillmann/chapters';

const chapters = new ChaptersJson()
chapters.add({ startTime: 0, title: 'Intro' })
chapters.add({ startTime: 30, title: 'Some Topic' })
const json = chapters.toString()
```

## Autoformat

`Autoformat` is a helper that can be used to automatically detect the format of a given input and return the corresponding class,
key or a new instance of the detected class. It also provides a method to convert the input to a specific format.

```javascript
import { Autoformat } from '@mtillmann/chapters'
import { WebVTT } from '@mtillmann/chapters'

const content = '<podcasting 2.0 chapters.json>...'
const instance = Autoformat.detect(content) // returns an instance of ChaptersJson
const instance2 = Autoformat.from(content) // returns an instance of ChaptersJson

const key = Autoformat.detect(content, 'key') // returns 'chaptersjson'
const className = Autoformat.detect(content, 'class') // returns ChaptersJson

const webVttString = 'WEBVTT...';

const autodetectedWebVtt = Autoformat.detect(webVttString) // returns an instance of WebVTT

const fail = Autoformat.as('chaptersjson', webVttString) // throws an error

const vtt = Autoformat.as('webvtt', webVttString) // returns an instance of WebVTT
const vtt2 = Autoformat.as(WebVTT, webVttString) // returns an instance of WebVTT
```

## API

All formats support the following methods:

### `static create (input?: string | MediaItem): MediaItem`

Creates a new media item. This is the suggested way to create a media item:

### `from (input?: string | MediaItem): MediaItem`

Populates the media item's chapters from the given input.

### `to (className: any): MediaItem`

Converts the media item to another format.

### `add (chapter: Chapter): void`

Adds a chapter.

### `addChapterAt (index: number, chapter: object = {}): number`

Adds a chapter at the given index.

### `addChapterAtTime (time: number | string, chapter: object = {}): boolean`

Adds a chapter at the given time.

### `remove (index: number): void`

Removes the chapter at the given index.

### `bump (keepDuration: boolean = false): void`

Updates the chapters and duration. Called automatically after adding or removing chapters.

### `endTime (index: number): number`

Returns the end time for the chapter at the given index.

### `expandFirstToStart (): void`

Expands the first chapter to start at 0.

### `applyChapterMinLength (seconds: number): object`

Applies a minimum length to the chapters.

### `chapterExistsAtStartTime (time: number): boolean`

Checks if a chapter exists at the given start time.

### `updateChapterStartTime (index: number, startTime: number | string): number | 'timeInUse'`

Updates the start time for the chapter at the given index.

### `chapterIndexFromStartTime (startTime: number | string): number`

Returns the index of the chapter with the given start time.

### `chapterIndexFromTime (time: number | string): null | number`

Returns the index of the chapter at the given time.

### `toString([pretty: boolean][, options: object]): string`

Convert the chapters to a string.
If `pretty` is `true`, the output will be formatted for better readability. Only supported by `json` and `xml` formats.
`options` is an optional argument, containing format specific, optional options:

#### ChapterJson

| option              | type      | default | description                                                                                                                                                      |
|---------------------|-----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `imagePrefix`       | `string`  | `''`    | Prefix for image URLs                                                                                                                                            |
| `writeRedundantToc` | `boolean` | `false` | Write [redundant](https://github.com/Podcastindex-org/podcast-namespace/blob/main/chapters/jsonChapters.md#:~:text=or%20not%20present%20at%20all) TOC attributes |
| `writeEndTimes`     | `boolean` | `false` | Write end times                                                                                                                                                  |

#### AppleChapters

| option          | type      | default | description                                               |
|-----------------|-----------|---------|-----------------------------------------------------------|
| `acUseTextAttr` | `boolean` | `false` | When set, the text-attribute will be used instead of node  textContent     |

#### PySceneDetect

| option             | type     | default  | description                              |
|--------------------|----------|----------|------------------------------------------|
| `psdFramerate`     | `number` | `23.976` | Framerate of the video file              |
| `psdOmitTimecodes` | `boolen` | `false`  | When set, the first line will be omitted |

#### Scenecut

| option | type     | default | description                 |
|--------|----------|---------|-----------------------------|
| `frameRate` | `number` | `30`    | Framerate of the video file |
| `ptsScale`  | `number` | `1`     | PTS scale (See below)       |
| `score`     | `number` | `0.5`   | Score threshold             |

When asked about the `ptsScale`-value, ChatGPT said:
> The number "1001" in the context of video processing and multimedia, especially in relation to frame rates and timecodes, is often associated with the NTSC color system used in North America and Japan.
> In this system, the frame rate is often described as "29.97 frames per second", but it's technically 30000/1001 frames per second, which is approximately 29.97 but not exactly. This is known as a "drop frame" rate, and the "1001" comes from this fractional frame rate.

When you use `1` the output `pts` will be the same as the `frame` number. When you use `1001` the output `pts` will be the same as the `frame` number multiplied by `1001`.
