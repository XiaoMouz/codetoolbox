import { useUserStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

import { baseURL as api } from '~/config/backend'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore()
  const { session } = storeToRefs(userStore)

  if (!session.value) {
    return navigateTo('/share/backend/login')
  }

  await useFetch(api + '/auth/refresh', {
    method: 'post',
    body: {
      token: session.value.token,
      email: session.value.user.email,
      refreshToken: session.value.refreshToken,
    },
    onRequestError: ({ request, error, options }) => {
      console.error(error)
    },
    onResponse: ({ request, response, options }) => {
      if (response.status === 200 && response._data.session) {
        userStore.session = response._data.session
        return
      } else {
        // todo: fix backend, mutiple device have different refresh token
        //return navigateTo('/share/backend/login')
      }
    },
    onResponseError: ({ request, response, error, options }) => {
      console.error(error)
      // todo: fix backend, mutiple device have different refresh token
      //return navigateTo('/share/backend/login')
    },
  })
})
