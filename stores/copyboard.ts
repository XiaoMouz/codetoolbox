import { get } from '@vueuse/core'
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
  loading: boolean
  local: CopyboardState[] | null
  current: CopyboardState | null
}

const baseURL = process.env.BASE_URL || 'https://api.mou.best'

export const useCopyboardStore = defineStore('copyboard', {
  state: (): State => ({
    remote: null,
    local: null,
    current: null,
    loading: false,
  }),
  actions: {
    async getRemoteCopyboardList() {
      const user = useUserStore()
      if (!user.session) return
      this.loading = true
      const response = await fetch(`${baseURL}/tool/copyboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${user.session?.token}:${user.session?.user.email}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          this.remote = data.copyboards
        })
      this.loading = false
    },
    async newCopyboard(
      content: string,
      options?: {
        name?: string
        priavte?: boolean
        password?: string
      }
    ): Promise<Content | null> {
      this.loading = true
      await fetch(`${baseURL}/tool/copyboard`, {
        method: 'POST',
        body: JSON.stringify({
          content,
          name: options?.name,
          private: options?.priavte,
          password: options?.password,
        }),
      })
        .then(
          (res) => res.json() as Promise<{ message: string; info: Content }>
        )
        .then((data) => {
          this.loading = false
          return data.info
        })
        .catch((err) => {
          console.error(err)
          this.loading = false
          return null
        })
      return null
    },
    async putCopyboard(content: Content) {
      this.loading = true
      await fetch(`${baseURL}/tool/copyboard/${content.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          content,
        }),
      })
        .then(
          (res) => res.json() as Promise<{ message: string; info: Content }>
        )
        .then((data) => {
          this.loading = false
          return data.info
        })
        .catch((err) => {
          console.error(err)
          this.loading = false
          return null
        })
      return null
    },
    async getRemoteCopyboard(id: string) {
      this.loading = true
      const response = await fetch(`${baseURL}/tool/copyboard/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          this.current = data.info
        })
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
