<script setup lang="ts">
import Title from '~/components/Title.vue'

const content = ref('')
</script>
<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[70%] h-full flex flex-col items-start gap-6">
      <Title
        title="Generate QR Code"
        icon="mdi:qrcode"
        description="Just generate QR Code from input"
      />
      <Textarea class="h-[15vh] w-full" v-model:model-value="content" />
      <div class="flex"></div>
    </div>
  </div>
</template>
