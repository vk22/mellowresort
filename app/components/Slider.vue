<template>
  <section
    :class="[$style.slider, largePadding && $style.largePadding, canDrag.value && $style.canDrag]"
    data-scroll-section
    :data-section-theme="isDark ? 'dark' : undefined"
  >
    <div class="container" :class="$style.top">
      <Title
        v-if="title?.[0]?.text"
        class="h2"
        :class="$style.title"
        :text="title"
        data-fade-in
      />
    </div>

    <div
      ref="maskRef"
      :class="$style.mask"
      :data-cursor-text="canDrag.value ? 'Drag' : undefined"
    >
      <div ref="contentRef" :class="$style.content">
        <div
          v-for="(item, i) in items"
          :key="i"
          :class="$style.item"
        >
          <ResponsiveImage
            :class="$style.itemImage"
            :image="item.item_image"
            :ratio="400/380"
          />
          <h1 :class="$style.itemTitle">{{ item.item_title?.[0]?.text }}</h1>
          <RichText :class="$style.itemDescription" :text="item.item_description" />
        </div>
      </div>

      <div
        :class="[$style.prev, noPrev.value && $style.disabled]"
        @click="prev"
        data-cursor-hide
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 15">
          <path d="M10.8 12.609C6.903 10.173 5.383 9.242 1.618 7.2 5.383 5.158 6.903 4.227 10.8 1.791L9.677 0C5.912 3.116 3.897 4.55 0 7.2c3.897 2.65 5.912 4.084 9.677 7.2l1.123-1.791Z"/>
        </svg>
      </div>

      <div
        :class="[$style.next, noNext.value && $style.disabled]"
        @click="next"
        data-cursor-hide
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 15">
          <path d="M0.2 12.609C4.097 10.173 5.617 9.242 9.382 7.2 5.617 5.158 4.097 4.227 0.2 1.791L1.323 0C5.088 3.116 7.103 4.55 11 7.2c-3.897 2.65-5.912 4.084-9.677 7.2L0.2 12.609Z"/>
        </svg>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import Slider from '@/assets/js/components/slider'

const props = defineProps({
  title: { type: Array, default: () => [] },
  items: { type: Array, default: () => [] },
  isDark: { type: Boolean, default: false },
  largePadding: { type: Boolean, default: false },
})

const maskRef = ref(null)
const contentRef = ref(null)

const slider = ref(null)
const canDrag = ref(true)
const noPrev = ref(true)
const noNext = ref(false)

function resize() {
  /* оставлено пустым — оригинал тоже ничего не делал */
}

function init() {
  resize()
  window.addEventListener('resize', resize)

  nextTick(() => {
    setTimeout(() => {
      slider.value = new Slider({
        el: maskRef.value,
        noTouch: true,
        content: contentRef.value,
        margin: 130,
        containerMargin: true,
        paralax: [
          () => {
            noPrev.value = slider.value.data.t === 0
            noNext.value = slider.value.data.t === slider.value.max
          }
        ]
      })

      canDrag.value = slider.value.max > 0
      resize()
    }, 500)
  })
}

function prev() {
  slider.value?.prev()
}

function next() {
  slider.value?.next()
}

watch(
  () => props.items,
  async () => {
    await nextTick()
    slider.value?.updateSections()
    resize()
  }
)

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
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
.slider {
  width: 100%;
  padding: 240px * 0.5 0;
  .top {
    .title {
      max-width: 560px;
      text-align: center;
      margin: 0 auto;
    }
    &:not(:empty) {
      margin-bottom: 72px;
    }
  }
  .mask {
    box-sizing: border-box;
    overflow: hidden;
    pointer-events: all;
    position: relative;
    z-index: 1;
  }
  .prev,.next {
    width: 54px;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 1;
    top: calc((100vw / 3.8) * 0.5);
    transform: translateY(-50%);
    transition: opacity 1s $curve;
    &::before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;
      border-radius: 50%;
      background: $white;
      box-shadow: 0 0 6px 1px #14131426;
      transition: transform 1s $curve;
    }
    svg {
      width: 20%;
      fill: $black;
      position: relative;
      z-index: 1;
      transition: transform 1s $curve;
    }
    @include not-touch {
      &:hover {
        &::before {
          transform: scale(1.1);
        }
      }
    }
    &.disabled {
      opacity: 0;
      pointer-events: none;
      &::before {
        transform: scale(0.2);
      }
      svg {
        transform: scale(0.2);
      }
      &.prev {
        svg {
          transform: translateX(-10%) scale(0.2);
        }
      }
      &.next {
        svg {
          transform: translateX(10%) scale(0.2);
        }
      }
    }
  }
  .prev {
    left: var(--container-margin);
    svg {
      transform: translateX(-10%);
    }
  }
  .next {
    right: var(--container-margin);
    svg {
      transform: translateX(10%);
    }
  }
  .content {
    width: auto;
    display: inline-block;
    white-space: nowrap;
  }
  .item {
    width: calc(100vw / 3.8);
    margin-right: 24px;
    display: inline-block;
    vertical-align: top;
    will-change: transform;
    white-space: normal;
    .itemImage {
      width: 100%;
      margin-bottom: 40px;
    }
    .itemTitle {
      font-family: $font-serif;
      font-weight: 400;
      font-size: 21px;
      margin: 0;
      margin-bottom: 11px;
    }
    .itemDescription {
      max-width: 90%;
      font-weight: 400;
      font-size: 14px;
      line-height: 1.5;
      letter-spacing: 0.01em;
      white-space: normal;
    }
  }
  &[data-section-theme="dark"] {
    background: $black;
    color: $white;
  }
  &.largePadding {
    padding: 240px 0;
  }
  &.canDrag {
    .mask {
      cursor: grab;
    }
  }
  @include respond-to('desktop-extra-large') {
    padding: toVW(240) 0;
    .top {
      .title {
        max-width: toVW(560);
      }
      &:not(:empty) {
        margin-bottom: toVW(72);
      }
    }
    .item {
      .itemTitle {
        font-size: toVW(21);
        margin-bottom: toVW(11);
      }
      .itemDescription {
        font-size: toVW(14);
      }
    }
  }
  @include respond-to('tablet-small') {
    .item {
      width: calc(100vw / 1.8);
    }
  }
  @include respond-to('mobile-medium') {
    padding: 100px 0;
    .top {
      &:not(:empty) {
        margin-bottom: 30px;
      }
    }
    .prev, .next {
      width: 40px;
      height: 40px;
      top: calc((100vw - 60px) * 0.5);
      svg {
        width: 23%;
      }
    }
    .prev {
      left: 11px;
    }
    .next {
      right: 11px;
    }
    .item {
      width: calc(100vw - 60px);
      margin-right: 15px;
      .itemImage {
        margin-bottom: 30px;
      }
      .itemTitle {
        font-size: 16px;
        margin-bottom: 5px;
      }
      .itemDescription {
        max-width: 300px;
        font-size: 14px;
      }
    }
    &.largePadding {
      padding: 100px 0;
    }
  }
}
</style>
