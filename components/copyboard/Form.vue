<script setup lang="ts">
import { Label } from '@/components/ui/label'
import type { Content } from '~/types/copyboard.type'

const item = defineModel({
  type: Object as PropType<Content>,
  required: true,
})

const emit = defineEmits<{
  (e: 'save'): void
}>()
</script>
<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="flex flex-row gap-2 items-center">
      <Icon name="mdi:clipboard-edit-outline" class="size-5" />
      <h1 class="text-xl">Copyboard</h1>
    </div>
    <div class="w-[80%] h-full flex flex-col items-start gap-6">
      <div class="flex flex-row w-full gap-2 items-center">
        <Icon name="mdi:tag" class="size-5" />
        <Input v-model="item.name" placeholder="Copyboard Title" />
      </div>
      <div class="flex flex-col md:flex-row w-full h-full gap-4">
        <div>
          <div class="flex border p-2 rounded-xl shadow-lg flex-col gap-2">
            <div class="flex flex-col gap-2">
              <div class="flex flex-row gap-2 items-center">
                <Icon name="mdi:account-file-text-outline" class="size-5" />
                <Label placeholder="Uploader">
                  {{ item.uploader ? item.uploader : 'Anonymous' }}
                </Label>
              </div>
              <div class="flex flex-row gap-2 items-center">
                <Icon name="mdi:delete-clock-outline" class="size-5" />
                <Label placeholder="Expire At">
                  Expire at:
                  {{ new Date(item.expireAt).toLocaleString() }}</Label
                >
              </div>
              <div class="flex flex-row gap-2 items-center">
                <Icon name="mdi:clock-plus-outline" class="size-5" />
                <Label placeholder="Created At">
                  Created at: {{ new Date(item.createdAt).toLocaleString() }}
                </Label>
              </div>

              <div class="flex flex-row gap-2 items-center">
                <Icon name="mdi:clock-edit-outline" class="size-5" />
                <Label placeholder="Updated At">
                  Last modified:
                  {{ new Date(item.modifiedAt).toLocaleString() }}
                </Label>
              </div>
              <Button @click="$emit('save')" variant="outline" class="w-full">
                <Icon name="mdi:cloud-upload-outline" class="mr-1 size-4" />
                Save
              </Button>
            </div>
          </div>
        </div>

        <div class="w-full min-h-64">
          <Textarea v-model="item.content" class="min-h-64" />
        </div>
      </div>
    </div>
  </div>
</template>
