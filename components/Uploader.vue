<template>
  <div
    class="border relative border-dashed border-foreground transition-all duration-300 rounded-md p-4 text-center cursor-pointer py-8 hover:bg-gray-400 dark:hover:bg-gray-800"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
    @click="triggerFileInput"
  >
    <input
      type="file"
      ref="fileInput"
      :accept="props.accept"
      @change="onFileChange"
      style="display: none"
      multiple
    />
    <div class="text-sm flex flex-col items-center gap-1 relative">
      <div
        class="flex w-10 h-10 items-center justify-center rounded-full transition duration-300 cursor-pointer hover:bg-slate-400 dark:hover:bg-gray-400 fill-gray-900 dark:fill-slate-100 ease-in-out"
      >
        <Transition name="slide">
          <Icon
            v-if="!isUploading"
            name="mdi:cloud-upload-outline"
            class="size-8 absolute"
          />
          <Icon v-else name="mdi:progress-upload" class="size-8 absolute" />
        </Transition>
      </div>
      <div>
        <span v-if="!isUploading">{{ message }}</span>
        <div v-else class="flex flex-row gap-1">
          <span>Processing... {{ progress }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type VNodeRef } from 'vue'
import { useToast } from './ui/toast'

const { toast } = useToast()

const props = defineProps<{
  accept?: string
}>()

const message = ref('Click / Drag / Ctrl + V')
const isUploading = ref(false)
const fileInput = ref<VNodeRef | null>(null)
const progress = ref(0)

// register Ctrl + V ,read image or file from clipboard
const paste = () => {
  navigator.clipboard.read().then(async (clipboardItems) => {
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        if (type === 'image/png') {
          const blob = await clipboardItem.getType(type)
          const file = new File([blob], 'clipboard.png', { type })
          uploadFiles([file])
        }
      }
    }
  })
  toast({
    title: 'Clipboard',
    description: 'Reading image from clipboard',
  })
}

onMounted(() => {
  // key binding
  window.addEventListener('keydown', (e) => {
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      paste()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', (e) => {
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      paste()
    }
  })
})

const emit = defineEmits<{
  decoded: [value: string]
  callback: [value: any]
}>()

const onDragOver = () => {
  message.value = 'Release to upload'
}

const onDragLeave = () => {
  message.value = 'Click / Drag / Ctrl + V'
}

const onDrop = (event: any) => {
  const files = event.dataTransfer.files
  if (files.length) {
    uploadFiles(files)
  }
}

const triggerFileInput = () => {
  if (!fileInput.value || !fileInput.value) return
  fileInput.value.click()
}

const onFileChange = (event: any) => {
  const files = event.target.files
  if (files.length) {
    uploadFiles(files)
  }
}

const uploadFiles = (files: any) => {
  isUploading.value = true
  const totalFiles = files.length
  let uploadedFiles = 0

  const uploadFile = (file: any) => {
    emit('callback', file)
  }

  for (const file of files) {
    message.value = `Handling ${uploadedFiles + 1} of ${totalFiles}`
    uploadFile(file)
    isUploading.value = false
    message.value = 'Click / Drag / Ctrl + V'
  }
}
</script>

<style scoped>
.slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-enter-active,
.slide-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(+20px);
}

.slide-leave-from,
.slide-enter-to {
  opacity: 1;
  transform: translateX(0px);
}
</style>
