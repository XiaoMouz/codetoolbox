<script lang="ts">
export default {
  name: 'colorPicker',
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue: string
    defaultColor?: string
    disabled?: boolean
  }>(),
  {
    defaultColor: '#000000',
  }
)
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const openStatus = ref(false)
const openPanel = () => {
  openStatus.value = !props.disabled
}
const colorPicker = ref<HTMLInputElement | null>(null)

const closePanel = () => {
  openStatus.value = false
}
onClickOutside(colorPicker, closePanel)

const hoveColor = ref('')
const handleOver = (color: string) => {
  hoveColor.value = color
}

const tColor = [
  '#ffffff',
  '#000000',
  '#eeece1',
  '#1e497b',
  '#4e81bb',
  '#e2534d',
  '#9aba60',
  '#8165a0',
  '#47acc5',
  '#f9974c',
]

const colorConfig = [
  ['#7f7f7f', '#f2f2f2'],
  ['#0d0d0d', '#808080'],
  ['#1c1a10', '#ddd8c3'],
  ['#0e243d', '#c6d9f0'],
  ['#233f5e', '#dae5f0'],
  ['#632623', '#f2dbdb'],
  ['#4d602c', '#eaf1de'],
  ['#3f3150', '#e6e0ec'],
  ['#1e5867', '#d9eef3'],
  ['#99490f', '#fee9da'],
]

const bColor = [
  '#c21401',
  '#ff1e02',
  '#ffc12a',
  '#ffff3a',
  '#90cf5b',
  '#00af57',
  '#00afee',
  '#0071be',
  '#00215f',
  '#72349d',
]
const html5Color = props.modelValue

const showPanelColor = computed(() => {
  if (hoveColor.value) {
    return hoveColor
  } else {
    return showColor
  }
})

const showColor = computed(() => {
  if (props.modelValue) {
    return props.modelValue
  } else {
    return props.defaultColor
  }
})

const colorPanel = computed(() => {
  let colorArr = []
  for (let color of colorConfig) {
    colorArr.push(gradient(color[1], color[0], 5))
  }
  return colorArr
})

const html5ColorEl = ref<HTMLInputElement | null>(null)
const triggerHtml5Color = () => {
  html5ColorEl.value?.click()
}

const updataValue = (value: string) => {
  emits('update:modelValue', value)
  emits('change', value)
  openStatus.value = false
}

const handleDefaultColor = () => {
  updataValue(props.defaultColor)
}

const parseColor = (hexStr: string) => {
  if (hexStr.length === 4) {
    return (hexStr =
      '#' +
      hexStr[1] +
      hexStr[1] +
      hexStr[2] +
      hexStr[2] +
      hexStr[3] +
      hexStr[3])
  } else {
    return hexStr
  }
}

const rgbToHex = (r: number, g: number, b: number) => {
  const hex = ((r << 16) | (g << 8) | b).toString(16)
  return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex
}

const hexToRgb = (hex: string) => {
  hex = parseColor(hex)
  let rgb = []
  for (let i = 1; i < 7; i += 2) {
    rgb.push(parseInt('0x' + hex.slice(i, i + 2)))
  }
  return rgb
}

const gradient = (startColor: string, endColor: string, step: number) => {
  let sColor = hexToRgb(startColor)
  let eColor = hexToRgb(endColor)
  let rStep = (eColor[0] - sColor[0]) / step
  let gStep = (eColor[1] - sColor[1]) / step
  let bStep = (eColor[2] - sColor[2]) / step
  let gradientColorArr = []
  for (let i = 0; i < step; i++) {
    gradientColorArr.push(
      rgbToHex(
        rStep * i + sColor[0],
        gStep * i + sColor[1],
        bStep * i + sColor[2]
      )
    )
  }
  return gradientColorArr
}
</script>

