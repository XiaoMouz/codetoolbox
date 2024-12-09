<script setup lang="ts">
import Title from '~/components/Title.vue'
import { useToast } from '~/components/ui/toast'

const { toast } = useToast()

useHead({
  title: 'Online Copyboard',
  meta: [
    {
      name: 'description',
      content: 'A Online copyboard to store your text',
    },
  ],
})
</script>

<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[70%] h-full flex flex-col items-start gap-6">
      <Title
        title="Online Copyboard"
        icon="mdi:file-cloud"
        description="A Online copyboard to store your text"
      />
    </div>
  </div>
</template>
