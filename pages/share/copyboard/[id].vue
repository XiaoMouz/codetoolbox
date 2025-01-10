<script setup lang="ts">
import type { Content } from '~/types/dto/copyboard.type'

useHead({
  title: 'Online Copyboard',
})

const store = useCopyboardStore()
const userStore = useUserStore()
const { session } = storeToRefs(userStore)

const {
  getRemoteCopyboard,
  getRemoteCopyboardList,
  newCopyboard,
  deleteCopyboard,
  putCopyboard,
} = store
const { remote, local } = storeToRefs(store)

// find remote and local copyboard have same copyboard ?
function haveLocal(id: string): boolean {
  return local.value.find((i) => i.body.id === id) ? true : false
}

// get id from route
const route = useRoute()
const router = useRouter()
const loading = ref(false)

const paramId = route.params.id.toString()
console.log(paramId)
let itemIndex = computed(() => {
  return local.value.findIndex((i) => i.body.id === paramId)
})

let item = ref<Content>({
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

getRemoteCopyboard(paramId)

onMounted(async () => {
  let result = local.value.find((i) => (i.body ? i.body.id === paramId : false))
  console.log(local.value)
  // if not exist in local, get from remote

  item.value = result ? result?.body : item.value
  let localIndex = local.value.findIndex((i) =>
    i.body ? i.body.id === paramId : false
  )
  local.value[localIndex] = { body: item.value, updateAt: Date.now() }

  if (!item.value) {
    router.push('/share/copyboard/new')
  }

  loading.value = true
})

//watch local
watch(local, (val) => {
  console.log('update')
  const paramId = route.params.id.toString()
  let result = val.find((i) => (i.body ? i.body.id === paramId : false))
  item.value = result ? result?.body : item.value
  useHead({
    title: item.value.name,
  })
})
</script>

<template>
  <ClientOnly>
    <div class="h-full w-full flex-1 flex" v-if="loading">
      <CopyboardForm
        @save="putCopyboard(local[itemIndex].body)"
        @delete="deleteCopyboard(item.id)"
        v-model="local[itemIndex].body"
      />
    </div>
  </ClientOnly>
</template>
