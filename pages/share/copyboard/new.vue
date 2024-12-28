<script setup lang="ts">
import type { Content } from '~/types/dto/copyboard.type'

const store = useCopyboardStore()
const userStore = useUserStore()

useHead({
  title: 'New Copyboard',
})

const {
  getRemoteCopyboard,
  getRemoteCopyboardList,
  newCopyboard,
  putCopyboard,
} = store
const { remote, local } = storeToRefs(store)

const item = ref<Content>({
  id: '',
  name: '',
  expireAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
  createdAt: Date.now(),
  modifiedAt: Date.now(),
  uploader: '',
  content: '',
  status: 'active',
  password: undefined,
  private: false,
  history: [],
})
</script>

<template>
  <div>
    <CopyboardForm
      @save="
        newCopyboard(item.content, {
          name: item.name,
          private: item.private,
          password: item.password,
        })
      "
      v-model="item"
    />
  </div>
</template>
