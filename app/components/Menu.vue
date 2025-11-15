<template>
  <div ref="root" :class="[$style.menu, isOpen && $style.isOpen]">
    <div ref="bg" :class="$style.bg" />

    <div class="container" :class="$style.top">
      <div ref="mainItemsRef" :class="$style.mainItems">
        
        <NuxtLink
          v-for="(item, index) in mainItems"
          :key="index"
          :class="$style.item"
          :to="localePath('/'+item.link.slug)"
          
        >
          <small>(0{{ index + 1 }})</small>
          <h1>{{ asText(item.title) }}</h1>

          <ResponsiveImage
            :image="item.image"
            :class="$style.image"
            :ratio="211 / 160"
            use-container-size
          />
        </NuxtLink>
      </div>

      <div :class="$style.right">
        <hr ref="line" />

        <div :class="$style.list">
          <h1>{{ asText(secondaryTitle) }}</h1>

          <NuxtLink
            v-for="(item, index) in secondaryItems"
            :key="index"
            :to="localePath('/'+item.link.slug)"
            :class="$style.item"
            >{{ asText(item.title) }}</NuxtLink
          >
        </div>

        <div :class="$style.list">
          <h1>{{ asText(supportTitle) }}</h1>

          <NuxtLink
            v-for="(item, index) in supportItems"
            :key="index"
            :to="localePath('/'+item.link.slug)"
            :class="$style.item"
            >{{ asText(item.title) }}</NuxtLink
          >
        </div>

        <div :class="$style.flex">
          <!-- <div :class="$style.social">
            <a
              v-for="(item, index) in socialItems"
              :key="index"
              :class="$style.socialItem"
              :href="item.social_link?.url"
              target="_blank"
            >
              <svg
                v-if="getSocialName(item.social_link) === 'instagram'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22 22"
              >
                <path
                  d="M10.591 21.018c-2.866 0-3.204-.015-4.323-.064a7.672 7.672 0 0 1-2.546-.524 5.383 5.383 0 0 1-3.065-3.067 7.68 7.68 0 0 1-.488-2.548c-.065-1.117-.065-1.482-.065-4.327 0-2.875.015-3.21.065-4.323A7.68 7.68 0 0 1 .657 3.62 5.372 5.372 0 0 1 3.725.552 7.613 7.613 0 0 1 6.27.062C7.383 0 7.75 0 10.592 0c2.89 0 3.222.015 4.323.063a7.66 7.66 0 0 1 2.552.49 5.378 5.378 0 0 1 3.068 3.067c.312.826.478 1.7.49 2.583.066 1.116.066 1.481.066 4.325 0 2.843-.016 3.216-.065 4.32a7.69 7.69 0 0 1-.49 2.55 5.389 5.389 0 0 1-3.069 3.068 7.702 7.702 0 0 1-2.547.488c-1.113.064-1.478.064-4.329.064Zm-.04-19.173c-2.85 0-3.145.014-4.258.064a5.814 5.814 0 0 0-1.945.362 3.483 3.483 0 0 0-2.004 1.995 5.844 5.844 0 0 0-.362 1.966c-.062 1.13-.062 1.425-.062 4.256 0 2.797.01 3.136.062 4.258.01.665.133 1.323.362 1.946a3.486 3.486 0 0 0 2.004 1.994c.622.233 1.28.355 1.945.363 1.128.065 1.425.065 4.259.065 2.859 0 3.155-.014 4.258-.065a5.786 5.786 0 0 0 1.946-.363 3.496 3.496 0 0 0 1.993-1.991c.232-.63.355-1.296.362-1.968h.013c.05-1.114.05-1.41.05-4.258 0-2.847-.013-3.146-.063-4.259a5.892 5.892 0 0 0-.362-1.944 3.496 3.496 0 0 0-1.993-1.995 5.76 5.76 0 0 0-1.946-.362c-1.127-.064-1.422-.064-4.258-.064Zm.04 14.026a5.387 5.387 0 1 1 5.384-5.389 5.394 5.394 0 0 1-5.383 5.389Zm0-8.887a3.496 3.496 0 1 0 3.497 3.496 3.504 3.504 0 0 0-3.496-3.496Zm5.594-.831a1.256 1.256 0 1 1 .01-2.512 1.256 1.256 0 0 1-.01 2.512Z"
                />
              </svg>
              <svg
                v-if="getSocialName(item.social_link) === 'twitter'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 18"
              >
                <path
                  d="M24 2.131c-.883.362-1.832.605-2.828.715 1.017-.562 1.798-1.452 2.165-2.514-.951.52-2.005.9-3.127 1.103C19.313.552 18.032 0 16.616 0c-3.179 0-5.515 2.737-4.797 5.579C7.728 5.389 4.1 3.58 1.671.832c-1.29 2.042-.669 4.714 1.523 6.067A5.219 5.219 0 0 1 .965 6.33c-.054 2.105 1.581 4.075 3.949 4.513a5.335 5.335 0 0 1-2.224.078c.626 1.805 2.444 3.118 4.6 3.155-2.07 1.498-4.678 2.167-7.29 1.883A14.798 14.798 0 0 0 7.548 18c9.142 0 14.307-7.126 13.995-13.517A9.634 9.634 0 0 0 24 2.131Z"
                />
              </svg>
              <svg
                v-if="getSocialName(item.social_link) === 'spotify'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 19 20"
              >
                <path
                  d="M9.5 19.8A9.49 9.49 0 0 1 2.8 3.59a9.49 9.49 0 1 1 6.7 16.2Zm-1.4-6.4a9.31 9.31 0 0 1 4.96 1.32c.1.06.2.1.31.1a.6.6 0 0 0 .5-.3c.08-.15.1-.34.04-.51a.5.5 0 0 0-.28-.29 10.5 10.5 0 0 0-5.59-1.47c-1.22 0-2.43.15-3.62.43a.6.6 0 0 0-.43.7c.07.26.3.44.56.46l.15-.02c1.11-.27 2.25-.4 3.4-.42Zm-.19-2.83c2.14-.02 4.24.52 6.1 1.58.1.08.23.12.37.12a.8.8 0 0 0 .63-.36.68.68 0 0 0 .1-.55.6.6 0 0 0-.29-.4 13.56 13.56 0 0 0-6.91-1.81c-1.28-.01-2.55.17-3.78.53a.73.73 0 0 0-.47.9c.1.31.38.52.7.5.07 0 .14 0 .2-.02 1.09-.33 2.22-.5 3.35-.49Zm.18-2.94c2.44-.07 4.85.49 7.02 1.62.14.08.3.12.47.12.3 0 .58-.13.76-.36a.94.94 0 0 0 .08-.68.87.87 0 0 0-.41-.55 16.01 16.01 0 0 0-7.93-1.87 16.5 16.5 0 0 0-4.52.59.87.87 0 0 0 .27 1.7c.09 0 .17-.01.25-.04 1.3-.37 2.66-.55 4.01-.53Z"
                />
              </svg>
            </a>
          </div> -->

          <div :class="$style.langs">
            <NuxtLink
              v-for="l in locales"
              :key="l.code"
              :to="`/${l.code}/`"
              :class="[
                $style.lang,
                locale.value === l.code && $style.active,
              ]"
              >{{ l.code }}</NuxtLink
            >
          </div>
        </div>
      </div>
    </div>

    <div class="container" :class="$style.bottom">
      <span>{{ asText(footerLeft) }}</span>
      <span>{{ asText(footerCenter) }}</span>
      <span>{{ asText(footerRight) }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick, toRefs } from 'vue'
