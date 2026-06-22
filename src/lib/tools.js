import {
  removeMultipleSpaces,
  removeEmptyLines,
  trimLines,
  removeAccents,
  removeNumbers,
  removeSpecialChars,
  removeEmojis,
  toUpperCase,
  toLowerCase,
  toTitleCase,
  capitalizeSentences,
  toSlug,
  toSnakeCase,
  toCamelCase,
  toPascalCase,
  reverseText,
  reverseWords,
  toBase64,
  fromBase64,
  toMockingCase
} from '../lib/textUtils'

export const cleaners = [
  { id: 'remove-multi-spaces', label: 'Quitar espacios múltiples', fn: removeMultipleSpaces, icon: '↔️' },
  { id: 'remove-empty-lines', label: 'Quitar líneas vacías', fn: removeEmptyLines, icon: '🗑️' },
  { id: 'trim-lines', label: 'Recortar espacios', fn: trimLines, icon: '✂️' },
  { id: 'remove-accents', label: 'Quitar tildes', fn: removeAccents, icon: 'á→a' },
  { id: 'remove-numbers', label: 'Quitar números', fn: removeNumbers, icon: '🔢' },
  { id: 'remove-symbols', label: 'Quitar símbolos', fn: removeSpecialChars, icon: '❇' },
  { id: 'remove-emojis', label: 'Quitar emojis', fn: removeEmojis, icon: '😀' },
]

export const converters = [
  { id: 'to-upper', label: 'MAYÚSCULAS', fn: toUpperCase },
  { id: 'to-lower', label: 'minúsculas', fn: toLowerCase },
  { id: 'title-case', label: 'Tipo Título', fn: toTitleCase },
  { id: 'capitalize', label: 'Capitalizar', fn: capitalizeSentences },
  { id: 'to-slug', label: 'slug-case', fn: toSlug },
  { id: 'to-snake', label: 'snake_case', fn: toSnakeCase },
  { id: 'to-camel', label: 'camelCase', fn: toCamelCase },
  { id: 'to-pascal', label: 'PascalCase', fn: toPascalCase },
  { id: 'reverse-text', label: 'Invertir Texto', fn: reverseText },
  { id: 'reverse-words', label: 'Invertir Palabras', fn: reverseWords },
  { id: 'to-base64', label: 'A Base64', fn: toBase64 },
  { id: 'from-base64', label: 'De Base64', fn: fromBase64 },
  { id: 'mocking-case', label: 'Mocking Case', fn: toMockingCase },
]
