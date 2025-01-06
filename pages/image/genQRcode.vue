<script setup lang="ts">
import type { IEncodeOption } from 'tc-qrcode/type'
import QRCode from '~/components/app/QRCode.vue'
import Title from '~/components/Title.vue'
import Label from '~/components/ui/label/Label.vue'

const dark = useDark()

useHead({
  title: 'Generate QR Code',
  meta: [
    {
      name: 'description',
      content: 'Generate QR Code',
    },
  ],
})

const loaded = ref(false)

const content = ref('')

const selectedForeColor = ref<string>(dark.value ? '#ffffff' : '#000000')

const selectedBackColor = ref<string>('#ffffff00')

const selectedCurrectLevel = ref<'0' | '1' | '2' | '3'>('3')

watch(dark, (value) => {
  if (
    selectedForeColor.value === '#000000' ||
    selectedForeColor.value === '#ffffff'
  ) {
    selectedForeColor.value = value ? '#ffffff' : '#000000'
  }
})

const config = reactive<{
  size: number[]
  image: string | undefined
  imageSize: number[] | undefined
}>({
  size: [256],
  image: undefined,
  imageSize: undefined,
})

const options = computed<IEncodeOption>(() => {
  return {
    text: content.value,
    size: config.size[0],
    foreground: selectedForeColor.value,
    background: selectedBackColor.value,
    correctLevel: parseInt(selectedCurrectLevel.value) as 0 | 1 | 2 | 3,
    pdground: selectedForeColor.value,
    image: config.image,
    imageSize: config.imageSize?.[0],
  }
})

function reciveImage(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  console.log(file)
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      config.image = e.target?.result as string
      config.imageSize = [32]
      console.log(config.image)
    }
    reader.readAsDataURL(file)
  }
}

onMounted(() => {
  loaded.value = true
})
</script>
<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div
      v-show="loaded"
      class="w-[90%] xl:w-[70%] h-full flex flex-col items-start gap-6"
    >
      <Title
        title="Generate QR Code"
        icon="mdi:qrcode"
        description="Just generate QR Code from input"
      />
      <Textarea class="h-[15vh] w-full" v-model="content" />
      <div class="flex flex-col md:flex-row justify-between w-full gap-8">
        <div class="flex flex-col gap-6">
          <div class="flex flex-row items-center gap-2">
            <Icon name="mdi:resize" class="size-6" />
            <div class="flex flex-col gap-1 w-full">
              <Label class="flex flex-row items-center"
                >Size: {{ config.size[0] }}</Label
              >
              <Slider
                class="w-full md:w-72 xl:w-80"
                v-model:model-value="config.size"
                :default-value="[256]"
                :min="128"
                :max="512"
                :step="16"
              />
            </div>
          </div>
          <div class="flex flex-row items-center gap-2">
            <Icon name="mdi:package-variant-closed-remove" class="size-6" />
            <div class="flex flex-col gap-1 w-full">
              <Label class="flex flex-row items-center">Correct Level:</Label>
              <Select v-model="selectedCurrectLevel" class="w-full">
                <SelectTrigger>
                  <SelectValue placeholder="Select a Correct Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="flex flex-row items-center gap-2">
            <Icon name="mdi:arrange-bring-forward" class="size-6" />
            <div class="flex flex-col gap-1 w-full">
              <Label class="flex flex-row items-center"
                >Foreground Color:</Label
              >
              <ClientOnly>
                <div class="relative w-full max-w-sm items-center">
                  <Input
                    v-model="selectedForeColor"
                    type="text"
                    placeholder="Foreground Color"
                    class="pl-10"
                  />
                  <span
                    class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
                  >
                    <ColorPicker v-model="selectedForeColor" />
                  </span>
                </div>
              </ClientOnly>
            </div>
          </div>
          <div class="flex flex-row items-center gap-2">
            <Icon name="mdi:arrange-send-backward" class="size-6" />
            <div class="flex flex-col gap-1 w-full">
              <Label class="flex flex-row items-center"
                >Background Color:</Label
              >
              <ClientOnly>
                <div class="relative w-full max-w-sm items-center">
                  <Input
                    v-model="selectedBackColor"
                    type="text"
                    placeholder="Foreground Color"
                    class="pl-10"
                  />
                  <span
                    class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
                  >
                    <ColorPicker v-model="selectedBackColor" />
                  </span>
                </div>
              </ClientOnly>
            </div>
          </div>
          <div class="flex flex-row items-center gap-2">
            <Icon name="mdi:image-plus-outline" class="size-6" />
            <div class="flex flex-col gap-1 w-full">
              <Label class="flex gap-2 flex-row items-center">
                Image <Badge>WIP</Badge></Label
              >

              <Input
                @change="reciveImage"
                accept="image/*"
                type="file"
                disabled
              />
            </div>
          </div>
          <div v-if="config.image" class="flex flex-row items-center gap-2">
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
    <div
      v-show="!loaded"
      class="flex items-center justify-center w-full h-full"
    >
      <LoadingCycle />
    </div>
  </div>
</template>
