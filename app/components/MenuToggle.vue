<template>
  <div
    :class="[
      $style.menuToggle,
      isMin && $style.isMin,
      isOpen && $style.isOpen
    ]"
    @click="toggle"
    data-cursor-pointer
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 13">
      <path d="M0 1h35"/>
      <path d="M0 11h35"/>
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAppBus } from '~/composables/useAppBus'

const bus = useAppBus()

const isOpen = ref(false)
const isMin = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
  console.log('isOpen.value 1', isOpen.value)
  bus.emit('menu-toggle')
  console.log('isOpen.value 2', isOpen.value)
}

function close() {
  console.log('menu close')
  isOpen.value = false
}

onMounted(() => {
  bus.on('menu-close', close)
})

onBeforeUnmount(() => {
  bus.off('menu-close', close)
})
</script>

<style lang="scss" module>
@use "sass:math";
@use "sass:map";
@use "sass:meta";
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;

.menuToggle {
  aspect-ratio: 1;
  cursor: pointer;
  color: inherit;
  display: flex;
  align-items: center;
  pointer-events: all;
  position: relative;

  svg {
    width: 35px;
    height: auto;
    overflow: visible;
  }

  path {
    stroke: currentColor;
    stroke-width: 1.5;
    transform-origin: center;
    transition: transform 1s cubic-bezier(0.38, 0.07, 0, 1), opacity 1s $curve, stroke-width 1s $curve;

    &:last-child {
      stroke-width: 3.5;
    }
  }

  &.isOpen {
    path {
      &:nth-child(1) {
        transform: rotate(45deg) translateY(5px);
      }
      &:nth-child(2) {
        transform: rotate(-45deg) translateY(-5px);
      }
    }
  }
}
</style>
