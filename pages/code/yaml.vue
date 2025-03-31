<script setup lang="ts">
import Title from '~/components/Title.vue'
import { yaml } from '@codemirror/lang-yaml'
import { json } from '@codemirror/lang-json'
import yamlLib from 'yaml'

import { useToast } from '~/components/ui/toast'
useHead({
    title: 'YAML Editor',
    meta: [
        {
            name: 'description',
            content: 'Parse to JSON',
        },
    ],
})
const code = ref(`# YAML Example
name: YAML Example
description: A simple YAML example
version: 1.0
dependencies:
  - name: yaml
    version: ^1.0.0
  - name: js-yaml
    version: ^4.1.0
array:
  - item1
  - item2
  - item3`)
const { toast } = useToast()

const jsonCode = computed(() => {
    try {
        const parsed = yamlLib.parse(code.value)
        return JSON.stringify(parsed, null, 2)
    } catch (error) {
        return "null"
    }
})

const loaded = ref(false)

const copyYAML = () => {
    navigator.clipboard.writeText(code.value).then(() => {
        toast({
            title: 'Copied',
            description: 'YAML Copied to Clipboard',
        })
    }).catch(() => {
        toast({
            title: 'Error',
            description: 'Failed to copy JSON',
            variant: 'destructive',
        })
    })
}
const pasteToYAML = async () => {
    try {
        const text = await navigator.clipboard.readText()
        code.value = text
        toast({
            title: 'Pasted',
            description: 'YAML Pasted from Clipboard',
        })
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to paste YAML',
            variant: 'destructive',
        })
    }
}

const copyJSON = () => {
    navigator.clipboard.writeText(jsonCode.value || "null").then(() => {
        toast({
            title: 'Copied',
            description: 'JSON Copied to Clipboard',
        })
    }).catch(() => {
        toast({
            title: 'Error',
            description: 'Failed to copy JSON',
            variant: 'destructive',
        })
    })
}



onMounted(() => {
    loaded.value = true
})

</script>
<template>
    <div class="flex flex-col gap-4 px-8 py-2">
        <div class="flex flex-col gap-2">
            <Title title="YAML" description="A easy editor, Formatter, Compressor" icon='file-icons:yaml-alt4' />
        </div>
        <div>
            <AppCodeMirror class="h-[80vh] w-full" v-model="code" :lang="yaml" />
        </div>
        <div>
            <div class="flex flex-row gap-2">
                <Button @click="copyYAML" variant="ghost">
                    <Icon name="mdi:content-copy" />
                </Button>
                <Button @click="pasteToYAML" variant="ghost">
                    <Icon name="mdi:content-paste" />
                </Button>
            </div>
        </div>
        <div>
            <AppCodeMirror class="h-[80vh] w-full" v-model="jsonCode" :lang="json" />
        </div>
        <div>
            <div class="flex flex-row gap-2">
                <Button @click="copyJSON" variant="ghost">
                    <Icon name="mdi:content-copy" />
                </Button>
            </div>
        </div>
    </div>



</template>