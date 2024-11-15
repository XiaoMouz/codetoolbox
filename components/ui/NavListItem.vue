<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { MenusState } from '../menu'
const $route = useRoute()
const props = defineProps<{
  title?: string
  to?: string
  icon?: string
  href?: string
  state?: MenusState
}>()
</script>
<template>
  <li>
    <div as-child>
      <a
        @click="() => $router.push(to ?? '')"
        :href="href"
        :class="
          cn(
            'block cursor-pointer h-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            $route.path === to && ' bg-muted hover:bg-muted',
            $attrs.class ?? ''
          )
        "
      >
        <div class="flex flex-row items-center gap-2">
          <Icon v-if="icon" :name="icon" class="w-6 h-6" />
          <div>
            <div
              class="text-sm font-medium flex flex-row items-center gap-2 leading-none"
            >
              {{ title }}
              <Badge
                class="text-xs font-light"
                v-if="state && (state == 'wip' || state == 'beta')"
                >{{ state == 'wip' ? 'TODO' : 'BETA' }}</Badge
              >
            </div>
            <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
              <slot />
            </p>
          </div>
        </div>
      </a>
    </div>
  </li>
</template>
