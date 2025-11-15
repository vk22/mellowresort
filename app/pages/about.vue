<template>
  <!-- prettier-ignore -->
  <div :class="$style.page">
    <header ref="headerRef" :class="$style.header" data-scroll-section>
      <TextAndImage
        ref="headerContentRef"
        :class="$style.content"
        :large-title="header.title"
        :description="header.description"
        :padding="false"
        :scroll-section="false"
      />
    </header>

    <StickyCards ref="stickyCardsRef" :items="slides" />

    <TextAndImage
      :class="$style.mission"
      :large-title="mission.title"
      :description="mission.description"
      :image="mission.image"
      is-dark
      reverse
    />

    <div :class="$style.weAre" data-section-theme="dark" data-scroll-section>
      <div class="container">
        <Title
          class="h1"
          :class="$style.title"
          :text="weAre.title"
          data-fade-in
        />
      </div>
      <MediaComponent
        :class="$style.media"
        :image="weAre.media.image"
        :video="weAre.media.video"
      />
    </div>

    <Testimonials :title="testimonials.title" :items="testimonials.items" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Util from '~/utils/util'
import { usePage } from '~/composables/usePage'
import { useAppBus } from '~/composables/useAppBus'

// 🧩 стили модуля
const $style = useCssModule()

// router / i18n
const route = useRoute()
const { locale } = useI18n()

// bus + page helpers (аналог PageMixin)
const bus = useAppBus()
const { hideLoading, useCommonPageInit } = usePage()

// refs на DOM/компоненты
const headerRef = ref(null)
const headerContentRef = ref(null)
const stickyCardsRef = ref(null)

// состояние окна
const winW = ref(0)
const winH = ref(0)
const isMobile = ref(false)
const isVertical = ref(false)
const isTouch = ref(false)

// флаги и данные
const domReady = ref(false)
const dataReady = ref(false)
const inited = ref(false)

// данные страницы
const meta = reactive({
  title: '',
  description: '',
  image: '',
})

const header = reactive({
  title: [],
  description: [],
})

const mission = reactive({
  title: [],
  description: [],
  image: {},
})

const weAre = reactive({
  title: [],
  media: {
    image: {},
    video: {},
  },
})

const slides = ref([])

const testimonials = reactive({
  title: [],
  items: [],
})

// 🔄 resize
function resize() {
  winW.value = window.innerWidth
  winH.value = window.innerHeight
  isMobile.value = winW.value <= 1024
  isVertical.value = winH.value > winW.value
}

const { data, status } = await useFetch('/api/about', {
  method: 'GET',
  query: {
    lang: locale.value,
  },
})

// маппинг ответа API -> локальное состояние
if (data.value) {
  const serverContent = data.value.data || data.value

  header.title = serverContent.title || []
  header.description = serverContent.description || []

  slides.value = serverContent.slides || []

  mission.title = serverContent.our_mission_title || []
  mission.description = serverContent.our_mission_description || []
  mission.image = serverContent.our_mission_image || {}

  weAre.title = serverContent.we_are_mellow_title || []
  weAre.media.image = serverContent.video_cover || {}
  weAre.media.video = serverContent.video || {}

  testimonials.title = serverContent.testimonials_title || []
  testimonials.items = serverContent.testimonials_items || []

  meta.title = serverContent.meta_title || ''
  meta.description = serverContent.meta_description || ''
  meta.image = serverContent.meta_image || ''

  dataReady.value = true
}

// <head>
useHead(() => ({
  title: meta.title,
  meta: [
    { hid: 'description', name: 'description', content: meta.description },
    { hid: 'twitter:title', name: 'twitter:title', content: meta.title },
    { hid: 'twitter:description', name: 'twitter:description', content: meta.description },
    { hid: 'twitter:image', name: 'twitter:image', content: meta.image },
    { hid: 'og:title', name: 'og:title', content: meta.title },
    { hid: 'og:description', name: 'og:description', content: meta.description },
    { hid: 'og:image', name: 'og:image', content: meta.image },
  ],
}))

// 🎬 intro анимации
function initIntro() {
  // TextAndImage умеет hide()/show()
  if (headerContentRef.value?.hide) {
    headerContentRef.value.hide()
  }
  bus.emit('book-button-hide')
}

function intro() {
  if (headerContentRef.value?.show) {
    headerContentRef.value.show()
  }
  setTimeout(() => {
    bus.emit('book-button-show', '#ACAC7A')
  }, 1800)
}

// общая инициализация страницы (аналог init() из миксина)
function init() {
  if (!dataReady.value || !domReady.value || inited.value) return

  inited.value = true

  useCommonPageInit()

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

// lifecycle
onMounted(() => {
  domReady.value = true
  isTouch.value = Util.isTouch()

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
    padding-bottom: 240px;
    min-height: 100vh;
  }

  .weAre {
    width: 100%;
    background: $black;
    color: $white;

    .title {
      margin-bottom: 240px;
    }
  }

  @include respond-to('mobile-medium') {
    .header {
      padding-top: 120px;
      padding-bottom: 90px;
      box-sizing: border-box;
    }

    .weAre {
      .title {
        margin-bottom: 120px;
      }
    }
  }
}
</style>
