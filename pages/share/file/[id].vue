<script setup lang="ts">
// @ts-ignore
import axios from 'axios'

const download = async () => {
  try {
    const response = await axios.get(
      'http://localhost:3000/tool/file/vbO8xU/download',
      {
        headers: {
          'Download-Token': 'JlaBYoqVoRrCwG',
        },
      }
    )

    // handle the response, e.g. download the file
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'file.ext') // or any other extension
    document.body.appendChild(link)
    link.click()
  } catch (error) {
    console.error(error)
  }
}
</script>
<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[90%] xl:w-[70%] h-full flex flex-col items-start gap-6">
      <Title
        title="File Share"
        icon="mdi:cloud-print-outline"
        description="Small file sharing, storage max 10GB for 7 days"
      />
    </div>
    <Button @click="download">
      <span>Download</span>
      <Icon name="mdi:download" />
    </Button>
  </div>
</template>
