<script setup lang="ts">
import Title from '~/components/Title.vue'
import { useToast } from '~/components/ui/toast'
import type { CryptoFormat } from '~/utils/crypto'
import { cryptoFormatMap } from '~/utils/crypto'

const { toast } = useToast()

useHead({
  title: 'Encrypt, Decrypt',
  meta: [
    {
      name: 'description',
      content: 'Encrypt, Decrypt',
    },
  ],
})

const mode = ref<'encrypt' | 'decrypt'>('encrypt')

const format = ref<CryptoFormat>('AES')

const content = ref('')

const key = ref('')

const result = computed(() => {
  try {
    if (mode.value === 'encrypt') {
      return encrypt(content.value, key.value, format.value)
    } else {
      return decrypt(content.value, key.value, format.value)
    }
  } catch (e: any) {
    toast({
      title: 'Error',
      description: e.message,
      variant: 'destructive',
    })
  }
})

const { copy, paste } = useCVHotkey(content, result)

function share() {
  const url = new URL(window.location.href)
  url.searchParams.set('mode', mode.value == 'encrypt' ? 'decrypt' : 'encrypt')
  url.searchParams.set('format', format.value)
  url.searchParams.set('key', key.value || '')
  url.searchParams.set('content', result.value || '')
  navigator.clipboard.writeText(url.toString())
  toast({
    title: 'Copied',
    description: 'URL has been copied to clipboard',
  })
}

const route = useRoute()
const modeFromUrl = route.query.mode as 'encrypt' | 'decrypt'
const formatFromUrl = route.query.format as CryptoFormat
const contentFromUrl = route.query.content as string
const keyFromUrl = route.query.key as string

if (modeFromUrl == 'encrypt' || modeFromUrl == 'decrypt') {
  mode.value = modeFromUrl
}
if (formatFromUrl) {
  format.value = formatFromUrl
}
if (keyFromUrl) {
  key.value = keyFromUrl
}
if (contentFromUrl) {
  content.value = contentFromUrl
}
</script>
<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[70%] h-full flex flex-col items-start gap-6">
      <Title
        title="Encrypt"
        icon="mdi:lock"
        description="Symmetric encryption :)"
      />
      <Textarea class="h-[30vh] w-full" v-model:model-value="content" />
      <div class="flex flex-row w-full items-center gap-4">
        <Icon name="mdi:key-outline" class="size-6" /><Input
          v-model="key"
          placeholder="Key"
        />
      </div>
      <div class="flex flex-row gap-4 flex-wrap items-center">
        <Button
          @click="() => (mode = 'encrypt')"
          :disabled="mode === 'encrypt'"
          :variant="mode == 'encrypt' ? 'default' : 'secondary'"
          ><div class="flex flex-row items-center gap-1">
            <div class="flex h-4 w-4 items-center">
              <Transition name="fade">
                <Icon
                  name="mdi:package-variant-closed"
                  v-if="mode != 'encrypt'"
                  class="absolute"
                />
                <Icon name="mdi:check" class="absolute" v-else />
              </Transition>
            </div>
            Encrypt
          </div></Button
        >
        <Button
          @click="() => (mode = 'decrypt')"
          :disabled="mode === 'decrypt'"
          :variant="mode == 'decrypt' ? 'default' : 'secondary'"
          ><div class="flex flex-row items-center gap-1">
            <div class="flex h-4 w-4 items-center">
              <Transition name="fade">
                <Icon
                  name="mdi:package-variant"
                  v-if="mode != 'decrypt'"
                  class="absolute"
                />
                <Icon name="mdi:check" v-else class="absolute" />
              </Transition>
            </div>
            Decrypt
          </div></Button
        >
        <span class="cursor-default">&nbsp;</span>

        <div>
          <Select v-model="format">
            <SelectTrigger>
              <SelectValue placeholder="Choose a format" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="item in cryptoFormatMap"
                  :value="item"
                  :key="item"
                >
                  {{ item }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button @click="paste" variant="ghost"
          ><Icon name="mdi:content-paste"
        /></Button>
      </div>
      <div class="grid w-full gap-1.5">
        <Label for="message">Result</Label>
        <Textarea
          id="message"
          @click="copy"
          v-model:model-value="result"
          class="h-[20vh] w-full cursor-pointer"
          readonly
        />
      </div>
      <div class="flex gap-4">
        <Button @click="copy" variant="ghost"
          ><Icon name="mdi:content-copy"
        /></Button>
        <Button @click="share" variant="ghost"
          ><Icon name="mdi:share-variant"
        /></Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
