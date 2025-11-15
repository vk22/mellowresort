<template>
  <section
    :class="[$style.placesSlider]"
    data-scroll-section
  >
    <div ref="items" :class="$style.items">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="[$style.item, index === active && $style.active]"
        ref="item"
      >
        <div :class="$style.images">
          <div :class="$style.imageContainer">
            <ResponsiveImage
              :image="item.image_1"
              :class="$style.image"
              full
            />
          </div>
          <div :class="$style.imageContainer">
            <ResponsiveImage
              :image="item.image_2"
              :class="$style.image"
              full
            />
          </div>
          <div :class="$style.imageContainer">
            <ResponsiveImage
              :image="item.image_3"
              :class="$style.image"
              full
            />
          </div>
          <div :class="$style.imageContainer">
            <ResponsiveImage
              :image="item.image_4"
              :class="$style.image"
              full
            />
          </div>
          <div :class="$style.imageContainer">
            <ResponsiveImage
              :image="item.image_5"
              :class="$style.image"
              full
            />
          </div>
        </div>
        <div :class="$style.content">
          <MainTitle :class="$style.title" :text="item.item_title" :mask="false" />
          <RichText :class="$style.description" :text="item.item_description" />
        </div>
      </div>
    </div>
    <div ref="nav" :class="$style.nav" v-show="this.items.length > 1">
      <div :class="$style.button" @click="prev">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 15">
          <path d="M10.8 12.609C6.903 10.173 5.383 9.242 1.618 7.2 5.383 5.158 6.903 4.227 10.8 1.791L9.677 0C5.912 3.116 3.897 4.55 0 7.2c3.897 2.65 5.912 4.084 9.677 7.2l1.123-1.791Z"/>
        </svg>
      </div>
      <div :class="$style.button" @click="next">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 15">
          <path d="M0.2 12.609C4.097 10.173 5.617 9.242 9.382 7.2 5.617 5.158 4.097 4.227 0.2 1.791L1.323 0C5.088 3.116 7.103 4.55 11 7.2c-3.897 2.65-5.912 4.084-9.677 7.2L0.2 12.609Z"/>
        </svg>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const active = ref(0)
const taller = ref(0)

const itemsRef = ref(null)
const itemRefs = ref([])
const navRef = ref(null)

// styles
const $style = useCssModule()

// ———————————————
// Resize logic
// ———————————————
function resize() {
  const list = itemRefs.value
  if (!list || list.length === 0) return

  let maxH = 0

  list.forEach((el) => {
    const content = el.querySelector(`.${$style.content}`)
    const h = content?.offsetHeight || 0
    if (h > maxH) maxH = h
  })

  taller.value = maxH
  if (itemsRef.value) {
    itemsRef.value.style.setProperty('--taller', `${maxH}px`)
  }

  if (navRef.value) {
    const marginTop = window.innerHeight * (420 / 795)
    navRef.value.style.top = `${marginTop + maxH + 40}px`
  }
}

// ———————————————
// Navigation
// ———————————————
function prev() {
  active.value =
    active.value === 0 ? props.items.length - 1 : active.value - 1
}

function next() {
  active.value =
    active.value === props.items.length - 1 ? 0 : active.value + 1
}

// ———————————————
// Watch props
// ———————————————
watch(
  () => props.items,
  async () => {
    await nextTick()
    resize()
  },
  { deep: true }
)

