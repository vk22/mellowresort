<template>
  <div :class="$style.page">
    <header ref="header" :class="$style.header" data-scroll-section data-section-theme="dark">
      <div ref="headerBgRef" :class="$style.headerBG">
        <ResponsiveImage :image="headerData.image" full use-tag />
      </div>
      
      <!-- <ResponsiveImage ref="headerBgRef" :class="$style.headerBG" :image="header.image" full use-tag /> -->
      <div class="container" :class="$style.content">
        <MainTitle ref="titleRef" class="h1" :class="$style.title" :text="headerData.title" :mask="true" />
      </div>
    </header>

    <section :class="$style.adventures" data-scroll-section>
      <div class="container">
        <MainTitle class="h2" :class="$style.title" :text="adventures.title" data-fade-in />
        <div :class="$style.content">
          <NuxtLink
            v-for="(a, i) in adventures.items"
            :key="i"
            :class="$style.adventure"
            :to="getLink(a.link)"
            data-cursor-pointer
            data-fade-in-y
          >
            <ResponsiveImage :class="$style.adventureImage" :image="a.image" :ratio="500/380" use-container-size />
            <div :class="$style.adventureContent">
              <h2>{{ asText(a.title) }}</h2>
              <hr>
              <RichText :class="$style.description" :text="a.description" no-headings />
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <TextAndTwoImages
      :title="introSection.title"
      :description="introSection.description"
      :images="introSection.images"
      :buttonText="introSection.button"
      :buttonLink="`/${locale}/about/`"
      no-mobile-images
    />

    <MediaComponent
      :class="$style.fullWidthMedia"
      :image="media.image"
      :video="media.video"
      data-scroll-section
      data-section-theme="dark"
    />

    <section ref="discover" :class="$style.discover" data-scroll-section data-section-theme="dark">
      <div class="container">
        <MainTitle :class="$style.title" :text="discover.title" :mask="false" @click="gotoDiscover" />
        <div :class="$style.images" data-scroll-item>
          <ResponsiveImage
            v-for="(img, i) in discover.images"
            :key="i"
            :class="[$style.image, img.isHorizontal && $style.isHorizontal]"
            :image="img.image"
            use-tag
            use-container-size
          />
        </div>
      </div>
    </section>

    <TextAndImage
      :title="surfing.title"
      :description="surfing.description"
      :image="surfing.image"
      :buttonText="surfing.button"
      :buttonLink="surfing.link"
      :is-dark="true"
      center-on-mobile
    />

    <IconsSection :class="$style.iconsSection" :title="icons.title" :items="icons.items" :is-dark="true" />
    <Instagram :class="$style.instagram" :title="instagram.title" :url="instagram.url" />
  </div>
</template>


<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from '#app'
import { useHead } from '#imports'
import { useAppBus } from '~/composables/useAppBus'
import Util from '~/utils/util'
import { gsap } from 'gsap'
import { asText } from '@prismicio/helpers'
import { usePage } from '~/composables/usePage'

const { hideLoading, useCommonPageInit } = usePage()

// styles
const $style = useCssModule()

// router
const route = useRoute()
const router = useRouter()

const { locale } = useI18n();

// bus
const bus = useAppBus()

const winW = ref(0)
const winH = ref(0)
const isMobile = ref(false)
const isVertical = ref(false)

const titleRef = ref(null)
const headerBgRef = ref(null)


// state
const headerData = reactive({ title: [], image: {} })
const adventures = reactive({ title: [], items: [] })
const introSection = reactive({ title: [], description: [], images: [], button: [] })
const retreats = reactive({ title: [], items: [] })
const media = reactive({ image: {}, video: {} })
const discover = reactive({ title: [], images: [] })
const surfing = reactive({ title: [], description: [], image: {}, button: [], link: '' })
const icons = reactive({ title: [], items: [] })
const instagram = reactive({ title: [], url: '' })
const meta = reactive({ title: '', description: '', image: '' })

const domReady = ref(false)
const dataReady = ref(false)

// helpers
// const asText = (arr) => arr?.[0]?.text || ''

