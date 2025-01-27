<script setup lang="ts">
// @ts-ignore

const download = async () => {
  try {

  } catch (error) {
    console.error(error)
  }
}
</script>
<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[90%] xl:w-[70%] h-full flex flex-col items-start gap-6">
      <Title title="File Share" icon="mdi:cloud-print-outline"
        description="Small file sharing, storage max 10GB for 7 days" />
    </div>
    <Button @click="download">
      <span>Download</span>
      <Icon name="mdi:download" />
    </Button>
  </div>
</template>
