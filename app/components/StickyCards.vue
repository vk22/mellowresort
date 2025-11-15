<template>
  <section
    ref="root"
    :class="$style.stickyCards"
    data-scroll-sticky="true"
    data-scroll-section
    :data-section-theme="isTouch ? undefined : 'dark'"
  >
    <div data-scroll-sticky-placeholder></div>
    <div :class="$style.container" data-scroll-sticky-container>
      <div
        :class="$style.content"
        data-scroll-sticky-content
        :data-scroll-sticky-height="items.length * 2"
      >
        <!-- LEFT -->
        <div :class="$style.left">
          <div ref="leftBox" :class="$style.leftBox">
            <div
              v-for="(item, index) in items"
              :key="index"
              ref="leftSlide"
              :class="[$style.leftSlide, index === currentIndex && $style.active]"
            >
              <span :class="$style.title">
                {{ item.item_title }}
              </span>
              <MainTitle
                class="h1"
                :class="$style.subtitle"
                :text="item.item_subtitle"
                :mask="false"
              />
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div :class="$style.right">
          <div
            :class="$style.progress"
            :style="{ transform: `scaleX(${progress})` }"
          />
          <span :class="$style.pagination">
            {{ currentIndexVisual }} - {{ totalVisual }}
          </span>

          <div ref="rightBox" :class="$style.rightBox">
            <div
              v-for="(item, index) in items"
              :key="index"
              ref="rightSlide"
              :class="[$style.rightSlide, index === currentIndex && $style.active]"
            >
              <ResponsiveImage
                :image="item.item_image"
                :class="$style.image"
                full
              />
              <div :class="$style.back">
                <RichText
                  :class="$style.description"
                  :text="item.item_hover_text"
                />
              </div>
            </div>
          </div>

          <span :class="$style.scrollText">{{ scrollText }}</span>
        </div>

        <!-- MOBILE -->
        <div :class="$style.mobile">
          <div
            v-for="(item, index) in items"
            :key="index"
            :class="$style.item"
          >
            <ResponsiveImage
              :image="item.item_image"
              :class="$style.image"
              :ratio="1"
            />
            <div :class="$style.itemContent">
              <span :class="$style.title">
                {{ item.item_title }}
              </span>
              <MainTitle
                class="h1"
                :class="$style.subtitle"
                :text="item.item_subtitle"
                :mask="false"
              />
              <RichText
                :class="$style.description"
                :text="item.item_hover_text"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Sticky from '../assets/js/components/sticky'
import Util from '~//utils/util'
import { useRoute } from '#imports'
import { useAppBus } from '~/composables/useAppBus'

const $style = useCssModule()
const route = useRoute()
const bus = useAppBus()

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

// refs
const root = ref(null)
const leftBox = ref(null)
const rightBox = ref(null)
const leftSlide = ref([])   // v-for ref → массив
const rightSlide = ref([])

const currentIndex = ref(0)
const progress = ref(0)
const isTouch = ref(false)
const stickyInstance = ref(null)

// computed
const scrollText = computed(() =>
  route.params.lang === 'es' ? 'Baja para ver más' : 'Scroll'
)

const currentIndexVisual = computed(() => {
  const v = currentIndex.value + 1
  return v < 10 ? `0${v}` : String(v)
})

const totalVisual = computed(() => {
  const len = props.items.length
  return len < 10 ? `0${len}` : String(len)
})

// resize
function resize() {
  isTouch.value = Util.isTouch()

  if (!leftSlide.value?.length || !rightSlide.value?.length) return

  let leftTallest = 0
  let rightTallest = 0

  // высота левой колонки
  leftSlide.value.forEach((el) => {
    if (!el) return
    if (el.scrollHeight > leftTallest) leftTallest = el.scrollHeight
  })

  // высота правого блока (по .back)
  rightSlide.value.forEach((el) => {
    if (!el) return
    const back = el.querySelector(`.${$style.back}`)
    if (!back) return
    back.classList.add('height-auto')
    if (back.scrollHeight > rightTallest) rightTallest = back.scrollHeight
    back.classList.remove('height-auto')
  })

  const firstRight = rightSlide.value[0]
  if (firstRight) {
    const minHeight = firstRight.clientWidth * 1.25
    const maxHeight = window.innerHeight * 0.8
    if (rightTallest < minHeight) rightTallest = minHeight
    if (rightTallest > maxHeight) rightTallest = maxHeight
  }

  if (leftBox.value) leftBox.value.style.height = `${leftTallest}px`
  if (rightBox.value) rightBox.value.style.height = `${rightTallest}px`

  stickyInstance.value?.resize()
  bus.emit('scroll-resize')
}