import { useRoute } from '#app'
import { useAppBus } from '~/composables/useAppBus'
import { gsap } from 'gsap'

const { locale, locales } = useI18n();
const localePath = useLocalePath()

const $style = useCssModule()

// 1) Забираем props в переменную и превращаем в реактивные ссылки
const props = defineProps({
  mainItems: { type: Array, default: () => [] },
  secondaryItems: { type: Array, default: () => [] },
  supportItems: { type: Array, default: () => [] },
  socialItems: { type: Array, default: () => [] },
  secondaryTitle: { type: Array, default: () => [] },
  supportTitle: { type: Array, default: () => [] },
  footerLeft: { type: Array, default: () => [] },
  footerCenter: { type: Array, default: () => [] },
  footerRight: { type: Array, default: () => [] },
})
const {
  mainItems,
  secondaryItems,
  supportItems,
  socialItems,
  secondaryTitle,
  supportTitle,
  footerLeft,
  footerCenter,
  footerRight,
} = toRefs(props)

// state / utils
const isOpen = ref(false)
const route = useRoute()
const bus = useAppBus()

const root = ref<HTMLElement | null>(null)
const bg = ref<HTMLElement | null>(null)
const mainItemsRef = ref<HTMLElement | null>(null)
const line = ref<HTMLElement | null>(null)

