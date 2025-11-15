<template>
  <div :class="$style.page">
    <header ref="headerRef" :class="$style.header" data-scroll-section>
      <TextAndImage
        :class="$style.content"
        :large-title="header.title"
        :description="header.description"
        :padding="false"
        :scroll-section="false"
      />
    </header>

    <div :class="$style.slices" ref="slicesRef">
      <component
        :is="componentsMap[slice.name]"
        v-for="(slice, sliceIndex) in slices"
        :key="sliceIndex"
        :class="$style.slice"
        :data-type="slice.name"
        v-bind="slice.data"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from '#imports'
import { useAppBus } from '~/composables/useAppBus'

import TextAndImage from '~/components/TextAndImage.vue'
import MediaSection from '~/components/slices/MediaSection.vue'
import IconsSection from '~/components/IconsSection.vue'

const componentsMap = {
  'text-and-image': TextAndImage,
  'media-section': MediaSection,
  'icons-section': IconsSection,
}

import Util from '~//utils/util'

const { hideLoading, useCommonPageInit } = usePage()

// styles
const $style = useCssModule()

//
const { locale } = useI18n()

const route = useRoute()
const bus = useAppBus()


// ---------- INIT ----------
const domReady = ref(false)
const dataReady = ref(false)
const inited = ref(false)


// состояние окна
const winW = ref(0)
const winH = ref(0)
const isMobile = ref(false)
const isVertical = ref(false)
const isTouch = ref(false)


// ---------- reactive state ----------
const header = ref({
  title: [],
  description: []
})

const slices = ref([])

const meta = ref({
  title: '',
  description: '',
  image: ''
})


// ---------- utilities ----------
function camelCase(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

function getLink(link) {
  if (!link?.url) return { href: '', isExternal: false }
  return {
    href: link.url,
    isExternal: link.url.startsWith('http')
  }
}

// ---------- load API ----------

const { data, status } = await useFetch('/api/sustainability', {
  method: 'GET',
  query: {
    lang: locale.value,
  },
})

if (data.value) {
  const d = data.value.data

  // header
  header.value.title = d.title
  header.value.description = d.description

  // slices formatting
  const arr = d.body || []

  arr.forEach((slice) => {
    const primary = {}
    Object.keys(slice.primary).forEach((key) => {
      const newKey = camelCase(key)
      primary[newKey] = slice.primary[key]
    })

    slice.data = { ...primary }

    // TEXT & IMAGE
    if (slice.slice_type === 'text_and_image') {
      slice.name = 'text-and-image'
      slice.data.title = slice.primary.section_title
      slice.data.description = slice.primary.section_description
      slice.data.image = slice.primary.section_image
      slice.data.reverse = slice.primary.image_position

      if (slice.primary.button_link) {
        const link = getLink(slice.primary.button_link)
        slice.data.buttonLink = link.href
        slice.data.buttonExternal = link.isExternal
      }
    }

    // MEDIA
    if (slice.slice_type === 'media') {
      slice.name = 'media-section'
    }

    // ICONS SECTION
    if (slice.slice_type === 'icons_section') {
      slice.name = 'icons-section'
      slice.data.title = slice.primary.icons_title
      slice.data.items = slice.items
    }
  })
  console.log('arr ', arr)

  slices.value = arr

  // meta
  meta.value.title = d.meta_title
  meta.value.description = d.meta_description
  meta.value.image = d.meta_image

  dataReady.value = true
}



function resize() {
  winW.value = window.innerWidth
  winH.value = window.innerHeight
  isMobile.value = winW.value <= 1024
  isVertical.value = winH.value > winW.value
}

function init() {
        
  if (!dataReady.value || inited.value) return

  console.log('init')
  inited.value = true

  bus.emit('footer-show')
  bus.emit('scroll-reset')
  bus.emit('theme', 'light')
  bus.emit('theme-nav', 'light')
  bus.emit('book-button-show', '#594E54')
  bus.emit('book-button-dark')

  Util.loadImages(document.body, () => {
    nextTick(() => {
      resize()
      bus.emit('scroll-reset')
      resize()
      hideLoading(() => {})
    })
  })
}

onMounted(() => {
  domReady.value = true
  resize()
  window.addEventListener('resize', resize)
  init()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
})
</script>

<style lang="scss" module>
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.page {
  width: 100%;
  min-height: 100vh;
  .header {
    padding-top: 288px;
    padding-bottom: 120px;
  }
  .slice {
    &:first-child {
      padding-top: 0;
    }
  }
  @include respond-to('mobile-medium') {
    .header {
      padding-top: 120px;
      padding-bottom: 90px;
      box-sizing: border-box;
    }
  }
}
</style>
