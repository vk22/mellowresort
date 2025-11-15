<template>
  <div
    :class="[
      $style.navbar,
      isMenuOpen && $style.isMenuOpen,
      isHidden && $style.isHidden,
      isFooter && $style.isFooter,
      hideLogo && $style.hideLogo,
      isDown && $style.isDown
    ]"
  >
    <div class="container" :class="$style.flex">
      <Logo :class="$style.logo" />
      <MenuToggle :class="$style.menuToggle" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute } from '#app'
import Logo from './Logo'
import MenuToggle from './MenuToggle'
import { useAppBus } from '~/composables/useAppBus'
import Util from '~/utils/util'

const bus = useAppBus()
const route = useRoute()

// ----- state
const state = reactive({
  isMenuOpen: false,
  isHidden: false,
  isFooter: false,
  hideLogo: false,
  isDown: false,
  lastScroll: 0,
  footerHeight: 0,
  isMobile: false,
})

// ----- computed (то что template использует)
const isMenuOpen = computed(() => state.isMenuOpen)
const isHidden   = computed(() => state.isHidden)
const isFooter   = computed(() => state.isFooter)
const hideLogo   = computed(() => state.hideLogo)
const isDown     = computed(() => state.isDown)

function toggleMenu() {
  state.isMenuOpen = !state.isMenuOpen
  bus.emit(state.isMenuOpen ? 'menu-open' : 'menu-close')
}

// ----- события bus (бывшие this.$nuxt.$on)
function bindBus() {
  bus.on('menu-toggle', () => toggleMenu())
  bus.on('menu-close', () => { state.isMenuOpen = false })
  bus.on('nav-show',  () => { state.isHidden = false })
  bus.on('nav-hide',  () => { state.isHidden = true })
  bus.on('nav-hide-logo', () => { state.hideLogo = true })
  bus.on('scroll-position', onScroll)  // layout/scroll-ctrl будет слать {pos,max}
}

function unbindBus() {
  bus.off('menu-toggle')
  bus.off('menu-close')
  bus.off('nav-show')
  bus.off('nav-hide')
  bus.off('nav-hide-logo')
  bus.off('scroll-position')
}

// ----- scroll logic
function onScroll({ pos, max }) {
  if (pos > max - state.footerHeight) state.isFooter = true
  else state.isFooter = false

  if (!state.isMobile) {
    if (pos > state.lastScroll) state.isDown = true
    else if (pos < state.lastScroll) state.isDown = false
    state.lastScroll = pos
  }
}

function onResize() {
  state.footerHeight = document.getElementById('footer')?.offsetHeight || window.innerHeight + 100
  state.isMobile = window.innerWidth <= 1024 && Util.isTouch()
}

watch(() => route.fullPath, () => {
  state.isHidden = false
  state.isMenuOpen = false
})

onMounted(() => {
  bindBus()
  onResize()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  unbindBus()
  window.removeEventListener('resize', onResize)
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
.navbar {
  width: 100%;
  padding-top: 45px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999998;
  pointer-events: none;
  transition: transform 1s $curve, opacity 1s $curve, color 1s $curve;
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo, .menuToggle {
    transition: opacity 1s $curve;
  }
  .logo {
    display: inline-flex;
  }
  &.isMin {
  }
  &.isMenuOpen {
    color: $white !important;
  }
  &.isHidden {
    opacity: 0;
    &, * {
      pointer-events: none !important;
    }
  }
  &.isDown {
    opacity: 0;
    &, * {
      pointer-events: none !important;
    }
  }
  &.isFooter {
    opacity: 0;
    &, * {
      pointer-events: none !important;
    }
  }
  &.hideLogo {
    .logo {
      opacity: 0 !important;
      pointer-events: none;
    }
  }
  @include respond-to('mobile-medium') {
    padding-top: 30px;
  }
  @include theme-nav('dark') {
    color: $white;
  }
}
</style>