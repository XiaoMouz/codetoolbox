<template>
  <ScrollArea>
    <div
      class="w-screen min-h-[100dvh] overflow-x-hidden flex flex-col items-center gap-6"
    >
      <Header v-if="$route.path != '/'" />
      <span v-else>&nbsp;</span>
      <main class="w-full h-full flex flex-col flex-1">
        <NuxtPage />
      </main>
    </div>
  </ScrollArea>
</template>
<style scoped></style>
<script setup lang="ts"></script>
