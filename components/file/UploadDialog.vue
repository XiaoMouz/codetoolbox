<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { EventMissionQueue, fileEventBus as fileEventBus, updateMission, finishMission, newMission } from '~/event/api/file'


import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'

import { useToast } from '../ui/toast'

const userStore = useUserStore()
const { session } = storeToRefs(userStore)

const userAuthed = computed(() => {
    return session.value && !userStore.isTokenExpired()
})

const { toast } = useToast()


const freezen = ref(false)

const formSchema = toTypedSchema(z.object({
    title: z.string().max(50).optional(),
    description: z.string().min(2).max(200).optional(),
    private: z.boolean().default(false),
    password: z.string().min(4).max(50).optional(),
    file: z.any()
}))

const form = useForm({
    validationSchema: formSchema,
})

const progress = ref(0)

const onSubmit = form.handleSubmit((values) => {
    console.log('Form submitted!', values)
    // create a xhr request 
    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://api.mou.best/tool/file/', true)
    xhr.setRequestHeader('Authorization', session.value ? `${session.value.token}:${session.value.user.email}` : ' ')

    // build payload
    const formData = new FormData()
    values.title ? formData.append('title', values.title) : {}
    values.description ? formData.append('description', values.description) : {}
    formData.append('private', values.private.toString())
    values.password ? formData.append('password', values.password) : {}
    values.file ? formData.append('data', values.file) : {}

    xhr.upload.addEventListener('progress', (e) => {
        console.log(Math.round((e.loaded / e.total) * 100))
        progress.value = Math.round((e.loaded / e.total) * 100)
    })

    xhr.send(formData)
    freezen.value = true

    xhr.upload.addEventListener('load', () => {
        freezen.value = false
        progress.value = 0
        toast({
            title: 'Upload complete',
            description: 'Your file has been uploaded',
        })
    })
})


onUnmounted(() => {
    form.resetForm()
    freezen.value = false
    progress.value = 0
})


const setRandomPassword = () => {
    form.setFieldValue('password', Math.random().toString(36).slice(-8))
    form.values.password ? navigator.clipboard.writeText(form.values.password) : null
    toast({
        title: 'Random password copied',
        description: 'Password copied to clipboard',

    })

}
</script>
<template>
    <Dialog>
        <DialogTrigger as-child>
            <Button :disabled="!userAuthed">
                <Icon name="mdi:upload-box-outline" class="size-5" />
                <span>Upload</span>
            </Button>
        </DialogTrigger>
        <DialogContent
            class="sm:max-w-[425px] md:max-w-[695px] xl:max-w-[50dvw] 2xl:max-w-[40dvw] max-w-[720px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">
            <DialogHeader class="p-6 pb-0">
                <DialogTitle>Upload a new file</DialogTitle>
            </DialogHeader>
            <ScrollArea>
                <div class="p-4">
                    <form @submit="onSubmit">
                        <div class="w-full">
                            <div class="flex md:flex-row flex-col gap-6 w-full  ">
                                <div class="flex-1 md:min-w-40 h-full ">
                                    <div class="flex h-full flex-col md:flex-row gap-4 md:gap-6">
                                        <fieldset class="grid h-full w-full gap-6 rounded-lg border p-4">
                                            <legend
                                                class="-ml-1 px-1 text-sm font-medium flex flex-row items-center gap-1">
                                                <Icon name="mdi:document" /> <span>Info</span>
                                            </legend>
                                            <FormField v-slot="{ componentField }" name="title">
                                                <FormItem>
                                                    <FormLabel>Title</FormLabel>
                                                    <FormControl>
                                                        <Input :disabled="freezen" type="text"
                                                            :placeholder="'Untitled-' + Date.now()"
                                                            v-bind="componentField" />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is your file title.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            </FormField>
                                            <FormField class="h-full" v-slot="{ componentField }" name="description">
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea type="text" :disabled="freezen" :placeholder="''"
                                                            v-bind="componentField" />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is your file description.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            </FormField>
                                        </fieldset>

                                    </div>

                                </div>
                                <div>
                                    <div class="flex flex-col xl:flex-row gap-4 md:gap-6">
                                        <fieldset class="grid w-full gap-6 rounded-lg border p-4">
                                            <legend
                                                class="-ml-1 px-1 text-sm font-medium flex flex-row items-center gap-1">
                                                <Icon name="mdi:file" /> <span>File</span>
                                            </legend>
                                            <!-- <Uploader /> -->
                                            <FormField v-slot="{ componentField }" name="file">
                                                <FormItem>
                                                    <FormLabel>File</FormLabel>
                                                    <FormControl>
                                                        <Input :disabled="freezen" type="file"
                                                            @change="form.setFieldValue('file', $event.target.files[0])" />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Select a file to upload.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>

                                            </FormField>

                                        </fieldset>

                                    </div>
                                    <div class="flex flex-col md:flex-row gap-4 md:gap-6">
                                        <fieldset class="grid w-full gap-6 rounded-lg border p-4">
                                            <legend
                                                class="-ml-1 px-1 text-sm font-medium flex flex-row items-center gap-1">
                                                <Icon name="mdi:lock" /> <span>Privacy</span>
                                            </legend>
                                            <FormField v-slot="{ componentField }" name="private">
                                                <FormItem>
                                                    <div class="flex justify-between items-center">
                                                        <FormLabel>Private?</FormLabel>
                                                        <FormControl>
                                                            <Switch :disabled="freezen" v-bind="componentField" />
                                                        </FormControl>
                                                    </div>
                                                    <FormDescription>
                                                        Only you can access this file.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            </FormField>
                                            <FormField v-slot="{ componentField }" name="password">
                                                <FormItem>
                                                    <FormLabel>
                                                        Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input :disabled="freezen" type="password"
                                                            placeholder="Keep empty for public file"
                                                            v-bind="componentField" />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Set a password to protect your file.
                                                    </FormDescription>
                                                    <Button :disabled="freezen" @click="setRandomPassword"
                                                        variant="ghost">
                                                        <Icon name="mdi:refresh" /> Random
                                                    </Button>
                                                    <FormMessage />

                                                </FormItem>
                                            </FormField>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                            <div class="flex gap-4 items-center">
                                <Button :disabled="freezen" type="submit">
                                    <div v-if="!freezen">Submit</div>
                                    <div v-else class="flex items-center justify-center gap-2">
                                        <LoadingCycle /> Uploading
                                    </div>
                                </Button>

                                <div v-if="freezen" class="flex items-center gap-1 h-full">
                                    <FileUploadProgressCircle size="24" :progress="progress" />
                                    {{ progress }}%
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </ScrollArea>

        </DialogContent>
    </Dialog>
    <Badge v-if="!userAuthed" class="ml-4">
        <Icon name="mdi:account-alert-outline" />
        <span class="cursor-default">You need sign in.</span>
    </Badge>
</template>
