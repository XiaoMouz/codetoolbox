import { defineStore } from 'pinia'
import type { Content } from '~/types/copyboard.type'

interface CopyboardState {
  body: Content
  updateAt: number
}

interface State {
  remote:
    | {
        id: string
        name: string
      }[]
    | null
  local: CopyboardState[] | null
  current: CopyboardState | null
}

const baseURL = process.env.BASE_URL || 'https://api.mou.best'

export const useCopyboardStore = defineStore('copyboard', {
  state: (): State => ({
    remote: null,
    local: null,
    current: null,
  }),
  actions: {
    async getRemoteCopyboardList() {
      const user = useUserStore()
      if (!user.session) return
      const response = await fetch(`${baseURL}/tool/copyboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${user.session?.token}:${user.session?.user.email}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          this.remote = data.info
        })
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
