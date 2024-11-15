<template>
  <ScrollArea>
    <div
      class="w-screen min-h-screen overflow-x-hidden flex flex-col items-center gap-6"
    >
      <Header v-if="$route.path != '/'" />
      <span v-else>&nbsp;</span>
      <main class="w-full h-full">
        <NuxtPage />
      </main>
    </div>
  </ScrollArea>
</template>
<style scoped></style>
<script setup lang="ts"></script>
