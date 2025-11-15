<script setup>
import { ref, computed } from 'vue'
import { asText } from '@prismicio/helpers'

// Props
const props = defineProps({
  click: { type: Function, default: null },
  text: { type: Array, default: () => [] },
  href: { type: String, default: '' },
  external: { type: Boolean, default: false },
  isDark: { type: Boolean, default: false },
})

// state
const contentRef = ref(null)

const hasListener = computed(() => typeof props.click === 'function' && props.click !== null)

function handleClick() {
  if (hasListener.value) {
    props.click()
  } else {
    // fallback: click inner element if exists
    contentRef.value?.click?.()
  }
}

const textValue = computed(() => asText(props.text) || '')
</script>

<template>
  <div
    :class="[
      $style.primaryButton,
      isDark && $style.isDark,
      hasListener && $style.handleClick
    ]"
    @click="handleClick"
    data-cursor-pointer
  >

    <!-- External link -->
    <a
      v-if="href && external"
      ref="contentRef"
      :href="href"
      target="_blank"
      rel="noopener noreferrer"
      :class="$style.content"
    >
      <span :class="$style.text">{{ textValue }}</span>
    </a>

    <!-- Internal Nuxt link -->
    <NuxtLink
      v-else-if="href && !external"
      ref="contentRef"
      :to="href"
      :class="$style.content"
    >
      <span :class="$style.text">{{ textValue }}</span>
    </NuxtLink>

    <!-- As plain button -->
    <div
      v-else
      ref="contentRef"
      :class="$style.content"
    >
      <span :class="$style.text">{{ textValue }}</span>
    </div>

  </div>
</template>

<style lang="scss" module>
@use "sass:math";
@use "sass:map";
@use "sass:meta";
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.primaryButton {
  display: inline-flex;
  color: inherit;
  cursor: pointer;
  font-size: 14px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: 0.01em;
  color: white;

  .content {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 20px 70px;

    &::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 0;
      background: $black;
      border-radius: 100px;
      transition: transform 1s $curve, opacity 1s $curve;
    }

    span {
      position: relative;
      z-index: 1;
    }
  }

  &:hover .content::after {
    opacity: 0.7;
    transform: scale(1.05);
  }

  &.isDark {
    color: $black;
    .content::after {
      background: $white;
    }
  }

  @include respond-to('desktop-extra-large') {
    font-size: toVW(14);
  }

  @include respond-to('mobile-medium') {
    font-size: 15.5px;
    .content {
      padding: 18px 40px;
    }
  }
}
</style>
