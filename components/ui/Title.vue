<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  icon: string
}>()
</script>

<template>
  <div class="flex flex-row gap-4 items-center">
    <Icon :name="icon" class="w-12 h-12" />
    <div>
      <h1 class="text-4xl font-bold">{{ title }}</h1>
      <p class="text-lg text-muted-foreground">{{ description }}</p>
    </div>
  </div>
</template>
