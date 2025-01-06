import { defineStore } from 'pinia'
import type { TokenSession } from '~/types/dto/user.type'
import { baseURL } from '~/config/backend'

interface UserState {
  session: TokenSession | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    session: null,
  }),
  actions: {
    async login(
      email: string,
      password: string
    ): Promise<{
      success: boolean
      message?: string
    }> {
      try {
        const response = await fetch(`${baseURL}/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          const errorData = await response.json()

          throw new Error(errorData.message || 'Login failed')
        }

        const data = await response.json()
        this.session = data.session
        return { success: true }
      } catch (error: any) {
        console.error('Login failed:', error)
        return { success: false, message: error.message }
      }
    },

    async refreshToken() {
      try {
        const token = this.session?.token
        const refreshToken = this.session?.refreshToken
        const response = await fetch(`${baseURL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, refreshToken }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Refresh failed')
        }

        const data = await response.json()
        this.session = data.session
        return { success: true }
      } catch (error: any) {
        console.error('Refresh failed:', error)
        return { success: false, message: error.message }
      }
    },
    logout() {
      this.session = null
    },
    isTokenExpired(): boolean {
      return this.session && this.session.expireAt
        ? Date.now() >= this.session.expireAt
        : false
    },
  },
  persist: {
    key: 'session-store',
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
