import CleanCSS from 'clean-css'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { code } = body
  const result = new CleanCSS().minify(code)
  return { result }
})
