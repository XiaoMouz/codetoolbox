import { Event } from '../event'
import type { TokenSession } from '~/types/dto/user.type'
type AuthEventPayload = {
  'AUTH:EXPIRED': boolean
  'AUTH:ERROR': boolean
  'AUTH:REQUIRE': boolean
  'AUTH:REFRESH': boolean
  'AUTH:SUCCESS': TokenSession
}
const authEvent = new Event<AuthEventPayload>()

export { authEvent }