function getLink(link) {
  switch (link.type) {
    case 'our_place':
      return `/${locale.value}/our-place/`
    case 'special_retreat':
      return `/${locale.value}/retreats/${link.uid}/`
    case 'standard_retreat':
      return `/${locale.value}/retreats/standard/`
    case 'special_retreat_overview':
      return `/${locale.value}/retreats/special/`
    default:
      return `/${locale.value}/`
  }
}

function resize() {
  winW.value = window.innerWidth
  winH.value = window.innerHeight
  isMobile.value = winW.value <= 1024
  isVertical.value = winH.value > winW.value
}

function gotoDiscover() {
  router.push(`/${locale.value}/our-place/`)
}


function initIntro() {
  console.log('initIntro')
  if (titleRef.value?.hide) {
    titleRef.value.hide()
  }

  bus.emit('book-button-hide')

  // Если ResponsiveImage → доступ через .$el
  const el = headerBgRef.value?.$el || headerBgRef.value
  console.log('initIntro el', headerBgRef.value)
  if (el) {
    gsap.set(el, { scale: 1.2 })
  }
}

function intro() {
  console.log('intro titleRef.value ', titleRef.value)
  if (titleRef.value?.show) {
    titleRef.value.show()
  }

  const el = headerBgRef.value?.$el || headerBgRef.value
  if (el) {
    gsap.to(el, { duration: 3.5, scale: 1, ease: 'power4.inOut' })
  }

  setTimeout(() => {
    bus.emit('book-button-show')
  }, 2000)
}

const page = {
  title: route.matched[0].components.default.__name,
  endpoint: `/api/home`,
};

const { data, status } = await useFetch(page.endpoint, {
  method: "GET",
  query: {
    lang: locale.value,
  },
});


if (data.value) {
  const serverContent = data.value.data
  console.log('serverContent ', serverContent)
  headerData.title = serverContent.title
  headerData.image = serverContent.header_image
  adventures.title = serverContent.adventures_title
  adventures.items = serverContent.adventures
  introSection.title = serverContent.intro_title
  introSection.description = serverContent.intro_description
  introSection.images = serverContent.intro_images
  introSection.button = serverContent.intro_button
  media.image = serverContent.video_cover
  media.video = serverContent.video
  discover.title = serverContent.our_place_title
  discover.images = serverContent.our_place_images.map(i => ({
    image: i.image,
    isHorizontal: i.image?.dimensions?.width > i.image?.dimensions?.height
  }))
  surfing.title = serverContent.surfing_title
  surfing.description = serverContent.surfing_description
  surfing.image = serverContent.surfing_image
  surfing.button = serverContent.surfing_button
  surfing.link = `/${locale.value}/surfing/`
  icons.title = serverContent.icons_title
  icons.items = serverContent.icons
  instagram.title = serverContent.instagram_title
  instagram.url = asText(serverContent.instagram_feed)

  dataReady.value = true
}

// meta
useHead(() => ({
  title: meta.title,
  meta: [
    { name: 'description', content: meta.description },
    { property: 'og:title', content: meta.title },
    { property: 'og:description', content: meta.description },
    { property: 'og:image', content: meta.image }
  ]
}))

