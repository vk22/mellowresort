<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  title: { type: Array, default: () => [] },
  url: { type: String, default: '' }
})

const items = ref([])
const itemsEl = ref(null)
const inViewport = ref(false)

const dataItems = ref([])
let raf = null

// scroll state
const scroll = reactive({ ease: 0.05, current: 0, target: 0 })
const speed = ref(2)
const pause = ref(true)
const scrollWidth = ref(0)
const margin = ref(0)

const asText = (arr) => arr?.map(x => x.text).join(' ') || ''

onMounted(async () => {
  if (!props.url) return

  const res = await fetch(props.url)
  const photos = await res.json()

  items.value = photos.map(p => ({
    image: p.mediaType === 'VIDEO' ? p.thumbnailUrl : p.mediaUrl,
    link: p.permalink
  }))

  if (items.value.length < 10) items.value = items.value.concat(items.value)

  await nextTick()
  init()
  raf = requestAnimationFrame(render)
})

onUnmounted(() => cancelAnimationFrame(raf))


function init() {
  const els = [...itemsEl.value.children]
  dataItems.value = els.map((el, i) => ({
    el,
    extra: 0,
    x: 0,
    left: el.getBoundingClientRect().left
  }))

  margin.value = parseFloat(getComputedStyle(dataItems.value[0].el).marginRight)
  scrollWidth.value = itemsEl.value.scrollWidth
  pause.value = false

  // watch viewport via IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) inViewport.value = true
  }, { threshold: 0.1 })
  observer.observe(itemsEl.value)
}

function render() {
  if (!pause.value && inViewport.value) {
    scroll.target += speed.value
    scroll.current += (scroll.target - scroll.current) * scroll.ease

    dataItems.value.forEach(item => {
      item.x = -scroll.current + item.extra
      item.el.style.transform = `translateX(${item.x}px)`

      const limit = scrollWidth.value - window.innerWidth
      if (item.x < -limit) item.extra += scrollWidth.value + margin.value
    })
  }
  raf = requestAnimationFrame(render)
}

function mouseover() { speed.value = 0.5 }
function mouseleave() { speed.value = 2 }
</script>

<template>
  <section :class="$style.instagram" data-scroll-section>
    <div class="container">
      <Title class="h1" :class="$style.title" :text="title" />
    </div>

    <div :class="$style.items" ref="itemsEl" @mouseover="mouseover" @mouseleave="mouseleave">
      <a
        v-for="(item, i) in items"
        :key="i"
        :class="$style.item"
        :href="item.link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          :class="$style.itemImage"
          :style="{ backgroundImage: inViewport ? `url(${item.image})` : 'none' }"
        />
      </a>
    </div>
  </section>
</template>

<style lang="scss" module>
/* оставляем ваш SCSS как есть */
</style>
