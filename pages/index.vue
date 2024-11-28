<script setup lang="ts">
import { menus } from '@/components/menu'
import NavListItem from '~/components/NavListItem.vue'
</script>
<template>
  <div class="flex flex-col flex-wrap justify-center items-center">
    <div v-for="item in menus" :key="item.title">
      <h2 class="text-center md:text-left text-2xl font-bold">
        {{ item.title }}
      </h2>
      <ul
        class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
      >
        <NavListItem v-for="component in item.menu" v-bind="component">
          {{ component.description }}
        </NavListItem>
      </ul>
    </div>
  </div>
</template>
