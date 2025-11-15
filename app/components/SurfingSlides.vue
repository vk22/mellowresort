<template>
  <section
    :class="[$style.surfingSlides]"
    data-scroll-sticky="true"
    data-scroll-section
    data-section-theme="dark"
  >
    <div ref="placeholder" data-scroll-sticky-placeholder></div>

    <div :class="$style.container" data-scroll-sticky-container>
      <div
        :class="$style.content"
        data-scroll-sticky-content
        :data-scroll-sticky-height="props.items.length * 1.5"
      >
        <!-- LEFT -->
        <div :class="$style.left">
          <div ref="leftBox" :class="$style.leftBox">
            <div
              v-for="(item, index) in props.items"
              :key="index"
              ref="leftSlide"
              :class="[$style.leftSlide, index === currentIndex && $style.active]"
            >
              <ResponsiveImage :class="$style.image" :image="item.item_image" full />
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div :class="$style.right">
          <div :class="$style.progress" :style="{ transform: `scaleX(${0})` }"></div>

          <div ref="rightBox" :class="$style.rightBox">
            <div
              v-for="(item, index) in props.items"
              :key="index"
              ref="rightSlide"
              :class="[$style.rightSlide, index === currentIndex && $style.active]"
            >
              <Title class="h1" :class="$style.title" :text="item.item_title" />

              <span v-if="index > 0" :class="$style.number">{{ prettyNumber(index) }}</span>

              <RichText
                v-if="item.item_description"
                :class="$style.description"
                :text="item.item_description"
              />

              <span
                v-if="item.item_scroll_text && item.item_scroll_text[0]"
                :class="$style.scrollText"
              >
                {{ asText(item.item_scroll_text) }}
              </span>
            </div>
          </div>
        </div>

        <!-- MOBILE -->
        <div :class="$style.mobile">
          <div
            v-for="(item, index) in props.items"
            :key="index"
            :class="$style.item"
          >
            <div :class="$style.itemContent">
              <span v-if="index > 0" :class="$style.number" class="h1">
                {{ prettyNumber(index) }}
              </span>

              <Title class="h1" :class="$style.title" :text="item.item_title" />

              <RichText
                v-if="item.item_description"
                :class="$style.description"
                :text="item.item_description"
              />

              <span
                v-if="item.item_scroll_text && item.item_scroll_text[0]"
                :class="$style.scrollText"
              >
                {{ asText(item.item_scroll_text) }}
              </span>
            </div>

            <ResponsiveImage
              :image="item.item_image"
              :class="$style.image"
              full
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { asText } from "@prismicio/helpers";
import Sticky from "~/assets/js/components/sticky";
import { useAppBus } from "~/composables/useAppBus";

const $style = useCssModule();
const bus = useAppBus();

// props
const props = defineProps({
  items: { type: Array, default: () => [] }
});

// state
const currentIndex = ref(0);
const progress = ref(0);

// refs
const leftBox = ref(null);
const rightBox = ref(null);
const leftSlide = ref([]);
const rightSlide = ref([]);
const placeholder = ref(null);

let stickyInstance = null;

// pretty number
const prettyNumber = (n) => (n < 10 ? "0" + n : n);

// resize
function resize(skipEmit = false) {
  if (!rightSlide.value?.length) return;

  rightSlide.value.forEach((el, i) => {
    if (i > 0) {
      const title = el.querySelector(`.${$style.title}`);
      if (title) {
        const w = title.offsetWidth;
        const h = title.offsetHeight;
        // можно использовать при нужде
      }
    }
  });

  if (stickyInstance) stickyInstance.resize();

  if (!skipEmit) bus.emit("scroll-resize", {});
}

// watch props update
watch(
  () => props.items,
  async () => {
    await nextTick();
    resize();
  },
  { immediate: true }
);

