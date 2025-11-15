<template>
  <header
    :class="[$style.header, isMeta && $style.isMeta]"
    data-section-theme="dark"
    data-scroll-section
  >
    <ResponsiveImage :class="$style.bg" :image="image" />

    <div class="container" :class="$style.flex">
      <!-- Subtitle -->
      <span
        v-if="subtitle?.[0]?.text"
        ref="subtitleRef"
        :class="$style.subtitle"
      >
        {{ subtitle[0].text }}
      </span>

      <!-- Title -->
      <MainTitle
        ref="titleRef"
        :class="$style.title"
        :text="title"
        class="h1"
        :mask="true"
      />

      <!-- Location -->
      <a
        v-if="location?.[0]?.text"
        ref="locationRef"
        :class="$style.location"
        :href="locationLink?.url"
        target="_blank"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 29">
          <path
            d="M10 0A10 10 0 0 0 0 10c0 7.5 10 18.57 10 18.57S20 17.5 20 10A10 10 0 0 0 10 0Zm0 13.57a3.57 3.57 0 1 1 0-7.14 3.57 3.57 0 0 1 0 7.14Z"
          />
        </svg>
        <span>{{ location[0].text }}</span>
      </a>

      <!-- Dates -->
      <span
        v-if="datesVisual"
        ref="datesRef"
        :class="$style.dates"
      >
        {{ datesVisual }}
      </span>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gsap } from 'gsap'
import MainTitle from './MainTitle.vue'

const props = defineProps({
  image: { type: Object, default: () => ({}) },
  title: { type: Array, default: () => [] },
  dates: { type: Array, default: () => [] },
  subtitle: { type: Array, default: () => [] },
  location: { type: Array, default: () => [] },
  locationLink: { type: Object, default: () => ({}) },
  isMeta: { type: Boolean, default: false },
})

/* ---------------------- REFS ---------------------- */

const titleRef = ref(null)
const subtitleRef = ref(null)
const locationRef = ref(null)
const datesRef = ref(null)

/* Коллекция элементов, которые fade-in */
const items = ref([])

/* ---------------------- COMPUTED ---------------------- */

const datesVisual = computed(() => {
  return props.dates
    .filter(d => d.date?.[0]?.text)
    .map(d => d.date[0].text)
    .join(' & ')
})

/* ---------------------- METHODS ---------------------- */

function initIntro() {
  items.value = []

  if (titleRef.value) titleRef.value.hide()

  if (subtitleRef.value) items.value.push(subtitleRef.value)
  if (locationRef.value) items.value.push(locationRef.value)
  if (datesRef.value) items.value.push(datesRef.value)

  gsap.set(items.value, { opacity: 0 })
}

function intro() {
  titleRef.value?.show()

  gsap.to(items.value, {
    opacity: 1,
    duration: 3,
    ease: 'power4.inOut',
    stagger: 0.1,
    delay: 1,
  })
}

/* --------------------------------------------------------
  Expose методы наружу, чтобы родитель мог вызвать:
  this.$refs.header.initIntro()
  this.$refs.header.intro()
--------------------------------------------------------- */
defineExpose({
  initIntro,
  intro,
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
.header {
  width: 100%;
  height: $vh100;
  position: relative;
  color: $white;
  text-align: center;
  overflow: hidden;

  .bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .flex {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1;
    position: relative;
  }

  .subtitle {
    margin-bottom: 16px;
  }

  .title {
    max-width: 890px;
  }

  .location {
    display: inline-flex;
    align-items: center;
    margin-top: 18px;

    svg {
      height: 1.5em;
      margin-right: 20px;
      fill: currentColor;
    }
  }

  .dates {
    position: absolute;
    bottom: 120px;
  }

  &.isMeta {
    .subtitle,
    .title,
    .location {
      display: none;
    }
  }

  @include respond-to('desktop-extra-large') {
    .title {
      max-width: toVW(890);
    }
  }

  @include respond-to('mobile-medium') {
    .location svg {
      display: none;
    }
  }
}
</style>

