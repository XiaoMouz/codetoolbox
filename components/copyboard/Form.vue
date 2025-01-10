<script setup lang="ts">
import { Label } from '@/components/ui/label'
import type { Content } from '~/types/dto/copyboard.type'
import { useToast } from '../ui/toast'

const item = defineModel({
  type: Object as PropType<Content>,
  required: true,
})
const dark = useDark()

const selectedForeColor = ref<string>(dark.value ? '#ffffff' : '#000000')

const emit = defineEmits<{
  (e: 'save'): void
  (e: 'delete'): void
}>()

const saveState = ref(true)
const save = () => {
  saveState.value = false
  emit('save')

  setTimeout(() => {
    saveState.value = true
  }, 1000)
}

const router = useRouter()

const deleteThis = () => {
  emit('delete')
  router.push('/share/copyboard')
}

function getURL() {
  return window.location.origin + '/share/copyboard/' + item.value.id
}

function share() {
  const url = new URL(getURL())
  navigator.clipboard.writeText(url.toString())

  const { toast } = useToast()
  toast({
    title: 'Copied',
    description: 'URL has been copied to clipboard',
  })
}

watch(dark, (value) => {
  if (
    selectedForeColor.value === '#000000' ||
    selectedForeColor.value === '#ffffff'
  ) {
    selectedForeColor.value = value ? '#ffffff' : '#000000'
  }
})
</script>
<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="flex flex-row gap-2 items-center">
      <Icon name="mdi:clipboard-edit-outline" class="size-5" />
      <h1 class="text-xl">Copyboard</h1>
    </div>
    <div class="w-[80%] h-full flex flex-col items-start gap-6">
      <div class="flex flex-row w-full gap-2 items-center">
        <Icon name="mdi:tag" class="size-5" />
        <Input v-model="item.name" placeholder="Copyboard Title" />
      </div>
      <div class="flex flex-col md:flex-row w-full h-full gap-4">
        <div class="flex flex-col gap-4">
          <div class="flex border p-2 rounded-xl shadow-lg flex-col gap-2">
            <div class="flex flex-col gap-2">
              <div class="flex flex-row gap-2 items-center">
                <Icon name="mdi:account-file-text-outline" class="size-5" />
                <Label placeholder="Uploader">
                  {{ item.uploader ? item.uploader : 'Anonymous' }}
                </Label>
              </div>
              <div class="flex flex-row gap-2 items-center">
                <Icon name="mdi:delete-clock-outline" class="size-5" />
                <Label placeholder="Expire At">
                  Expire at:
                  {{ new Date(item.expireAt).toLocaleString() }}</Label
                >
              </div>
              <div class="flex flex-row gap-2 items-center">
                <Icon name="mdi:clock-plus-outline" class="size-5" />
                <Label placeholder="Created At">
                  Created at: {{ new Date(item.createdAt).toLocaleString() }}
                </Label>
              </div>

              <div class="flex flex-row gap-2 items-center">
                <Icon name="mdi:clock-edit-outline" class="size-5" />
                <Label placeholder="Updated At">
                  Last modified:
                  {{ new Date(item.modifiedAt).toLocaleString() }}
                </Label>
              </div>
              <Button
                @click="save"
                :disabled="!saveState"
                variant="outline"
                class="w-full"
              >
                <Icon name="mdi:cloud-upload-outline" class="mr-1 size-4" />
                Save
              </Button>
            </div>
          </div>
          <div
            v-if="item.id != ''"
            class="flex border p-2 rounded-xl shadow-lg gap-2"
          >
            <Dialog>
              <DialogTrigger as-child>
                <Button variant="outline">
                  <Icon name="mdi:share" class="mr-1 size-4" />
                  Share
                </Button>
                <DialogContent class="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Share to ...</DialogTitle>
                    <DialogDescription>
                      <div class="flex flex-row flex-nowrap gap-2">
                        ID:
                        <div
                          @click="share"
                          class="border cursor-pointer flex items-center gap-1 px-2 rounded shadow-lg"
                        >
                          <Icon name="mdi:link-variant" /> {{ item.id }}
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>

                  <div class="flex items-center justify-center">
                    <div class="rounded-lg border-2 p-2">
                      <AppQRCode
                        class="flex rounded-lg"
                        :options="{
                          text: getURL(),
                          size: 256,
                          foreground: selectedForeColor,
                          background: '#ffffff00',
                          correctLevel: 2,
                          pdground: selectedForeColor,
                          image: undefined,
                          imageSize: undefined,
                        }"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" @click="share"
                      ><Icon name="mdi:share-variant" /> Copy URL</Button
                    >
                  </DialogFooter>
                </DialogContent>
              </DialogTrigger>
            </Dialog>
            <Dialog>
              <DialogTrigger>
                <Button variant="destructive">
                  <Icon name="mdi:delete" class="mr-1 size-4" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle> Sure? </DialogTitle>
                </DialogHeader>

                <DialogFooter>
                  <Button variant="destructive" @click="deleteThis"
                    ><Icon name="mdi:delete" /> Yes</Button
                  >
                  <DialogClose>
                    <Button variant="outline"
                      ><Icon name="mdi:minus" /> No</Button
                    >
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div class="w-full">
          <Textarea v-model="item.content" class="h-full" />
        </div>
      </div>
    </div>
  </div>
</template>
