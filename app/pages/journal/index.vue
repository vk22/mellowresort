<template>
  <!-- prettier-ignore -->
  <div :class="$style.page">
    <header :class="$style.header" data-scroll-section>
      <div class="container">
        <h1 :class="$style.title">{{ asText(header.title) }}</h1>
      </div>
    </header>
    
    <section :class="$style.columns" data-scroll-section>
      <div class="container" :class="$style.flex">
        <div
          v-for="(column, index) in columns"
          :key="index"
          :class="$style.column"
        >
          <NuxtLink
            v-for="(item, index) in column"
            :key="index"
            :to="`/${$route.params.lang}/journal/${item.data.uid}/`"
            :class="$style.post"
            data-fade-in
          >
          <!-- {{ item.data.title }} -->
            <MainTitle class="h2" :class="$style.title" :text="item.data.title" />
            <div :class="$style.imageContainer">
              <ResponsiveImage :class="$style.image" :image="item.data.cover_image" :ratio="900/600" />
            </div>
            <RichText :class="$style.description" :text="item.data.description" />
          </NuxtLink>
        </div>
      </div>
      <div class="container" :class="$style.footer">
        <div :class="[$style.loadMore, indexLimit < posts.length && $style.show, loading && $style.loading]" @click="loadMore" data-cursor-pointer>
          <MainTitle class="h2" :class="$style.title" :text="loadMoreButton" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M8.75 16h-1.5V8.75H0v-1.5h7.25V0h1.5v7.25H16v1.5H8.75V16Z" />
          </svg>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import Util from '~/utils/util'
import { asText } from "@prismicio/helpers";
import { useAppBus } from '~/composables/useAppBus'

const bus = useAppBus();
const nuxtApp = useNuxtApp()
const { hideLoading, useCommonPageInit } = usePage()

const { locale } = useI18n();

/* -------------------------------------------
   STATE
-------------------------------------------- */
const header = ref({ title: '' })
const loadMoreButton = ref('')
const posts = ref([])

const indexLimit = ref(6)
const loading = ref(false)

const winW = ref(0)
const isMobile = ref(false)
const domReady = ref(false)
const dataReady = ref(false)

/* -------------------------------------------
   FETCH DATA
-------------------------------------------- */

const { data, status } = await useFetch("/api/journal", {
  method: "GET",
  query: {
    lang: locale.value,
  },
});

console.log('data ', data.value)

if (data.value) {
  header.value.title = data.value.data.title
  loadMoreButton.value = data.value.data.load_more_button
  posts.value = [...data.value.data].sort((a, b) => new Date(b.date) - new Date(a.date))

  dataReady.value = true
}

/* -------------------------------------------
   SEO
-------------------------------------------- */
useHead(() => ({
  title: data.value?.meta_title || '',
  meta: [
    { name: 'description', content: data.value?.meta_description || '' },
    { property: 'og:title', content: data.value?.meta_title || '' },
    { property: 'og:description', content: data.value?.meta_description || '' },
    { property: 'og:image', content: data.value?.meta_image || '' }
  ]
}))

/* -------------------------------------------
   COMPUTED: two-column layout
-------------------------------------------- */
const columns = computed(() => {
  const numberOfColumns = isMobile.value ? 1 : 2
  const arr = Array.from({ length: numberOfColumns }, () => [])

  for (let i = 0; i < indexLimit.value; i++) {
    const col = i % numberOfColumns
    if (posts.value[i]) arr[col].push(posts.value[i])
  }
  return arr
})

/* -------------------------------------------
   LOAD MORE
-------------------------------------------- */
const loadMore = () => {
  loading.value = true

  setTimeout(() => {
    indexLimit.value += 6

    nextTick(() => {
      bus.emit('scroll-resize')
      setTimeout(() => {
        loading.value = false
        bus.emit('scroll-call-parallax')
      }, 300)
    })
  }, 300)
}

/* -------------------------------------------
   RESIZE
-------------------------------------------- */
const resize = () => {
  winW.value = window.innerWidth
  isMobile.value = winW.value <= 740
}

