<script setup lang="ts">
import type { Content } from '~/types/copyboard.type'

const store = useCopyboardStore()
const userStore = useUserStore()
const { session } = storeToRefs(userStore)

const userAuthed = computed(() => {
  return session.value && !userStore.isTokenExpired()
})

const {
  getRemoteCopyboard,
  getRemoteCopyboardList,
  newCopyboard,
  putCopyboard,
} = store
const { remote, loading, local } = storeToRefs(store)

// find remote and local copyboard have same copyboard ?
function haveLocal(id: string): boolean {
  return local.value.find((i) => i.body.id === id) ? true : false
}

getRemoteCopyboardList()
</script>
<template>
  <div class="flex gap-6 flex-col">
    <div v-if="userAuthed" class="flex gap-2 flex-col">
      <div class="flex flex-row items-center gap-2">
        <Icon name="mdi:cloud" class="size-5" />
        <h1 class="text-xl">Remote Copyboard List</h1>
      </div>
      <div
        class="flex justify-center items-center h-full w-full border relative rounded-lg gap-4 flex-col flex-wrap p-2"
      >
        <div
          v-if="loading"
          class="bg-muted w-full h-full flex justify-center items-center absolute"
        >
          <LoadingCycle />
        </div>
        <button
          class="flex items-center p-1 px-2 border-2 rounded-lg justify-center gap-1 hover:bg-muted transition-all duration-100"
          v-for="i in remote"
          :key="i.id"
          @click="
            () => {
              getRemoteCopyboard(i.id)
              $router.push(`/share/copyboard/${i.id}`)
            }
          "
        >
          <Icon
            v-if="!loading"
            :name="
              haveLocal(i.id)
                ? 'mdi:clipboard-text-play-outline'
                : 'mdi:cloud-arrow-down-outline'
            "
          />
          {{ i.name }}
        </button>
      </div>
    </div>
    <div v-else>
      <Badge
        ><Icon class="mr-2 size-5" name="mdi:account-alert-outline" /><span
          class="cursor-default"
          >Anonymouse&nbsp;Mode</span
        >
      </Badge>
    </div>
    <div class="flex gap-2 flex-col">
      <div class="flex flex-row items-center gap-2">
        <Icon name="mdi:database-outline" class="size-5" />
        <h1 class="text-xl">Local Copyboards</h1>
      </div>
      <div
        class="flex justify-center items-center h-full w-full border relative rounded-lg gap-4 flex-col flex-wrap p-2"
      >
        <div
          v-if="false"
          class="bg-muted w-full h-full flex justify-center items-center absolute"
        >
          <LoadingCycle />
        </div>
        <CopyboardItem
          v-for="i in local"
          :item="i.body"
          :update-at="i.updateAt"
          :key="i.body.id"
        />
      </div>
    </div>
  </div>
</template>
