import { JSDOM } from 'jsdom'
import { indenter, secondsToTimestamp, timestampToSeconds } from '../util'
import { MatroskaXML } from './MatroskaXML'

export class AppleChapters extends MatroskaXML {
  supportsPrettyPrint = true
  filename = 'apple-chapters.xml'
  mimeType = 'text/xml'

  detect (inputString: string): boolean {
    return /^<\?xml/.test(inputString.trim()) && inputString.includes('<TextStream')
  }

  parse (string: string): void {
    if (!this.detect(string)) {
      throw new Error('Input needs xml declaration and a <TextStream...> node')
    }

    let dom
    /* istanbul ignore next */
    if (typeof DOMParser !== 'undefined') {
      /* istanbul ignore next */
      dom = (new DOMParser()).parseFromString(string, 'application/xml')
      /* istanbul ignore next */
    } else {
      /* istanbul ignore next */
      dom = new JSDOM(string, { contentType: 'application/xml' })
      /* istanbul ignore next */
      dom = dom.window.document
    }

    this.chapters = [...dom.querySelectorAll('TextSample')].map(chapter => {
      const title = String(chapter.getAttribute('text') ?? chapter.textContent)
      return {
        title,
        startTime: timestampToSeconds(String(chapter.getAttribute('sampleTime')))
      }
    })
  }

  toString (pretty: boolean = false, exportOptions: any = {}): string {
    const indent = indenter(pretty ? 2 : 0)

    const output = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<TextStream version="1.1">',
      indent(1, '<TextStreamHeader>'),
      indent(2, '<TextSampleDescription>'),
      indent(2, '</TextSampleDescription>'),
      indent(1, '</TextStreamHeader>')
    ]

    this.chapters.forEach(chapter => {
      const attrContent = exportOptions.acUseTextAttr && chapter.title ? ` text="${chapter.title}"` : ''
      const content = !exportOptions.acUseTextAttr && chapter.title ? chapter.title : ''

      output.push(indent(3, `<TextSample sampleTime="${secondsToTimestamp(chapter.startTime, { milliseconds: true })}"${attrContent}>${content}</TextSample>`))
    })

    output.push(
      '</TextStream>'
    )

    return output.join(pretty ? '\n' : '')
  }
}
