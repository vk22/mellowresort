<template>
  <section
    :class="$style.surfingSpots"
    data-scroll-sticky="true"
    data-scroll-section
    data-section-theme="dark"
  >
    <div ref="placeholder" data-scroll-sticky-placeholder></div>

    <div :class="$style.container" data-scroll-sticky-container>
      <Title :class="$style.title" class="h1" :text="title" />

      <div ref="content" :class="$style.content" data-scroll-sticky-content>
        <div
          v-for="(row, rowIndex) in rows"
          :key="rowIndex"
          :class="$style.row"
          class="container"
        >
          <div
            v-for="(item, itemIndex) in row"
            :key="itemIndex"
            :class="$style.item"
            data-cursor-pointer
            data-scroll-item
            @click="openPopup($event, item)"
          >
            <h2 :class="$style.itemTitle">{{ asText(item.item_title) }}</h2>
            <ResponsiveImage :class="$style.itemImage" :image="item.item_image" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Sticky from '~/assets/js/components/sticky'
import Util from '~/utils/util'
import { asText } from '@prismicio/helpers'
import { useAppBus } from '~/composables/useAppBus'

const $style = useCssModule()
const bus = useAppBus()

// props
const props = defineProps({
  title: { type: Array, default: () => [] },
  items: { type: Array, default: () => [] }
})

// refs
const content = ref(null)
const placeholder = ref(null)

// state
const maxH = ref(0)
const popup = reactive({
  title: [],
  description: [],
  image: {},
  x: 0,
  y: 0
})

let sticky = null
let rafId = null

// computed — rows logic preserved 1:1
const rows = computed(() => {
  const out = []
  props.items.forEach((item) => {
    if (out.length % 2 !== 0) {
      if (out[out.length - 1].length < 2) {
        out[out.length - 1].push(item)
      } else {
        out.push([item])
      }
    } else {
      out.push([item])
    }
  })
  return out
})


function resize(stopPropagation = false) {
  setTimeout(() => {
    if (sticky) sticky.resize()
    if (content.value) {
      maxH.value = content.value.scrollHeight
    }
    if (!stopPropagation) {
      bus.emit('scroll-resize', {})
    }
  }, 100)
}

function openPopup(e, item) {
  popup.title = item.item_title
  popup.description = item.item_description
  popup.image = item.item_image

  const el = e.target.closest(`.${$style.item}`)
  if (el) {
    const rect = el.getBoundingClientRect()
    popup.x = rect.left
    popup.y = rect.top
  }

  bus.emit('surfing-popup-open', popup)
}



watch(
  () => props.items,
  () => nextTick(() => resize())
)


onMounted(() => {
  window.addEventListener('resize', resize)
  resize()

  if (!Util.isTouch()) {
    let data = { c: 0, t: 0 }

    const loop = () => {
      data.c += 0.09 * (data.t - data.c)
      const final = Util.round(data.c)

      if (final !== data.t && content.value) {
        const y = -(maxH.value - window.innerHeight) * data.c
        content.value.style.transform = `translateY(${y}px)`
      }

      if (content.value) {
        rafId = requestAnimationFrame(loop)
      }
    }

    sticky = new Sticky(placeholder.value?.parentNode, (progress) => {
      data.t = progress
    })

    loop()
  }

  setTimeout(() => resize(true), 1500)

  // Nuxt2 → Nuxt3 event conversion
  bus.on('scroll-resize', () => {
    if (sticky) sticky.resize()
  })
})


onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  if (sticky) sticky.destroy()
  if (rafId) cancelAnimationFrame(rafId)
  bus.off('scroll-resize')
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

.surfingSpots {
  width: 100%;
  position: relative;
  color: $white;
  background: $black;
  .container {
    overflow: hidden;
  }
  .title {
    width: 100%;
    max-width: 520px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    will-change: transform;
  }
  .content {
    padding-top: 100vh;
    padding-bottom: 50vh;
    will-change: transform;
  }
  .item {
    width: 31%;
    .itemTitle {
      font-family: $font-serif;
      font-weight: 400;
      font-size: 14px;
      line-height: 1;
      margin: 0;
      margin-bottom: 12px;
      transition: opacity 1s $curve;
    }
    .itemImage {
      width: 100%;
      overflow: hidden;
      background: #3E3C3E;
      will-change: transform;
      transition: transform 2s $curve;
      & > div:last-child {
        will-change: transform;
        transition: transform 1s $curve, opacity 2s $curve 0.5s;
      }
    }
    &:first-child:last-child {
      margin-left: auto;
      margin-right: auto;
    }
    &:hover {
      .itemImage {
        & > div:last-child {
          transform: scale(1.1);
        }
      }
    }
    &:not(:global(.show)) {
      .itemTitle {
        opacity: 0;
      }
      .itemImage {
        transform: translateY(100px);
        & > div:last-child {
          opacity: 0;
        }
      }
    }
  }
  .row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 20vh;
    margin-bottom: 20vh;
    &:nth-child(1), &:nth-child(5n) {
      .item:first-child {
        margin-top: 17vh;
      }
    }
    &:nth-child(4n-1) {
      .item:last-child {
        margin-top: 17vh;
      }
    }
  }
  @include is-touch {
    .container {
      overflow: visible;
      padding-top: 50vh;
      padding-bottom: 50vh;
      box-sizing: border-box;
    }
    .title {
      position: sticky;
      margin: 0 auto;
      left: auto;
      transform: translateY(-50%);
    }
  }
  @include respond-to('desktop-extra-large') {
    .title {
      max-width: toVW(520);
    }
    .item {
      .itemTitle {
        font-size: toVW(14);
      }
    }
  }
  @include respond-to('desktop') {
    .title {
      max-width: 320px;
    }
  }
  @include respond-to('tablet-small') {
    .item {
      width: 40%;
    }
  }
  @include respond-to('mobile-medium') {
    .row {
      flex-direction: column;
    }
    .item {
      width: 50%;
      margin-top: 0;
      &:nth-child(2) {
        margin-top: 20vw;
        margin-left: auto;
        margin-right: 0;
      }
    }
  }
}
</style>
