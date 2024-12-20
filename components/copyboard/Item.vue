<script setup lang="tsx">
import type { Content } from '~/types/copyboard.type'

const props = defineProps<{
  item: Content
  updateAt: number
}>()

const store = useCopyboardStore()

const {
  getRemoteCopyboard,
  getRemoteCopyboardList,
  newCopyboard,
  putCopyboard,
} = store
const { remote, loading, local } = storeToRefs(store)

function isExpired(item: Content) {
  return item.expireAt < Date.now() ? true : false
}
</script>
<template>
  <div
    class="flex items-center relative p-1 px-2 border-2 rounded-lg justify-center gap-1 hover:bg-muted transition-all duration-100"
    @click="
      () => {
        getRemoteCopyboard(item.id)
        $router.push(`/share/copyboard/${item.id}`)
      }
    "
  >
    <Icon
      class="size-16 absolute bottom-1 right-3 dark:text-gray-300 text-gray-600"
      :name="
        isExpired(item)
          ? 'mdi:cloud-question-outline'
          : 'mdi:clipboard-edit-outline'
      "
    />
    <div class="flex flex-col gap-1 z-10">
      <div class="flex flex-row gap-1 items-center">
        <Icon name="mdi:tag" />{{ item.name }}
      </div>
      <div class="flex flex-row gap-1 items-center">
        <Icon name="mdi:clock-plus-outline" />
        {{ new Date(item.createdAt).toLocaleString() }}
      </div>
      <div class="flex flex-row gap-1 items-center">
        <Icon name="mdi:delete-clock-outline" /> {{ item.expireAt }}
      </div>
      <div class="flex flex-row gap-1 items-center">
        <Icon name="mdi:account-file-text-outline" /> {{ item.uploader }}
      </div>
    </div>
  </div>
</template>
