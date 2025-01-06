<script setup lang="ts">
import Title from '~/components/Title.vue'
import { useToast } from '~/components/ui/toast'

const { toast } = useToast()

const {
  remote,
  loading,
  local,
  getRemoteCopyboard,
  getRemoteCopyboardList,
  newCopyboard,
  putCopyboard,
} = useCopyboardStore()

getRemoteCopyboardList()

useHead({
  title: 'Online Copyboard',
  meta: [
    {
      name: 'description',
      content: 'A Online copyboard to store your text',
    },
  ],
})
</script>

<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[90%] xl:w-[70%] h-full flex flex-col items-start gap-6">
      <Title
        title="Online Copyboard"
        icon="mdi:file-cloud"
        description="A Online copyboard to store your text"
      />
      <div>
        <ClientOnly>
          <CopyboardList />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
