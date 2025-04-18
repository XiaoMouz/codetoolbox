<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import NavListItem from './NavListItem.vue'

import { cn } from '@/utils/shadcn'

import { menus } from './menu'

const isDark = useDark()
const $route = useRoute()

const userStore = useUserStore()
const { $state, isTokenExpired } = userStore
const loginState = computed(() => $state.session != null && !isTokenExpired())
</script>

<template>
  <header class="w-full flex flex-nowrap justify-between items-center pt-5 pl-10 pr-20">
    <div class="flex items-center hover:bg-accent p-2 rounded-full">
      <Icon name="mdi:home" class="flex size-6 cursor-pointer hover:bg-white p-2" @click="$router.push('/')" />
    </div>
    <NavigationMenu class="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem v-for="item in menus" :key="item.title">
          <NavigationMenuTrigger>{{ item.title }}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <NavListItem v-for="component in item.menu" v-bind="component">
                {{ component.description }}
              </NavListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>About</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
              <li class="row-span-3">
                <NavigationMenuLink as-child class="">
                  <div class="rounded-md bg-custom w-full h-full">
                    <a href="https://mou.best"
                      class="rounded-md bg-custom-child cursor-pointer flex h-full w-full select-none flex-col justify-end from-muted/50 to-muted p-6 no-underline outline-none">
                      <div class="mb-2 mt-4 text-lg font-medium dark:text-muted">
                        Home
                      </div>
                      <p class="text-sm leading-tight dark:text-muted">
                        Back to mou.best
                      </p>
                    </a>
                  </div>
                </NavigationMenuLink>
              </li>
              <NavListItem to="/about" title="You might interesting" icon="mdi:star-four-points-box-outline">
                This site
              </NavListItem>
              <NavListItem href="https://github.com/XiaoMouz/codetoolbox" title="Source Code" icon="mdi:github">
                @XiaoMouz/codetoolbox
              </NavListItem>
              <NavListItem href="https://service.mou.best" title="About File Share" icon="mdi:cloud-key-outline">
                This is a private function
              </NavListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    <div class="flex flex-row gap-6">
      <div v-if="$route.path.startsWith('/share')"
        class="flex w-10 h-10 items-center justify-center rounded-full transition duration-300 cursor-pointer hover:bg-slate-400 dark:hover:bg-gray-400 fill-gray-900 dark:fill-slate-100 ease-in-out"
        @click="$router.push('/share/backend/login')">
        <ClientOnly>
          <Icon v-if="!loginState" name="mdi:key-chain-variant" />
          <Avatar class="size-6" v-else>
            <AvatarImage v-if="$state.session?.user" :src="$state.session.user.avatar
              ? $state.session.user.avatar
              : getGAvatar($state.session?.user.email)
              " :alt="$state.session?.user.username" />
            <AvatarFallback v-if="$state.session?.user">{{
              $state.session.user.username.charAt(0)
              }}</AvatarFallback>
          </Avatar>
        </ClientOnly>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div
            class="flex w-10 h-10 items-center justify-center rounded-full transition duration-300 cursor-pointer hover:bg-slate-400 dark:hover:bg-gray-400 fill-gray-900 dark:fill-slate-100 ease-in-out">
            <Icon name="mdi:translate" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>语言 / Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Icon name="mdi:check" /> English / 英语
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Icon name="mdi:progress-wrench" />中文 / Chinese
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div
        class="flex w-10 h-10 items-center justify-center rounded-full transition duration-300 cursor-pointer hover:bg-slate-400 dark:hover:bg-gray-400 fill-gray-900 dark:fill-slate-100 ease-in-out"
        @click="isDark ? (isDark = false) : (isDark = true)">
        <ClientOnly>
          <Transition name="fade">
            <Icon name="mdi:weather-night" class="absolute w-5 h-5" v-if="isDark" />
            <Icon name="mdi:weather-sunny" class="absolute w-5 h-5" v-else />
          </Transition>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<style scoped>
.bg-custom {
  background: url('/image.ico');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

/* add a filter shadow for background */
@media screen and (min-width: 1024px) {
  .bg-custom {
    background-size: auto;
  }
}

.bg-custom-child {
  backdrop-filter: blur(1px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
