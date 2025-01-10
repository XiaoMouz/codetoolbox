<script setup lang="ts">
import Title from '~/components/Title.vue'
import Separator from '~/components/ui/separator/Separator.vue'
import { useToast } from '~/components/ui/toast'

const { toast } = useToast()

useHead({
  title: 'Unicode',
  meta: [
    {
      name: 'description',
      content: 'Convert to HTML entity or unicode',
    },
  ],
})

const mode = ref<'encode' | 'decode'>('encode')

const content = ref('')

const format = ref<
  | 'html-entity'
  | 'html-entity-hex'
  | 'html-entity-code-entity'
  | 'html-entity-hex-code-entity'
  | 'unicode'
>('html-entity')

const decodeFormat = ref<'html-entity' | 'unicode'>('html-entity')

const completeEncoding = ref(true)

const result = computed(() => {
  try {
    if (mode.value === 'encode') {
      if (format.value === 'unicode') {
        return strToUnicodeEscape(content.value, !completeEncoding.value)
      }
      return toHtmlEntities(content.value, {
        partial: !completeEncoding.value,
        mode:
          format.value === 'html-entity-hex' ||
          format.value === 'html-entity-hex-code-entity'
            ? 'hex'
            : 'normal',
        symbol:
          format.value === 'html-entity-code-entity' ||
          format.value === 'html-entity-hex-code-entity'
            ? 'entity'
            : 'normal',
      })
    } else {
      if (decodeFormat.value === 'unicode') {
        return revertToStringFromUnicodeEscape(content.value)
      }
      return decodeHtmlEntities(content.value)
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
  url.searchParams.set('mode', mode.value == 'encode' ? 'decode' : 'encode')
  url.searchParams.set(
    'format',
    mode.value == 'encode'
      ? format.value.includes('html-entity')
        ? 'html-entity'
        : 'unicode'
      : decodeFormat.value || 'html-entity'
  )
  url.searchParams.set('content', encodeURIComponent(result.value || ''))
  navigator.clipboard.writeText(url.toString())
  toast({
    title: 'Copied',
    description: 'URL has been copied to clipboard',
  })
}

const route = useRoute()
const modeFromUrl = route.query.mode as 'encode' | 'decode'
const formatFromUrl = route.query.format as
  | 'html-entity'
  | 'html-entity-hex'
  | 'html-entity-code-entity'
  | 'html-entity-hex-code-entity'
  | 'unicode'
const contentFromUrl = route.query.content as string

if (modeFromUrl == 'encode' || modeFromUrl == 'decode') {
  mode.value = modeFromUrl
}
if (modeFromUrl == 'decode') {
  decodeFormat.value = formatFromUrl.includes('html-entity')
    ? 'html-entity'
    : false || 'unicode'
} else {
  format.value = formatFromUrl || 'unicode'
}

if (contentFromUrl) {
  content.value = decodeURIComponent(contentFromUrl)
}
</script>
<template>
  <div class="flex h-full w-full flex-col items-center mb-8 md:mb-0">
    <div class="w-[90%] xl:w-[70%] h-full flex flex-col items-start gap-6">
      <Title
        title="Unicode"
        icon="mdi:unicode"
        description="Convert to HTML entity or unicode"
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
        <span>&nbsp;</span>
        <div v-if="mode != 'decode'">
          <Select v-model="format">
            <SelectTrigger>
              <SelectValue placeholder="Choose a format" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>HTML Entity {{ '(&#____;)' }}</SelectLabel>
                <SelectItem value="html-entity">
                  <div class="flex items-center flex-row gap-1">
                    <Icon name="mdi:alpha-e-box-outline" class="size-4" />Normal
                  </div></SelectItem
                >
                <SelectItem value="html-entity-hex"
                  ><div class="flex items-center flex-row gap-1">
                    <Icon name="mdi:hexadecimal" class="size-4" /> Hex Format
                  </div></SelectItem
                >
                <SelectItem value="html-entity-code-entity">
                  <div class="flex items-center flex-row gap-1">
                    <Icon name="mdi:symbol" class="size-4" /> Symbol
                  </div>
                </SelectItem>
                <SelectItem value="html-entity-hex-code-entity"
                  ><div class="flex items-center flex-row gap-1">
                    <Icon name="mdi:flip-horizontal" class="size-4" /> Hex
                    Format and Symbol
                  </div>
                </SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Unicode (\u____)</SelectLabel>
                <SelectItem value="unicode">
                  <div class="flex items-center flex-row gap-1">
                    <Icon name="mdi:alpha-u-box-outline" class="size-4" />Normal
                  </div></SelectItem
                >
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div v-else>
          <Select v-model="decodeFormat">
            <SelectTrigger>
              <SelectValue placeholder="Choose a format" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="html-entity">
                  <div class="flex items-center flex-row gap-1">
                    <Icon name="mdi:alpha-e-box-outline" class="size-4" />HTML
                    Entity {{ '(&#____;)' }}
                  </div></SelectItem
                >

                <SelectItem value="unicode">
                  <div class="flex items-center flex-row gap-1">
                    <Icon
                      name="mdi:alpha-u-box-outline"
                      class="size-4"
                    />Unicode (\u____)
                  </div></SelectItem
                >
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div v-if="mode != 'decode'" class="flex items-center gap-2">
          <Switch id="completeEncoding" v-model:checked="completeEncoding"
            ><template #thumb>
              <Icon v-if="completeEncoding" name="mdi:alphabetical-variant" />
              <Icon v-else name="mdi:alphabetical-variant-off" /> </template
          ></Switch>
          <Label for="completeEncoding">Complete Encode</Label>
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
