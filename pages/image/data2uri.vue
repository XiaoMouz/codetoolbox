<script setup lang="ts">
import Title from '~/components/Title.vue'
import Uploader from '~/components/Uploader.vue'
import { useToast } from '~/components/ui/toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { decode as decodeBase64 } from 'js-base64'

const { toast } = useToast()

const result = ref('')

const content = ref('')

// data uri to text data (like html. json)
const deresult = computed(() => {
  try {
    if (!content.value.startsWith('data:')) return
    return decodeBase64(content.value.split(',')[1])
  } catch (e: any) {
    toast({
      title: 'Error',
      description: e.message,
      variant: 'destructive',
    })
  }
})

useHead({
  title: 'Data URI Convertor',
  meta: [
    {
      name: 'description',
      content: 'Convert image, might not just Image, or Json and more...',
    },
  ],
})

function copy() {
  navigator.clipboard.writeText(result.value || '')
  toast({
    title: 'Copied',
    description: 'Result has been copied to clipboard',
  })
}

function decode(file: any) {
  // get DataURI from image file
  const reader = new FileReader()
  reader.onload = (e) => {
    const dataURI = e.target?.result
    if (typeof dataURI === 'string') {
      result.value = dataURI
    }
  }
  reader.readAsDataURL(file)
}

function isImage(dataURI: string) {
  return dataURI.startsWith('data:image/')
}

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
      copy()
    }
  })
})
</script>

<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[70%] h-full flex flex-col items-start gap-6">
      <Title
        title="Data URI Convertor"
        icon="mdi:image-multiple-outline"
        description="Convert image, might not just Image, or Json and more..."
      />
      <Tabs default-value="toURI" class="w-full">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="toURI"> To Data URI </TabsTrigger>
          <TabsTrigger value="toImage"> To Image </TabsTrigger>
        </TabsList>
        <TabsContent value="toURI">
          <Card>
            <CardContent class="p-4 gap-6 flex flex-col">
              <Uploader @callback="decode" class="w-full" />
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
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="toImage">
          <Card>
            <CardContent class="p-4 gap-6 flex flex-col">
              <div class="grid w-full gap-1.5">
                <Label for="content">Content</Label>
                <Textarea
                  id="content"
                  v-model:model-value="content"
                  class="h-[30vh] w-full"
                />
              </div>
              <div class="grid w-full gap-1.5">
                <Label for="message">Result</Label>
                <img
                  v-if="isImage(content)"
                  :src="content"
                  alt="image"
                  class="max-w-64 max-h-64 border-2 rounded-md p-2"
                />
                <Textarea
                  v-else
                  id="message"
                  @click="copy"
                  v-model:model-value="deresult"
                  class="h-[30vh] w-full cursor-pointer"
                  readonly
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
