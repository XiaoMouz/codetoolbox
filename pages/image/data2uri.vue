<script setup lang="ts">
import Title from '~/components/Title.vue'
import Uploader from '~/components/Uploader.vue'
import { useToast } from '~/components/ui/toast'
const { toast } = useToast()

const result = ref('')

function copy() {
  navigator.clipboard.writeText(result.value || '')
  toast({
    title: 'Copied',
    description: 'Result has been copied to clipboard',
  })
}

function paste() {
  navigator.clipboard.readText().then((text) => {
    result.value = text
    toast({
      title: 'Pasted',
      description: 'Text has been pasted',
    })
  })
}
</script>

<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[70%] h-full flex flex-col items-start gap-6">
      <Title
        title="Data URI Convertor"
        icon="mdi:image-multiple-outline"
        description="Convert image, might not just Image, or Json and more..."
      />
      <Uploader class="w-full" />
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
    </div>
  </div>
</template>
