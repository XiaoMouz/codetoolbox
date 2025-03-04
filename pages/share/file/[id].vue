<script setup lang="ts">
import { useToast } from '@/components/ui/toast'
import type { FileResponse } from '~/types/dto/file.type'
const { toast } = useToast()
const userStore = useUserStore()
const { session } = storeToRefs(userStore)




const { data, status, error, refresh, clear } = await useFetch<FileResponse>('/api/auth/login', {
  onRequest({ request, options }) {
    session.value && options.headers.set('Authorization', session.value.token)
  },
  onRequestError({ request, options, error }) {

  },
  onResponse({ request, response, options }) {
    // Process the response data

  },
  onResponseError({ request, response, options }) {
    toast({
      title: 'Error',
      description: 'Failed to fetch data',
    })
  }
})


const download = async () => {
  try {

  } catch (error) {
    console.error(error)
  }
}


</script>
<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[90%] xl:w-[70%] h-full flex flex-col items-start gap-6">
      <Title title="File Share" icon="mdi:cloud-print-outline"
        description="Small file sharing, storage max 10GB for 7 days" />
    </div>
    <Button @click="download">
      <span>Download</span>
      <Icon name="mdi:download" />
    </Button>
  </div>
</template>
