<script setup lang="ts">
import Title from '~/components/ui/Title.vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { dracula, noctisLilac } from 'thememirror'
import ScrollArea from '~/components/ui/scroll-area/ScrollArea.vue'
import { useToast } from '~/components/ui/toast'
import * as prettier from 'prettier/standalone'
import * as parserBabel from 'prettier/parser-babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import { obfuscate as javascriptObfuscator } from 'javascript-obfuscator'

import { minify } from 'terser'

const { toast } = useToast()
const code =
  ref(`// Demo code (the actual new parser character stream implementation)

function StringStream(string) {
  this.pos = 0
  this.string = string
}

StringStream.prototype = {
  done: function () {
    return this.pos >= this.string.length
  },
  peek: function () {
    return this.string.charAt(this.pos)
  },
  next: function () {
    if (this.pos < this.string.length) return this.string.charAt(this.pos++)
  },
  eat: function (match) {
    var ch = this.string.charAt(this.pos)
    if (typeof match == 'string') var ok = ch == match
    else var ok = ch && match.test ? match.test(ch) : match(ch)
    if (ok) {
      this.pos++
      return ch
    }
  },
  eatWhile: function (match) {
    var start = this.pos
    while (this.eat(match));
    if (this.pos > start) return this.string.slice(start, this.pos)
  },
  backUp: function (n) {
    this.pos -= n
  },
  column: function () {
    return this.pos
  },
  eatSpace: function () {
    var start = this.pos
    while (/\s/.test(this.string.charAt(this.pos))) this.pos++
    return this.pos - start
  },
  match: function (pattern, consume, caseInsensitive) {
    if (typeof pattern == 'string') {
      function cased(str) {
        return caseInsensitive ? str.toLowerCase() : str
      }
      if (cased(this.string).indexOf(cased(pattern), this.pos) == this.pos) {
        if (consume !== false) this.pos += str.length
        return true
      }
    } else {
      var match = this.string.slice(this.pos).match(pattern)
      if (match && consume !== false) this.pos += match[0].length
      return match
    }
  }
}`)
const extensions = [
  javascript(),
  useDark().value ? dracula : noctisLilac,
  EditorView.lineWrapping,
]
onMounted(() => {})

const loaded = ref(false)

const view = shallowRef()
const handleReady = (payload: {
  view: EditorView
  state: EditorState
  container: HTMLDivElement
}) => {
  view.value = payload.view
  loaded.value = true
}

async function format() {
  try {
    let formattedCode = prettier.format(code.value, {
      parser: 'babel',
      plugins: [parserBabel, prettierPluginEstree],
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
    })
    code.value = await formattedCode

    toast({
      title: 'Formatted',
      description: 'JavaScript code has been formatted',
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
    var result = await minify(code.value, { sourceMap: false })
    code.value = result.code || code.value
    toast({
      title: 'Compressed',
      description: 'JavaScript code has been compressed',
    })
  } catch (e: any) {
    toast({
      title: 'Error',
      description: e.message,
      variant: 'destructive',
    })
  }
}

async function obfuscate() {
  try {
    const obfuscationResult = javascriptObfuscator(code.value, {
      compact: true,
      controlFlowFlattening: true,
      deadCodeInjection: true,
      stringArray: true,
    })

    code.value = obfuscationResult.getObfuscatedCode()
    code.value = await prettier.format(code.value, {
      parser: 'babel',
      plugins: [parserBabel, prettierPluginEstree],

      semi: true,
      singleQuote: true,
      trailingComma: 'all',
    })

    toast({
      title: 'Obfuscated',
      description: 'JavaScript code has been Obfuscated',
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
        title="JavaScript"
        icon="mdi:language-javascript"
        description="JavaScript Formatter, Compressor"
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
        <Button @click="minified" variant="outline">Minify</Button>
        <Button @click="obfuscate" variant="secondary">Obfuscation</Button>
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
