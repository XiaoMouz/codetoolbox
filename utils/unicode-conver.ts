// 将文本转为 HTML 实体编码的主函数

const entityMap: Map<string, string> = new Map([
  ['!', '&excl;'],
  ['@', '&commat;'],
  ['#', '&num;'],
  ['$', '&dollar;'],
  ['%', '&percnt;'],
  ['^', '&circ;'],
  ['&', '&amp;'],
  ['*', '&ast;'],
  ['(', '&lpar;'],
  [')', '&rpar;'],
  ['-', '&minus;'],
  ['+', '&plus;'],
  ['=', '&equals;'],
  ['_', '&lowbar;'],
  ['{', '&lcub;'],
  ['}', '&rcub;'],
  ['[', '&lsqb;'],
  [']', '&rsqb;'],
  [':', '&colon;'],
  [';', '&semi;'],
  ["'", '&apos;'],
  ['"', '&quot;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
  [',', '&comma;'],
  ['.', '&period;'],
  ['?', '&quest;'],
  ['/', '&sol;'],
  ['\\', '&bsol;'],
  ['|', '&vert;'],
  ['`', '&grave;'],
  ['~', '&tilde;'],
])

export function toHtmlEntities(
  text: String,
  options = {
    partial: false,
    mode: <'hex' | 'normal'>'hex',
    symbol: <'normal' | 'entity'>'normal',
  }
) {
  return text.replace(/[\s\S]/g, (char) => {
    const code = char.charCodeAt(0)
    // 部分模式下跳过 ASCII 范围的字母、数字和符号
    if (options.symbol === 'entity') {
      const entity = entityMap.get(char)
      if (entity) {
        return entity
      }
    }
    if (
      options.partial &&
      /[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/|\\\-~` ]/.test(char)
    ) {
      return char
    }

    return options.mode === 'hex' ? `&#x${code.toString(16)};` : `&#${code};`
  })
}

export function decodeHtmlEntities(encodedText: string): string {
  const reverseEntityMap = new Map(
    [...entityMap.entries()].map(([key, value]) => [value, key])
  )

  encodedText = encodedText.replace(/&[a-zA-Z]+;/g, (entity) => {
    return reverseEntityMap.get(entity) || entity // Replace if found, otherwise keep original.
  })

  return encodedText.replace(/&#x([\da-f]+);|&#(\d+);/gi, (_, hex, dec) =>
    String.fromCharCode(dec || parseInt(hex, 16))
  )
}

// export function strToHtmlEntity(str: String) {
//   return Array.from(str)
//     .map((char) => `&#${char.charCodeAt(0)};`)
//     .join('')
// }

// export function strToHtmlEntityHex(str: String) {
//   return Array.from(str)
//     .map((char) => `&#x${char.charCodeAt(0).toString(16)};`)
//     .join('')
// }

export function strToUnicodeEscape(str: String, partial = false) {
  return Array.from(str)
    .map((char) => {
      const code = char.charCodeAt(0)
      if (partial && code < 128) {
        return char
      }
      return `\\u${code.toString(16).padStart(4, '0')}`
    })
    .join('')
}

export function revertToStringFromUnicodeEscape(escaped: String) {
  return escaped.replace(/\\u([\da-f]{4})/gi, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  )
}