// ———————————————
// Lifecycle
// ———————————————
onMounted(() => {
  window.addEventListener('resize', resize)
  resize()
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
.placesSlider {
  height: $vh100;
  position: relative;
  margin: 210px 0;
  $vw: 1440;
  $vh: 795;

  @function to-vw($value) {
    @return 100vw * $value/$vw;
  }
  @function to-vh($value) {
    @return 100vh * $value/$vh;
  }
  .items {
    width: 100%;
    height: 100%;
    position: relative;
    color: #{'v-bind(colorasd)'};
  }
  .item {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    .images {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      .imageContainer {
        overflow: hidden;
        position: absolute;
        will-change: transform, opacity;
        transition: transform 1s $curve, opacity 1s $curve;
        .image {
          transition: transform 2s cubic-bezier(0.36, 0.12, 0, 1), opacity 2s cubic-bezier(0.36, 0.12, 0, 1);
        }
        &:nth-child(1) {
          width: to-vw(140);
          height: to-vh(490);
          left: 0;
          bottom: 0;
          transition-delay: 0s;
        }
        &:nth-child(2) {
          width: to-vw(250);
          height: to-vh(270);
          left: to-vw(377);
          top: 0;
          transition-delay: 0.05s;
        }
        &:nth-child(3) {
          width: to-vw(400);
          height: to-vh(390);
          left: to-vw(770);
          top: 0;
          transition-delay: 0.1s;
        }
        &:nth-child(4) {
          width: to-vw(120);
          height: to-vh(340);
          right: 0;
          top: 0;
          transition-delay: 0.15s;
        }
        &:nth-child(5) {
          width: to-vw(360);
          height: to-vh(250);
          right: to-vw(114);
          bottom: 0;
          transition-delay: 0.2s;
        }
      }
    }
    .content {
      margin-top: to-vh(420);
      margin-left: to-vw(240);
      transition: opacity 1s ease-in-out;
    }
    .title {
      max-width: 190px;
      font-size: 51px;
      line-height: 1.2;
      letter-spacing: -0.01em;
    }
    .description {
      width: calc(100vw - #{to-vw(240 + 360 + 114 + 40)});
      max-width: 460px;
      margin-top: 40px;
    }
    &:not(.active) {
      pointer-events: none;
      .content {
        opacity: 0;
        transition-delay: 0s;
      }
      .imageContainer {
        // transform: scale(0.8);
        // opacity: 0;
        // transition-delay: 0s !important;
        .image {
          transition-delay: 0s !important;
        }
        &:nth-child(1) .image {
          transform: scale(1.05);
          opacity: 0;
        }
        &:nth-child(2) .image {
          transform: scale(1.05);
          opacity: 0;
        }
        &:nth-child(3) .image {
          transform: scale(1.05);
          opacity: 0;
        }
        &:nth-child(4) .image {
          transform: scale(1.05);
          opacity: 0;
        }
        &:nth-child(5) .image {
          transform: scale(1.05);
          opacity: 0;
        }
      }
    }
    &.active {
      .content {
        transition-delay: 0.9s;
      }
      .imageContainer {
        @for $i from 1 through 5 {
          &:nth-child(#{$i}) .image {
            transition-delay: 0.6s + 0.05s * $i !important;
          }
        }
      }
    }
  }
  .nav {
    display: flex;
    align-items: center;
    position: absolute;
    left: to-vw(236);
    .button {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
        width: 100%;
        height: 100%;
        background: currentColor;
        border-radius: 50%;
        transition: transform 1s $curve;
      }
      svg {
        width: 20%;
        fill: $white;
        position: relative;
        z-index: 1;
      }
      &:hover {
        &::before {
          transform: scale(1.2);
        }
      }
      &:first-child {
        svg {
          transform: translateX(-10%);
        }
      }
      &:last-child {
        svg {
          transform: translateX(10%);
        }
      }
      &:not(:last-child) {
        margin-right: 32px;
      }
    }
  }
    
  @include respond-to('desktop-extra-large') {
    .item {
      .title {
        max-width: toVW(190);
        font-size: toVW(51);
      }
      .description {
        max-width: toVW(460);
        margin-top: toVH(40);
      }
    }
  }
  @include respond-to('desktop') {
    .item {
      .images {
        .imageContainer {
          &:nth-child(1) {
            height: calc((100% - (var(--taller) + 15px + 30vh + 35px + 30px)) * 0.8);
          }
          &:nth-child(2) {
            display: none;
          }
          &:nth-child(3) {
            width: 400px;
            height: 30vh;
            left: 0;
          }
          &:nth-child(4) {
            height: 40vh;
          }
          &:nth-child(5) {
            width: 360px;
            height: calc((100% - (var(--taller) + 15px + 30vh + 35px + 30px)) * 0.6);
            right: 0;
          }
        }
      }
      .content {
        margin-left: var(--container-margin);
        margin-top: calc(30vh + 35px);
      }
    }
    .nav {
      left: var(--container-margin);
      top: calc(var(--taller) + 15px + 30vh + 35px) !important;
    }
  }
  @include respond-to('tablet-small') {
    .item {
      .images {
        .imageContainer {
          &:nth-child(1) {
            width:  62px;
            height: calc((100% - (var(--taller) + 15px + 30vh + 35px + 30px)) * 0.8);
          }
          &:nth-child(3) {
            width: 220px;
            height: 30vh;
            left: 0;
          }
          &:nth-child(4) {
            width: 100px;
            height: 40vh;
          }
          &:nth-child(5) {
            width: 180px;
            height: calc((100% - (var(--taller) + 15px + 30vh + 35px + 30px)) * 0.6);
            right: 0;
          }
        }
      }
      .title {
        max-width: 230px;
        font-size: 51px * 0.8;
      }
      .description {
        width: 100%;
        max-width: 315px;
        margin-top: 15px;
      }
    }
  }
  @include respond-to('mobile-medium') {
    margin: 210px * 0.5 0;
    .item {
      .images {
        .imageContainer {
          &:nth-child(4) {
            height: 36vh;
          }
        }
      }
      .title {
        font-size: 38px;
      }
    }
    .nav {
      .button {
        svg {
          width: 23%;
        }
        &:not(:last-child) {
          margin-right: 17px;
        }
      }
    }
  }
}
</style>
