import { Event } from './event'

const toastEvents = ['TOAST:INFO', 'TOAST:ERROR'] as const

type ToastEvents = (typeof toastEvents)[number]

type ToastType = { message: string; title: string }

const toastEvent = new Event<{
  [key in ToastEvents]: ToastType
}>()

export { toastEvent }
