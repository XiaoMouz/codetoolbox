import { defineStore } from 'pinia'
import type { File } from '~/types/dto/file.type'

export const useFileStore = defineStore('fileStore', {
  state: () => {
    return {
      files: [] as File[],
    }
  },
  actions: {
    addFile(file: File) {
      this.files.push(file)
    },
    clearExpired() {
      this.files = this.files.filter((file) => file.expireAt > Date.now())
    },
    removeFile(id: string) {
      const index = this.files.findIndex((f) => f.id === id)
      if (index !== -1) {
        this.files.splice(index, 1)
      }
    },
  },
  persist: {
    key: 'session-store',
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
