import { Base } from './Base'
import { JSDOM } from 'jsdom'
import { NPTToSeconds, indenter, secondsToNPT } from '../util'
import { type Chapter } from '../Types/Chapter'

export class PodloveSimpleChapters extends Base {
  supportsPrettyPrint = true
  filename = 'podlove-simple-chapters-fragment.xml'
  mimeType = 'text/xml'

  detect (inputString: string): boolean {
    return inputString.includes('<psc:chapters')
  }

  parse (string: string): void {
    if (!this.detect(string)) {
      throw new Error('Input must contain <psc:chapters ...> node')
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

    this.chapters = [...dom.querySelectorAll('[start]')].reduce((acc: Chapter[], node) => {
      if (node.tagName === 'psc:chapter') {
        const start = node.getAttribute('start')
        const title = node.getAttribute('title')
        const image = node.getAttribute('image')
        const href = node.getAttribute('href')

        const chapter: Chapter = {
          startTime: NPTToSeconds(start!)
        }

        if (title) {
          chapter.title = title
        }
        if (image) {
          chapter.img = image
        }
        if (href) {
          chapter.url = href
        }

        acc.push(chapter)
      }
      return acc
    }, [])
  }

  toString (pretty = false): string {
    const indent = indenter(pretty ? 2 : 0)

    const output = [
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
      indent(1, '<channel>'),
      indent(2, '<!-- this is only a fragment of an rss feed, see -->'),
      indent(2, '<!-- https://podlove.org/simple-chapters/#:~:text=37%20seconds-,Embedding%20Example,-This%20is%20an -->'),
      indent(2, '<!-- for more information -->'),
      indent(2, '<psc:chapters version="1.2" xmlns:psc="http://podlove.org/simple-chapters">')
    ]

    this.chapters.forEach(chapter => {
      const node = [
                `<psc:chapter start="${secondsToNPT(chapter.startTime)}"`
      ]

      if (chapter.title) {
        node.push(` title="${chapter.title}"`)
      }
      if (chapter.img) {
        node.push(` image="${chapter.img}"`)
      }
      if (chapter.url) {
        node.push(` href="${chapter.url}"`)
      }
      node.push('/>')

      output.push(indent(3, node.join('')))
    })

    output.push(
      indent(2, '</psc:chapters>'),
      indent(1, '</channel>'),
      indent(0, '</rss>')
    )

    return output.join(pretty ? '\n' : '')
  }
}
