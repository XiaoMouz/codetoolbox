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
  deleteCopyboard,
} = store
const { remote, local } = storeToRefs(store)

const { session } = storeToRefs(userStore)

const item = ref<Content>({
  id: '',
  name: '',
  expireAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
  createdAt: Date.now(),
  modifiedAt: Date.now(),
  uploader: session.value?.user.email || 'Anonymous',
  content: '',
  status: 'active',
  password: undefined,
  private: false,
  history: [],
})

const router = useRouter()

async function upload() {
  const result = await newCopyboard(item.value.content, {
    name: item.value.name,
    private: item.value.private,
    password: item.value.password,
  })

  if (!result) return
  router.push(`/share/copyboard/${result.id}`)
}
</script>

<template>
  <div>
    <ClientOnly>
      <CopyboardForm
        @save="upload"
        @delete="deleteCopyboard(item.id)"
        v-model="item"
      />
    </ClientOnly>
  </div>
</template>
