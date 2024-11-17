import crypto from 'crypto-js'

export type HashMode =
  | 'MD5'
  | 'SHA1'
  | 'SHA224'
  | 'SHA256'
  | 'SHA384'
  | 'SHA512'
  | 'SHA3'
  | 'RIPEMD160'

export const modeMap: HashMode[] = [
  'MD5',
  'SHA1',
  'SHA224',
  'SHA256',
  'SHA512',
  'SHA3',
  'RIPEMD160',
]

export function hash(text: string, mode: HashMode) {
  return crypto[mode](text).toString()
}

export function hmac(text: string, key: string, mode: HashMode) {
  const hmacMode:
    | 'HmacMD5'
    | 'HmacSHA1'
    | 'HmacSHA224'
    | 'HmacSHA256'
    | 'HmacSHA384'
    | 'HmacSHA512'
    | 'HmacSHA3'
    | 'HmacRIPEMD160' = `Hmac${mode}`
  return crypto[hmacMode](text, key).toString()
}
