import i18nStrings from './cs'

export function __ (str) {
  return i18nStrings[str] || str
}
