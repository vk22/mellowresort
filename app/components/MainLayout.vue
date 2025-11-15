<template>
  <main id="main">
    <Loading />
    <Intro />
    <ScrollPointer ref="scrollPointer" />
    <Navbar />

    <Menu
      :main-items="menu.mainItems"
      :secondary-items="menu.secondaryItems"
      :support-items="menu.supportItems"
      :social-items="menu.socialItems"
      :secondary-title="menu.secondaryTitle"
      :support-title="menu.supportTitle"
      :footer-left="menu.footerLeft"
      :footer-center="menu.footerCenter"
      :footer-right="menu.footerRight"
    />

    <BookButton />
    <BookingPopup v-bind="booking" />
    <CustomCursor />

    <!-- page-wrapper for ScrollCtrl -->
    <div ref="page">
      <NuxtPage />
      <Footer
        :newsletter-title="footer.newsletterTitle"
        :input-placeholder="footer.inputPlaceholder"
        :thanks-text="footer.thanksText"
        :copyright="footer.copyright"
        :column1="footer.column1"
        :column2="footer.column2"
        :social-items="menu.socialItems"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import { useRoute } from '#app'
import { useNuxtApp } from '#app'
import gsap from 'gsap'
import { useAppBus } from '~/composables/useAppBus'


// --- utils/classes
import Util from '~/utils/util'
import ScrollCtrl from '~/assets/js/components/scroll'

// --- refs
const page = ref<HTMLElement | null>(null)
const scrollPointer = ref<any>(null)
const scroll = ref<any>(null)

// --- bus
const bus = useAppBus()


// --- data
const menu = reactive({
  mainItems: [] as any[],
  secondaryItems: [] as any[],
  supportItems: [] as any[],
  socialItems: [] as any[],
  secondaryTitle: [] as any[],
  supportTitle: [] as any[],
  footerLeft: [] as any[],
  footerCenter: [] as any[],
  footerRight: [] as any[],
})

const footer = reactive({
  newsletterTitle: [] as any[],
  inputPlaceholder: '',
  copyright: '',
  column1: [] as any[],
  column2: [] as any[],
})

const booking = reactive({
  introTitle: [] as any[],
  introDescription: [] as any[],
  chooseTitle: [] as any[],
  chooseDescription: [] as any[],
  specialRetreatTitle: [] as any[],
  adventures: [] as any[],
  thanksTitle: [] as any[],
  thanksDescription: [] as any[],
  stayForm: { primary: {}, items: [] as any[] },
  standardRetreatForm: { primary: {}, items: [] as any[] },
  specialRetreatForm: { primary: {}, items: [] as any[] },
  specialRetreats: [] as any[],
})

const state = reactive({
  mobileInitialized: false,
  winW: 0,
  winH: 0,
  isMobile: false,
  scrollPaused: undefined as boolean | undefined
})

// ======================
// SSR-safe content loading
// ======================

