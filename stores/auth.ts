// stores/user.ts
import { defineStore } from 'pinia'
import type { TokenSession } from '~/types/user.type'

interface UserState {
  session: TokenSession | null
}

const baseURL = process.env.BASE_URL || 'https://api.mou.best'

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
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `${baseURL}/api/refresh`, true)

      xhr.setRequestHeader('Content-Type', 'application/json')

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          this.session = response.session
        } else {
          console.error('Token refresh failed:', xhr.statusText)
          this.logout()
        }
      }

      xhr.onerror = () => {
        console.error('Network error')
        this.logout()
      }

      xhr.send(
        JSON.stringify({
          token: this.session?.token,
          refreshToken: this.session?.refreshToken,
        })
      )
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
})
