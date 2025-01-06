<script setup lang="ts">
import Title from '~/components/Title.vue'
import { css } from '@codemirror/lang-css'
import { useToast } from '~/components/ui/toast'
import * as prettier from 'prettier/standalone'
import * as postcss from 'prettier/parser-postcss'
import * as prettierPluginEstree from 'prettier/plugins/estree'

const { toast } = useToast()

useHead({
  title: 'CSS Formatter, Compressor',
  meta: [
    {
      name: 'description',
      content: 'CSS Formatter, Compressor',
    },
  ],
})

const code = ref(`@import url('something.css');

body {
  margin: 0;
  padding: 3em 6em;
  font-family: tahoma, arial, sans-serif;
  color: #000;
}

#navigation a {
  font-weight: bold;
  text-decoration: none !important;
}

h1 {
  font-size: 2.5em;
}

h2 {
  font-size: 1.7em;
}

h1:before,
h2:before {
  content: '::';
}

code {
  font-family: courier, monospace;
  font-size: 80%;
  color: #418a8a;
}
`)

onMounted(() => {})

const loaded = ref(false)

async function format() {
  try {
    let formattedCode = prettier.format(code.value, {
      parser: 'css',
      plugins: [postcss, prettierPluginEstree],
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
    })
    code.value = await formattedCode

    toast({
      title: 'Formatted',
      description: 'CSS code has been formatted',
    })
  } catch (e: any) {
    toast({
      title: 'Error',
      description: e.message,
      variant: 'destructive',
    })
  }
}

async function minified() {
  try {
    const result = await fetch('/api/code/css', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ code: code.value }),
    })
    const data = await result.json()

    code.value = data?.result?.styles
    toast({
      title: 'Compressed',
      description: 'CSS code has been compressed',
    })
  } catch (e: any) {
    console.error(e)
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
    <div
      v-show="loaded"
      class="w-[90%] xl:w-[70%] h-full flex flex-col items-start gap-6"
    >
      <Title
        title="CSS"
        icon="mdi:language-css3"
        description="CSS Formatter, Compressor"
      />
      <AppCodeMirror
        v-model="code"
        @loaded="
          () => {
            loaded = true
          }
        "
        :lang="css"
      />
      <div class="flex flex-row gap-2">
        <Button @click="format" variant="secondary">Formatter</Button>
        <Button @click="minified" variant="outline">Minify </Button>
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