async function loadServerData() {
  // Если у тебя уже стоит @nuxtjs/prismic для Nuxt 3 — замени на его SDK.
  // Ниже простая реализация через window.fetch и твой API endpoint + ref.
  // Если используешь официальный @prismicio/client — подключи его и замени.
  // const prismicApi = 'https://mellow-sa.prismic.io/api/v2'

  // // В Nuxt 2 ты искал masterRef. В Nuxt 3 проще — возьмём master ref из api.
  // const refsRes = await fetch(`${prismicApi}/refs`)
  // const refs = await refsRes.json()
  // const masterRef = refs?.refs?.find((r: any) => r.isMasterRef)?.ref

  // const opt = masterRef ? `?ref=${encodeURIComponent(masterRef)}` : ''

  // // helper для singleton
  // const getSingle = async (type: string) => {
  //   const res = await fetch(`${prismicApi}/documents/search${opt}&q=[[at(document.type,"${type}")]]&pageSize=1`)
  //   const json = await res.json()
  //   return json?.results?.[0]?.data
  // }

  // // helper для коллекций
  // const queryType = async (type: string, pageSize = 100) => {
  //   const res = await fetch(`${prismicApi}/documents/search${opt}&q=[[at(document.type,"${type}")]]&pageSize=${pageSize}`)
  //   const json = await res.json()
  //   return json?.results || []
  // }

  //// custom server data
  const getSeverData = async (type: string, lang: string) => {
    const { success, data } = await $fetch(`/api/${type}`, {
      method: "GET",
      query: {
        lang: lang,
      },
    });
    return data.data
  };

  // menu
  const menuData = await getSeverData('menu', 'en')

  console.log('menuData ', menuData)

  if (menuData) {
    menu.mainItems = menuData.main_items || []
    menu.secondaryItems = menuData.secondary_items || []
    menu.supportItems = menuData.support_items || []
    menu.socialItems = menuData.social_items || []
    menu.secondaryTitle = menuData.secondary_items_title || []
    menu.supportTitle = menuData.support_items_title || []
    menu.footerLeft = menuData.footer_left || []
    menu.footerCenter = menuData.footer_center || []
    menu.footerRight = menuData.footer_right || []
  }

  // footer
  // const footerData = await getSingle('footer')
  // if (footerData) {
  //   // asText заменяешь на свою утилиту (ты уже её писал ранее)
  //   const asText = (arr: any[]) => Array.isArray(arr) ? arr.map(b => b.text || '').join(' ') : ''
  //   footer.newsletterTitle = footerData.newsletter_title || []
  //   footer.copyright = asText(footerData.copyright || [])
  //   footer.inputPlaceholder = asText(footerData.input_placeholder || [])
  //   footer.thanksText = footerData.thanks_text || []
  //   footer.column1 = footerData.column_1 || []
  //   footer.column2 = footerData.column_2 || []
  // }

  // // booking
  // const bookingData = await getSingle('booking')
  // if (bookingData) {
  //   const asText = (arr: any[]) => Array.isArray(arr) ? arr.map(b => b.text || '').join(' ') : ''
  //   booking.introTitle = bookingData.intro_title || []
  //   booking.introDescription = bookingData.intro_description || []
  //   booking.chooseTitle = bookingData.choose_title || []
  //   booking.chooseDescription = bookingData.choose_description || []
  //   booking.specialRetreatTitle = bookingData.special_retreat_title || []
  //   booking.adventures = bookingData.adventures || []
  //   booking.thanksTitle = bookingData.thanks_title || []
  //   booking.thanksDescription = bookingData.thanks_description || []
  //   booking.stayForm = bookingData.body?.find((s: any) => s.slice_type === 'stay_form') || { primary: {}, items: [] }
  //   booking.standardRetreatForm = bookingData.body?.find((s: any) => s.slice_type === 'standard_retreat_form') || { primary: {}, items: [] }
  //   booking.specialRetreatForm = bookingData.body?.find((s: any) => s.slice_type === 'special_retreat_form') || { primary: {}, items: [] }
  // }

  // // special retreats list
  // const resultsRetreats = await queryType('special_retreat')
  // if (Array.isArray(resultsRetreats)) {
  //   const asText = (arr: any[]) => Array.isArray(arr) ? arr.map(b => b.text || '').join(' ') : ''
  //   booking.specialRetreats = resultsRetreats.map((item: any) => {
  //     const d = item.data || {}
  //     return {
  //       uid: item.uid,
  //       title: asText(d.title || []),
  //       image: d.header_image_vertical,
  //       soon: d.soon,
  //       price: asText(d.shared_price || []),
  //       dates: d.dates,
  //       bookTitle: d.book_popup_title,
  //       bookDescription: d.book_popup_description,
  //       sharedTitle: asText(d.shared_title || []),
  //       privateTitle: asText(d.private_title || []),
  //       sharedPrice: asText(d.shared_price || []),
  //       privatePrice: asText(d.private_price || []),
  //     }
  //   })
  // }
}

// ======================
// DOM/scroll
// ======================

