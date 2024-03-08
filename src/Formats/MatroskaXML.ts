import { Float, Int, indenter } from '../util'
import { Base } from './Base'
import { JSDOM } from 'jsdom'

export class MatroskaXML extends Base {
  supportsPrettyPrint = true
  filename = 'matroska-chapters.xml'
  mimeType = 'text/xml'

  chapterStringNodeName = 'ChapString'
  inputTimeToSeconds (string: string): number {
    return Float(string) / 1e9
  };

  secondsToOutputTime (seconds: number): string {
    return String(Int(String(seconds * 1e9)))
  };

  detect (inputString: string): boolean {
    return /^<\?xml/.test(inputString.trim()) && inputString.includes('<Chapters>') && inputString.includes(`<${this.chapterStringNodeName}>`)
  }

  parse (string: string): void {
    if (!this.detect(string)) {
      throw new Error('Input needs xml declaration and a <Chapters> node')
    }

    let dom
    if (typeof DOMParser !== 'undefined') {
      dom = (new DOMParser()).parseFromString(string, 'application/xml')
      /* istanbul ignore next */
    } else {
      /* istanbul ignore next */
      dom = new JSDOM(string, { contentType: 'application/xml' })
      /* istanbul ignore next */
      dom = dom.window.document
    }

    this.chapters = [...dom.querySelectorAll('ChapterAtom')].map(chapter => {
      return {
        title: String(chapter.querySelector(this.chapterStringNodeName)?.textContent),
        startTime: this.inputTimeToSeconds(String(chapter.querySelector('ChapterTimeStart')?.textContent)),
        endTime: this.inputTimeToSeconds(String(chapter.querySelector('ChapterTimeEnd')?.textContent))
      }
    })
  }

  toString (pretty: boolean = false): string {
    const indent = indenter(pretty ? 2 : 0)

    const output = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<!DOCTYPE Chapters SYSTEM "matroskachapters.dtd">',
      '<Chapters>',
      indent(1, '<EditionEntry>'),
      indent(2, `<EditionUID>${Date.now()}${Int(Math.random() * 1e6)}</EditionUID>`)
    ]

    this.chapters.forEach((chapter, index: number) => {
      output.push(indent(2, '<ChapterAtom>'))
      output.push(indent(3, `<ChapterTimeStart>${this.secondsToOutputTime(chapter.startTime)}</ChapterTimeStart>`))
      output.push(indent(3, `<ChapterTimeEnd>${this.secondsToOutputTime(chapter.endTime!)}</ChapterTimeEnd>`))
      output.push(indent(3, `<ChapterUID>${Int(1 + chapter.startTime)}${Int(Math.random() * 1e6)}</ChapterUID>`))
      output.push(indent(3, '<ChapterDisplay>'))
      output.push(indent(4, `<${this.chapterStringNodeName}>${this.ensureTitle(index)}</${this.chapterStringNodeName}>`))
      output.push(indent(3, '</ChapterDisplay>'))
      output.push(indent(2, '</ChapterAtom>'))
    })

    output.push(
      indent(1, '</EditionEntry>'),
      '</Chapters>'
    )

    return output.join(pretty ? '\n' : '')
  }
}
