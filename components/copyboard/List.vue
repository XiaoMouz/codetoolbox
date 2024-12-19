<script setup lang="ts">
import type { Content } from '~/types/copyboard.type'

const store = useCopyboardStore()
store.$subscribe((state) => {
  console.log(state)
})
const {
  getRemoteCopyboard,
  getRemoteCopyboardList,
  newCopyboard,
  putCopyboard,
} = store
const { remote, loading, local, current } = storeToRefs(store)

// find remote and local copyboard have same copyboard ?
function haveLocal(id: string): boolean {
  return local.value.find((i) => i.body.id === id) ? true : false
}

function isExpired(item: Content) {
  return item.expireAt < Date.now() ? true : false
}

getRemoteCopyboardList()
</script>
<template>
  <div class="flex gap-6 flex-col">
    <div class="flex gap-2 flex-col">
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
          :class="
            cn({
              'bg-muted cursor-not-allowed': current
                ? current.id === i.id
                : false,
            })
          "
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
        <button
          class="flex items-center p-1 px-2 border-2 rounded-lg justify-center gap-1 hover:bg-muted transition-all duration-100"
          :class="
            cn({
              'bg-muted cursor-not-allowed': current
                ? current.id === i.body.id
                : false,
            })
          "
          v-for="i in local"
          :key="i.body.id"
          @click="
            () => {
              getRemoteCopyboard(i.body.id)
              $router.push(`/share/copyboard/${i.body.id}`)
            }
          "
        >
          <Icon
            v-if="!loading"
            :name="
              isExpired(i.body)
                ? 'mdi:clipboard-text-play-outline'
                : 'mdi:cloud-arrow-down-outline'
            "
          />
          {{ i.body.name }}
        </button>
      </div>
    </div>
  </div>
</template>
