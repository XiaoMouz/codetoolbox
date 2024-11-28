<script setup lang="ts">
import Title from '~/components/Title.vue'
import { html } from '@codemirror/lang-html'
import { useToast } from '~/components/ui/toast'
import * as prettier from 'prettier/standalone'
import * as htmlParser from 'prettier/parser-html'
import * as prettierPluginEstree from 'prettier/plugins/estree'

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
const loaded = ref(false)
async function format() {
  try {
    let formattedCode = prettier.format(code.value, {
      parser: 'html',
      plugins: [htmlParser, prettierPluginEstree],
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
    })
    code.value = await formattedCode
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
function copy() {
  navigator.clipboard.writeText(code.value)
  toast({
    title: 'Copied',
    description: 'CSS code has been copied',
  })
}
function paste() {
  navigator.clipboard.readText().then((text) => {
    code.value = text
    toast({
      title: 'Pasted',
      description: 'CSS code has been pasted',
    })
  })
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
      <AppCodeMirror
        v-model="code"
        @loaded="
          () => {
            loaded = true
          }
        "
        :lang="html"
      />
      <div class="flex flex-wrap flex-row gap-2">
        <Button @click="format" variant="secondary">Formatter</Button>
        <Button @click="compress" variant="outline">Compress</Button>
        <Button @click="copy" variant="ghost"
          ><Icon name="mdi:content-copy"
        /></Button>
        <Button @click="paste" variant="ghost"
          ><Icon name="mdi:content-paste"
        /></Button>
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
