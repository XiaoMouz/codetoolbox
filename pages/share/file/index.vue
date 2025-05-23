<script setup lang="ts">
import Title from '~/components/Title.vue'
import { EventMissionQueue, fileEventBus as fileEventBus, updateMission, finishMission } from '~/event/api/file'
import { baseURL as api } from '~/config/backend'

definePageMeta({
  middleware: 'auth'
})


const userStore = useUserStore()
const { session } = storeToRefs(userStore)

type Result = {
  files: {
    id: string
    name: string
  }[]
}

const {
  data: lists,
  status: listStatus,
  refresh,
  execute
} = await useAsyncData('file-list', () =>
  $fetch<Result>(api + '/tool/file/', {
    headers: {
      Authorization: session.value
        ? `${session.value.token}:${session.value.user.email}`
        : ' ',
    },

  }), {
  immediate: true,
  lazy: true,
}
)

const files = computed(() => lists.value?.files)

onMounted(() => {
  execute()
})

const userAuthed = computed(() => {
  return session.value && !userStore.isTokenExpired()
})

// subscribe file event

fileEventBus.subscribe('API:UPLOADING', (task) => {
  console.log(EventMissionQueue[task.missionId])
})

</script>

<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[90%] xl:w-[80%] h-full flex flex-col items-start gap-6">
      <Title title="File Share" icon="mdi:cloud-print-outline" description="Single file max 100MB" />
      <div class="flex flex-col gap-8 w-full">
        <div>
          <ClientOnly>
            <FileUploadDialog />
          </ClientOnly>
        </div>
        <ClientOnly>
          <div v-if="files?.length && userAuthed" class="flex flex-col gap-2">
            <div class="flex flex-row gap-4 items-center">
              <div
                class="flex px-2 py-1 rounded-md flex-row gap-2 items-center cursor-pointer hover:bg-muted transition-all bg-transparent duration-300 hover:shadow-md"
                @click="refresh()">
                <Icon name="mdi:file-document-multiple-outline" class="size-5" /><span class="text-xl font-bold">Your
                  File
                  List</span>
              </div>
            </div>
            <div class="flex  items-center h-full w-full border relative rounded-lg gap-4 flex-wrap p-2">
              <div v-if="listStatus === 'pending'" class="w-full h-12 flex justify-center items-center absolute">
                <LoadingCycle />
              </div>
              <button
                class="flex items-center w-full md:w-72 truncate text-nowrap overflow-hidden h-full p-1 px-2 border-2 rounded-lg justify-center gap-1 hover:bg-muted transition-all duration-100"
                v-for="i in files" :key="i.id" @click="() => {

                  $router.push(`/share/file/${i.id}`)
                }
                ">
                <Icon v-if="listStatus !== 'pending'" name="mdi:cloud-arrow-down-outline" />
                <span class="truncate text-nowrap">{{ i.name ? i.name : "<<NO NAME FILE>>" }}</span>
              </button>

            </div>
          </div>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