let x = 0
let items: HTMLElement[] = []
let opacityItems: HTMLElement[] = []

const asText = (arr?: Array<{ text?: string }>) => arr?.[0]?.text || ''
function resolveLink(link?: any) {
  if (!link) return `/${locale.value}/`
  if (link.type === 'standard_retreat') return `/${locale.value}/retreats/standard/`
  if (link.type === 'special_retreat') return `/${locale.value}/retreats/${link.slug || link.uid}/`
  if (link.type === 'home') return `/${locale.value}/`
  return `/${locale.value}/${link.slug || link.type?.replace('_', '-')}/`
}

// animations
function init() {
  x = window.innerWidth * 0.25
  items = mainItemsRef.value ? Array.from(mainItemsRef.value.children) as HTMLElement[] : []
  opacityItems = root.value
    ? (Array.from(
        root.value.querySelectorAll(
          `.${$style.list} > *, .${$style.langs} > *, .${$style.bottom} > *`
        )
      ) as HTMLElement[])
    : []
  hideInstant()
}
function hideInstant() {
  if (!bg.value) return
  gsap.set(bg.value, { y: '-100%' })
  gsap.set(opacityItems, { opacity: 0 })
  if (line.value) gsap.set(line.value, { scaleY: 0 })
  gsap.set(items, { x: (i: number) => (i % 2 === 0 ? x : -x), opacity: 0 })
}
function openMenu() {
  if (!bg.value) return
  isOpen.value = true
  gsap.to(bg.value, { duration: 1.2, y: '0%', ease: 'Power4.easeInOut' })
  if (items.length)
    gsap.to(items, { duration: 1.2, x: 0, opacity: 1, stagger: 0.05, delay: 0.1, ease: 'Power4.easeInOut' })
  if (opacityItems.length)
    gsap.to(opacityItems, { duration: 1.2, opacity: 1, stagger: 0.05, delay: 0.1, ease: 'Power4.easeInOut' })
  if (line.value) gsap.to(line.value, { duration: 1.2, scaleY: 1, delay: 0.3, ease: 'Power4.easeInOut' })
}
function closeMenu() {
  if (items.length)
    gsap.to([...items].reverse(), { duration: 1, x: (i: number) => (i % 2 === 0 ? -x : x), opacity: 0, stagger: 0.05, ease: 'Power4.easeInOut' })
  if (opacityItems.length)
    gsap.to([...opacityItems].reverse(), { duration: 0.8, opacity: 0, stagger: 0.01, ease: 'Power4.out' })
  if (line.value) gsap.to(line.value, { duration: 1, scaleY: 0, ease: 'Power4.easeInOut' })
  if (bg.value) gsap.to(bg.value, { duration: 1, y: '-100%', delay: 0.2, ease: 'Power4.easeInOut' })
  isOpen.value = false
}

// bus handlers (одни и те же ссылки для .off)
const onToggle = () => (isOpen.value ? closeMenu() : openMenu())
const onClose = () => closeMenu()
bus.on('menu-toggle', onToggle)
bus.on('menu-close', onClose)

// ждём когда реально появятся DOM-дети (после прихода данных)
watch(
  () => mainItems.value?.length,
  async (len) => {
    if (!len) return
    await nextTick()
    init()
  },
  { immediate: true }
)

