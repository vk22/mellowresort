<template>
  <ClientOnly>
  <figure
    ref="el"
    :class="[
      $style.responsiveImage,
      full && $style.full,
      currentCover && $style.hasCover,
      loaded && $style.loaded,
      bg && $style.bg,
    ]"
  >
    <div
      :class="$style.ratio"
      :style="{
        paddingBottom: `${currentRatio * 100}%`,
        backgroundImage: currentCoverBG,
      }"
    />

    <div
      v-if="!useTag && !currentCover"
      :class="$style.shape"
      :alt="alt"
      :title="alt"
      :style="{ backgroundImage: currentBG }"
    />

    <img
      v-if="useTag && currentUrl"
      :src="currentUrl"
      :loading="lazy ? 'lazy' : undefined"
      :alt="alt"
      @load="onLoad"
    />
  </figure>
  </ClientOnly>
</template>


<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  image: { type: Object, default: () => ({}) },
  cover: { type: Object, default: () => ({}) },
  full: { type: Boolean, default: false },
  useTag: { type: Boolean, default: false },
  bg: { type: Boolean, default: false },
  ratio: { type: Number, default: 0 },
  quality: { type: Number, default: 100 },
  lazy: { type: Boolean, default: false },
  useContainerSize: { type: Boolean, default: false },
})

const el = ref(null)
const loaded = ref(false)
const allowLoad = ref(false)
const imageSize = ref(750)

const currentCover = computed(() => props.cover?.url)

const currentRatio = computed(() => {
  if (props.ratio) return props.ratio
  if (props.image?.dimensions) {
    return props.image.dimensions.height / props.image.dimensions.width
  }
  return 9 / 16
})

const currentUrl = computed(() => {
  if (!props.image?.url) return null
  return `${props.image.url.replace(/\?.+/, '')}?auto=format&fit=max&w=${imageSize.value}`
})

const currentBG = computed(() => currentUrl.value ? `url('${currentUrl.value}')` : 'none')
const currentCoverBG = computed(() => currentCover.value ? `url('${currentCover.value}')` : 'none')
const alt = computed(() => props.image?.alt || '')

function updateSize() {
  // ✅ Выполняем только на клиенте
  if (typeof window === 'undefined') return
  if (!el.value) return

  let maxW = el.value.clientWidth || 1
  let maxH = el.value.clientHeight || 1
  let ratio = maxH / maxW
  let size = 750

  if (maxW < 600) size = 700
  else if (window.innerWidth > 1024 && maxW > 750) size = 2000
  else if (window.innerWidth > 1600 && maxW > 1024) size = 3500

  if (ratio > 1) {
    const scale = size / maxW > 1 ? size / maxW : 1.5
    size = (maxH / ratio) * scale * 1.2
    if (size * ratio > window.innerHeight) size = Math.max(window.innerWidth, 700)
    if (maxW < 700) size = 900
  }

  if (props.useContainerSize) size = maxW
  if (size < 750) size *= 2

  imageSize.value = isNaN(size) ? 750 : size * 1.2
}

function onLoad() {
 if (allowLoad.value) loaded.value = true
}

onMounted(() => {
  updateSize()
  window.addEventListener('resize', updateSize)
  nextTick(() => {
    allowLoad.value = true
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSize)
})
</script>


<style lang="scss" module>
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
@use "sass:math";
.responsiveImage {
  width: 100%;
  height: auto;
  padding: 0;
  margin: 0;
  position: relative;
  .shape,
  img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }
  .shape,
  .ratio {
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .ratio {
    display: block;
    position: relative;
    z-index: 1;
  }
  img {
    object-fit: cover;
  }
  &.hasCover {
    .ratio {
      transition: opacity 1s $curve;
      background-color: #f5f5f5;
    }
  }
  &.loaded {
    .ratio {
      opacity: 0;
    }
  }
  &.bg {
    background: #f5f5f5;
  }
  &.full {
    width: 100%;
    height: 100%;
    .shape {
      height: 100%;
    }
    .ratio {
      padding-bottom: 0 !important;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>