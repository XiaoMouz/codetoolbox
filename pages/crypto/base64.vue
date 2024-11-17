<script setup lang="ts">
import Title from '~/components/Title.vue'
import { encode, decode } from 'js-base64'
import { useToast } from '~/components/ui/toast'

const { toast } = useToast()

const mode = ref<'encode' | 'decode'>('encode')

const content = ref('')

const encodeOrDecodeString = ref(false)

const result = computed(() => {
  try {
    if (mode.value === 'encode') {
      if (encodeOrDecodeString.value) {
        return btoa(encodeURIComponent(content.value))
      }
      return encode(content.value)
    } else {
      if (encodeOrDecodeString.value) {
        return decodeURIComponent(atob(content.value))
      }
      return decode(content.value)
    }
  } catch (e: any) {
    toast({
      title: 'Error',
      description: e.message,
      variant: 'destructive',
    })
  }
})

function copy() {
  navigator.clipboard.writeText(result.value || '')
  toast({
    title: 'Copied',
    description: 'Result has been copied to clipboard',
  })
}

function paste() {
  navigator.clipboard.readText().then((text) => {
    content.value = text
    toast({
      title: 'Pasted',
      description: 'Text has been pasted',
    })
  })
}

function share() {
  const url = new URL(window.location.href)
  url.searchParams.set('mode', mode.value == 'encode' ? 'decode' : 'encode')
  url.searchParams.set('content', result.value || '')
  navigator.clipboard.writeText(url.toString())
  toast({
    title: 'Copied',
    description: 'URL has been copied to clipboard',
  })
}

const route = useRoute()
const modeFromUrl = route.query.mode as 'encode' | 'decode'
const contentFromUrl = route.query.content as string

if (modeFromUrl == 'encode' || modeFromUrl == 'decode') {
  mode.value = modeFromUrl
}
if (contentFromUrl) {
  content.value = contentFromUrl
}
</script>
<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[70%] h-full flex flex-col items-start gap-6">
      <Title
        title="Base64"
        icon="mdi:code-parentheses"
        description="Base 64 Encode, decode, custom code table"
      />
      <Textarea class="h-[30vh] w-full" v-model:model-value="content" />
      <div class="flex flex-row gap-4 flex-wrap items-center">
        <Button
          @click="() => (mode = 'encode')"
          :disabled="mode === 'encode'"
          :variant="mode == 'encode' ? 'default' : 'secondary'"
          ><div class="flex flex-row items-center gap-1">
            <div class="flex h-4 w-4 items-center">
              <Transition name="fade">
                <Icon
                  name="mdi:package-variant-closed"
                  v-if="mode != 'encode'"
                  class="absolute"
                />
                <Icon name="mdi:check" class="absolute" v-else />
              </Transition>
            </div>
            Encode
          </div></Button
        >
        <Button
          @click="() => (mode = 'decode')"
          :disabled="mode === 'decode'"
          :variant="mode == 'decode' ? 'default' : 'secondary'"
          ><div class="flex flex-row items-center gap-1">
            <div class="flex h-4 w-4 items-center">
              <Transition name="fade">
                <Icon
                  name="mdi:package-variant"
                  v-if="mode != 'decode'"
                  class="absolute"
                />
                <Icon name="mdi:check" v-else class="absolute" />
              </Transition>
            </div>
            Decode
          </div></Button
        >

        <div class="flex items-center gap-2">
          <Switch id="encodeString" v-model:checked="encodeOrDecodeString"
            ><template #thumb>
              <Icon v-if="encodeOrDecodeString" name="mdi:attachment" />
              <Icon v-else name="mdi:attachment-remove" /> </template
          ></Switch>
          <Label for="encodeString">Encode String</Label>
        </div>
        <Button variant="link"
          ><div class="flex flex-row items-center gap-1">
            <Icon name="mdi:table" /> Custom Code Table
          </div></Button
        >
        <Button @click="copy" variant="ghost"
          ><Icon name="mdi:content-copy"
        /></Button>
      </div>
      <div class="grid w-full gap-1.5">
        <Label for="message">Result</Label>
        <Textarea
          id="message"
          @click="copy"
          v-model:model-value="result"
          class="h-[30vh] w-full cursor-pointer"
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
