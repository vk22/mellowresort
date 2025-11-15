<template>
  <!-- prettier-ignore -->
  <div :class="$style.page" data-section-theme="dark">
    <header ref="header" :class="$style.header">
      <div class="container">
        <div :class="$style.navItems">
          <div
            :class="$style.navItem"
            class="h2"
            @click="gotoSection(contact.title)"
          >
            01 {{ asText(contact.title) }}
          </div>
          <div
            v-for="(item, index) in sections"
            :key="index"
            :class="$style.navItem"
            class="h2"
            @click="gotoSection(item.section_title)"
          >
            {{ prettyNumber(index + 2) }} {{ asText(item.section_title) }}
          </div>
        </div>
      </div>
    </header>
    <section
      :class="$style.section"
      data-scroll-section
      :data-section-slug="getSlug(contact.title)"
    >
      <div class="container">
        <div :class="$style.sectionContainer">
          <h1 :class="$style.sectionNumber">01</h1>
          <h2 class="h3" :class="$style.sectionTitle">{{ asText(contact.title) }}</h2>
          <div :class="$style.icons">
            <a
              v-for="(item, index) in contact.items"
              :key="index"
              :class="$style.icon"
              :href="item.item_link && item.item_link.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img :src="item.item_icon && item.item_icon.url" :alt="item.item_icon.alt" />
              <div :class="$style.iconContent">
                <h3 :class="$style.iconTitle">{{ asText(item.item_title) }}</h3>
                <RichText :class="$style.iconSubtitle" :text="item.item_subtitle" :margin="false" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
    <section
      v-for="(section, index) in sections"
      :key="index"
      :class="$style.section"
      data-scroll-section
      :data-section-slug="getSlug(section.section_title)"
    >
      <div class="container">
        <div :class="$style.sectionContainer">
          <h1 class="h1" :class="$style.sectionNumber">{{ prettyNumber(index + 2) }}</h1>
          <h1 class="h3" :class="$style.sectionTitle">{{ asText(section.section_title) }}</h1>
          <RichText :class="$style.sectionContent" :text="section.section_description" :margin="false" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Util from '~/utils/util'
import { asText } from "@prismicio/helpers";
import { useAppBus } from '~/composables/useAppBus'

const bus = useAppBus();
const { hideLoading, useCommonPageInit } = usePage()

const route = useRoute()
const nuxtApp = useNuxtApp()


const { locale } = useI18n();

/* ---------------- STATE ---------------- */

const sections = ref([])
const contact = ref({
  title: '',
  items: []
})

const metaState = ref({
  title: '',
  description: '',
  image: ''
})

const domReady = ref(false)
const dataReady = ref(false)

const winW = ref(0)
const winH = ref(0)
const isMobile = ref(false)
const isVertical = ref(false)

const lang = route.params.lang || 'en'

/* ---------------- FETCH ---------------- */

const { data, status } = await useFetch("/api/help-center", {
  method: "GET",
  query: {
    lang: locale.value,
  },
});



if (data.value) {
  contact.value.title = data.value.data.contact_title || ''
  contact.value.items = data.value.data.contact_items || []
  sections.value = data.value.data.sections || []

  metaState.value = {
    title: data.value.data.meta_title || '',
    description: data.value.data.meta_description || '',
    image: data.value.data.meta_image || ''
  }

  dataReady.value = true
}

/* ---------------- HEAD ---------------- */

useHead(() => ({
  title: metaState.value.title,
  meta: [
    { hid: 'description', name: 'description', content: metaState.value.description },
    { hid: 'twitter:title', name: 'twitter:title', content: metaState.value.title },
    { hid: 'twitter:description', name: 'twitter:description', content: metaState.value.description },
    { hid: 'twitter:image', name: 'twitter:image', content: metaState.value.image },
    { hid: 'og:title', name: 'og:title', content: metaState.value.title },
    { hid: 'og:description', name: 'og:description', content: metaState.value.description },
    { hid: 'og:image', name: 'og:image', content: metaState.value.image }
  ]
}))

/* ---------------- HELPERS ---------------- */

const prettyNumber = (num) => (num < 10 ? `0${num}` : String(num))

