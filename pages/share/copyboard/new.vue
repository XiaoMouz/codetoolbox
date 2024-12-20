<script setup lang="ts">
import type { Content } from '~/types/copyboard.type'

const item = ref<Content>({
  id: '',
  name: '',
  expireAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
  createdAt: Date.now(),
  modifiedAt: Date.now(),
  uploader: '',
  content: '',
  status: 'active',
  password: undefined,
  private: false,
  history: [],
})
</script>

<template>
  <div>
    <CopyboardForm v-model="item" />
  </div>
</template>
