

<template>
  <section
    :class="[
      $style.texAndImage,
      hasImage && $style.hasImage,
      padding && $style.padding,
      reverse && $style.reverse,
      centerOnMobile && $style.centerOnMobile
    ]"
    :data-section-theme="isDark ? 'dark' : undefined"
    :data-scroll-section="scrollSection ? 'true' : undefined"
  >
    <div class="container">
      <MainTitle
        v-if="largeTitle?.[0]?.text"
        ref="largeTitleRef"
        class="h1"
        :class="$style.largeTitle"
        :text="largeTitle"
        :data-fade-in="scrollSection ? 'true' : undefined"
      />

      <MainTitle
        ref="titleRef"
        class="h2"
        :class="[$style.title, $style.titleMobile]"
        :text="title"
        :data-fade-in="scrollSection ? 'true' : undefined"
      />
    </div>

    <div :class="$style.flex">
      <div v-show="hasImage" :class="$style.bg">
        <ResponsiveImage :image="image" full :class="$style.image" />
      </div>

      <div :class="$style.textContainer">
        <MainTitle class="h2" :class="$style.title" :text="title" :data-fade-in="scrollSection ? 'true' : undefined" />

        <div ref="contentRef" :class="$style.content" data-fade-in>
          <RichText :class="$style.description" :text="description" />

          <PrimaryButton
            v-if="buttonLink"
            :class="$style.button"
            :text="buttonText"
            :external="buttonExternal"
            :href="buttonLink"
            :is-dark="isDark"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gsap } from 'gsap'

// Props
const props = defineProps({
  title: { type: Array, default: () => [] },
  largeTitle: { type: Array, default: () => [] },
  description: { type: Array, default: () => [] },
  image: { type: Object, default: () => ({}) },
  buttonLink: { type: String, default: '' },
  buttonText: { type: Array, default: () => [] },
  buttonExternal: { type: Boolean, default: false },
  reverse: { type: Boolean, default: false },
  isDark: { type: Boolean, default: false },
  padding: { type: Boolean, default: true },
  scrollSection: { type: Boolean, default: true },
  centerOnMobile: { type: Boolean, default: false },
})

// Local refs
const largeTitleRef = ref(null)
const titleRef = ref(null)
const contentRef = ref(null)

// Computed
const hasImage = computed(() => props.image?.url && props.image?.url !== '')

// Methods
function hide() {
  if (largeTitleRef.value?.hide) largeTitleRef.value.hide()
  if (titleRef.value?.hide) titleRef.value.hide()
  if (contentRef.value) gsap.set(contentRef.value, { opacity: 0 })
}

function show() {
  if (largeTitleRef.value?.show) largeTitleRef.value.show()
  if (titleRef.value?.show) titleRef.value.show()
  if (contentRef.value)
    gsap.to(contentRef.value, { opacity: 1, duration: 3, ease: 'power4.inOut', stagger: 0.1, delay: 1 })
}

// Expose API to parent
defineExpose({ hide, show })
</script>



<style lang="scss" module>
@use "sass:math";
@use "sass:map";
@use "sass:meta";
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.texAndImage {
  position: relative;
  .flex {
    display: flex;
    position: relative;
  }
  .bg {
    width: 50%;
    .image {
      width: 100%;
      height: 100%;
    }
  }
  .largeTitle {
    max-width: 1400px;
    margin-bottom: 72px;
  }
  
  .textContainer {
    width: 50%;
    padding: 200px var(--container-margin);
    box-sizing: border-box;
    .title {
      max-width: 590px;
      margin: 0;
      margin-bottom: 40px;
    }
    .description {
      max-width: 590px;
    }
    .button {
      margin-top: 40px;
    }
  }
  .titleMobile {
    display: none;
  }
  &[data-section-theme="dark"] {
    background: $black;
    color: $white;
  }
  &.padding {
    padding: 220px 0;
  }
  &.reverse {
    .flex {
      flex-direction: row-reverse;
    }
  }
  &:not(.hasImage) {
    .textContainer {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
  @include respond-to('desktop-extra-large') {
    .largeTitle {
      max-width: toVW(1400);
    }
    .textContainer {
      padding: toVW(200) var(--container-margin);
      .title {
        max-width: toVW(590);
      }
      .description {
        max-width: #{Min(toVW(590), 1200px)};
      }
    }
  }
  @include respond-to('tablet') {
    text-align: left;
    .flex {
      flex-direction: column;
      align-items: flex-start;
    }
    .bg {
      width: 70vw;
      height: 70vw * 1.15;
      margin: 30px 0;
    }
    .titleMobile {
      display: block;
    }
    .textContainer {
      width: var(--container-width);
      padding: 0px var(--container-margin);
      margin-top: 30px;
      box-sizing: content-box;
      .title {
        display: none;
      }
      .button {
        margin-top: 30px;
      }
      .description {
        margin-left: 0;
        margin-right: auto;
      }
    }
    &.reverse {
      .flex {
        flex-direction: column-reverse;
      }
      .bg {
        margin-left: auto;
        margin-right: 0;
      }
    }
    &.padding {
      padding: 120px 0;
    }
    &.centerOnMobile {
      text-align: center;
      .flex {
        flex-direction: column;
        align-items: center;
      }
      .bg {
        width: var(--container-width);
        height: 90vw * 377/315;
        margin: 30px auto !important;
      }
      .textContainer {
        .description {
          margin-left: auto !important;
          margin-right: auto !important;
        }
      }
    }
  }
  @include respond-to('mobile-medium') {
    .largeTitle {
      font-size: 38px;
    }
    &.padding {
      padding: 100px 0;
    }
  }
}
</style>
