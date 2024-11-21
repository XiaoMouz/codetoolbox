<script setup lang="ts">
import type { IEncodeOption } from 'tc-qrcode/type'
import QRCode from '~/components/app/QRCode.vue'
import Title from '~/components/Title.vue'

const dark = useDark()

const content = ref('')

const forecolor = computed(() => (dark.value ? '#ffffff' : '#000000'))

const options = computed<IEncodeOption>(() => {
  return {
    text: content.value,
    size: 256,
    foreground: forecolor.value,
    background: '#ffffff00',
    correctLevel: 3,
    pdground: forecolor.value,
    image: undefined,
    imageSize: undefined,
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
      <div class="flex">
        <ClientOnly>
          <div class="border-4 p-2 rounded-xl">
            <QRCode :options="options" />
          </div>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
