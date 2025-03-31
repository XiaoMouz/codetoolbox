type Menu = {
  title: string
  to: string
  icon?: string
  description: string
  state?: MenusState
}
export type MenusState = 'default' | 'wip' | 'beta'

const codePages: Menu[] = [
  {
    title: 'HTML',
    to: '/code/html',
    description: 'Compress, Formatter',
    icon: 'mdi:language-html5',
  },
  {
    title: 'JavaScript',
    to: '/code/js',
    description: 'Compress, Formatter, Obfuscation',
    icon: 'mdi:language-javascript',
  },
  {
    title: 'CSS',
    to: '/code/css',
    description: 'Compress, Formatter',
    icon: 'mdi:language-css3',
  },
  {
    title: 'JSON',
    to: '/code/json',
    description: 'Convert, Formatter, Checker',
    icon: 'mdi:code-json',
  },
  {
    title: 'YAML',
    to: '/code/yaml',
    description: 'Convert, Formatter, Checker',
    icon: 'file-icons:yaml-alt4',
  },
]
const cryptoPages: Menu[] = [
  {
    title: 'Base64',
    to: '/crypto/base64',
    description: 'Base64 Encode, Base64 Decode',
    icon: 'mdi:code-parentheses',
  },
  {
    title: 'Unicode',
    to: '/crypto/unicode',
    description: 'Unicode Encode, Unicode Decode',
    icon: 'mdi:unicode',
  },
  {
    title: 'URI Coder',
    to: '/crypto/urlencode',
    description: 'URI Encode, URI Decode',
    icon: 'mdi:link',
  },
  {
    title: 'Hash',
    to: '/crypto/hash',
    description: 'MD5, SHA1 ...',
    icon: 'mdi:lock',
  },
  {
    title: 'Encrypt',
    to: '/crypto/crypto',
    description: 'AES, DES, RSA ...',
    icon: 'mdi:shield-lock-outline',
  },
]

const imagePages: Menu[] = [
  {
    title: 'Data URI',
    to: '/image/data2uri',
    description: 'Image to Data URI',
    icon: 'mdi:image-multiple-outline',
  },
  {
    title: 'Generate QR Code',
    to: '/image/genQRcode',
    description: 'Generate QR Code',
    icon: 'mdi:qrcode',
    state: 'beta',
  },
  {
    title: 'PNG to Favicon',
    to: '/image/png2ico',
    description: 'PNG to Favicon',
    icon: 'mdi:alpha-f-box-outline',
    state: 'wip',
  },
]
const converMenu: Menu[] = [
  {
    title: 'CIDR to IP',
    to: '/convert/cidr2ip',
    description: 'CIDR to IP Range',
    icon: 'mdi:ip-network-outline',
  },
  {
    title: 'Singbox Configer',
    to: '/configer/singbox',
    description: 'Singbox Configer',
    icon: 'mdi:server',
    state: 'wip',
  },
]

const shareMenu: Menu[] = [
  {
    title: 'Online Copyboard',
    to: '/share/copyboard',
    description: 'Share your text',
    icon: 'mdi:file-cloud',
  },
  {
    title: 'File Share',
    to: '/share/file',
    description: 'Fast share service',
    icon: 'mdi:cloud-print-outline',
    state: 'beta',
  },
]

export const menus: {
  title: string
  menu: Menu[]
  icon?: string
}[] = [
  {
    title: 'Code',
    menu: codePages,
  },
  {
    title: 'Encode and Security',
    menu: cryptoPages,
  },
  {
    title: 'Process Image',
    menu: imagePages,
  },
  {
    title: 'Network',
    menu: converMenu,
  },
  {
    title: 'Share',
    menu: shareMenu,
  },
]
