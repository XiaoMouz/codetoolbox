<script setup lang="ts">
import Title from '~/components/Title.vue'
import { useToast } from '~/components/ui/toast'
import { modeMap } from '~/utils/hash'
import type { HashMode } from '~/utils/hash'

const { toast } = useToast()

const mode = ref<'calculate'>('calculate')

const format = ref<HashMode>('MD5')

const content = ref('')

const hmacEnable = ref(false)

const hmacKey = ref('')

const result = computed(() => {
  try {
    if (hmacEnable.value) {
      return hmac(content.value, hmacKey.value, format.value)
    }
    return hash(content.value, format.value)
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
      description: 'Result has been pasted',
    })
  })
}
</script>
<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[70%] h-full flex flex-col items-start gap-6">
      <Title title="Hash" icon="mdi:lock" description="Hash" />
      <Textarea class="h-[30vh] w-full" v-model:model-value="content" />
      <div class="flex flex-row gap-4 flex-wrap items-center">
        <Button :disabled="mode === 'calculate'"
          ><div class="flex flex-row items-center gap-1">
            <div class="flex h-4 w-4 items-center">
              <Transition name="fade">
                <Icon
                  name="mdi:package-variant-closed"
                  v-if="mode != 'calculate'"
                  class="absolute"
                />
                <Icon name="mdi:check" class="absolute" v-else />
              </Transition>
            </div>
            Calculate
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
                <SelectItem v-for="mode in modeMap" :value="mode" :key="mode">
                  {{ mode }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div class="flex items-center gap-2">
          <Switch id="hmacEnable" v-model:checked="hmacEnable"
            ><template #thumb>
              <Icon v-if="hmacEnable" name="mdi:key-star" />
              <Icon v-else name="mdi:key-minus" /> </template
          ></Switch>
          <Label for="hmacEnable">HMAC</Label>
        </div>
        <div v-if="hmacEnable" class="flex items-center gap-2">
          <Icon class="size-5" name="mdi:key-outline" />
          <Input
            v-model="hmacKey"
            id="hmacKey"
            placeholder="HMAC Key"
            :disabled="!hmacEnable"
          />
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
