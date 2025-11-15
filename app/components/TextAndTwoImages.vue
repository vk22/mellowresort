<template>
  <ClientOnly>
  <section
    ref="sectionRef"
    :class="[$style.texAndTwoImages, noMobileImages && $style.noMobileImages]"
    :data-section-theme="isDark ? 'dark' : undefined"
    data-scroll-section
  >
    <div :class="$style.bg">
      <ResponsiveImage
        v-for="(image, index) in images"
        :key="index"
        :image="image.image"
        :ratio="index % 2 === 0 ? 435/430 : 392/356"
        :class="$style.image"
        use-container-size
        data-fade-in
      />
    </div>

    <div class="container">
      <MainTitle ref="titleRef" class="h1" :class="$style.title" :text="title" data-fade-in />

      <div ref="contentRef" :class="$style.content">
        <RichText :class="$style.description" :text="description" />
        <PrimaryButton
          v-if="buttonLink && buttonLink.url"
          :class="$style.button"
          :text="buttonText"
          :external="buttonExternal"
          :is-dark="isDark"
        />
      </div>
    </div>
  </section>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue'
const $style = useCssModule()

const props = defineProps({
  title: { type: Array, default: () => [] },
  description: { type: Array, default: () => [] },
  images: { type: Array, default: () => [] },
  buttonLink: { type: Object, default: () => ({ url: '/' }) },
  buttonText: { type: Array, default: () => [] },
  buttonExternal: { type: Boolean, default: false },
  isDark: { type: Boolean, default: false },
  noMobileImages: { type: Boolean, default: false }
})

const titleRef = ref(null)
const contentRef = ref(null)
const sectionRef = ref(null)

const resize = () => {
  if (process.server) return
  if (!sectionRef.value || !contentRef.value) return
  
  const images = sectionRef.value.querySelectorAll(`.${$style.image}`)
  const image = images[1] // второй по порядку
  if (!image) return

  contentRef.value.style.marginTop = `0px`
  const contentR = contentRef.value.getBoundingClientRect()
  const imageR = image.getBoundingClientRect()

  let overlaping = imageR.top + imageR.height - contentR.top
  const margin = 72

  contentRef.value.style.marginTop = overlaping > 0
    ? `${margin + overlaping}px`
    : `${margin}px`
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
})

// Обновляем позиционирование при изменении картинок
watch(() => props.images, async () => {
  await nextTick()
  resize()
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
.texAndTwoImages {
  position: relative;
  padding: 110px 0;
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
    .image {
      position: absolute;
      &:first-child {
        width: 430/1400 * 100%;
        bottom: 0;
        left: 0;
      }
      &:last-child {
        width: 353/1400 * 100%;
        top: 0;
        right: 0;
      }
    }
  }
  :global(.container) {
    position: relative;
    z-index: 1;
  }
  .title {
    max-width: 740px;
    text-align: center;
    margin: 0 auto;
  }
  .content {
    width: 50%;
    margin-left: auto;
    margin-top: 72px;
    .description {
      max-width: 590px;
    }
    .button {
      margin-top: 40px;
    }
  }
  &[data-section-theme="dark"] {
    background: $black;
    color: $white;
  }
  @include respond-to('desktop-extra-large') {
    .title {
      max-width: toVW(740);
    }
    .content {
      .description {
        max-width: toVW(590);
      }
    }
  }
  @include respond-to('desktop') {
    &.noMobileImages {
      .bg {
        visibility: hidden;
      }
    }
  }
  @include respond-to('tablet') {
    padding: 80px 0;
    .content {
      width: 100%;
      margin-left: auto;
      margin-right: auto;
      margin-top: 50px !important;
      text-align: center;
      .description {
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
      }
    }
  }
  @include respond-to('mobile-medium') {
    .bg {
      .image {
        &:first-child {
          width: 40%;
        }
        &:last-child {
          width: 40%;
        }
      }
    }
    .content {
      margin-top: 30px !important;
    }
  }
}
</style>
