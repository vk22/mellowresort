<template>
  <section :class="$style.testimonials" data-scroll-section>
    <div class="container">
      <h1 :class="$style.title">{{ title?.[0]?.text || '' }}</h1>

      <div ref="container" :class="$style.items">
        <div
          v-for="(item, index) in items"
          :key="index"
          :class="[$style.item, index === active && $style.active]"
          :ref="el => itemsRefs[index] = el"
        >
          <RichText :class="$style.quote" :text="item.quote" />

          <ResponsiveImage
            :image="item.image"
            :ratio="1"
            :class="$style.image"
          />

          <h2 :class="$style.name">{{ item.name?.[0]?.text || '' }}</h2>
        </div>
      </div>

      <div :class="$style.dots">
        <div
          v-for="(dot, index) in items"
          :key="index"
          :class="[$style.dot, index === active && $style.active]"
          @click="active = index"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  title: {
    type: Array,
    default: () => []
  },
  items: {
    type: Array,
    default: () => []
  }
})

// state
const active = ref(0)
const itemsRefs = ref([])
const container = ref(null)
let interval = null

// вычисляет высоту текущего слайда
const resize = () => {
  const arr = itemsRefs.value
  if (!arr || arr.length === 0) return

  let tallest = 0
  arr.forEach(el => {
    if (el) {
      const h = el.offsetHeight
      if (h > tallest) tallest = h
    }
  })

  if (container.value) {
    container.value.style.height = tallest + 'px'
  }

  initTimer()
}

// авто-переключение каждые 8s
const initTimer = () => {
  if (interval) clearInterval(interval)

  if (!itemsRefs.value.length) return

  interval = setInterval(() => {
    active.value = (active.value + 1) % itemsRefs.value.length
  }, 8000)
}

// watchers
watch(
  () => props.items,
  async () => {
    await nextTick()
    resize()
  },
  { deep: true }
)

onMounted(async () => {
  await nextTick()
  resize()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  if (interval) clearInterval(interval)
})
</script>




<style lang="scss" module>
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.testimonials {
  position: relative;
  padding: 210px 0;
  text-align: center;
  .title {
    font-weight: 400;
    font-size: 16px;
    line-height: 1.6;
    letter-spacing: 0.01em;
    margin: 0;
    margin-bottom: 67px;
  }
  .items {
    width: 100%;
    position: relative;
  }
  .item {
    width: 100%;
    top: 0;
    left: 0;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: opacity 2s ease-in-out;
    .quote {
      max-block-size: 1080px;
      font-family: $font-serif;
      font-weight: 400;
      font-size: 51px;
      line-height: 1.2;
      letter-spacing: -0.01em;
      margin-bottom: 72px;
    }
    .image {
      width: 70px;
      border-radius: 50%;
      overflow: hidden;
    }
    .name {
      margin: 0;
      margin-top: 12px;
      font-weight: 400;
      font-size: 16px;
      line-height: 1.5;
      letter-spacing: 0.01em;
    }
    &:not(.active) {
      opacity: 0;
      pointer-events: none;
    }
  }
  .dots {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 70px;
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
      transition: opacity 1s $curve;
      &:not(:last-child) {
        margin-right: 8px;
      }
      &:not(.active) {
        opacity: 0.3;
      }
    }
  }
  @include respond-to('desktop-extra-large') {
    padding: toVW(210) 0;
    .title {
      font-size: toVW(16);
      margin-bottom: toVW(67);
    }
    .item {
      .quote {
        font-size: toVW(51);
        margin-bottom: toVW(72);
      }
      .image {
        width: toVW(70);
      }
      .name {
        font-size: toVW(16);
      }
    }
    .dots {
      margin-top: toVW(70);
      .dot {
        width: toVW(8);
        height: toVW(8);
        &:not(:last-child) {
          margin-right: toVW(8);
        }
      }
    }
  }
  @include respond-to('desktop') {
    .item {
      .quote {
        font-size: 51px * 0.8;
      }
    }
  }
  @include respond-to('mobile-medium') {
    padding: 110px 0;
    .title {
      margin-bottom: 15px;
      font-size: inherit;
    }
    .item {
      .image {
        width: 50px;
      }
      .quote {
        font-size: 19px;
        margin-bottom: 15px;
      }
      .name {
        font-size: inherit;
      }
    }
    .dots {
      margin-top: 15px;
    }
  }
}
</style>