/* -------------------------------------------
   MOUNT
-------------------------------------------- */
onMounted(() => {
  domReady.value = true

  window.addEventListener('resize', resize)
  resize()

  if (dataReady.value) {
    init()
  }
})

/* -------------------------------------------
   INIT
-------------------------------------------- */
function init() {
  bus.emit('footer-show')
  bus.emit('scroll-reset')
  bus.emit('theme', 'light')
  bus.emit('theme-nav', 'light')
  bus.emit('book-button-show', '#DECA94')

  Util.loadImages(document.body, () => {
    nextTick(() => {
      resize()
      bus.emit('scroll-reset')

      hideLoading(() => {
        const visible = document.querySelectorAll('[data-fade-in]')
        visible.forEach((item) => item.classList.add('show'))
        bus.emit('scroll-call-parallax')
      })
    })
  })
}
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
    padding-top: 160px;
    padding-bottom: 75px;
    .title {
      font-family: $font-serif;
      font-weight: 400;
      font-size: 230px;
      line-height: 1;
      margin: 0;
      margin-left: auto;
      margin-right: 0;
      text-align: right;
    }
  }
  .columns {
    margin-bottom: 120px;
    .flex {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
  }
  .column {
    width: 46%;
    &:first-child:not(:last-child) {
      margin-top: 10vh;
    }
    .post {
      width: 100%;
      display: block;
      border-top: 1px solid currentColor;
      padding-top: 40px;
      .title {
        width: 100%;
        max-width: 460px;
        min-height: 2.2em;
        margin-bottom: 40px;
      }
      .imageContainer {
        width: 100%;
        overflow: hidden;
        .image {
          will-change: transform;
          transition: transform 1s $curve;
        }
      }
      .description {
        width: 100%;
        max-width: 530px;
        margin-top: 40px;
      }
      &:not(:last-child) {
        margin-bottom: 180px;
      }
      &:hover {
        .image {
          transform: scale(1.1);
        }
      }
    }
  }
  .footer {
    padding-top: 120px;
    display: flex;
    justify-content: center;
  }
  .loadMore {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.3s $curve;
    svg {
      width: 15px;
      margin-left: 15px;
      fill: currentColor;
      transition: transform 1s $curve;
    }
    &:hover {
      svg {
        transform: rotate(90deg);
      }
    }
    &.loading, &:not(.show) {
      opacity: 0;
      &, * {
        pointer-events: none !important;
      }
    }
  }
  @include respond-to('desktop-extra-large') {
    .header {
      padding-top: toVW(160);
      padding-bottom: toVW(75);
      .title {
        font-size: toVW(230);
      }
    }
    .columns {
      margin-bottom: toVW(120);
    }
    .column {
      &:first-child:not(:last-child) {
        margin-top: toVW(10);
      }
      .post {
        .title {
          max-width: toVW(460);
          margin-bottom: toVW(40);
        }
        .description {
          max-width: toVW(530);
          margin-top: toVW(40);
        }
        &:not(:last-child) {
          margin-bottom: toVW(180);
        }
      }
    }
    .footer {
      padding-top: toVW(120);
    }
    .loadMore {
      svg {
        width: toVW(15);
        margin-left: toVW(15);
      }
    }
  }
  @include respond-to('desktop') {
    .header {
      padding-top: 120px;
      padding-bottom: 60px;
      .title {
        font-size: 180px;
      }
    }
    .column {
      width: 48%;
    }
  }
  @include respond-to('tablet-small') {
    .header {
      padding-top: 100px;
      padding-bottom: 50px;
      .title {
        font-size: 120px;
      }
    }
    .column {
      width: 100%;
      &:first-child:not(:last-child) {
        margin-top: 0;
      }
      .post {
        &:not(:last-child) {
          margin-bottom: 44px;
        }
      }
    }
  }
  @include respond-to('mobile-medium') {
    .header {
      padding-top: 140px;
      padding-bottom: 80px;
      .title {
        font-size: 100px;
      }
    }
    .columns {
      margin-bottom: 80px;
    }
    .column {
      .post {
        .title {
          max-width: 100%;
        }
        .description {
          max-width: 100%;
        }
      }
    }
    .footer {
      padding-top: 80px;
    }
  }
}
</style>