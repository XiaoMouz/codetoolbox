<script setup lang="ts">
import Title from '~/components/ui/Title.vue'
import { javascript } from '@codemirror/lang-javascript'
import { useToast } from '~/components/ui/toast'
import * as prettier from 'prettier/standalone'
import * as parserBabel from 'prettier/parser-babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import javascriptObfuscator from 'javascript-obfuscator'

import { minify } from 'terser'

const { toast } = useToast()
const code = ref(`function StringStream(string) {
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

onMounted(() => {})

const loaded = ref(false)

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
    const obfuscationResult = javascriptObfuscator.obfuscate(code.value, {
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
        title="JavaScript"
        icon="mdi:language-javascript"
        description="JavaScript Formatter, Compressor"
      />
      <AppCodeMirror
        v-model="code"
        @loaded="
          () => {
            loaded = true
          }
        "
        :lang="javascript"
      />
      <div class="flex flex-row gap-2">
        <Button @click="format" variant="secondary">Formatter</Button>
        <Button @click="minified" variant="outline">Minify</Button>
        <Button @click="obfuscate" variant="secondary">Obfuscation</Button>
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
