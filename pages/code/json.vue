<script setup lang="ts">
import Title from '~/components/Title.vue'
import { json } from '@codemirror/lang-json'
import { yaml } from '@codemirror/lang-yaml'
import { useToast } from '~/components/ui/toast'
import { convert } from '@catalystic/json-to-yaml'
useHead({
    title: 'JSON Editor',
    meta: [
        {
            name: 'description',
            content: 'JSON Formatter, Compressor',
        },
    ],
})

const code = ref(`{
    "name": "exmaple",
    "description": "a short example json",
    "version": "1.0.0",
    "dependencies": {
        "example": "^1.0.0",
        "example2": "^2.0.0"
    },
    "array": [
        "item1",
        "item2",
        "item3"
    ]
}`)

const yamlCode = computed(() => {
    try {
        const parsed = JSON.parse(code.value)
        return convert(parsed)
    } catch (error) {
        return "null"
    }
})
const { toast } = useToast()
const loaded = ref(false)

async function format() {
    try {
        const formatted = JSON.stringify(JSON.parse(code.value), null, 2)
        code.value = formatted
        toast({
            title: 'Formatted',
            description: 'JSON Formatted Successfully',
        })
    } catch (error: any) {
        const position = error.message.split('at position')[1]
        toast({
            title: 'Error',
            description: 'Invalid JSON:' + position,
            variant: 'destructive',
        })
    }
}

const compress = () => {
    try {
        const compressed = JSON.stringify(JSON.parse(code.value))
        code.value = compressed
        toast({
            title: 'Compressed',
            description: 'JSON Compressed Successfully',
        })
    } catch (error: any) {
        const position = error.message.split('at position')[1]
        toast({
            title: 'Error',
            description: 'Invalid JSON' + position,
            variant: 'destructive',
        })
    }
}

const copy = () => {
    navigator.clipboard.writeText(code.value).then(() => {
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
const paste = async () => {
    try {
        const text = await navigator.clipboard.readText()
        code.value = text
        toast({
            title: 'Pasted',
            description: 'JSON Pasted from Clipboard',
        })
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to paste JSON',
            variant: 'destructive',
        })
    }
}

onMounted(() => {
    loaded.value = true
})

const copyYAML = () => {
    navigator.clipboard.writeText(yamlCode.value || "null").then(() => {
        toast({
            title: 'Copied',
            description: 'YAML Copied to Clipboard',
        })
    }).catch(() => {
        toast({
            title: 'Error',
            description: 'Failed to copy YAML',
            variant: 'destructive',
        })
    })
}

</script>
<template>
    <div class="flex flex-col gap-4 px-8 py-2">
        <div class="flex flex-col gap-2">
            <Title title="JSON" description="A easy editor, Formatter, Compressor" icon='mdi:code-json' />
        </div>
        <div>
            <AppCodeMirror class="h-[80vh] w-full" v-model="code" :lang="json" />
        </div>
        <div>
            <div class="flex flex-row gap-2">
                <Button @click="format" variant="secondary">Formatter</Button>
                <Button @click="compress" variant="outline">Compress</Button>
                <Button @click="copy" variant="ghost">
                    <Icon name="mdi:content-copy" />
                </Button>
                <Button @click="paste" variant="ghost">
                    <Icon name="mdi:content-paste" />
                </Button>
            </div>
        </div>
        <div>
            <AppCodeMirror class="h-[80vh] w-full" v-model="yamlCode" :lang="yaml" />
        </div>
        <div>
            <div class="flex flex-row gap-2">
                <Button @click="copyYAML" variant="ghost">
                    <Icon name="mdi:content-copy" />
                </Button>
            </div>
        </div>
    </div>



</template>