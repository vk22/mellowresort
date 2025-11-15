<template>
  <div :class="$style.page">
    <header :class="$style.header" data-scroll-section>
      <div class="container" :class="$style.flex">

        <!-- BG IMAGES -->
        <div :class="$style.bg">
          <div
            v-for="(img, i) in header.images"
            :key="i"
            :class="$style.imageContainer"
            ref="headerImage"
            :data-scroll-speed="0.1 + i * 0.5"
          >
            <ResponsiveImage
              :class="$style.image"
              :image="img.image"
              full
            />
          </div>
        </div>

        <!-- TEXT CONTENT -->
        <div ref="headerContent" :class="$style.headerContent">
          <MainTitle
            ref="title"
            class="h1"
            :class="$style.title"
            :text="header.title"
            :mask="true"
          />
          <RichText
            ref="description"
            :class="$style.description"
            :text="header.description"
          />
        </div>

      </div>
    </header>

    <TextAndImage
      :class="$style.intro"
      :title="introSection.title"
      :description="introSection.description"
      :image="introSection.image"
      padding
      reverse
      center-on-mobile
    />

    <SurfingSlides :items="slides" />
    <SurfingSpots :title="spots.title" :items="spots.items" />
    <SurfingPopup />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from '#app'
import { useHead } from '#imports'
import { gsap } from 'gsap'

import Util from '~/utils/util'
import { useAppBus } from '~/composables/useAppBus'
import { asText } from '@prismicio/helpers'
import { useI18n } from '#imports'

const { hideLoading, useCommonPageInit } = usePage()

// styles
const $style = useCssModule()

// route + lang
const route = useRoute()
const { locale } = useI18n()

// event bus
const bus = useAppBus()

// refs
const title = ref(null)
const description = ref(null)
const headerImage = ref([])
const headerContent = ref(null)

// state
const meta = reactive({ title: '', description: '', image: '' })

const header = reactive({
  title: [],
  description: [],
  images: []
})

const introSection = reactive({
  title: [],
  description: [],
  image: {}
})

const slides = reactive([])
const spots = reactive({ title: [], items: [] })

const domReady = ref(false)
const dataReady = ref(false)
const inited = ref(false)

const winW = ref(0)
const winH = ref(0)
const isMobile = ref(false)
const isVertical = ref(false)


// API endpoint
const endpoint = '/api/surfing'

const { data } = await useFetch(endpoint, {
  method: 'GET',
  query: { lang: locale.value }
})



if (data.value?.data) {
  const d = data.value.data
  console.log('d.title !!!', d.title)
  header.title = d.title
  header.description = d.description
  header.images = d.header_images

  introSection.title = d.intro_title
  introSection.description = d.intro_description
  introSection.image = d.intro_image

  slides.push({
    item_title: d.slides_intro_title,
    item_image: d.slides_intro_image,
    item_scroll_text: d.slides_scroll_text
  })
  slides.push(...d.slides)

  spots.title = d.surf_spots_title
  spots.items = d.surf_spots

  meta.title = asText(d.meta_title)
  meta.description = asText(d.meta_description)
  meta.image = d.meta_image?.url || ''

  dataReady.value = true
}


useHead(() => ({
  title: meta.title,
  meta: [
    { name: 'description', content: meta.description },
    { property: 'og:title', content: meta.title },
    { property: 'og:description', content: meta.description },
    { property: 'og:image', content: meta.image }
  ]
}))


function resize() {
  winW.value = window.innerWidth
  winH.value = window.innerHeight
  isMobile.value = winW.value <= 1024
  isVertical.value = winH.value > winW.value
}

function initIntro() {
  title.value?.hide()

  gsap.set([
    description.value?.$el,
    ...headerImage.value.map(img => img)
  ], {
    opacity: 0,
    y: 200
  })

  bus.emit('book-button-hide')
}

function intro() {
  title.value?.show()

  gsap.to(description.value?.$el, {
    opacity: 1,
    y: 0,
    duration: 2.5,
    ease: 'power4.out',
    delay: 1.3
  })

  gsap.to(headerImage.value, {
    opacity: 1,
    y: 0,
    duration: 2.5,
    ease: 'power4.out',
    stagger: 0.1,
    delay: 1.3
  })

  setTimeout(() => {
    bus.emit('book-button-show', '#B2CCE5')
  }, 1800)
}


