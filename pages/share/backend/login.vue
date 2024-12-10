<script setup lang="ts">
import Title from '~/components/Title.vue'
import { buttonVariants } from '~/components/ui/button'
import { useToast } from '~/components/ui/toast'

const { toast } = useToast()

definePageMeta({
  layout: 'blank',
})

useHead({
  title: 'Login (service.mou.best)',
})

const userStore = useUserStore()
const { $state, isTokenExpired } = userStore
const loginState = computed(() => $state.session != null && !isTokenExpired())
</script>
<template>
  <main class="h-screen flex justify-center items-center">
    <div class="flex flex-col gap-4">
      <Button
        variant="outline"
        :onClick="
          () => {
            $router.back()
          }
        "
        ><Icon name="mdi:keyboard-backspace" /> Back</Button
      >
      <AppAuthForm v-if="!loginState" />
      <AppUserCard v-else />
    </div>
  </main>
</template>
