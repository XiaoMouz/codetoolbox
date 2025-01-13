<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'

const formSchema = toTypedSchema(z.object({
    title: z.string().max(50).optional().default('Untitled-' + Date.now()),
    description: z.string().min(2).max(200).optional(),
    private: z.boolean().default(false),
    password: z.string().min(6).max(50).optional(),
}))

const form = useForm({
    validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
    console.log('Form submitted!', values)
})
</script>
<template>
    <Dialog>
        <DialogTrigger as-child>
            <Button>
                <Icon name="mdi:upload-box-outline" class="size-5" />
                <span>Upload</span>
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Upload a new file</DialogTitle>
            </DialogHeader>
            <div>
                <form @submit="onSubmit">
                    <div class="w-full">
                        <div class="flex md:flex-row flex-col gap-6 w-full items-center">
                            <div class="flex-1 h-full ">
                                <div class="flex h-full flex-col md:flex-row gap-4 md:gap-6">
                                    <fieldset class="grid w-full gap-6 rounded-lg border p-4">
                                        <legend class="-ml-1 px-1 text-sm font-medium flex flex-row items-center gap-1">
                                            <Icon name="mdi:document" /> <span>Info</span>
                                        </legend>
                                        <FormField v-slot="{ componentField }" name="title">
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input type="text" :placeholder="'Untitled-' + Date.now()"
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
                                                    <Textarea type="text" :placeholder="''" v-bind="componentField" />
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
                                        <legend class="-ml-1 px-1 text-sm font-medium flex flex-row items-center gap-1">
                                            <Icon name="mdi:file" /> <span>File</span>
                                        </legend>
                                        <Uploader />
                                    </fieldset>

                                </div>
                                <div class="flex flex-col md:flex-row gap-4 md:gap-6">
                                    <fieldset class="grid w-full gap-6 rounded-lg border p-4">
                                        <legend class="-ml-1 px-1 text-sm font-medium flex flex-row items-center gap-1">
                                            <Icon name="mdi:lock" /> <span>Privacy</span>
                                        </legend>
                                        <FormField v-slot="{ componentField }" name="private">
                                            <FormItem>
                                                <div class="flex justify-between items-center">
                                                    <FormLabel>Private?</FormLabel>
                                                    <FormControl>
                                                        <Switch v-bind="componentField" />
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
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Keep empty for public file"
                                                        v-bind="componentField" />
                                                </FormControl>
                                                <FormDescription>
                                                    Set a password to protect your file.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        </FormField>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                        <Button type="submit">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </DialogContent>
    </Dialog>
</template>