// mounted
onMounted(() => {
  window.addEventListener("resize", resize);

  stickyInstance = new Sticky(placeholder.value.parentNode, (p) => {
    progress.value = p;
    currentIndex.value = Math.round(p * (props.items.length - 1));

    const slides = leftSlide.value;
    if (!slides) return;

    slides.forEach((slide, i) => {
      const pPerItem = progress.value / (1 / props.items.length);
      const itemProgress = Math.max(0, Math.min(1, pPerItem - i));

      if (i > 0) {
        slide.style.clipPath = `inset(${(1 - itemProgress) * 100}% 0 0 0)`;
      }
    });
  });

  resize();

  // bus listener
  bus.on("scroll-resize", () => {
    setTimeout(() => stickyInstance?.resize(), 100);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);

  bus.off("scroll-resize");

  if (stickyInstance) stickyInstance.destroy();
});
</script>


<style lang="scss" module>

@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;

.surfingSlides {
  width: 100%;
  position: relative;
  color: $white;
  overflow: hidden;
  .content {
    display: flex;
  }
  .left {
    width: 48%;
    height: $vh100;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background: $black;
    .leftBox {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .leftSlide {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      transition: opacity 1s $curve 0s;
      .image {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 0;
        transition: transform 1s $curve 0s;
      }
      &:not(.active) {
        // opacity: 0;
        pointer-events: none;
        .image {
          transform: scale(1.2);
        }
      }
      &.active {
        transition-delay: 0.6s;
      }
    }
  }
  .right {
    width: 52%;
    height: $vh100;
    box-sizing: border-box;
    position: relative;
    background: $black;
    .progress {
      position: absolute;
      top: -1px;
      left: 0;
      width: 100%;
      height: 3px;
      background: $white;
      will-change: transform;
      transform-origin: 0 0;
      transform: scaleX(0);
      transition: transform 1s $curve;
    }
    .rightBox {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .rightSlide {
      width: 100%;
      height: 100%;
      padding: var(--container-margin);
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      overflow: hidden;
      .title, .number, .scrollText, .description {
        transition: opacity 1.7s $curve 0s;
        will-change: transform;
      }
      .title, .number {
        top: 150px;
      }
      .scrollText {
        width: 100%;
        display: block;
        position: absolute;
        left: 0;
        bottom: 150px;
        text-align: center;
      }
      .title {
        position: absolute;
        left: var(--container-margin);
        transform-origin: 0% 0%;
        transform: rotate(-90deg) translateX(-100%);
      }
      .number {
        display: inline-block;
        font-family: $font-serif;
        font-size: 80px;
        text-align: right;
        letter-spacing: -0.02em;
        position: absolute;
        right: var(--container-margin);
      }
      .description {
        max-width: 340px;
      }
      &:first-child {
        .title {
          max-width: 540px;
          transform: none;
        }
      }
      &:not(.active) {
        .title, .number, .scrollText, .description {
          opacity: 0;
        }
      }
      &.active {
        .title {
          transition-delay: 0.8s;
        }
        .number {
          transition-delay: 0.9s;
        }
        .scrollText, .description {
          transition-delay: 0.95s;
        }
      }
    }
  }
  .mobile {
    width: 100%;
    max-width: 700px;
    display: none;
    margin: 0 auto;
    padding-bottom: 120px;
    .item {
      width: 100%;
      .itemContent {
        width: 100%;
        padding: 120px var(--container-margin);
        box-sizing: border-box;
        background: $black;
        color: $white;
      }
      .number, .title {
        font-size: 38px;
      }
      .number {
        display: block;
        font-family: $font-serif;
        margin-bottom: 15px;
      }
      .description {
        margin-top: 60px;
      }
      .image {
        width: 100%;
        aspect-ratio: 1/1;
      }
      &:first-child {
        position: relative;
        height: $vh100;
        text-align: center;
        .itemContent {
          height: 100%;
          background: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }
        .scrollText {
          font-family: $font-serif;
          font-weight: 400;
          font-size: 19px;
          margin-top: 60px;
        }
        .image {
          height: 100%;
          aspect-ratio: auto;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 0;
        }
      }
    }
  }
  @include respond-to('desktop-extra-large') {
    .right {
      .rightSlide {
        .number {
          font-size: toVW(80);
        }
        .description {
          max-width: toVW(340);
        }
        &:first-child {
          .title {
            max-width: toVW(540);
          }
        }
      }
    }
  }
  @include respond-to('desktop-large') {
    .right {
      .rightSlide {
        .title {
          font-size: 100px * 0.8;
        }
      }
    }
  }
  @include respond-to('desktop-medium') {
    @include is-touch {
      .left, .right {
        display: none;
      }
      .content {
        height: auto;
      }
      .mobile {
        display: block;
      }
    }
  }
}
</style>
