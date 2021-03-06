import { Document } from "@oozcitak/dom/lib/dom/interfaces"
import { DOMImplementation } from "@oozcitak/dom"
import { dom } from "@oozcitak/dom/lib/dom"
import { isString } from '@oozcitak/util'

dom.setFeatures(false)

/**
 * Creates an XML document without any child nodes.
 */
export function createDocument(): Document {
  const impl = new DOMImplementation()
  const doc = impl.createDocument(null, 'root', null)
  /* istanbul ignore else */
  if (doc.documentElement) {
    doc.removeChild(doc.documentElement)
  }
  return doc
}

export function sanitizeInput(str: string,
  replacement?: string | ((char: string, offset: number, str: string) => string)): string
export function sanitizeInput(str: string | null,
  replacement?: string | ((char: string, offset: number, str: string) => string)): string | null
export function sanitizeInput(str: string | null | undefined,
  replacement?: string | ((char: string, offset: number, str: string) => string)): string | null | undefined

/**
 * Sanitizes input strings with user supplied replacement characters.
 * 
 * @param str - input string
 * @param replacement - replacement character or function
 */
export function sanitizeInput(str: any,
  replacement?: string | ((char: string, offset: number, str: string) => string)): any {
  if (str == null) {
    return str
  } else if (replacement === undefined) {
    return str + ""
  } else {
    let result = ""
    str = str + ""
    for (let i = 0; i < str.length; i++) {
      let n = str.charCodeAt(i)

      // #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
      if (n === 0x9 || n === 0xA || n === 0xD ||
        (n >= 0x20 && n <= 0xD7FF) ||
        (n >= 0xE000 && n <= 0xFFFD)) {
        // valid character - not surrogate pair
        result += str.charAt(i)
      } else if (n >= 0xD800 && n <= 0xDBFF && i < str.length - 1) {
        const n2 = str.charCodeAt(i + 1)
        if (n2 >= 0xDC00 && n2 <= 0xDFFF) {
          // valid surrogate pair
          n = (n - 0xD800) * 0x400 + n2 - 0xDC00 + 0x10000
          result += String.fromCodePoint(n)
          i++
        } else {
          // invalid lone surrogate
          result += isString(replacement) ? replacement : replacement(str.charAt(i), i, str)
        }
      } else {
        // invalid character
        result += isString(replacement) ? replacement : replacement(str.charAt(i), i, str)
      }
    }

    return result
  }
}
