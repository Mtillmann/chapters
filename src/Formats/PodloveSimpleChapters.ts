import { Base } from './Base'
import { NPTToSeconds, indenter, secondsToNPT } from '../util'
import { type Chapter } from '../Types/Chapter'
import { XMLParser } from 'fast-xml-parser'

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

    if (typeof DOMParser !== 'undefined') {
      const dom = (new DOMParser()).parseFromString(string, 'application/xml')
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
    } else {
      const parsed = (new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_'
      })).parse(string)

      this.chapters = parsed.rss.channel.item['psc:chapters']['psc:chapter'].map((chapter: any) => {
        const item: Chapter = {
          startTime: NPTToSeconds(chapter['@_start'] as string)
        }

        if (chapter['@_title']) {
          item.title = chapter['@_title']
        }

        if (chapter['@_image']) {
          item.img = chapter['@_image']
        }

        if (chapter['@_href']) {
          item.url = chapter['@_href']
        }

        return item
      })
    }
  }

  toString (pretty = false): string {
    const indent = indenter(pretty ? 2 : 0)

    const output = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
      indent(1, '<channel>'),
      indent(2, '<!-- this is only a fragment of an rss feed, see -->'),
      indent(2, '<!-- https://podlove.org/simple-chapters/#:~:text=37%20seconds-,Embedding%20Example,-This%20is%20an -->'),
      indent(2, '<!-- for more information -->'),
      indent(2, '<atom:link type="text/html" href="http://podlove.org/" />'),
      indent(2, '<item>'),
      indent(3, '<psc:chapters version="1.2" xmlns:psc="http://podlove.org/simple-chapters">')
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

      output.push(indent(4, node.join('')))
    })

    output.push(
      indent(3, '</psc:chapters>'),
      indent(2, '</item>'),
      indent(1, '</channel>'),
      indent(0, '</rss>')
    )

    return output.join(pretty ? '\n' : '')
  }
}
