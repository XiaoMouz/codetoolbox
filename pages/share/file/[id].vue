<script setup lang="ts">
import { useToast } from '@/components/ui/toast'
import type { FileResponse } from '~/types/dto/file.type'
import { baseURL } from '~/config/backend'

definePageMeta({
  layout: 'center'
})

const { toast } = useToast()
const userStore = useUserStore()
const { session } = storeToRefs(userStore)




const paramId = useRoute().params.id


const { data, status, error, refresh, clear } = await useFetch<FileResponse>(baseURL + '/tool/file/' + paramId, {
  onRequest({ request, options }) {
    session.value && options.headers.set('Authorization', session.value.token)
  },
  onRequestError({ request, options, error }) {

  },
  onResponse({ request, response, options }) {
  },
  onResponseError({ request, response, options }) {
    toast({
      title: 'Error',
      description: 'Failed to fetch data',
    })


    const router = useRouter()
    router.push('/share/file')
  }
})

const downloadToken = useCookie('Download-Token', {
  domain: baseURL,
  path: '/',
  maxAge: 60 * 60 * 24,

  encode: (value) => value || '',
})

const isOwener = computed(() => {
  return session.value && data.value && session.value.user.email === data.value.info.uploader
})

const download = async () => {
  try {
    if (!data.value) {
      toast({
        title: 'Error',
        description: 'Failed to download file',
      })
      return
    }
    downloadToken.value = data.value.info.downloadToken
    const a = document.createElement('a')
    a.href = baseURL + '/tool/file/' + data.value.info.id + '/download/'
    a.download = data.value.info.binaryName || data.value.info.title
    a.click()
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to download file',
    })
  }
}

const deleteFile = () => {
  useFetch(baseURL + '/tool/file/' + paramId, {
    method: 'DELETE',
    onRequest({ request, options }) {
      session.value && options.headers.set('Authorization', session.value.token + ':' + session.value.user.email)
    },
    onRequestError({ request, options, error }) {

    },
    onResponse({ request, response, options }) {
      toast({
        title: 'Success',
        description: 'File deleted',
      })
      const router = useRouter()
      router.push('/share/file')
    },
    onResponseError({ request, response, options }) {
      toast({
        title: 'Failed to delete file',
        description: response.statusText + ':' + response.json()
      })
    }
  })
}

const deleteConfirm = ref(false)


watchEffect(() => {
  console.log("Token:", data.value?.info.downloadToken)

  if (data.value?.info.downloadToken) {
    downloadToken.value = data.value.info.downloadToken
  }

  console.log("Cookie DT:", downloadToken.value)

})

</script>
<template>
  <div class="flex h-full w-full flex-col items-center justify-center mb-8">


    <div>
      <Card class="p-4 w-full" v-if="data">
        <div class="flex flex-col items-center gap-4">
          <div class="flex flex-col md:flex-row justify-between gap-8 md:gap-16">
            <div class="flex flex-col  gap-4">
              <div class="flex items-center gap-2">
                <Icon name="mdi:file" size="20" />
                <span class="text-lg">{{ data.info.title }}</span>
              </div>
              <div class="flex items-center gap-4">
                <HoverCard>
                  <HoverCardTrigger class="flex gap-1 items-center">
                    <Icon name="mdi:sort-clock-ascending-outline" size="18" />
                    <span class=" cursor-default">{{ data.info.downloadTime }}</span>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    File download time
                  </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger class="flex gap-1 items-center">
                    <Icon name="mdi:delete-clock-outline" size="18" />
                    <span class=" cursor-default">{{ new Date(data.info.expireAt).toLocaleString() }}</span>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    File will be deleted at
                  </HoverCardContent>
                </HoverCard>

              </div>
            </div>
            <div class="flex gap-2 items-center ">
              <Avatar>
                <AvatarImage :src="data.owner.avatar" />
                <AvatarFallback>{{ data.owner.name.charAt(0) }}</AvatarFallback>
              </Avatar>
              <div class="flex flex-col gap-1 ">
                <span>File upload by</span>
                <span>{{ data.owner.name }}</span>
              </div>
            </div>
          </div>
          <div class="flex justify-between gap-2 w-full">
            <Button @click="download" color="primary">
              <Icon name="mdi:download" /> Download
            </Button>
            <div v-if="isOwener">
              <transition name="flip" mode="out-in">
                <Button @click="deleteConfirm = true" v-if="!deleteConfirm" variant="outline">
                  <Icon name="mdi:delete-outline" /> Delete
                </Button>
                <Button v-else="deleteConfirm" @click="deleteFile" variant="destructive">
                  <Icon name="mdi:check" /> Confirm
                </Button>
              </transition>


            </div>
          </div>
        </div>
      </Card>
      <Card v-else>
        <LoadingCycle />
      </Card>
    </div>
  </div>
</template>

<style scoped>
.flip-enter-active,
.flip-leave-active {
  transition: all 0.3s;
  transform-style: preserve-3d;
}

.flip-enter-from {
  transform: rotateX(90deg);
  opacity: 0;
}

.flip-leave-from,
.flip-enter-to {
  transform: rotateX(0deg);
  opacity: 1;
}

.flip-leave-to {
  transform: rotateX(-90deg);
  opacity: 0;
}
</style>