function init() {
  if (!dataReady.value || !domReady.value || inited.value) return
  inited.value = true

  bus.emit('footer-show')
  bus.emit('scroll-reset')
  bus.emit('theme', 'light')
  bus.emit('theme-nav', 'light')

  Util.loadImages(document.body, () => {
    nextTick(() => {
      resize()
      bus.emit('scroll-reset')
      resize()
      setTimeout(() => {
        initIntro()
        hideLoading(intro)
      }, 500)
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

@use "sass:math";
@use "sass:map";
@use "sass:meta";
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.page {
  width: 100%;
  min-height: 100vh;
  .header {
    width: 100%;
    height: $vh100;
    text-align: center;
    .flex {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .headerContent {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 1;
    }
    .title {
      max-width: 680px;
    }
    .description {
      max-width: 500px;
      margin-top: 32px;
    }
    .bg {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }
    .imageContainer {
      position: absolute;
      overflow: hidden;
      &:nth-child(1) {
        width: #{Min(calc(((100% - 680px) / 2 - 50px) * 0.8), 270px)};
        height: #{'min(calc((((var(--container-width) - 680px) / 2 - 50px) * 280 / 236) * 0.8), 320px)'};
        left: 0;
        top: 20%;
        border-top-left-radius: 100vw;
        border-top-right-radius: 100vw;
      }
      &:nth-child(2) {
        width: #{Min(calc((100% - 680px) / 2 - 50px), 300px)};
        height: auto !important;
        aspect-ratio: 268 / 160;
        left: calc(((100% - 680px) / 2 - 50px) * 0.2);
        top: 117px;
      }
      &:nth-child(3) {
        width: #{Min(calc(((100% - 500px) / 2 - 20px) * 0.5), 170px)};
        height: 30%;
        right: 2%;
        bottom: 20%;
        z-index: 1;
      }
      &:nth-child(4) {
        width: #{Min(calc(((100% - 680px) / 2 - 30px) * 1), 310px)};
        height: 22%;
        right: 0;
        bottom: 5%;
        z-index: 0;
      }
    }
  }
  @include respond-to('desktop-extra-large') {
    .header {
      .title {
        max-width: toVW(680);
      }
      .description {
        max-width: toVW(500);
      }
      .imageContainer {
        &:nth-child(1) {
          width: #{Min(calc(((100% - toVW(680)) / 2 - 50px) * 0.8), toVW(270))};
          height: #{'min(calc((((var(--container-width) - ' + toVW(680) + ') / 2 - 50px) * 280 / 236) * 0.8), ' + toVW(320) + ')'};
        }
        &:nth-child(2) {
          width: #{Min(calc((100% - toVW(680)) / 2 - 50px), toVW(300))};
          left: calc(((100% - toVW(680)) / 2 - 50px) * 0.2);
          top: 117px;
        }
        &:nth-child(3) {
          width: #{Min(calc(((100% - 500px) / 2 - 20px) * 0.5), toVW(170))};
        }
        &:nth-child(4) {
          width: #{Min(calc(((100% - toVW(680)) / 2 - 30px) * 1), toVW(310))};
        }
      }
    }
  }
  @include respond-to('desktop-medium') {
    .header {
      .bg {
        width: 100vw;
        left: 50%;
        transform: translateX(-50%);
      }
      .imageContainer {
        &:nth-child(1) {
          width: #{Min(calc(((100% - 680px) / 2 - 50px) * 0.8), 270px)};
          height: #{'min(calc((((var(--container-width) - 680px) / 2 - 50px) * 280 / 236) * 0.8), 320px)'};
        }
        &:nth-child(2) {
          width: #{Min(calc((100% - 680px) / 2 - 50px), 300px)};
          left: calc(((100% - 680px) / 2 - 50px) * 0.2);
        }
        &:nth-child(3) {
          width: #{Min(calc(((100% - 500px) / 2 - 20px) * 0.5), 170px)};
        }
        &:nth-child(4) {
          width: #{Min(calc(((100% - 680px) / 2 - 30px) * 1), 310px)};
        }
      }
    }
  }
  @include respond-to('desktop') {
    .header {
      .title {
        max-width: 520px;
      }
      .description {
        max-width: 400px;
      }
      .imageContainer {
        &:nth-child(1) {
          width: #{Min(calc(((100% - 520px) / 2 - 50px) * 0.8), 270px)};
          height: #{'min(calc((((var(--container-width) - 520px) / 2 - 50px) * 280 / 236) * 0.8), 320px)'};
        }
        &:nth-child(2) {
          width: #{Min(calc((100% - 520px) / 2 - 50px), 300px)};
          left: calc(((100% - 520px) / 2 - 50px) * 0.2);
        }
        &:nth-child(3) {
          width: #{Min(calc(((100% - 400px) / 2 - 20px) * 0.5), 170px)};
        }
        &:nth-child(4) {
          width: #{Min(calc(((100% - 520px) / 2 - 30px) * 1), 310px)};
        }
      }
    }
  }
  @include respond-to('tablet') {
    .header {
      overflow: hidden;
      .imageContainer {
        &:nth-child(1) {
          width: #{Min(30vw, 270px)};
          height: #{Min(calc((30vw * 280 / 236) * 0.8), 320px)};
          right: -15vw;
          top: 120px;
          z-index: 2;
          left: auto;
        }
        &:nth-child(2) {
          width: #{Min(30vw, 300px)};
          height: 20vw !important;
          aspect-ratio: unset !important;
          top: 85px;
          right: 0;
          left: auto;
        }
        &:nth-child(3) {
          width: #{Min(calc(((100% - 400px) / 2 - 20px) * 0.5), 170px)};
          left: 0;
          right: auto;
        }
        &:nth-child(4) {
          width: #{Min(calc(((100% - 520px) / 2 - 30px) * 1), 310px)};
          left: 0;
          right: auto;
        }
      }
    }
  }
  @include respond-to('tablet-small') {
    .header {
      .title {
        max-width: 400px;
      }
      .imageContainer {
        &:nth-child(3) {
          width: 80px;
          height: 30%;
          bottom: 5%;
        }
        &:nth-child(4) {
          width: 160px;
          height: 15%;
          bottom: 0;
        }
        
      }
    }
  }
  @include respond-to('mobile-medium') {
    .header {
      .title {
        max-width: 320px;
      }
      .imageContainer {
        &:nth-child(1) {
          top: 100px;
          width: #{Min(35vw, 270px)};
          height: #{Min(calc((35vw * 280 / 236)), 320px)};
        }
        &:nth-child(2) {
          top: 60px;
          width: #{Min(45vw, 300px)};
          height: 30vw !important;
        }
      }
      .description {
        max-width: #{Min(calc(100vw - 90px * 2), 400px)};
      }
    }
  }
}
</style>
