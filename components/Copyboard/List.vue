<script setup lang="ts">
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

getRemoteCopyboardList()
</script>
<template>
  <div
    class="flex justify-center items-center h-full w-full border rounded-lg p-2"
  >
    <div v-if="true" class="bg-transparent absolute"><LoadingCycle /></div>
    <button
      class="flex items-center p-1 px-2 border-2 rounded-lg justify-center gap-1 hover:bg-muted transition-all duration-100"
      v-for="i in remote"
      :key="i.id"
      @click="getRemoteCopyboard(i.id)"
    >
      <Icon name="mdi:clipboard-text-play-outline" /> {{ i.name }}
    </button>
  </div>
</template>
