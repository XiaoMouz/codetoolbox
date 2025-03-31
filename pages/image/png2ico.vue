<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'


useHead({
  title: 'PNG to ICO',
  meta: [
    {
      name: 'description',
      content: 'PNG to ICO or Apple ICNS converter',
    },
  ],
})

const format = ref<'ico' | 'icns'>('ico')
const innerFormat = ref<'png' | 'bmp'>('png')
const noc = ref(0)
//scaling is map
const options = {
  0: 'Nearest Neighbor',
  1: 'Bilinear',
  2: 'Bicubic',
  5: 'Bicubic 2',
  3: 'Bezier',
  4: 'Hermite',
}
const scaling = ref<0 | 1 | 2 | 3 | 4 | 5>(0)

const useForExe = ref(false)

const selectedSize = ref([])

async function convert(file: File) {
  //create a buffer for file, not arraybuffer
  const buffer = await new Promise<Buffer>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer
      const buffer = Buffer.from(arrayBuffer)
      resolve(buffer)
    }

    reader.onerror = () => {
      reject(new Error('Failed'))
    }

    reader.readAsArrayBuffer(file)
  })
  if (format.value == 'ico') {

    // const ico = createICO(
    //   buffer,
    //   scaling.value,
    //   noc.value,
    //   innerFormat.value == 'png' ? true : false
    // )
    // console.log(ico)
  }
}
</script>
<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[90%] xl:w-[70%] h-full flex flex-col items-start gap-6">
      <Alert class="flex">
        <Icon class="size-4 mr-2 mt-1" name="mdi:alert-circle-outline" />
        <div>
          <AlertTitle>Working in Progress</AlertTitle>
          <AlertDescription class="flex gap-1">
            You still use it on
            <a class="transition-all font-bold flex items-center hover:underline hover:underline-offset-4"
              target="_blank" href="https://lolicon.dev/#/image/png2ico">
              <Icon name="mdi:link-variant"></Icon>lolicon.dev
            </a>
            or
            <a class="transition-all font-bold flex items-center hover:underline hover:underline-offset-4"
              target="_blank" href="https://xiaomouz.github.io/codetoolbox/#/image/png2ico">
              <Icon name="mdi:link-variant"></Icon>xiaomouz.github.io
            </a>
          </AlertDescription>
        </div>
      </Alert>
      <Title title="PNG to ICO" icon="mdi:image-multiple-outline" description="PNG to ICO or Apple ICNS converter" />
      <Uploader @callback="convert" accept="image/png" class="w-full" />
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <Label for="format">Output format</Label>
          <Select id="format" v-model="format">
            <SelectTrigger>
              <SelectValue placeholder="Select a format" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ico">Microsoft ICO (.ico)</SelectItem>
                <SelectItem value="icns">Apple ICNS (.icns)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div v-if="format == 'ico'">
          <Select id="innerFormat" v-model="innerFormat">
            <Label for="innerFormat">Inner Format</Label>
            <SelectTrigger>
              <SelectValue placeholder="Select an inner format" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="bmp">BMP</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div v-if="format == 'ico'">
          <NumberField id="noc" type="number" v-model="noc" :default-value="0" :min="0" :max="256">
            <Label for="noc">Number of Colors</Label>
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>
        <div>
          <Label for="scaling">Scaling Algorithm</Label>
          <Select id="scaling" :model-value="scaling.toString()" @update:model-value="
            (v) => {
              if (v) scaling = parseInt(v) as 0 | 1 | 2 | 3 | 4 | 5
            }
          ">
            <SelectTrigger>
              <SelectValue placeholder="Select a scaling algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="(value, key) in options" :value="key.toString()">
                  {{ value }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="flex items-center justify-center h-full gap-1">
          <Label for="forExe">
            <HoverCard>
              <HoverCardTrigger>
                <Icon name="mdi:package-variant-closed" class="size-5" />
              </HoverCardTrigger>
              <HoverCardContent>
                <div class="flex flex-col gap-2">
                  <p>Use for EXE</p>
                  <p class="text-sm text-muted-foreground">
                    This will make the ICO file compatible with Windows EXE files.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </Label>
          <div class="h-full flex justify-center items-center">
            <Switch id="forExe" v-model="useForExe" />
          </div>
        </div>
      </div>
      <!-- <div>
        <ToggleGroup v-model:model-value="selectedSize">
          <ToggleGroupItem value="left"> 1 </ToggleGroupItem>
          <ToggleGroupItem value="center"> 2 </ToggleGroupItem>
          <ToggleGroupItem value="right"> 3 </ToggleGroupItem>
        </ToggleGroup>
      </div> -->
      <div class="grid w-full gap-1.5">
        <Label>Result</Label>
      </div>
    </div>
  </div>
</template>
