import crypot from 'crypto-js'

export type CryptoFormat =
  | 'AES'
  | 'DES'
  | 'RC4'
  | 'Blowfish'
  | 'RC4Drop'
  | 'TripleDES'
  | 'Rabbit'
  | 'RabbitLegacy'
export const cryptoFormatMap: CryptoFormat[] = [
  'AES',
  'DES',
  'RC4',
  'Blowfish',
  'RC4Drop',
  'TripleDES',
  'Rabbit',
  'RabbitLegacy',
]

export function encrypt(text: string, key: string, format: CryptoFormat) {
  return crypot[format].encrypt(text, key).toString()
}

export function decrypt(text: string, key: string, format: CryptoFormat) {
  return crypot[format].decrypt(text, key).toString(crypot.enc.Utf8)
}
