import { get } from '@vueuse/core'
import { defineStore } from 'pinia'
import type { Content } from '~/types/dto/copyboard.type'
import { baseURL } from '~/config/backend'

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
  local: CopyboardState[]
}

export const useCopyboardStore = defineStore('copyboard', {
  state: (): State => ({
    remote: null,
    local: [],
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
          this.loading = false
        })
      this.loading = false
    },
    async newCopyboard(
      content: string,
      options?: {
        name?: string
        private?: boolean
        password?: string
      }
    ): Promise<Content | null> {
      this.loading = true
      const user = useUserStore()
      await fetch(`${baseURL}/tool/copyboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${user.session?.token}:${user.session?.user.email}`,
        },
        body: JSON.stringify({
          content,
          name: options?.name,
          private: options?.private,
          password: options?.password,
        }),
      })
        .then(
          (res) => res.json() as Promise<{ message: string; info: Content }>
        )
        .then((data) => {
          this.loading = false
          this.local.push({
            body: data.info,
            updateAt: Date.now(),
          })
          return data.info
        })
        .catch((err) => {
          console.error(err)
          this.loading = false
          return null
        })
      this.loading = false
      return null
    },
    async putCopyboard(content: Content) {
      const user = useUserStore()
      this.loading = true
      await fetch(`${baseURL}/tool/copyboard/${content.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${user.session?.token}:${user.session?.user.email}`,
        },
        body: JSON.stringify({
          name: content.name,
          status: content.status,
          content: content.content,
          private: content.private,
          password: content.password,
        }),
      })
        .then(
          (res) => res.json() as Promise<{ message: string; info: Content }>
        )
        .then((data) => {
          if (!data.info) {
            this.loading = false
            return
          }
          this.loading = false
          this.local.forEach((item) => {
            if (item.body.id === content.id) {
              item.body = data.info
              item.updateAt = Date.now()
            }
          })
          return data.info
        })
        .catch((err) => {
          console.error(err)
          this.loading = false
          return null
        })
      this.loading = false
      return null
    },
    async getRemoteCopyboard(id: string) {
      this.loading = true
      const user = useUserStore()
      const response = await fetch(`${baseURL}/tool/copyboard/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${user.session?.token}:${user.session?.user.email}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.info) {
            this.loading = false
            return false
          }
          // search local ,if have update it, else push it
          const index = this.local.findIndex((item) => item.body.id === id)
          if (index !== -1) {
            this.local[index].body = data.info
            this.local[index].updateAt = Date.now()
          } else {
            this.local.push({
              body: data.info,
              updateAt: Date.now(),
            })
          }
          this.loading = false
          return true
        })
      this.loading = false
      return false
    },
    async setLocalCopyboardList(id: string) {
      const index = this.local.findIndex((item) => item.body.id === id)
      if (index !== -1) {
        this.local[index].updateAt = Date.now()
      }
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