// следим за items
watch(
  () => props.items,
  () => {
    nextTick(() => {
      resize()
    })
  },
  { deep: true }
)

onMounted(() => {
  window.addEventListener('resize', resize)

  nextTick(() => {
    resize()

    if (!root.value) return

    stickyInstance.value = new Sticky(root.value, (p /* progress */, isDown) => {
      progress.value = p
      if (props.items.length > 1) {
        currentIndex.value = Math.round(p * (props.items.length - 1))
      } else {
        currentIndex.value = 0
      }
    })
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  if (stickyInstance.value) {
    stickyInstance.value.destroy()
    stickyInstance.value = null
  }
})
</script>

<style lang="scss" module>
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.stickyCards {
  width: 100%;
  position: relative;
  .content {
    display: flex;
  }
  .left {
    width: 48%;
    height: $vh100;
    background: $black;
    color: $white;
    box-sizing: border-box;
    padding-left: var(--container-margin);
    display: flex;
    align-items: center;
    .leftBox {
      width: 100%;
      position: relative;
    }
    .leftSlide {
      max-width: 90%;
      position: absolute;
      top: 0;
      left: 0;
      .title, .subtitle {
        transition: opacity 1s $curve 0s, transform 1s $curve 0s;
      }
      .title {
        font-size: 16px;
        line-height: 1.6;
        letter-spacing: 0.01em;
        margin-bottom: 32px;
        display: block;
      }
      &:not(.active) {
        .title, .subtitle {
          opacity: 0;
          transform: translateY(100px);
        }
      }
      &.active {
        .title {
          transition-delay: 0.6s;
        }
        .subtitle {
          transition-delay: 0.8s;
        }
      }
    }
  }
  .right {
    width: 52%;
    height: $vh100;
    background: $white;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .progress {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: $black;
      transform-origin: 0 0;
      transform: scaleX(0);
      transition: transform 1s $curve;
    }
    .rightBox {
      width: 80%;
      max-width: calc(100% - var(--container-margin) * 4);
      position: relative;
    }
    .pagination, .scrollText {
      position: absolute;
      top: 50%;
      font-weight: 400;
      font-size: 14px;
      line-height: 1;
      text-align: center;
      text-transform: uppercase;
      will-change: transform;
    }
    .pagination {
      left: var(--container-margin);
      transform: rotate(-90deg) translateY(-50%);
    }
    .scrollText {
      right: var(--container-margin);
      transform: rotate(90deg) translateY(-50%);
    }
    .rightSlide {
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
      .back {
        width: 100%;
        height: 100%;
        background: $black;
        color: $white;
        padding: 90px 60px;
        opacity: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        position: relative;
        z-index: 1;
        transition: opacity 1s $curve 0s;
      }
      .description {
        font-size: 14px;
      }
      &:hover {
        .back {
          opacity: 1;
        }
      }
      &:not(.active) {
        opacity: 0;
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
      .title {
        font-size: 16px;
        line-height: 1.6;
        letter-spacing: 0.01em;
        margin-bottom: 32px;
        display: block;
      }
      .subtitle {
        width: 100%;
        max-width: 540px;
      }
      .description {
        margin-top: 30px;
      }
    }
  }
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
  @include respond-to('desktop-extra-large') {
    .left {
      .leftSlide {
        .title {
          font-size: toVW(16);
        }
      }
    }
    .right {
      .pagination, .scrollText {
        font-size: toVW(14);
      }
      .rightSlide {
        .description {
          font-size: toVW(14);
        }
      }
    }
  }
  @include respond-to('mobile-medium') {
    @include is-touch {
      .mobile {
        padding-bottom: 0;
      }
    }
    .mobile {
      .item {
        .subtitle {
          max-width: 320px;
        }
      }
    }
  }
}
</style>
