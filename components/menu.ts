type Menu = {
  title: string
  href: string
  icon?: string
  description: string
  state?: MenusState
}
export type MenusState = 'default' | 'wip' | 'beta'

const codePages: Menu[] = [
  {
    title: 'HTML',
    href: '/code/html',
    description: 'Compress, Formatter',
    icon: 'mdi:language-html5',
  },
  {
    title: 'JavaScript',
    href: '/code/js',
    description: 'Compress, Formatter, Obfuscation',
    icon: 'mdi:language-javascript',
  },
  {
    title: 'CSS',
    href: '/code/css',
    description: 'Compress, Formatter',
    icon: 'mdi:language-css3',
  },
  {
    title: 'JSON',
    href: '/code/json',
    description: 'Convert, Formatter, Checker',
    icon: 'mdi:code-json',
    state: 'wip',
  },
  {
    title: 'YAML',
    href: '/code/yaml',
    description: 'Convert, Formatter, Checker',
    icon: 'file-icons:yaml-alt4',
    state: 'wip',
  },
  {
    title: 'TOML',
    href: '/code/toml',
    description: 'Convert, Formatter, Checker',
    icon: 'file-icons:toml',
    state: 'wip',
  },
]
const cryptoPages: Menu[] = [
  {
    title: 'Base64',
    href: '/crypto/base64',
    description: 'Base64 Encode, Base64 Decode',
    icon: 'mdi:code-parentheses',
  },
  {
    title: 'Unicode',
    href: '/crypto/unicode',
    description: 'Unicode Encode, Unicode Decode',
    icon: 'mdi:unicode',
  },
  {
    title: 'URI Coder',
    href: '/crypto/urlencode',
    description: 'URI Encode, URI Decode',
    icon: 'mdi:link',
  },
  {
    title: 'Hash',
    href: '/crypto/hash',
    description: 'MD5, SHA1 ...',
    icon: 'mdi:lock',
  },
  {
    title: 'Encrypt',
    href: '/crypto/crypto',
    description: 'AES, DES, RSA ...',
    icon: 'mdi:shield-lock-outline',
  },
]

const imagePages: Menu[] = [
  {
    title: 'Data URI',
    href: '/image/data2uri',
    description: 'Image to Data URI',
    icon: 'mdi:image-multiple-outline',
  },
  {
    title: 'Generate QR Code',
    href: '/image/genQRcode',
    description: 'Generate QR Code',
    icon: 'mdi:qrcode',
    state: 'wip',
  },
  {
    title: 'PNG to Favicon',
    href: '/image/png2icon',
    description: 'PNG to Favicon',
    icon: 'mdi:alpha-f-box-outline',
    state: 'wip',
  },
]
const converMenu: Menu[] = [
  {
    title: 'CIDR to IP',
    href: '/convert/cidr2ip',
    description: 'CIDR to IP Range',
    icon: 'mdi:ip-network-outline',
    state: 'wip',
  },
]

export const menus: {
  title: string
  menu: Menu[]
  icon?: string
}[] = [
  {
    title: 'Code Compression',
    menu: codePages,
  },
  {
    title: 'Encoding Processing',
    menu: cryptoPages,
  },
  {
    title: 'Processing',
    menu: imagePages,
  },
  {
    title: 'Convert',
    menu: converMenu,
  },
]
