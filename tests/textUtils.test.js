import { describe, it, expect } from 'vitest'
import {
  removeMultipleSpaces,
  removeEmptyLines,
  trimLines,
  toLowerCase,
  toUpperCase,
  capitalizeSentences,
  removeAccents,
  removeNumbers,
  removeSpecialChars,
  removeEmojis,
  toTitleCase,
  toBase64,
  fromBase64,
  reverseWords,
  toMockingCase,
  toSlug,
  toSnakeCase,
  toCamelCase,
  toPascalCase,
  reverseText,
  getStats,
  getWordCloud,
  formatJson,
  csvToTable,
  markdownToHtml,
  sortLinesAsc,
  sortLinesDesc,
  sortLinesRandom,
  removeDuplicateLines,
  urlEncode,
  urlDecode
} from '../src/lib/textUtils'

describe('removeMultipleSpaces', () => {
  it('collapses multiple spaces', () => {
    expect(removeMultipleSpaces('hola   mundo')).toBe('hola mundo')
  })
  it('trims result', () => {
    expect(removeMultipleSpaces('  hola  ')).toBe('hola')
  })
})

describe('removeEmptyLines', () => {
  it('removes blank lines', () => {
    expect(removeEmptyLines('a\n\nb\n')).toBe('a\nb')
  })
})

describe('trimLines', () => {
  it('trims each line', () => {
    expect(trimLines('  a  \n  b  ')).toBe('a\nb')
  })
})

describe('toLowerCase', () => {
  it('converts to lowercase', () => {
    expect(toLowerCase('HOLA')).toBe('hola')
  })
})

describe('toUpperCase', () => {
  it('converts to uppercase', () => {
    expect(toUpperCase('hola')).toBe('HOLA')
  })
})

describe('capitalizeSentences', () => {
  it('capitalizes after dot', () => {
    expect(capitalizeSentences('hola. qué tal')).toBe('Hola. Qué tal')
  })
})

describe('removeAccents', () => {
  it('removes accents', () => {
    expect(removeAccents('áéíóúñ')).toBe('aeioun')
  })
})

describe('removeNumbers', () => {
  it('removes digits', () => {
    expect(removeNumbers('abc123')).toBe('abc')
  })
})

describe('removeSpecialChars', () => {
  it('removes punctuation', () => {
    expect(removeSpecialChars('hola, mundo!')).toBe('hola mundo')
  })
})

describe('removeEmojis', () => {
  it('removes emoji', () => {
    expect(removeEmojis('hola 😀')).toBe('hola ')
  })
})

describe('toTitleCase', () => {
  it('capitalizes each word', () => {
    expect(toTitleCase('hola mundo')).toBe('Hola Mundo')
  })
})

describe('toBase64', () => {
  it('encodes to base64', () => {
    expect(toBase64('hola')).toBe('aG9sYQ==')
  })
})

describe('fromBase64', () => {
  it('decodes base64', () => {
    expect(fromBase64('aG9sYQ==')).toBe('hola')
  })
  it('returns error on invalid', () => {
    expect(fromBase64('!!!')).toBe('Error: El texto no es un Base64 válido')
  })
})

describe('reverseWords', () => {
  it('reverses word order', () => {
    expect(reverseWords('hola mundo')).toBe('mundo hola')
  })
})

describe('toMockingCase', () => {
  it('alternates case', () => {
    expect(toMockingCase('hola')).toBe('hOlA')
  })
})

describe('toSlug', () => {
  it('converts to slug', () => {
    expect(toSlug('Hola Mundo!')).toBe('hola-mundo')
  })
})

describe('toSnakeCase', () => {
  it('converts to snake_case', () => {
    expect(toSnakeCase('hola mundo')).toBe('hola_mundo')
  })
})

describe('toCamelCase', () => {
  it('converts to camelCase', () => {
    expect(toCamelCase('hola mundo')).toBe('holaMundo')
  })
})

describe('toPascalCase', () => {
  it('converts to PascalCase', () => {
    expect(toPascalCase('hola mundo')).toBe('HolaMundo')
  })
  it('handles empty string', () => {
    expect(toPascalCase('')).toBe('')
  })
})

describe('reverseText', () => {
  it('reverses characters', () => {
    expect(reverseText('hola')).toBe('aloh')
  })
})

describe('getStats', () => {
  it('counts chars, words, lines', () => {
    const r = getStats('hola mundo\nadios')
    expect(r.chars).toBe(16)
    expect(r.words).toBe(3)
    expect(r.lines).toBe(2)
    expect(r.readingTime).toBe('0.0')
  })
  it('handles empty', () => {
    const r = getStats('')
    expect(r.chars).toBe(0)
    expect(r.words).toBe(0)
  })
})

describe('getWordCloud', () => {
  it('returns top words', () => {
    const r = getWordCloud('hola hola hola mundo')
    expect(r[0]).toEqual(['hola', 3])
  })
})

describe('sortLinesAsc', () => {
  it('sorts lines A-Z', () => {
    expect(sortLinesAsc('c\na\nb')).toBe('a\nb\nc')
  })
})

describe('sortLinesDesc', () => {
  it('sorts lines Z-A', () => {
    expect(sortLinesDesc('a\nb\nc')).toBe('c\nb\na')
  })
})

describe('sortLinesRandom', () => {
  it('returns same number of lines', () => {
    const r = sortLinesRandom('a\nb\nc\nd\ne')
    expect(r.split('\n').length).toBe(5)
  })
})

describe('removeDuplicateLines', () => {
  it('removes duplicate lines', () => {
    expect(removeDuplicateLines('a\nb\na\nc')).toBe('a\nb\nc')
  })
})

describe('urlEncode', () => {
  it('encodes URL', () => {
    expect(urlEncode('hola mundo')).toBe('hola%20mundo')
  })
})

describe('urlDecode', () => {
  it('decodes URL', () => {
    expect(urlDecode('hola%20mundo')).toBe('hola mundo')
  })
})

describe('formatJson', () => {
  it('formats valid JSON', () => {
    expect(formatJson('{"a":1}')).toBe('{\n  "a": 1\n}')
  })
  it('returns error on invalid', () => {
    expect(formatJson('{')).toBe('Error: JSON no válido')
  })
})

describe('csvToTable', () => {
  it('converts CSV to HTML table', () => {
    const r = csvToTable('a,b\n1,2')
    expect(r).toContain('<table>')
    expect(r).toContain('<th>a</th>')
    expect(r).toContain('<td>1</td>')
  })
})
