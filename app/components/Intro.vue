<template>
  <div
    id="intro"
    :class="[$style.intro, isOpen && $style.show]"
    :data-done="done"
  >
    <div ref="bg" :class="$style.bg">
      <img ref="logo" :class="$style.logo" src="/img/loading.gif" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useNuxtApp, useRoute } from '#app'
import { gsap } from 'gsap'
import { useAppBus } from '~/composables/useAppBus'

// event bus
const bus = useAppBus()
const route = useRoute()

const bg = ref(null)
const logo = ref(null)

const domReady = ref(false)
const dataReady = ref(false)
const isOpen = ref(false)
const done = ref(false)
let isFirstLoad = true

const canShow = ref(true)
const pause = ref(false)

function resize() {
  // mobile flag if needed
}

// ---- MAIN INIT
async function initData() {
  let { ref: refQuery } = route.query
  const options = {}

  // if (refQuery && refQuery !== '') {
  //   options.ref = decodeURIComponent(refQuery)
  // } else {
  //   const masterRef = $prismic.api.refs.find(ref => ref.isMasterRef)
  //   options.ref = masterRef.ref
  // }

  dataReady.value = true
  init()
}

function init() {
  if (domReady.value && dataReady.value) {
    nextTick(() => {
      resize()
      initIntro()
      playIntro()
    })
  }
}

function initIntro() {
  logo.value.classList.add('no-transition')
  logo.value.style.display = 'block'
  logo.value.style.transform = 'scale(1.3)'
}

function playIntro() {
  done.value = false
  logo.value.classList.remove('no-transition')
  logo.value.style.transform = 'scale(1)'
  setTimeout(() => {
    if (!done.value) {
      done.value = true
      bus.emit('intro-done')
    }
  }, 3000)
}

// ---- VISIBILITY
function checkVisibility() {
  pause.value = document.hidden
}

// ---- SHOW / HIDE
function setShow() {
  isOpen.value = true
  initIntro()
  gsap.set(bg.value, { opacity: 1 })
  playIntro()
}

function setHide() {
  isOpen.value = false
  gsap.set(bg.value, { opacity: 0 })
}

function show() {
  isOpen.value = true
  initIntro()
  gsap.fromTo(bg.value, { opacity: 0 }, { duration: 1, opacity: 1, ease: 'Power4.easeInOut' })
  playIntro()
}

function hide() {
  gsap.killTweensOf(bg.value)
  gsap.to(bg.value, {
    duration: 0.5,
    opacity: 0,
    delay: 0.25,
    ease: 'Power4.easeOut',
    onComplete: () => {
      logo.value.style.display = 'none'
      logo.value.style.transform = 'scale(1)'
    }
  })
  isOpen.value = false
  if (!done.value) done.value = true
}

// ---- LIFECYCLE
onMounted(() => {
  domReady.value = true

  const loading = document.getElementById('loading')
  isFirstLoad = loading?.getAttribute('data-first-load') === 'true'
  canShow.value = isFirstLoad

  if (canShow.value) {
    setShow()
    document.addEventListener('visibilitychange', checkVisibility)
    window.addEventListener('resize', resize)
    init()
  } else {
    done.value = true
    bus.emit('intro-done')
    setHide()
  }

  bus.on('intro-hide', hide)
  bus.on('intro-show', show)
  bus.on('intro-set-show', setShow)

  initData()
})

onBeforeUnmount(() => {
  bus.off('intro-hide', hide)
  bus.off('intro-show', show)
  bus.off('intro-set-show', setShow)
  document.removeEventListener('visibilitychange', checkVisibility)
  window.removeEventListener('resize', resize)
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
.intro {
  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  position: fixed;
  z-index: 9999999;
  top: 0;
  left: 0;
  pointer-events: none;
  color: $white;

  .bg {
    width: 100%;
    height: 100%;
    background: $black;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo {
    width: 60%;
    max-width: 400px;
    will-change: transform;
    transition: transform 5s cubic-bezier(0.68, 0.15, 0, 1);
  }

  &.show {
    pointer-events: all;
    .logo {
      transform: scale(1);
    }
  }

  &:not(.show) {
    &, * { pointer-events: none !important; }
  }
}
</style>
