import crypto from 'crypto-js'

export function getGAvatar(email: string) {
  const hash = crypto.MD5(email.trim().toLowerCase()).toString()

  return `https://www.gravatar.com/avatar/${hash}?d=identicon`
}
