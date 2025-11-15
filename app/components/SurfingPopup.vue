<template>
  <div :class="[$style.surfingPopup, isOpen && $style.isOpen]" data-scroll-native>
    <div :class="$style.bg" />

    <CloseButton :class="$style.close" @click="close" />

    <div ref="card" :class="$style.card">
      <ResponsiveImage :class="$style.image" :image="image" :ratio="1" />
      <h2 :class="$style.title">{{ asText(title) }}</h2>
      <RichText :class="$style.description" :text="description" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from "vue"
import { asText } from "@prismicio/helpers"
import { useAppBus } from "~/composables/useAppBus"

const $style = useCssModule()
const bus = useAppBus()

// state
const isOpen = ref(false)

const title = ref([])
const description = ref([])
const image = ref({})

const card = ref(null)

// METHODS
function close() {
  isOpen.value = false
  document.documentElement.classList.remove("overflowHidden")
}

function open(data) {
  title.value = data.title
  description.value = data.description
  image.value = data.image

  nextTick(() => {
    isOpen.value = true
  })

  document.documentElement.classList.add("overflowHidden")
}

// EVENTS
onMounted(() => {
  bus.on("surfing-popup-open", open)
  bus.on("surfing-popup-close", close)
})

onBeforeUnmount(() => {
  bus.off("surfing-popup-open", open)
  bus.off("surfing-popup-close", close)
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

.surfingPopup {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999999;
  display: flex;
  align-items: center;
  justify-content: center;

  .bg {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    background: rgba(0, 0, 0, 0.5);
    transition: opacity 1s $curve;
  }

  .close {
    position: absolute;
    top: 45px;
    right: var(--container-margin);
    z-index: 2;
    transition: opacity 1s $curve;
  }

  .card {
    width: 95%;
    max-width: 472px;
    height: auto;
    max-height: calc(var(--vh, 1vh) * 100 - 45px * 4 - 30px * 2);
    overflow-y: auto;
    padding: 22px;
    padding-bottom: 50px;
    box-sizing: border-box;
    background: $white;
    color: $black;
    position: relative;
    z-index: 1;
    transition: opacity 1s $curve, transform 1.2s $curve;

    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #afa9a1;
    }
  }

  .title {
    font-family: $font-serif;
    font-weight: 400;
    font-size: 21px;
    margin: 0;
  }

  .image {
    margin-bottom: 40px;
  }

  .description {
    margin-top: 8px;
  }

  &:not(.isOpen) {
    &,
    * {
      pointer-events: none;
    }
    .bg,
    .close,
    .card {
      opacity: 0;
    }
    .card {
      transform: scale(0.9);
    }
  }

  @include respond-to("desktop-extra-large") {
    .card {
      max-width: toVW(472);
    }
    .title {
      font-size: toVW(21);
    }
  }

  @include respond-to("mobile-medium") {
    .card {
      width: calc(100vw - var(--container-margin) * 2);
      max-height: calc(var(--vh, 1vh) * 100 - 190px);
      padding: 15px;
      padding-bottom: 40px;
    }
    .close {
      top: 30px;
    }
  }
}
</style>
