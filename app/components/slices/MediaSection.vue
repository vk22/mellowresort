<template>
  <div
    :class="[$style.mediaSection]"
    :data-section-theme="isDark ? 'dark' : undefined"
    data-scroll-section
  >
    <MediaComponent
      :class="$style.mediaContainer"
      :image="image"
      :video="video"
      :autoplay="autoplay"
      :ratio="autoRatio ? 0 : 9/16"
      data-scroll-item
    />
  </div>
</template>

<script setup>

const props = defineProps({
  image: { type: Object, default: () => ({}) },
  video: { type: Object, default: () => ({}) },
  autoplay: { type: Boolean, default: true },
  autoRatio: { type: Boolean, default: true },
  isDark: { type: Boolean, default: true }
})
</script>

<style lang="scss" module>
.mediaSection {
  .mediaContainer {
    width: 100%;
  }
}
</style>
