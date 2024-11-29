<script setup lang="ts">
import Title from '~/components/Title.vue'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '~/components/ui/toast'
import cidrRegex from 'cidr-regex'
import { Netmask } from 'netmask'
const { toast } = useToast()

useHead({
  title: 'CIDR to IP',
  meta: [
    {
      name: 'description',
      content: 'CIDR to IP Range',
    },
  ],
})

const cidr = ref(`10.0.0.0/8
172.16.0.0/12
192.168.0.0/16`)
const columns = ref<
  {
    key: string
    label: string
    enabled: boolean
  }[]
>([
  { key: 'base', label: 'Base ', enabled: true },
  { key: 'first', label: 'First', enabled: true },
  { key: 'last', label: 'Last', enabled: true },
  { key: 'broadcast', label: 'Broadcast', enabled: true },
  { key: 'mask', label: 'Mask', enabled: true },
  { key: 'bitmask', label: 'Bitmask', enabled: false },
  { key: 'hostmask', label: 'Hostmask', enabled: false },
  { key: 'size', label: 'Size', enabled: true },
])
var block = new Netmask('10.0.0.0/12')
const result = computed(() => {
  return cidr.value
    .split('\n')
    .map((i) => i.trim())
    .filter((i) => i)
    .map((i) => {
      if (!cidrRegex({ exact: true }).test(i)) {
        toast({
          title: 'Error',
          description: 'Invalid CIDR format: ' + i,
          variant: 'destructive',
        })
        return
      }
      try {
        var block = new Netmask(i)

        // handle columns
        return columns.value
          .filter((i) => i.enabled)
          .map((column) => {
            switch (column.key) {
              case 'base':
                return block.base
              case 'first':
                return block.first
              case 'last':
                return block.last
              case 'broadcast':
                return block.broadcast
              case 'mask':
                return block.mask
              case 'bitmask':
                return block.bitmask
              case 'hostmask':
                return block.hostmask
              case 'size':
                return block.size
            }
          })
      } catch (e: any) {
        toast({
          title: 'Error',
          description: e.message,
          variant: 'destructive',
        })
      }
    })
})
</script>
<template>
  <div class="flex h-full w-full flex-col items-center mb-8">
    <div class="w-[70%] h-full flex flex-col items-start gap-6">
      <Title
        title="CIDR to IP"
        icon="mdi:ip-network-outline"
        description="CIDR to IP Range"
      />
      <Textarea class="h-36" v-model:model-value="cidr" />
      <div class="flex flex-wrap flex-row gap-2">
        <div
          class="flex items-center gap-1"
          v-for="column in columns"
          :key="column.key"
        >
          <Checkbox :id="column.key" v-model:checked="column.enabled" />

          <Label
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            :for="column.key"
            >{{ column.label }}</Label
          >
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              v-for="column in columns.filter((i) => i.enabled)"
              :key="column.key"
            >
              {{ column.label }}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in result">
            <TableCell v-for="i in item" :key="i">
              {{ i }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
