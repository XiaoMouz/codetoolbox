<script setup lang="ts">
import { cn } from '~/utils/shadcn'
import { ref } from 'vue'
import Label from '../ui/label/Label.vue'
import Input from '../ui/input/Input.vue'
import Button from '../ui/button/Button.vue'
import LoadingCycle from '../LoadingCycle.vue'
import { useUserStore } from '~/stores/auth'
import { onMounted } from 'vue'
import { useToast } from '~/components/ui/toast'
const { toast } = useToast()

const userStore = useUserStore()

onMounted(() => {})

const certificate = reactive({
  email: '',
  password: '',
})

const isLoading = ref(false)
async function onSubmit(event: Event) {
  event.preventDefault()
  isLoading.value = true
  await userStore
    .login(certificate.email, certificate.password)
    .then((result) => {
      if (result.success) {
        toast({
          title: 'Login',
          description: 'Login successfully',
        })
        isLoading.value = false
        const router = useRouter()
        router.back()
      } else {
        toast({
          title: 'Login',
          description: result.message,
        })
        isLoading.value = false
      }
    })
    .catch((error) => {
      toast({
        title: 'Login',
        description: error.message,
      })
    })
}
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <Card>
      <CardHeader
        ><div class="flex items-center gap-4">
          <Icon name="mdi:account-key-outline" class="size-8" />
          <div class="flex items-center gap-1">
            <span class="text-xl">Login </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit">
          <div class="grid gap-6">
            <div class="grid gap-4">
              <div class="grid gap-1">
                <Label for="email"> Email </Label>
                <Input
                  v-model:model-value="certificate.email"
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  auto-capitalize="none"
                  auto-complete="email"
                  auto-correct="off"
                  :disabled="isLoading"
                />
              </div>
              <div class="grid gap-1">
                <Label for="password"> Password </Label>
                <Input
                  v-model:model-value="certificate.password"
                  id="password"
                  placeholder="Password"
                  type="password"
                  auto-capitalize="none"
                  auto-complete="password"
                  auto-correct="off"
                  :disabled="isLoading"
                />
              </div>
            </div>
            <Button :disabled="isLoading">
              <LoadingCycle v-if="isLoading" />
              Sign In with Email
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <span>The user authentication is provided by&nbsp;</span>
        <a href="https://service.mou.best"
          ><code class="hover:underline hover:underline-offset-2"
            >service</code
          ></a
        >
      </CardFooter>
    </Card>
  </div>
</template>
