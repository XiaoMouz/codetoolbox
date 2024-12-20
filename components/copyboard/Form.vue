<script setup lang="ts">
import type { Content } from '~/types/copyboard.type'

const item = defineModel({
  type: Object as PropType<Content>,
  required: true,
})
</script>
<template>
  <div>
    <div class="flex flex-col gap-2">
      <div class="flex flex-row gap-2 items-center">
        <Icon name="mdi:clipboard-edit-outline" class="size-5" />
        <h1 class="text-xl">Copyboard Form</h1>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex flex-row gap-2 items-center">
          <Icon name="mdi:tag" />
          <Input v-model="item.name" placeholder="Name" />
        </div>
        <div class="flex flex-row gap-2 items-center">
          <Icon name="mdi:account-file-text-outline" />
          <Input v-model="item.uploader" placeholder="Uploader" />
        </div>
        <div class="flex flex-row gap-2 items-center">
          <Icon name="mdi:delete-clock-outline" />
          <Input v-model="item.expireAt" placeholder="Expire At" />
        </div>
        <div class="flex flex-row gap-2 items-center">
          <Icon name="mdi:clock-plus-outline" />
          <Input v-model="item.createdAt" placeholder="Created At" />
        </div>

        <div class="flex flex-row gap-2 items-center">
          <Icon name="mdi:clock-edit-outline" />
          <Input v-model="item.modifiedAt" placeholder="Updated At" />
        </div>
      </div>
    </div>
  </div>
</template>
