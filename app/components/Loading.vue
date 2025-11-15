<template>
  <div
    id="loading"
    :class="[
      $style.loading,
      isOpen && $style.show
    ]"
    :data-mounted="domReady"
    data-first-load="true"
  >
    <div ref="bg" :class="$style.bg"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useNuxtApp } from '#app'
import { gsap } from 'gsap'
import { useAppBus } from '~/composables/useAppBus'

const isOpen = ref(false)
const domReady = ref(false)

const bg = ref(null)
const route = useRoute()
const bus = useAppBus()

// --- methods (как раньше, 1 в 1)
function setShow() {
  isOpen.value = true
  gsap.set(bg.value, { opacity: 1 })
}

function setHide() {
  isOpen.value = false
  gsap.set(bg.value, { opacity: 0 })
}

function show() {
  isOpen.value = true
  gsap.to(bg.value, {
    duration: 0.5,
    opacity: 1,
    ease: 'Power4.easeInOut',
  })
}

function hide() {
  gsap.to(bg.value, {
    duration: route.name === 'work-slug' ? 2 : 0.2,
    opacity: 0,
    ease: 'Power4.easeInOut',
  })
  isOpen.value = false
}

function showAndHide() {
  isOpen.value = true
  gsap.fromTo(
    bg.value,
    { opacity: 0 },
    {
      duration: 1,
      opacity: 1,
      ease: 'Power4.easeIn',
      onComplete: () => {
        gsap.to(bg.value, {
          duration: 0.5,
          delay: 1,
          opacity: 0,
          ease: 'Power4.easeInOut',
          onComplete: () => {
            isOpen.value = false
          },
        })
      },
    }
  )
}

// --- bus events
onMounted(() => {
  domReady.value = true

  bus.on('loading-show', show)
  bus.on('loading-hide', hide)

  bus.on('loading-set-show', setShow)
  bus.on('loading-set-hide', setHide)

  bus.on('loading-show-and-hide', showAndHide)
})

onBeforeUnmount(() => {
  bus.off('loading-show', show)
  bus.off('loading-hide', hide)

  bus.off('loading-set-show', setShow)
  bus.off('loading-set-hide', setHide)

  bus.off('loading-show-and-hide', showAndHide)
})
</script>

<style lang="scss" module>
@use "sass:map";
@use "sass:meta";
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.loading {
  width: 100vw;
  height: 100lvh;
  height: calc(var(--vh, 1vh) * 100);
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  pointer-events: none;

  .bg {
    width: 100%;
    height: 100%;
    background: $black;
    transition: background 0.5s ease-in-out;
  }

  &.show {
    pointer-events: all;
  }
}
</style>