// animations init
onMounted(() => {
  resize()
  window.addEventListener('resize', resize)

  useCommonPageInit()
  bus.emit('footer-show')

  Util.loadImages(document.body, () => {
    nextTick(() => {
      bus.emit('scroll-reset')
      setTimeout(() => {
        initIntro()
        hideLoading(intro)
      }, 500)
    })
  })
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
  z-index: 0;
  .header {
    width: 100%;
    height: $vh100;
    position: relative;
    color: $white;
    overflow: hidden;
    .headerBG {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      will-change: transform;
    }
    .content {
      height: 100%;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .title {
      max-width: 900px;
    }
  }
  .fullWidthMedia {
    margin-top: 240px;
  }
  .adventures {
    width: 100%;
    position: relative;
    padding: 240px 0;
    .title {
      max-width: 480px;
      margin: 0 auto;
      text-align: center;
    }
    .content {
      width: 100%;
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 72px;
    }
    .adventure {
      width: 28%;
      position: relative;
      color: white;
      overflow: hidden;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
        width: 100%;
        height: 100%;
        background-color: $black;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      }
      .adventureContent {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        box-sizing: border-box;
        padding: 30px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
      .adventureImage {
        transform: scale(1.1);
        transition: transform 1s $curve;
      }
      h2 {
        max-width: 180px;
        font-family: $font-serif;
        font-weight: 400;
        font-size: 21px;
        line-height: 1.43;
        margin: 0;
      }
      .description {
        font-weight: 400;
        font-size: 18px;
        margin: 0;
      }
      hr {
        width: 100%;
        height: 1px;
        background: currentColor;
        padding: 0;
        border: navajowhite;
        margin: 16px 0;
        transform: scaleX(0.1);
        transform-origin: 0% 0%;
        transition: transform 1s $curve;
      }
      &:nth-child(even) {
        margin-top: 80px;
      }
      &:hover {
        &::after {
          opacity: 0.2;
        }
        hr {
          transform: scaleX(1);
        }
        .adventureImage {
          transform: scale(1);
        }
      }
    }
  }
  .discover {
    width: 100%;
    padding: 230px 0;
    background: $black;
    color: $white;
    display: flex;
    align-items: center;
    overflow: hidden;
    .title {
      max-width: 690px;
      margin: 0 auto;
      text-align: center;
      font-size: 190px;
      line-height: 1.05;
      position: relative;
      z-index: 1;
      cursor: pointer;
      &:hover {
        & ~ .images {
          .image img {
            transform: scale(0.7);
          }
        }
      }
    }
    :global(.container) {
      position: relative;
    }
    .images {
      width: 100%;
      //height: min(100vw / 5 * 1.5, 80vh);
      height: 30vw;
      position: absolute;
      top: 50%;
      z-index: 0;
      transform: translateY(-50%);
      &:not(:global(.show)) {
        .image {
          transform: translateX(-50vw) translateY(-50%) scale(1.5) !important;
          opacity: 0;
          &:nth-child(odd), &:last-child {
            transform: translateX(50vw) translateY(-50%) scale(1.5) !important;
          }
          &:nth-child(1), &:nth-child(2), &:nth-child(3), &:nth-child(4) {
            transform: translateX(-50vw) translateY(-50%) scale(1.5) !important;
          }
          &:nth-child(5), &:nth-child(6), &:nth-child(7) {
            transform: translateX(50vw) translateY(-50%) scale(1.5) !important;
          }
        }
      }
    }
    .image {
      width: #{Min(calc(100% / 5), 330px)};
      //width: calc(100vh - #{2/3 * 10rem});
      position: absolute;
      top: 50%;
      z-index: 0;
      will-change: transform;
      transition: transform 2s cubic-bezier(0.6, 0.15, 0, 1), opacity 2s cubic-bezier(0.6, 0.15, 0, 1);
      img {
        will-change: transform;
        transition: transform 2s cubic-bezier(0.6, 0.15, 0, 1);
      }
      @for $i from 1 through 4 {
        &:nth-child(#{$i}) img {
          transition-delay: 0.05s * $i;
        }
        &:nth-last-child(#{$i}) img {
          transition-delay: 0.05s * $i;
        }
      }
      @for $i from 1 through 50 {
        &:nth-child(#{$i}) {
          transition-delay: calc(($i - 1) * 0.1s);
        }
      }
      @for $i from 3 through 50 {
        &:nth-child(#{$i}) {
          left: calc(50% + 40% * math.random() - 35%);
          transform: translateY(-50% + 25% * math.random() - 25%);
        }
      }
      $len: 7/2;
      $delay: 0.5s;
      &:first-child {
        left: 0;
        transform: translateY(-50%);
        z-index: 9;
        transition-delay: $delay * math.div(math.abs($len - 1), $len);
      }
      &:nth-child(2) {
        left: 17%;
        transform: translateY(-10%);
        z-index: 3;
        transition-delay: $delay * math.div(math.abs($len - 2), $len);
      }
      &:nth-child(3) {
        left: 27%;
        top: 7%;
        transform: translateY(0%);
        z-index: 0;
        transition-delay: $delay * math.div(math.abs($len - 3), $len);
      }
      &:nth-child(4) {
        left: 50%;
        top: 0%;
        transform: translateX(-50%) translateY(-20%);
        z-index: 2;
        transition-delay: $delay * math.div(math.abs($len - 4), $len);
      }
      &:nth-child(5) {
        left: 50%;
        transform: translateY(-52%);
        z-index: 1;
        transition-delay: $delay * math.div(math.abs($len - 5), $len);
      }
      &:nth-child(6) {
        right: 13%;
        transform: translateY(-10%);
        z-index: 0;
        left: auto;
        top: 30%;
        transition-delay: $delay * math.div(math.abs($len - 6), $len);
      }
      &:last-child {
        left: auto;
        right: 0;
        top: 60%;
        transform: translateY(-50%);
        z-index: 1;
        transition-delay: $delay * math.div(math.abs($len - 7), $len);
      }
      &.isHorizontal {
        // width: min(calc((100% / 4.5) * 1.2), 500px);
        width: #{Min(calc((100% / 4.5) * 1.2), 500px)};
      }
    }
  }
  .iconsSection {
    padding-bottom: 240px;
  }
  @include respond-to('desktop-extra-large') {
    .header {
      .title {
        max-width: toVW(900);
      }
    }
    .adventures {
      .title {
        max-width: toVW(480);
      }
      .adventure {
        h2 {
          font-size: 1.66vw;
          max-width: 12.5vw;
        }
        .description {
          font-size: 1.1vw;
        }
      }
    }
    .discover {
      padding: toVW(230) 0;
      .title {
        max-width: toVW(690);
        font-size: toVW(190);
      }
      .image {
        width: #{Min(calc(100% / 4.5), toVW(330))};
      }
    }
  }
  @include respond-to('desktop-medium') {
    .discover {
      .title {
        font-size: 190px * 0.8;
      }
    }
  }
  @include respond-to('desktop') {
    .adventures {
      .adventure {
        .description {
          font-size: 15.5px;
        }
      }
    }
    .discover {
      .title {
        font-size: 190px * 0.6;
      }
    }
  }
  @include respond-to('tablet') {
    .fullWidthMedia {
      margin-top: 120px;
    }
    .adventures {
      padding: 120px 0;
      .content {
        flex-direction: column;
        align-items: center;
        margin-top: 60px;
      }
      .adventure {
        width: 100%;
        max-width: 400px;
        margin-top: 0;
        &:nth-child(even) {
          margin-top: 0;
        }
        &:not(:last-child) {
          margin-bottom: 30px;
        }
      }
    }
    .discover {
      padding: 120px 0;
      .title {
        font-size: 85px;
        max-width: 320px;
      }
    }
    .iconsSection {
      padding-bottom: 120px;
    }
  }
  @media (max-width: 868px) {
    .header {
      .title {
        font-size: 52px;
      }
    }
  }
  @include respond-to('mobile-medium') {
    .iconsSection {
      padding-bottom: 80px;
    }
    .discover {
      //background: transparent;
      //color: inherit;
      .images {
        height: 100%;
        .image {
          &:first-child {
            width: 34%;
            top: 56%;
          }
          &:nth-child(2) {
            width: 36.666667%;
            top: -10%;
            left: 9%;
          }
          &:nth-child(3) {
            left: 37%;
            top: 67%;
            width: 40% !important;
          }
          &:nth-child(4) {
            left: 50%;
            top: 20%;
            width: 36%;
          }
          &:nth-child(5) {
            left: 60%;
            top: 0;
            width: 35%;
          }
          &:nth-child(6) {
            right: 0;
            top: 40%;
            width: 33%;
          }
          &:last-child {
            left: 10%;
            right: auto;
            top: 110%;
            width: 30%;
          }
        }
      }
      & + section {
        // background: transparent;
      }
    }
    .fullWidthMedia {
      margin-top: 80px;
    }
  }
}
</style>