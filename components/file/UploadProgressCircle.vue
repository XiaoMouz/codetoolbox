<template>
    <div class="progress-circle">
        <svg :width="size" :height="size" viewBox="0 0 36 36">
            <circle class="progress-circle-bg" cx="18" cy="18" r="16" fill="none" :stroke="bgColor"
                :stroke-width="strokeWidth" />
            <circle class="progress-circle-bar" cx="18" cy="18" r="16" fill="none" :stroke="color"
                :stroke-width="strokeWidth" :stroke-dasharray="circumference" :stroke-dashoffset="dashoffset" />
        </svg>
        <slot></slot>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    progress: {
        type: Number,
        default: 0,
        validator: (value) => value >= 0 && value <= 100
    },
    size: {
        type: String,
        default: "36"
    },
    strokeWidth: {
        type: Number,
        default: 4
    }
})

const color = useDark().value ? '#fff' : '#000'
const bgColor = useDark().value ? '#333' : '#ddd'

const circumference = computed(() => 2 * Math.PI * 16)
const dashoffset = computed(() =>
    circumference.value * (1 - props.progress / 100)
)
</script>

<style scoped>
.progress-circle {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.progress-circle-bar {
    transform: rotate(-90deg);
    transform-origin: center;
    transition: stroke-dashoffset 0.3s ease;
}
</style>