// если нужно закрывать при смене маршрута
watch(() => route.fullPath, () => { if (isOpen.value) bus.emit('menu-close') })

onBeforeUnmount(() => {
  bus.off('menu-toggle', onToggle)
  bus.off('menu-close', onClose)
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
.menu {
  width: 100vw;
  height: calc(var(--rvh, 1vh) * 100);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 998;
  overflow: hidden;
  color: $white;
  .bg {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
    background: $black;
    will-change: transform;
  }
  .top {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .right {
      padding: 90px 0;
      padding-left: 90px;
      position: relative;
      hr {
        width: 1px;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: currentColor;
        margin: 0;
        padding: 0;
        border: none;
        will-change: transform;
        transform-origin: 0% 0%;
      }
      > * {
        &:not(:last-child) {
          margin-bottom: 72px;
        }
      }
    }
    .list {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      h1 {
        color: $olive;
        font-weight: 400;
        font-size: 19px;
        line-height: 1;
        letter-spacing: 0.01em;
        margin: 0;
        margin-bottom: 24px;
      }
      .item {
        @include underline();
        display: inline-block;
        font-family: $font-serif;
        font-weight: 400;
        font-size: 28px;
        line-height: 1;
        &:not(:last-child) {
          margin-bottom: 16px;
        }
      }
    }
    .flex {
      display: flex;
      align-items: center;
    }
    .social {
      display: flex;
      align-items: center;
      margin-right: 23px;
      .socialItem {
        width: 20px;
        height: 20px;
        display: inline-block;
        svg {
          width: 100%;
          height: 100%;
          fill: currentColor;
          transition: transform 1s $curve;
        }
        &:hover {
          svg {
            transform: scale(0.8);
          }
        }
        &:not(:last-child) {
          margin-right: 24px;
        }
      }
    }
    .langs {
      display: flex;
      align-items: center;
      .lang {
        @include underline();
        display: inline-block;
        font-weight: 400;
        font-size: 19px;
        line-height: 1;
        text-transform: uppercase;
        transform: translateY(2px);
        &:not(:last-child) {
          margin-right: 24px;
        }
        &:not(.active) {
          color: rgba($white, 0.45);
        }
      }
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 40px;
    left: var(--container-margin);
    font-size: 16px;
    line-height: 1;
  }
  .mainItems {
    width: calc(100% - 267px);
    max-width: 1200px;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    padding: 20px 0;
    padding-right: 90px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .item {
      position: relative;
      display: inline-flex;
      align-items: flex-end;
      will-change: transform;
      font-family: $font-serif;
      font-size: 120px;
      h1 {
        @include underline();
        font-size: inherit;
        font-weight: 400;
        line-height: 1;
        margin: 0;
        position: relative;
        z-index: 1;
      }
      small {
        font-weight: 400;
        font-size: 0.17em;
        line-height: 1;
        display: inline-block;
        position: relative;
        margin-right: 40px;
        transform: translateY(-20px);
      }
      .image {
        width: 160px;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 0;
        transform: translate(-50%, 0%);
        opacity: 0;
        pointer-events: none;
        will-change: transform;
        transition: transform 1s $curve, opacity 1s $curve;
      }
      &:nth-child(odd) {
        align-self: flex-end;
      }
      &:first-child {
        align-self: center;
      }
      &:not(:last-child) {
        margin-bottom: 40px;
      }
      &:hover {
        h1 {
          &::after {
            transform: scaleY(1);
          }
        }
        .image {
          transform: translate(-50%, -50%) rotate(-5.7deg);
          opacity: 1;
        }
        &:nth-child(odd) {
          .image {
            transform: translate(-50%, -50%) rotate(5.7deg);
          }
        }
      }
    }
  }
  &:not(.isOpen) {
    &,
    * {
      pointer-events: none !important;
    }
  }
  @include respond-to("desktop-extra-large") {
    .top {
      .right {
        padding-top: toVW(90);
        padding-bottom: toVW(90);
        padding-left: toVW(50);
        padding-right: toVW(50);
      }
      .list {
        h1 {
          font-size: toVW(19);
          margin-bottom: toVW(24);
        }
        .item {
          font-size: toVW(28);
          &:not(:last-child) {
            margin-bottom: toVW(16);
          }
        }
      }
      .social {
        .socialItem {
          width: toVW(20);
          height: toVW(20);
        }
      }
      .langs {
        .lang {
          font-size: toVW(19);
        }
      }
    }
    .bottom {
      font-size: toVW(16);
    }
    .mainItems {
      width: calc(100% - toVW(267) - toVW(50 * 2));
      max-width: toVW(1200);
      .item {
        font-size: toVW(120);
        small {
          margin-right: toVW(40);
          transform: translateY(-1em);
        }
        .image {
          width: toVW(160);
        }
      }
    }
  }
  @media (max-height: 1023px) {
    .top {
      .right {
        padding: 50px 0;
        padding-left: 50px;
        > * {
          &:not(:last-child) {
            margin-bottom: 72px * 0.8;
          }
        }
      }
      .list {
        h1 {
          font-size: 14px;
          margin-bottom: 20px;
        }
        .item {
          font-size: 18px;
          &:not(:last-child) {
            margin-bottom: 14px;
          }
        }
      }
      .social {
        margin-right: 18px;
        .socialItem {
          width: 18px;
          height: 18px;
          &:not(:last-child) {
            margin-right: 18px;
          }
        }
      }
      .langs {
        .lang {
          font-size: 16px;
          &:not(:last-child) {
            margin-right: 18px;
          }
        }
      }
    }
    .mainItems {
      width: calc(100% - 180px);
      max-width: 900px;
      padding-right: 50px;
      .item {
        font-size: 120px * 0.8;
        &:not(:last-child) {
          margin-bottom: 40px * 0.8;
        }
      }
    }
    .bottom {
      bottom: 30px;
      font-size: 14px;
    }
  }
  @include respond-to("desktop") {
    .mainItems {
      .item {
        font-size: 80px;
        &:not(:last-child) {
          margin-bottom: 20px;
        }
      }
    }
  }
  @include respond-to("tablet-big") {
    .top {
      .right {
        padding-left: 20px;
      }
    }
    .mainItems {
      padding-right: 20px;
      .item {
        font-size: 62px;
        small {
          margin-right: 20px;
          transform: translateY(-10px);
        }
      }
    }
  }
  @include respond-to("tablet-small") {
    .right {
      display: none;
    }
    .mainItems {
      width: 100%;
      max-width: 450px;
      padding: 0;
      padding-right: 0;
    }
  }
  @include respond-to("mobile-medium") {
    .top {
      align-items: flex-end;
    }
    .mainItems {
      max-width: 380px;
      padding-bottom: 90px;
      .item {
        font-size: 45px;
        small {
          font-size: 0.222222222em;
          margin-right: 12px;
          transform: translateY(-2em);
        }
      }
    }
    .bottom {
      display: none;
    }
  }
  @media (max-width: 580px) and (min-height: 650px) {
    .top {
      .right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        text-align: right;
        position: absolute;
        top: 75px;
        left: auto;
        right: var(--container-margin);
        padding: 0;
        border-left: none;
        hr {
          display: none;
        }
        .list {
          align-items: flex-end;
          h1 {
            margin-bottom: 8px;
            font-size: 12px;
          }
          .item {
            margin-bottom: 6px;
            font-size: 14px;
          }
        }
        .social {
          margin-right: 11px;
          .socialItem {
            width: 14px;
            height: 14px;
            &:not(:last-child) {
              margin-right: 11px;
            }
          }
        }
        .langs {
          transform: translateY(-2px);
          .lang {
            font-size: 13px;
            &:not(:last-child) {
              margin-right: 11px;
            }
          }
        }
        & > * {
          &:not(:last-child) {
            margin-bottom: 13px;
          }
        }
      }
    }
    .mainItems {
      padding-bottom: 30px;
    }
  }
}
</style>
