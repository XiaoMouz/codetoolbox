<script setup lang="ts">
import Title from '~/components/Title.vue'
import { encode, decode } from 'js-base64'
import { useToast } from '~/components/ui/toast'

const { toast } = useToast()

useHead({
  title: 'URI Encoder',
  meta: [
    {
      name: 'description',
      content: 'URI Encode, URI Decode',
    },
  ],
})

const mode = ref<'encode' | 'decode'>('encode')

const content = ref('')

const completeEncoding = ref(false)

const batchMode = ref(false)

const result = computed(() => {
  try {
    if (mode.value === 'encode') {
      if (batchMode.value) {
        return content.value
          .split('\n')
          .map((line) => {
            if (completeEncoding.value) {
              return encodeURIComponent(line)
            }
            return encodeURI(line)
          })
          .join('\n')
      }
      if (completeEncoding.value) {
        return encodeURIComponent(content.value)
      }
      return encodeURI(content.value)
    } else {
      if (batchMode.value) {
        return content.value
          .split('\n')
          .map((line) => {
            if (completeEncoding.value) {
              return decodeURIComponent(line)
            }
            return decodeURI(line)
          })
          .join('\n')
      }
      if (completeEncoding.value) {
        return decodeURIComponent(content.value)
      }
      return encodeURI(content.value)
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

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
      copy()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', (e) => {
    if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
      copy()
    }
  })
})

const route = useRoute()
</script>
<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[70%] h-full flex flex-col items-start gap-6">
      <Title
        title="URI Coder"
        icon="mdi:link"
        description="URI Encode, URI Decode"
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
          <Switch id="completeCoding" v-model:checked="completeEncoding"
            ><template #thumb>
              <Icon v-if="completeEncoding" name="mdi:alpha-a-circle" />
              <Icon v-else name="mdi:alpha-a-circle-outline" /> </template
          ></Switch>
          <Label for="completeCoding">Fully</Label>
        </div>
        <div class="flex items-center gap-2">
          <Switch id="batchMode" v-model:checked="batchMode"
            ><template #thumb>
              <Icon v-if="batchMode" name="mdi:format-list-bulleted-square" />
              <Icon v-else name="mdi:format-list-checkbox" /> </template
          ></Switch>
          <Label for="batchMode">Batch</Label>
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
          class="h-[30vh] w-full cursor-pointer"
          readonly
        />
      </div>
      <div class="flex gap-4">
        <Button @click="copy" variant="ghost"
          ><Icon name="mdi:content-copy"
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
