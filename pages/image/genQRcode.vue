<script setup lang="ts">
import type { IEncodeOption } from 'tc-qrcode/type'
import QRCode from '~/components/app/QRCode.vue'
import Title from '~/components/Title.vue'
import Label from '~/components/ui/label/Label.vue'

const dark = useDark()

const content = ref('')

const forecolor = computed(() => (dark.value ? '#ffffff' : '#000000'))

const config = reactive<{
  size: number[]
  correctLevel: 0 | 1 | 2 | 3 | undefined
  image: string | undefined
  imageSize: number[] | undefined
}>({
  size: [256],
  correctLevel: 3,
  image: undefined,
  imageSize: undefined,
})

const options = computed<IEncodeOption>(() => {
  return {
    text: content.value,
    size: config.size[0],
    foreground: forecolor.value,
    background: '#ffffff00',
    correctLevel: config.correctLevel,
    pdground: forecolor.value,
    image: config.image,
    imageSize: config.imageSize?.[0],
  }
})
</script>
<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[70%] h-full flex flex-col items-start gap-6">
      <Title
        title="Generate QR Code"
        icon="mdi:qrcode"
        description="Just generate QR Code from input"
      />
      <Textarea class="h-[15vh] w-full" v-model="content" />
      <div class="flex flex-col md:flex-row justify-between w-full gap-4">
        <div class="flex flex-col gap-4">
          <div class="flex flex-row items-center gap-2">
            <Icon name="mdi:resize" class="size-6" />
            <div class="flex flex-col gap-1">
              <Label class="flex flex-row items-center"
                >Size: {{ config.size[0] }}</Label
              >
              <Slider
                class="w-64 md:w-72 xl:w-80"
                v-model:model-value="config.size"
                :default-value="[256]"
                :min="128"
                :max="512"
                :step="32"
              />
            </div>
          </div>
          <div class="flex flex-row items-center gap-2">
            <Icon name="mdi:image-size-select-large" class="size-6" />
            <div class="flex flex-col gap-1">
              <Label class="flex flex-row items-center"
                >ImageSize: {{ config.imageSize?.[0] }}</Label
              >
              <Slider
                class="w-64 md:w-72 xl:w-80"
                v-model:model-value="config.imageSize"
                :default-value="[32]"
                :min="16"
                :max="config.size[0] / 2"
                :step="4"
              />
            </div>
          </div>
        </div>
        <ClientOnly>
          <div>
            <QRCode class="rounded-xl p-2 border-2" :options="options" />
          </div>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