const getSlug = (text) => {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

const gotoSection = (text) => {
  const slug = getSlug(text)
  const section = document.querySelector(`[data-section-slug="${slug}"]`)
  if (section) {
    const pos = Util.getPosition(section)
    bus.emit('scroll-to', pos.y)
  }
}

/* ---------------- RESIZE ---------------- */

const resize = () => {
  winW.value = window.innerWidth
  winH.value = window.innerHeight
  isMobile.value = winW.value <= 1024
  isVertical.value = winH.value > winW.value
}

/* ---------------- INIT ---------------- */

const init = () => {
  if (!dataReady.value || !domReady.value) return

  bus.emit('scroll-reset')
  bus.emit('footer-hide')

  Util.loadImages(document.body, () => {
    nextTick(() => {
      resize()
      bus.emit('scroll-reset')
      bus.emit('theme', 'dark')
      hideLoading(() => {})
    })
  })
}

/* ---------------- LIFECYCLE ---------------- */

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
  position: relative;
  z-index: 0;
  color: $white;
  padding-bottom: 80px;
  background: $black;
  .header {
    padding-top: 270px;
    padding-bottom: 80px;
    position: relative;
    z-index: 1;
    pointer-events: none;
    .navItems {
      max-width: 35%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .navItem {
        @include underline();
        font-family: $font-serif;
        cursor: pointer;
        pointer-events: all;
        &:not(:last-child) {
          margin-bottom: 12px;
        }
      }
    }
  }
  .section {
    .sectionContainer {
      width: 60%;
      border-top: 1px solid currentColor;
      border-bottom: 1px solid currentColor;
      padding: 40px 0;
      margin-left: auto;
      margin-right: 0;
    }
    .sectionNumber {
      font-size: 160px;
      font-family: $font-serif;
      font-weight: normal;
      line-height: 1;
      margin: 0;
      margin-bottom: 20px;
    }
    .sectionTitle {
      font-family: $font-serif;
    }
    .sectionContent {
      max-width: 850px;
      margin-top: 72px;
      h4 {
        font-weight: 400;
        font-size: 21px;
        font-family: $font-serif;
        line-height: 1.4;
      }
      a strong {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 20px 70px;
        font-size: 14px;
        font-weight: normal;
        color: $black;
        position: relative;
        text-decoration: none;
        margin: 2em 0;
        &::after {
          content: '';
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: -1;
          background: white;
          border-radius: 100px;
          transition: transform 1s $curve, opacity 1s $curve;
        }
        &:hover {
          &::after {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
      }
      a:has(strong) {
        text-decoration: none;
      }
      h1:not(:empty) + p:empty, p:not(:empty) + p:empty {
        height: 1em !important;
      }
    }
    .icons {
      max-width: 850px;
      display: flex;
      flex-wrap: wrap;
      margin-top: 72px;
      .icon {
        width: 50%;
        margin-bottom: 72px;
        display: inline-flex;
        align-items: center;
        img {
          width: 80px;
          margin-right: 32px;
          transition: transform 1s $curve;
        }
        .iconTitle, .iconSubtitle {
          font-weight: normal;
          margin: 0;
        }
        &:hover {
          img {
            transform: scale(1.1);
          }
        }
      }
    }
  }
  @include respond-to('desktop-extra-large') {
    padding-bottom: toVW(80);
    .header {
      padding-top: toVW(270);
      padding-bottom: toVW(80);
    }
    .section {
      .sectionContainer {
        padding-top: toVW(40);
        padding-bottom: toVW(40);
      }
      .sectionNumber {
        font-size: toVW(160);
        margin-bottom: toVW(20);
      }
      .sectionContent {
        max-width: #{Min(toVW(850), 1200px)};
        margin-top: toVW(72);
        h4 {
          font-size: toVW(21);
        }
        a strong {
          font-size: toVW(14);
          margin: toVW(2) 0;
        }
      }
      .icons {
        max-width: #{Min(toVW(850), 1900px)};
        margin-top: toVW(72);
        .icon {
          width: 50%;
          margin-bottom: toVW(72);
          img {
            width: toVW(80);
            margin-right: toVW(32);
          }
        }
      }
    }
  }
  @include respond-to('desktop-medium') {
    .section {
      .icons {
        flex-direction: column;
        .icon {
          width: 100%;
          margin-bottom: 40px;
        }
      }
    }
  }
  @include respond-to('desktop') {
    .header {
      padding-top: 170px;
      padding-bottom: 48px;
    }
    .section {
      .sectionContainer {
        margin-left: 0;
        margin-right: auto;
        padding-top: 80px;
      }
      .sectionNumber {
        display: none;
      }
      .icons {
        margin-top: 40px;
      }
    }
  }
  @include respond-to('tablet-big') {
    .header {
      .navItems {
        width: 100%;
        max-width: 800px;
      }
    }
    .section {
      .sectionContainer {
        width: 100%;
        max-width: 850px;
      }
      .icons {
        .icon {
          margin-right: 0;
          &:not(:last-child) {
            margin-bottom: 30px;
          }
        }
      }
      .sectionTitle {
        font-size: 28px;
      }
    }
  }
  @include respond-to('mobile-medium') {
    .section {
      .sectionContent {
        a strong {
          font-size: 15.5px;
          padding: 18px 40px;
        }
      }
    }
  }
}
</style>