function setOS() {
  let os = 'osx'
  if (navigator.platform) {
    if (navigator.platform.includes('Win')) os = 'windows'
    else if (navigator.platform.includes('Mac')) os = 'osx'
    else if (navigator.platform.includes('Linux')) os = 'linux'
  } else {
    const ua = navigator.userAgent
    if (ua.includes('Windows')) os = 'windows'
    else if (ua.includes('Mac')) os = 'osx'
    else if (ua.includes('Linux')) os = 'linux'
  }
  document.documentElement.setAttribute('data-os', os)
  document.documentElement.setAttribute('data-browser', Util.getBrowser())
  document.documentElement.setAttribute('data-touch', String(Util.isTouch()))
}

function resize() {
  state.winW = window.innerWidth
  state.winH = window.innerHeight
  state.isMobile = state.winW <= 1024

  const vh = state.winH * 0.01
  if (state.isMobile && !state.mobileInitialized) {
    state.mobileInitialized = true
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  } else if (!state.isMobile) {
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
  document.documentElement.style.setProperty('--rvh', `${vh}px`)

  const container = document.querySelector('.container') as HTMLElement | null
  if (container) {
    const rect = container.getBoundingClientRect()
    document.documentElement.style.setProperty('--container-margin', `${rect.left}px`)
    document.documentElement.style.setProperty('--container-width', `${rect.width}px`)
    document.documentElement.style.setProperty('--column', `${rect.width / 12}px`)
  } else {
    document.documentElement.style.setProperty('--column', `${state.winW / 12}px`)
  }
}

function initScroll() {
  if (!scroll.value && page.value && scrollPointer.value) {
    console.log('initScroll ', scroll.value)
    scroll.value = new ScrollCtrl({
      page: page.value,
      pointer: scrollPointer.value.$el,
      hideCursor: () => bus.emit('cursor-hide'),
    })
    console.log('initScroll 2', scroll.value)
    // публичный доступ как раньше
    ;(window as any).scroll = scroll.value

    scroll.value.addParalax(scrollHandler)
    scrollHandler(0)
  }
}

// 
function scrollHandler(pos: number) {
  const winH = state.winH

  let scrollItems = Array.from(document.querySelectorAll(
    '.fade-in-y, .fade-in, [data-fade-in-y], [data-fade-in], [data-blur-fade-in-y], [data-blur-fade-in], [data-scroll-item]'
  )) as HTMLElement[]

  let sectionThemes = Array.from(document.querySelectorAll('[data-section-theme]')) as HTMLElement[]
  if (state.isMobile) {
    sectionThemes = sectionThemes.filter((section) => section.clientHeight >= winH * 0.6)
  }

  scrollItems.forEach((item) => {
    const offsetAttr = item.getAttribute('data-scroll-offset')
    const offset = offsetAttr ? Number(offsetAttr) : 120
    if (!item.classList.contains('show') && Util.isInViewportDom(item, offset)) {
      item.classList.add('show')
    } else if (item.classList.contains('show') && item.getBoundingClientRect().top > winH) {
      item.classList.add('no-transition')
      item.classList.remove('show')
      item.classList.remove('no-transition')
    }
  })

  let theme: 'light' | 'dark' = 'light'
  sectionThemes.forEach((item) => {
    const rect = item.getBoundingClientRect()
    if (rect.top <= 80 && rect.bottom > 80) {
      theme = (item.getAttribute('data-section-theme') as any) || 'light'
    }
  })
  document.documentElement.setAttribute('data-theme-nav', theme)
  document.documentElement.setAttribute('data-theme', getActiveTheme(sectionThemes, winH))
}

function getActiveTheme(sectionThemes: HTMLElement[], winH: number) {
  let current = sectionThemes.find((section) => Util.isInViewportDom(section) && Util.pxVisible(section) > 2)
  if (!current) return 'light'

  sectionThemes.forEach((section) => {
    const sectionD = Util.pxVisible(section)
    const currentD = Util.pxVisible(current!)
    if (Util.isInViewportDom(section) && sectionD > currentD) current = section
  })

  if (Util.pxVisible(current!) < winH * 0.99) {
    let i = sectionThemes.indexOf(current!)
    const top = current!.getBoundingClientRect().top
    current = top < 0 ? sectionThemes[i + 1] : sectionThemes[i - 1]
    if (current && Util.isInViewportDom(current)) return current.getAttribute('data-section-theme') || 'light'
    return 'light'
  } else {
    return current!.getAttribute('data-section-theme') || 'light'
  }
}

// ======================
// Bus events
// ======================

function attachBus() {
  bus.on('scroll-pause', () => {
    initScroll()
    state.scrollPaused = true
    if (scroll.value) scroll.value.pause = true
    document.documentElement.classList.add('overflowHidden')
  })

  bus.on('scroll-play', () => {
    initScroll()
    if (scroll.value) scroll.value.pause = false
    state.scrollPaused = undefined
    document.documentElement.classList.remove('overflowHidden')
  })

  bus.on('scroll-to', (pos) => {
    initScroll()
    if (scroll.value) scroll.value.scrollTo(pos)
  })

  bus.on('scroll-update-sections', () => {
    initScroll()
    if (scroll.value) {
      scroll.value.pause = true
      setTimeout(() => {
        scroll.value.updateSections()
        scroll.value.resize()
        scroll.value.pause = state.scrollPaused !== undefined ? state.scrollPaused : false
      }, 300)
    }
  })

  bus.on('scroll-reset', () => {
    initScroll()
    if (scroll.value) {
      setTimeout(() => {
        scroll.value.scrollTo(0, true)
        scroll.value.updateSections()
        scroll.value.resize()
      }, 300)
    }
  })

  bus.on('scroll-resize', (data) => {
    initScroll()
    if (scroll.value) {
      scroll.value.resize()
      bus.emit('scroll-after-resize', data)
    }
  })

  bus.on('scroll-add-listener', (cb) => {
    initScroll()
    if (scroll.value) scroll.value.addParalax(cb)
  })

  bus.on('scroll-remove-listener', (cb) => {
    initScroll()
    if (scroll.value) scroll.value.removeParalax(cb)
  })

  bus.on('scroll-call-parallax', () => {
    initScroll()
    if (scroll.value && scroll.value.callParalax) scroll.value.callParalax()
  })

  bus.on('theme', (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
  })
  bus.on('theme-nav', (theme) => {
    document.documentElement.setAttribute('data-theme-nav', theme)
  })
}

// ======================
// (client-only)
// ======================

onMounted(async () => {
  // 1) системные атрибуты/vars
  setOS()
  resize()
  window.addEventListener('resize', resize)

  // 2) «разрешить autoplay»
  document.documentElement.addEventListener('click', () => {
    document.documentElement.setAttribute('data-canplay', 'true')
  })

  // 3) загрузка контента (прежний fetch)
  await loadServerData()

  // 4) инициализация scroll + подписки
  attachBus()
  initScroll()

  // 5) observer на iframe (как у тебя)
  const observer = new MutationObserver((mut) => {
    mut.forEach((m) => {
      if (m.type === 'childList') {
        m.addedNodes.forEach((node: any) => {
          if (node?.tagName === 'IFRAME') node.remove()
        })
      }
    })
  })
  observer.observe(document.body, { childList: true, subtree: true })

  // при размонтировании — отключим
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
    observer.disconnect()
  })
})
</script>

<style lang="scss">
@use "sass:math";
@use "sass:map";
@use "sass:meta";
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;

/* Твои css-переменные темы, как и раньше */
html {
  --background-primary: #{$white};
  --text-color-primary: #{$black};
}
html[data-theme="dark"] {
  --background-primary: #{$black};
  --text-color-primary: #{$white};
}
html[data-theme="light"] {
  --background-primary: #{$white};
  --text-color-primary: #{$black};
}
</style>
