<script setup lang="ts">
import Title from '~/components/ui/Title.vue'
import { Codemirror } from 'vue-codemirror'
import { html } from '@codemirror/lang-html'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { dracula, noctisLilac } from 'thememirror'
import ScrollArea from '~/components/ui/scroll-area/ScrollArea.vue'
import { useToast } from '~/components/ui/toast'
const { toast } = useToast()
const code = ref(`<html style="color: green">
  <!-- this is a comment -->
  <head>
    <title>Mixed HTML Example</title>
    <style>
      h1 {
        font-family: comic sans;
        color: #f0f;
      }
      div {
        background: yellow !important;
      }
      body {
        max-width: 50em;
        margin: 1em 2em 1em 5em;
      }
    </style>
  </head>
  <body>
    <h1>Mixed HTML Example</h1>
  </body>
</html>
`)
const extensions = [
  html(),
  useDark().value ? dracula : noctisLilac,
  EditorView.lineWrapping,
]
onMounted(() => {
  console.log(extensions, useDark().value)
})

const loaded = ref(false)

// Codemirror EditorView instance ref
const view = shallowRef()
const handleReady = (payload: {
  view: EditorView
  state: EditorState
  container: HTMLDivElement
}) => {
  view.value = payload.view
  loaded.value = true
}

function format() {
  try {
    let html = code.value
    var tab = '\t'
    var result = ''
    var indent = ''

    html.split(/>\s*</).forEach(function (element) {
      if (element.match(/^\/\w/)) {
        indent = indent.substring(tab.length)
      }

      result += indent + '<' + element + '>\r\n'

      if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith('input')) {
        indent += tab
      }
    })

    code.value = result.substring(1, result.length - 3)
    toast({
      title: 'Formatted',
      description: 'HTML code has been formatted',
    })
  } catch (e: any) {
    toast({
      title: 'Error',
      description: e.message,
      variant: 'destructive',
    })
  }
}

function compress() {
  try {
    let html = code.value
    html = html.replace(/>\s+</g, '><')
    code.value = html
    toast({
      title: 'Compressed',
      description: 'HTML code has been compressed',
    })
  } catch (e: any) {
    toast({
      title: 'Error',
      description: e.message,
      variant: 'destructive',
    })
  }
}
</script>
<template>
  <div class="flex h-full w-full flex-col items-center">
    <div v-show="loaded" class="w-[70%] h-full flex flex-col items-start gap-6">
      <Title
        title="HTML"
        description="HTML Formatter, Compressor"
        icon="mdi:language-html5"
      />
      <ClientOnly>
        <ScrollArea class="w-full h-[55vh] rounded shadow-lg">
          <codemirror
            v-model="code"
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
      <div class="flex flex-row gap-2">
        <Button @click="format" variant="secondary">Formatter</Button>
        <Button @click="compress" variant="outline">Compress</Button>
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
<style>
.cm-scroller::-webkit-scrollbar {
  display: none;
}
</style>
