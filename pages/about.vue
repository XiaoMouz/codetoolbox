<script setup lang="ts">
useHead({
  title: 'About',
  meta: [
    {
      name: 'description',
      content: 'About',
    },
  ],
})
</script>
<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[70%] h-full flex flex-col items-center gap-6">
      <Card>
        <CardHeader> Empty </CardHeader>
        <CardContent> But not empty</CardContent>
        <CardFooter> Foot</CardFooter>
      </Card>
    </div>
  </div>
</template>
