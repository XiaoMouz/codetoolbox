<script setup lang="ts">
import { dracula, noctisLilac } from 'thememirror'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { Codemirror } from 'vue-codemirror'

const emit = defineEmits<{
  (e: 'loaded'): void
}>()

const code = defineModel({
  required: true,
  default: '',
})
const props = defineProps<{
  lang: Function
}>()

const view = shallowRef()

const renderRequire = ref(0)

const extensions = ref([
  props.lang(),
  useDark().value ? dracula : noctisLilac,
  EditorView.lineWrapping,
])

watch(
  () => useDark().value,
  (value) => {
    extensions.value[1] = value ? dracula : noctisLilac
    console.log('useDark', value)
    renderRequire.value += 1
    console.log('renderRequire', renderRequire.value)
  }
)

const handleReady = (payload: {
  view: EditorView
  state: EditorState
  container: HTMLDivElement
}) => {
  view.value = payload.view
  emit('loaded')
}
</script>
<template>
  <ClientOnly>
    <ScrollArea class="w-full h-[55vh] rounded shadow-lg">
      <codemirror
        v-model="code"
        :key="renderRequire"
        :style="{
          minHeight: '55vh',
          width: '100%',
          borderRadius: '0.25rem',
          textWrap: 'wrap',
          overflowX: 'hidden',
        }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
        @ready="handleReady"
      />
    </ScrollArea>
  </ClientOnly>
</template>
