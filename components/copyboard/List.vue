<script setup lang="ts">
import type { Content } from '~/types/dto/copyboard.type'

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
  return local.value.find((i) => (i.body ? i.body.id === id : false))
    ? true
    : false
}

getRemoteCopyboardList()
</script>
<template>
  <div class="flex w-full gap-6 flex-col">
    <div class="flex gap-2">
      <Button
        @click="
          () => {
            $router.push('/share/copyboard/new')
          }
        "
      >
        <Icon name="mdi:plus" class="mr-1 size-4" />
        New
      </Button>
      <Button variant="outline">
        <Icon name="mdi:cloud-refresh-outline" class="mr-1 size-4" />
        Delete Expired
      </Button>
    </div>
    <div v-if="userAuthed" class="flex gap-2 flex-col">
      <div class="flex flex-row items-center gap-2">
        <Icon name="mdi:cloud" class="size-5" />
        <h1 class="text-xl">Remote Copyboard List</h1>
      </div>
      <div
        class="flex justify-center items-center h-full w-full border relative rounded-lg gap-4 flex-wrap p-2"
      >
        <div
          v-if="loading"
          class="bg-muted w-full h-full flex justify-center items-center absolute"
        >
          <LoadingCycle />
        </div>
        <button
          v-if="remote?.length"
          class="flex items-center w-full md:w-72 truncate text-nowrap overflow-hidden h-full p-1 px-2 border-2 rounded-lg justify-center gap-1 hover:bg-muted transition-all duration-100"
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
          <span class="truncate text-nowrap">{{ i.name?i.name:"<<NO NAME COPYBOARD>>" }}</span>
        </button>
        <div v-else>
          <Badge class="mt-1" variant="secondary"
            ><Icon class="mr-2 size-5" name="mdi:cloud-off-outline" /><span
              class="cursor-default"
              >Remote&nbsp;copyboard&nbsp;list&nbsp;is&nbsp;empty</span
            >
          </Badge>
        </div>
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
        class="flex items-center h-full border relative rounded-lg gap-4 flex-row flex-wrap p-2"
      >
        <div
          v-if="false"
          class="bg-muted w-full h-full flex justify-center items-center absolute"
        >
          <LoadingCycle />
        </div>
        <CopyboardItem
          v-if="local.length"
          v-for="i in local"
          :item="i.body"
          :update-at="i.updateAt"
          :key="i.body.id"
        />
        <div v-else>
          <Badge variant="secondary" class="mt-1"
            ><Icon class="mr-2 size-5" name="mdi:database-off-outline" /><span
              class="cursor-default"
              >No&nbsp;Local&nbsp;Copyboard</span
            >
          </Badge>
        </div>
      </div>
    </div>
  </div>
</template>