<template>
  <div
    class="m-colorPicker"
    ref="colorPicker"
    @click="
      (event) => {
        event.stopPropagation()
      }
    "
  >
    <div
      class="colorBtn rounded"
      :style="`background-color: ${showColor}`"
      @click="openPanel"
      :class="{ disabled: disabled }"
    ></div>
    <!-- 颜色色盘 -->
    <div
      class="box bg-background border rounded-lg shadow-md"
      :class="{ open: openStatus }"
    >
      <div class="hd">
        <div
          class="colorView rounded"
          :style="{ 'background-color': showPanelColor.value }"
        ></div>
        <div
          class="defaultColor rounded hover:bg-muted"
          @click="handleDefaultColor"
          @mouseover="handleOver(defaultColor)"
          @mouseout="handleOver('')"
        >
          <span>Default</span>
        </div>
      </div>
      <div class="bd flex flex-col gap-2">
        <div>
          <p>Theme</p>
          <ul class="tColor">
            <li
              class="rounded"
              v-for="(color, index) of tColor"
              :key="index"
              :style="{ backgroundColor: color }"
              @mouseover="handleOver(color)"
              @mouseout="handleOver('')"
              @click="updataValue(color)"
            ></li>
          </ul>
        </div>

        <div>
          <ul class="bColor">
            <li v-for="(item, index) of colorPanel" :key="index">
              <ul class="flex flex-col gap-1">
                <li
                  class="rounded"
                  v-for="(color, cindex) of item"
                  :key="cindex"
                  :style="{ backgroundColor: color }"
                  @mouseover="handleOver(color)"
                  @mouseout="handleOver('')"
                  @click="updataValue(color)"
                ></li>
              </ul>
            </li>
          </ul>
        </div>
        <div>
          <p>Standard</p>
          <ul class="tColor">
            <li
              class="rounded"
              v-for="(color, index) of bColor"
              :key="index"
              :style="{ backgroundColor: color }"
              @mouseover="handleOver(color)"
              @mouseout="handleOver('')"
              @click="updataValue(color)"
            ></li>
          </ul>
        </div>
        <div
          class="cursor-pointer p-1 rounded-md hover:bg-muted"
          @click="triggerHtml5Color"
        >
          Color Picker...
        </div>

        <input
          type="color"
          ref="html5ColorEl"
          v-model="html5Color"
          @change="updataValue(html5Color)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.m-colorPicker {
  position: relative;
  text-align: left;
  font-size: 14px;
  display: inline-block;
  outline: none;
}

.m-colorPicker ul,
.m-colorPicker li,
.m-colorPicker ol {
  list-style: none;
  margin: 0;
  padding: 0;
}

.m-colorPicker .colorBtn {
  width: 15px;
  height: 15px;
}

.m-colorPicker .colorBtn.disabled {
  cursor: no-drop;
}

.m-colorPicker .box {
  position: absolute;
  width: 190px;
  visibility: hidden;
  margin-top: 2px;
  padding: 10px;
  padding-bottom: 5px;
  opacity: 0;
  transition: all 0.3s ease;
  box-sizing: content-box;
}

.m-colorPicker .box h3 {
  margin: 0;
  font-size: 14px;
  font-weight: normal;
  margin-top: 10px;
  margin-bottom: 5px;
  line-height: 1;
  color: #333;
}

.m-colorPicker .box input {
  visibility: hidden;
  position: absolute;
  left: 0;
  bottom: 0;
}

.m-colorPicker .box.open {
  visibility: visible;
  opacity: 1;
  z-index: 1;
}

.m-colorPicker .hd {
  overflow: hidden;
  line-height: 29px;
}

.m-colorPicker .hd .colorView {
  width: 100px;
  height: 30px;
  float: left;
  transition: background-color 0.3s ease;
}

.m-colorPicker .hd .defaultColor {
  width: 80px;
  float: right;
  text-align: center;
  border: 1px solid #ddd;
  cursor: pointer;
}

.m-colorPicker .tColor li {
  width: 15px;
  height: 15px;
  display: inline-block;
  margin: 0 2px;
  transition: all 0.3s ease;
}

.m-colorPicker .tColor li:hover {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  transform: scale(1.3);
}

.m-colorPicker .bColor li {
  width: 15px;
  display: inline-block;
  margin: 0 2px;
}

.m-colorPicker .bColor li li {
  display: block;
  width: 15px;
  height: 15px;
  transition: all 0.3s ease;
  margin: 0;
}

.m-colorPicker .bColor li li:hover {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  transform: scale(1.3);
}
</style>
