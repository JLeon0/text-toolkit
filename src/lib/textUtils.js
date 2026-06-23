export const removeMultipleSpaces = (str) => str.replace(/[ \t]+/g, ' ').trim()

export const removeEmptyLines = (str) => {
  return str.replace(/^\s*[\r\n]/gm, '').trim()
}

export const trimLines = (str) => {
  return str.split('\n')
    .map(line => line.trim())
    .join('\n')
    .trim()
}

export const toLowerCase = (str) => str.toLowerCase()
export const toUpperCase = (str) => str.toUpperCase()

export const capitalizeSentences = (str) => {
  return str.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase())
}

export const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const removeNumbers = (str) => str.replace(/[0-9]/g, '')

export const removeSpecialChars = (str) => str.replace(/[^\w\sñáéíóúü]/gi, '')

export const removeEmojis = (str) => {
  return str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
}

export const toTitleCase = (str) => {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())
}

export const toBase64 = (str) => {
  try {
    return btoa(unescape(encodeURIComponent(str)))
  } catch (e) {
    return 'Error al codificar a Base64'
  }
}

export const fromBase64 = (str) => {
  try {
    return decodeURIComponent(escape(atob(str)))
  } catch (e) {
    return 'Error: El texto no es un Base64 válido'
  }
}

export const reverseWords = (str) => {
  return str.split(/(\s+)/).reverse().join('')
}

export const toMockingCase = (str) => {
  return str.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('')
}

export const toSlug = (str) => {
  return str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s\-_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '')
}

export const toSnakeCase = (str) => {
  return str.toLowerCase()
    .replace(/[\s\-]+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/^_+|_+$/g, '')
}

export const toCamelCase = (str) => {
  return str.toLowerCase()
    .replace(/[\s\-_]+([a-z0-9])/g, (_, char) => char.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/^[A-Z]/, char => char.toLowerCase())
}

export const toPascalCase = (str) => {
  const camel = toCamelCase(str)
  if (!camel) return ''
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

export const reverseText = (str) => {
  return str.split('').reverse().join('')
}

export const getStats = (str) => {
  const chars = str.length
  const charsNoSpaces = str.replace(/\s/g, '').length
  const words = str.trim() === '' ? 0 : str.trim().split(/\s+/).length
  const lines = str.trim() === '' ? 0 : str.split('\n').length
  const paragraphs = str.trim() === '' ? 0 : str.split(/\n\s*\n/).filter(p => p.trim() !== '').length
  const readingTime = (words / 200).toFixed(1)

  return {
    chars,
    charsNoSpaces,
    words,
    lines,
    paragraphs,
    readingTime
  }
}

export const getWordCloud = (str) => {
  const stopwords = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'a', 'de', 'en', 'que', 'the', 'and', 'for', 'with', 'this', 'that', 'with', 'from'])
  const words = str.toLowerCase().match(/[a-záéíóúñü0-9]{3,}/gi) || []
  const freq = {}

  words.forEach(w => {
    if (!stopwords.has(w)) {
      freq[w] = (freq[w] || 0) + 1
    }
  })

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
}

export const formatJson = (str) => {
  try {
    return JSON.stringify(JSON.parse(str), null, 2)
  } catch (e) {
    return 'Error: JSON no válido'
  }
}

export const csvToTable = (str) => {
  try {
    const lines = str.trim().split('\n')
    if (lines.length === 0) return ''
    const rows = lines.map(line => line.split(',').map(c => c.trim()))
    const html = ['<table>']
    html.push('<thead><tr>' + rows[0].map(c => `<th>${c}</th>`).join('') + '</tr></thead>')
    html.push('<tbody>')
    for (let i = 1; i < rows.length; i++) {
      html.push('<tr>' + rows[i].map(c => `<td>${c}</td>`).join('') + '</tr>')
    }
    html.push('</tbody></table>')
    return html.join('\n')
  } catch (e) {
    return 'Error: CSV no válido'
  }
}

import { marked } from 'marked'

export const markdownToHtml = (str) => {
  try {
    return marked.parse(str, { breaks: true })
  } catch (e) {
    return 'Error al convertir Markdown'
  }
}

export const sortLinesAsc = (str) => {
  return str.split('\n').sort((a, b) => a.localeCompare(b)).join('\n')
}

export const sortLinesDesc = (str) => {
  return str.split('\n').sort((a, b) => b.localeCompare(a)).join('\n')
}

export const sortLinesRandom = (str) => {
  const lines = str.split('\n')
  for (let i = lines.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lines[i], lines[j]] = [lines[j], lines[i]]
  }
  return lines.join('\n')
}

export const removeDuplicateLines = (str) => {
  const seen = new Set()
  return str.split('\n').filter(line => {
    const trimmed = line.trim()
    if (seen.has(trimmed)) return false
    seen.add(trimmed)
    return true
  }).join('\n')
}

export const urlEncode = (str) => {
  try { return encodeURIComponent(str) } catch (e) { return 'Error al codificar URL' }
}

export const urlDecode = (str) => {
  try { return decodeURIComponent(str) } catch (e) { return 'Error: URL no válida' }
}
