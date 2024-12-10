<script setup lang="ts">
import Card from '../ui/card/Card.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const userStore = useUserStore()
const { $state, logout, refreshToken } = userStore
</script>
<template>
  <Card v-if="$state.session?.user">
    <CardHeader> You already at there </CardHeader>
    <CardContent>
      <div class="flex flex-row gap-4 items-center">
        <Avatar size="base">
          <AvatarImage
            :src="
              $state.session.user.avatar
                ? $state.session.user.avatar
                : getGAvatar($state.session?.user.email)
            "
            :alt="$state.session?.user.username"
          />
          <AvatarFallback>{{
            $state.session.user.username.charAt(0)
          }}</AvatarFallback>
        </Avatar>
        <div>
          <p>
            Hi, <strong>{{ $state.session.user.username }}</strong>
          </p>
          <p>
            <small>Account: {{ $state.session.user.email }}</small>
          </p>
          <p>
            <small
              >Expired:
              {{ new Date($state.session.expireAt).toLocaleString() }}</small
            >
          </p>
        </div>
      </div>
    </CardContent>
    <CardFooter class="flex gap-2">
      <Button
        class="w-full"
        variant="outline"
        :onClick="
          () => {
            logout()
          }
        "
        ><Icon name="mdi:logout" /> Logout</Button
      ><Button
        class="w-full"
        variant="outline"
        :onClick="
          () => {
            refreshToken()
          }
        "
        ><Icon name="mdi:refresh" /> Refresh</Button
      >
    </CardFooter>
  </Card>
</template>
