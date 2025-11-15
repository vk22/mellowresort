<template>
  <!-- prettier-ignore -->
  <div :class="$style.page">
    <header ref="header" :class="$style.header" data-scroll-section data-section-theme="dark">
      <div class="container">
        <Title class="h1" :class="$style.title" :text="title" :mask="true" />
      </div>
    </header>
    <section :class="$style.grid" data-scroll-section data-section-theme="dark">
      <div class="container">
        <div
          v-for="(item, itemIndex) in members"
          :key="itemIndex"
          :class="$style.gridItem"
          data-scroll-item
        >
          <h2 :class="$style.roleMobile">{{ asText(item.role) }}</h2>
          <ResponsiveImage :class="$style.gridItemImage" :image="item.image" :ratio="460/315" use-tag />
          <div :class="$style.gridItemContent">
            <div :class="$style.gridItemInfo">
              <h1>{{ asText(item.name) }}</h1>
              <h2>{{ asText(item.role) }}</h2>
              <div :class="[$style.gridItemButton]" data-cursor-pointer @click="toggle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path d="M8.75 16h-1.5V8.75H0v-1.5h7.25V0h1.5v7.25H16v1.5H8.75V16Z" />
                </svg>
              </div>
            </div>
            <RichText :class="$style.gridItemDescription" :text="item.description" />
          </div>
        </div>
      </div>
    </section>
    <MediaComponent
      :image="media.image"
      :video="media.video"
      data-scroll-section
      data-section-theme="dark"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Util from "~/utils/util";
import { useAppBus } from '~/composables/useAppBus'
import { asText } from "@prismicio/helpers";

const { hideLoading, useCommonPageInit } = usePage()
const bus = useAppBus();
const { locale } = useI18n();

// props / data
const title = ref([]);
const members = ref([]);
const media = ref({ image: {}, video: {} });

// состояние окна
const winW = ref(0)
const winH = ref(0)
const isMobile = ref(false)
const isVertical = ref(false)

// ---------- INIT ----------
const domReady = ref(false)
const dataReady = ref(false)
const inited = ref(false)

// маршрутизация
const route = useRoute();

// загрузка данных
const { data, status } = await useFetch("/api/team", {
  method: "GET",
  query: {
    lang: locale.value,
  },
});

// если данные получены
if (data.value) {
  const serverData = data.value.data;
  title.value = serverData.title;
  members.value = serverData.members;
  media.value = {
    image: serverData.video_cover,
    video: serverData.video,
  };

  dataReady.value = true;
}

// SEO
useHead(() => ({
  title: data.value?.meta_title || "",
  meta: [
    {
      name: "description",
      content: data.value?.meta_description || "",
    },
    {
      property: "og:title",
      content: data.value?.meta_title || "",
    },
    {
      property: "og:description",
      content: data.value?.meta_description || "",
    },
    {
      property: "og:image",
      content: data.value?.meta_image?.url || "",
    },
  ],
}));

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
// стили
const $style = useCssModule();

// открытие/закрытие карточки
const toggle = (event) => {
  const item = event.target.closest(`.${$style.gridItem}`);
  if (item) {
    item.classList.toggle(`${$style.open}`);
  }
};
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
  .header {
    padding-top: 280px;
    padding-bottom: 140px;
    background: $black;
    color: $white;
    .title {
      max-width: 1020px;
    }
  }
  .grid {
    background: $black;
    color: $white;
    padding-top: 0;
    padding-bottom: 300px;
    :global(.container) {
      display: flex;
      flex-direction: column;
    }
    .gridItem {
      display: flex;
      margin-top: 215px;
      margin-bottom: 215px;
      .roleMobile {
        display: none;
        margin-bottom: 44px;
        font-weight: normal;
        font-size: 12px;
        line-height: 1;
        letter-spacing: 0.01em;
        text-transform: uppercase;
      }
      .gridItemImage {
        width: 50vw;
        max-width: 360px;
        z-index: 0;
      }
      .gridItemContent {
        transform: translateX(-7%) translateY(100px);
      }
      .gridItemInfo {
        z-index: 1;
        h1 {
          max-width: 240px;
          font-family: $font-serif;
          font-weight: 400;
          font-size: 50px;
          line-height: 1.2;
          letter-spacing: -0.01em;
          margin: 0;
        }
        h2 {
          max-width: 350px;
          font-size: 14px;
          font-weight: normal;
          margin: 0;
          margin-top: 2px;
          text-transform: uppercase;
        }
      }
      .gridItemButton {
        width: 80px;
        height: 80px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        position: relative;
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          border: 1px solid currentColor;
          border-radius: 50%;
          transition: transform 1s $curve;
        }
        svg {
          width: 20%;
          height: 20%;
          fill: currentColor;
          position: relative;
          z-index: 1;
          transition: transform 1s $curve;
        }
        &:hover {
          &::before {
            transform: scale(1.1);
          }
        }
      }
      .gridItemDescription {
        max-width: 324px;
        font-weight: 400;
        font-size: 14px;
        line-height: 1.5;
        letter-spacing: 0.01em;
        opacity: 0;
        margin-left: 130px;
        transform: translateY(-50px);
        transition: opacity 1s $curve;
      }
      &.open {
        .gridItemButton {
          svg {
            transform: rotate(45deg);
          }
        }
        .gridItemDescription {
          opacity: 1;
        }
      }
      &:nth-child(odd) {
        margin-left: auto;
        margin-right: 0;
      }
      &:first-child {
        margin-top: 0;
      }
    }
  }
  @include respond-to("desktop-extra-large") {
    .header {
      padding-top: toVW(280);
      padding-bottom: toVW(140);
      .title {
        max-width: #{Min(toVW(1020), 2000px)};
      }
    }
    .grid {
      .gridItem {
        .gridItemImage {
          max-width: toVW(360);
        }
        .gridItemInfo {
          h1 {
            max-width: toVW(240);
            font-size: toVW(50);
          }
          h2 {
            max-width: toVW(350);
            font-size: toVW(14);
          }
        }
        .gridItemButton {
          width: toVW(40);
          height: toVW(40);
        }
        .gridItemDescription {
          max-width: toVW(324);
          font-size: toVW(14);
        }
      }
    }
  }
  @include respond-to("tablet-small") {
    .grid {
      .gridItem {
        width: 100%;
        max-width: 400px;
        margin: 80px auto;
        margin-left: auto !important;
        margin-right: auto !important;
        display: block;
        .roleMobile {
          display: block;
        }
        .gridItemImage {
          width: 100%;
          max-width: none;
        }
        .gridItemContent {
          padding-bottom: 44px;
          transform: none;
          border-bottom: 1px solid currentColor;
        }
        .gridItemInfo {
          display: flex;
          justify-content: space-between;
          margin-top: 44px;
          h1 {
            font-size: 40px * 0.8;
          }
          h2 {
            display: none;
          }
          .gridItemButton {
            width: 60px;
            height: 60px;
            margin-top: 0;
          }
        }
        .gridItemDescription {
          width: 100%;
          max-width: 380px;
          transform: none;
          margin-left: 0;
          margin-top: 44px;
        }
        &:not(.open) {
          .gridItemDescription {
            display: none;
          }
        }
      }
    }
  }
  @include respond-to("mobile-medium") {
    .header {
      padding-top: 100px;
      padding-bottom: 80px;
    }
    .grid {
      padding-bottom: 120px;
      .gridItem {
        margin: 40px auto;
        .gridItemInfo {
          h1 {
            max-width: 150px;
            font-size: 28px;
          }
          .gridItemButton {
            width: 56px;
            height: 56px;
          }
        }
      }
    }
  }
}
</style>