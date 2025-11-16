<template>
  <div
    :class="[
      $style.bookButton,
      hoverLeft && $style.hoverLeft,
      hoverRight && $style.hoverRight,
      isOpen && $style.isOpen,
      isDark && $style.isDark,
      isHidden && $style.isHidden,
      isFooter && $style.isFooter,
      isDisabled && $style.isDisabled
    ]"
  >
    <div ref="overlayEl" :class="$style.overlay" @click="close"></div>

    <div v-show="hasInfo" :class="$style.info" :style="{ background: currentColor }" @click="handleInfoClick">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 19">
        <path d="M2.4 18.98c1.36 0 2.72-.9 4-2.4 1.06-1.2 1.9-2.6 2.23-3.77a17.08 17.08 0 0 1-2.45 3.53c-1.21 1.39-2.42 2.03-3.15 2.03-.63 0-.88-.4-.88-.82 0-1.1.73-2.39 2.6-5.06 1.68-2.43 2.78-3.96 2.78-5.46 0-1.1-.8-1.56-1.72-1.56-1.8 0-3.55 1.85-4.03 3.49.92-1.53 2.05-2.6 2.97-2.6.3 0 .44.21.44.5 0 .96-.95 2.31-2.35 4.17C1.08 13.3.17 15.23.17 16.77c0 1.5.88 2.2 2.23 2.2Zm3.89-17c-.11.85.47 1.56 1.35 1.56.96 0 1.76-.75 1.84-1.64A1.38 1.38 0 0 0 8.12.33c-.84 0-1.69.68-1.83 1.64Z" />
      </svg>
    </div>

    <div ref="contentEl" :class="$style.content">
      <div ref="buttonsEl" :class="$style.buttons">
        <div
          ref="leftBtnEl"
          :class="$style.leftButton"
          @click="open"
          data-cursor-pointer
          @mouseenter="hoverLeft = true"
          @mouseleave="hoverLeft = false"
        >
          <MainTitle :class="$style.title" :text="currentTitle" :mask="false" />
        </div>

        <div
          ref="rightBtnEl"
          :class="$style.rightButton"
          data-cursor-pointer
          @mouseenter="hoverRight = true"
          @mouseleave="hoverRight = false"
          @click="book"
        >
          <div :class="$style.rightButtonBG" :style="{ background: currentColor }" />
          <MainTitle :class="$style.buttonText" :text="currentButton" :mask="false" />
        </div>
      </div>

      <div ref="listEl" :class="$style.list">
        <!-- {{ state.listTitle }} -->
        <MainTitle
          ref="listTitle"
          :class="$style.listTitle"
          :text="state.listTitle"
          :mask="false"
          :style="{ background: currentColor }"
        />
        <ul :class="$style.items">
          <li v-for="(item, index) in items" :key="index" @click="handleClick(item)">
            <MainTitle :class="$style.itemTitle" :text="item.item_title" :mask="false" />
          </li>
        </ul>
      </div>

      <div ref="BGs" :class="$style.BGs">
        <div ref="leftBG" :class="$style.left"></div>
        <div ref="rightBG" :class="$style.right" :style="{ background: currentColor }"></div>
      </div>

      <CloseButton :class="$style.close" @click.native="close" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute } from '#app'
import { useI18n } from 'vue-i18n'
import { useAppBus } from '~/composables/useAppBus' // см. снизу

// --------------------- props
const props = defineProps({
  title: { type: Array, default: () => [] },     // ожидается массив richText-блоков
  button: { type: Array, default: () => [] },
  color:  { type: String, default: '#FFBE00' },
  infoClick: { type: Function, default: () => {} },
})

// --------------------- refs к DOM
const overlayEl    = ref(null)
const contentEl  = ref(null)
const buttonsEl  = ref(null)
const leftBtnEl  = ref(null)
const rightBtnEl = ref(null)
const listEl     = ref(null)
const leftBG     = ref(null)
const rightBG    = ref(null)
const listTitle  = ref(null)

// --------------------- локальный стейт
const route = useRoute()
const { locale } = useI18n() 
const bus = useAppBus()

const state = reactive({
  defaultTitle: [],
  defaultButton: [],
  listTitle: [],
  items: [],
  bookLink: {},

  footerHeight: 0,
  isHidden: false,
  isFooter: false,
  isOpen: false,
  isDark: false,
  isDisabled: false,

  leftWidth: 0,
  rightWidth: 0,
  fullWidth: 0,
  contentWidth: 0,
  normalHeight: 0,
  fullHeight: 0,

  hoverLeft: false,
  hoverRight: false,

  infoListeners: [],
  currentColor: props.color,

  domReady: false,
  dataReady: false,
})

//
const toRich = (text) => Array.isArray(text) ? text : (text ? [{ type: 'paragraph', text }] : [])
const currentTitle  = computed(() => (props.title?.[0]?.text ? props.title : state.defaultTitle))
const currentButton = computed(() => (props.button?.[0]?.text ? props.button : state.defaultButton))
const hasInfo       = computed(() => state.infoListeners.length > 0)
const currentColor  = computed(() => state.currentColor)


const { data, success } = await useFetch('/api/menu', {
  method: 'GET',
  query: { lang: locale.value },
  // SSR по умолчанию включён в Nuxt 3, когда useFetch вызывается в setup
})


const mapApi = () => {
  const menu = data.value?.data.data || {}

  console.log('menu ', menu)

  state.defaultTitle  = menu.book_title || ''
  state.defaultButton = menu.book_button || ''
  state.listTitle     = menu.contact_title || ''
  state.items         = (menu.contact_items || []).map(it => ({
    item_title: it?.item_title || '',
    item_link: it?.item_link || {}
  }))
  state.bookLink      = menu.book_button_link || {}
  state.dataReady     = true
}

// --------------------- поведенческая логика
function open() {
  state.isOpen = true
  updatePos()
}

function close() {
  state.isOpen = false
  state.isDisabled = true
  updatePos()
  setTimeout(() => { state.isDisabled = false }, 1000)
}

function handleInfoClick(e) {
  if (!hasInfo.value) return
  e.preventDefault(); e.stopPropagation()
  state.infoListeners.forEach(cb => cb && cb())
}

function book() {
  const link = state.bookLink
  if (link?.url) {
    window.open(link.url, link.target || '_blank')
  }
}

function handleClick(item) {
  const link = item?.item_link
  if (link?.url) window.open(link.url, link.target || '_blank')
}

// --------------------- размеры/позиции
function updatePos() {
  if (!leftBG.value || !rightBG.value || !listEl.value || !contentEl.value || !buttonsEl.value) return

  leftBG.value.style.width  = `${state.isOpen ? state.fullWidth : state.leftWidth}px`
  leftBG.value.style.height = `${state.isOpen ? state.fullHeight : state.normalHeight}px`
  leftBG.value.style.transform = `translateX(${state.isOpen ? (contentEl.value.clientWidth * 0.5 - state.fullWidth * 0.5) : 0}px) translateY(${state.isOpen ? -state.normalHeight : 0}px)`

  rightBG.value.style.width  = `${state.rightWidth}px`
  rightBG.value.style.opacity = `${state.isOpen ? 0 : 1}`
  rightBG.value.style.transform = `translateX(0px) translateY(${state.isOpen ? 100 : 0}px)`
}

function resize() {
  state.footerHeight = document.getElementById('footer')?.offsetHeight || window.innerHeight + 100
  console.log('overlayEl ', overlayEl.value)
  console.log('buttonsEl ', buttonsEl.value)
  console.log('leftBtnEl ', leftBtnEl.value)
  console.log('rightBtnEl ', rightBtnEl.value)
  console.log('listEl ', listEl.value)
  console.log('contentEl ', contentEl.value)

  if (!buttonsEl.value || !leftBtnEl.value || !rightBtnEl.value || !listEl.value || !contentEl.value) return

  state.normalHeight = buttonsEl.value.offsetHeight

  if (leftBG.value)  leftBG.value.style.height  = `${state.normalHeight}px`
  if (rightBG.value) rightBG.value.style.height = `${state.normalHeight}px`

  if (listTitle.value?.$el) listTitle.value.$el.style.height = `${state.normalHeight}px`

  state.leftWidth   = leftBtnEl.value.clientWidth + 30
  state.rightWidth  = rightBtnEl.value.clientWidth
  state.fullWidth   = listEl.value.clientWidth
  state.contentWidth = contentEl.value.clientWidth
  state.fullHeight  = listEl.value.offsetHeight

  const root = (contentEl.value || document.documentElement)
  root.style.setProperty('--left-width', `${state.leftWidth}px`)
  root.style.setProperty('--right-width', `${state.rightWidth}px`)
  root.style.setProperty('--full-width', `${state.fullWidth}px`)
  root.style.setProperty('--full-height', `${state.fullHeight}px`)
  root.style.setProperty('--content-width', `${state.contentWidth}px`)

  // фиксация overlay top/left (как в старой версии)
  
  if (overlayEl.value) {
    let top  = Number((overlayEl.value.style.top || '').replace('px', '')) || 0
    let left = Number((overlayEl.value.style.left || '').replace('px', '')) || 0
    top  = top  - overlayEl.value.getBoundingClientRect().top
    left = left - overlayEl.value.getBoundingClientRect().left
    overlayEl.value.style.top  = `${top}px`
    overlayEl.value.style.left = `${left}px`
  }
}

// --------------------- скролл-футер (сигнал приходит извне)
function onScrollPos({ pos, max }) {
  state.isFooter = pos > max - state.footerHeight
}

// --------------------- события (замена this.$nuxt.$on/$emit)
function bindBus() {
  bus.on('book-button-hide', () => { state.isHidden = true })
  bus.on('book-button-show', (color) => { state.currentColor = color || '#FFBE00'; state.isHidden = false })
  bus.on('book-button-dark', () => { state.isDark = true })

  bus.on('book-button-add-info-listener', (cb) => {
    state.infoListeners.push(cb)
  })
  bus.on('book-button-remove-info-listener', (cb) => {
    const i = state.infoListeners.indexOf(cb)
    if (i > -1) state.infoListeners.splice(i, 1)
  })

  // чтобы получить скролл-данные из layout (где управляется кастомный ScrollCtrl)
  bus.on('book-button-scroll', onScrollPos)
}

function unbindBus() {
  bus.off('book-button-hide')
  bus.off('book-button-show')
  bus.off('book-button-dark')
  bus.off('book-button-add-info-listener')
  bus.off('book-button-remove-info-listener')
  bus.off('book-button-scroll')
}

// --------------------- реактивность
watch(() => route.fullPath, () => {
  state.isOpen = false
  state.isDark = false
})

onMounted(async () => {
  state.domReady = true
  mapApi()
  await nextTick()
  resize()
  updatePos()
  bindBus()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  unbindBus()
  window.removeEventListener('resize', resize)
})

// --------------------- экспонируем в template
const isOpen      = computed(() => state.isOpen)
const isDark      = computed(() => state.isDark)
const isHidden    = computed(() => state.isHidden)
const isFooter    = computed(() => state.isFooter)
const isDisabled  = computed(() => state.isDisabled)
const hoverLeft   = computed(() => state.hoverLeft)
const hoverRight  = computed(() => state.hoverRight)
const listTitleRT = computed(() => state.listTitle)
const items       = computed(() => state.items)

function handleMouseLeft(v)  { state.hoverLeft = v }
function handleMouseRight(v) { state.hoverRight = v }

</script>

<style lang="scss" module>
@use "sass:math";
@use "sass:map";
@use "sass:meta";
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.bookButton {
  height: 58px;
  display: flex;
  align-items: center;
  pointer-events: all;
  position: fixed;
  left: 50%;
  bottom: 40px;
  z-index: 9;
  transform: translateX(-50%);
  
  transition: transform 1s $curve, opacity 1s $curve, clip-path 1s $curve;
  .overlay {
    width: 100vw;
    height: 100lvh;
    position: fixed;
    top: auto !important;
    bottom: -40px;
    left: 0;
    background: rgba(0,0,0,0.4);
    transition: opacity 1s $curve;
  }
  .info {
    width: 58px;
    height: 100%;
    display: none !important;
    align-items: center;
    justify-content: center;
    margin-right: 14px;
    box-shadow: 3px 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    cursor: pointer;
    transition: width 1s $curve, transform 1s $curve, opacity 1s $curve;
    svg {
      height: 19px;
      fill: currentColor;
    }
    &:hover {
      width: 70px;
    }
  }
  .content {
    height: 100%;
    position: relative;
    transition: transform 1s $curve, opacity 1s $curve;
  }
  .BGs {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 0;
    pointer-events: none;
    display: none;
    .left, .right {
      position: absolute;
      bottom: 0;
      box-shadow: 3px 4px 10px rgba(0, 0, 0, 0.2);
      border-radius: 16px;
      transition: height 1s $curve, width 1s $curve, transform 1s $curve, opacity 1s $curve;
    }
    .left {
      background: $white;
    }
    .right {
      right: 0;
    }
  }
  .close {
    width: 50px;
    height: 50px;
    position: absolute;
    left: 50%;
    bottom: -15px;
    z-index: 2;
    transform: translateX(-50%) scale(1);
    transition: opacity 1s $curve 0.2s, transform 1s $curve 0.2s;
  }
  .buttons {
    height: 100%;
    display: flex;
    align-items: center;

    border-radius: 16px;
    font-weight: 400;
    font-size: 18px;
    line-height: 1;
    letter-spacing: -0.02em;
    white-space: nowrap;
    position: relative;
    z-index: 1;
    background: $white;
    box-shadow: 3px 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    overflow: hidden;
    transition: transform 1s $curve 0.4s;
    .title, .buttonText {
      font-weight: inherit;
    }
    .leftButton, .rightButton {
      height: 100%;
      display: inline-flex;
      align-items: center;
      padding: 0 20px;
      transition: transform 1s $curve, opacity 1s $curve;
      .title {
        transition: transform 1s $curve, opacity 1s $curve;
      }
    }
    .rightButton {
      position: relative;
      will-change: transform;
      .rightButtonBG {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 16px;
        box-shadow: 3px 4px 10px rgba(0, 0, 0, 0.2);
        will-change: transform;
        transition: transform 1s $curve;
      }
    }
  }
  .list {
    width: 90vw;
    max-width: 290px;
    position: absolute;
    left: 50%;
    bottom: 100%;
    z-index: 1;
    text-align: center;
    transform: translateX(-50%);
    background: $white;
    border-radius: 16px;
    transform-origin: 50% 100%;
    transition: transform 0.8s cubic-bezier(0, 1.46, 0.43, 0.97) 0.2s, opacity 0.8s cubic-bezier(0, 1.46, 0.43, 0.97) 0.2s;
    .listTitle {
      font-size: 20.535px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: 16px;
      transition-delay: #{(5 + 1) * 0.05}s;
      z-index: 1;
      position: relative;
    }
    ul {
      padding: 0;
      margin: 0;
      font-size: 14px;
    }
    li {
      list-style: none;
      padding: 12px;
      cursor: pointer;
      position: relative;
      z-index: 0;
      &::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        background: white;
        transition: opacity 1s $curve;
      }
      &:hover {
        &::before {
          opacity: 1;
        }
      }
      &:first-child {
        &::before {
          height: calc(100% + 16px);
          top: -16px;
        }
      }
      &:last-child::before {
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
      }
      &:not(:last-child) {
        border-bottom: 1px solid rgba(20, 19, 20, 0.40);
      }
      @for $i from 1 through 4 {
        &:nth-last-child(#{$i}) {
          transition-delay: #{($i + 1) * 0.05}s;
        }
      }
    }
    .listTitle, li {
      transition: transform 1s $curve, opacity 1s $curve;
    }
  }
  &.isDark {
    .rightButton, .listTitle {
      color: $white;
    }
  }
  &.isHidden {
    &, * {
      pointer-events: none !important;
    }
    .content, .info {
      transform: translateY(110px);
      opacity: 0;
    }
  }
  &.isFooter {
    &, * {
      pointer-events: none !important;
    }
    .content, .info {
      transform: translateY(110px);
      opacity: 0;
    }
  }
  &:not(.isOpen) {
    .overlay {
      opacity: 0;
      pointer-events: none;
    }
    .list {
      transition: transform 0.2s cubic-bezier(0, 0.88, 1, 0.99), opacity 0.2s cubic-bezier(0, 0.88, 1, 0.99);
      transform: translateX(-50%) scaleY(0);
      opacity: 0;
      &, * {
        pointer-events: none !important;
      }
      .listTitle, li {
        opacity: 0;
        transition-delay: 0s;
      }
    }
    .close {
      transform: translateX(-50%) scale(0.2);
      opacity: 0;
      pointer-events: none !important;
      transition-delay: 0s;
    }
    @include not-touch {
      &.hoverLeft {
        .rightButton {
          transform: translateX(10px) !important;
          transition-delay: 0s;
          pointer-events: none;
        }
        .leftButton .title {
          transform: translateX(5px);
        }
      }
      &.hoverRight {
        .rightButton {
          transform: translateX(-2%);
          .rightButtonBG {
            transform: scaleX(1.1) !important;
          }
        }
      }
    }
  }
  &.isOpen {
    .buttons {
      transform: translateY(200%);
      pointer-events: none !important;
      transition-delay: 0s;
    }
    .info {
      opacity: 0.2;
      pointer-events: none !important;
    }
    .list {
      opacity: 1;
      .listTitle, li {
      }
    }
  }
  &.isDisabled {
    &, * {
      pointer-events: none !important;
    }
  }
  @include respond-to('desktop-extra-large') {
    height: toVW(58);
    .info {
      width: toVW(58);
      margin-right: toVW(14);
      border-radius: toVW(16);
      svg {
        height: toVW(19);
      }
      &:hover {
        width: toVW(70);
      }
    }
    .close {
      width: toVW(50);
      height: toVW(50);
    }
    .list {
      max-width: toVW(290);
      .listTitle {
        font-size: toVW(20.535);
      }
      ul {
        font-size: toVW(14);
      }
    }
    .content {
      .BGs {
        .left, .right {
          border-radius: toVW(16);
        }
      }
      .buttons {
        border-radius: toVW(16);
      }
      .list {
        border-radius: toVW(16);
        li {
          &:last-child {
            &::before {
              border-bottom-left-radius: toVW(16);
              border-bottom-right-radius: toVW(16);
            }
          }
        }
      }
      .leftButton, .rightButton {
        padding: 0 toVW(20);
      }
      .rightButton {
        .rightButtonBG {
          border-radius: toVW(16);
        }
      }
    }
    .buttons {
      font-size: toVW(18);
    }
  }
  @include respond-to('desktop') {
    height: 52px;
    .content {
      font-size: 15px;
    }
  }
  @include respond-to('mobile-medium') {
    bottom: 30px;
    .overlay {
      bottom: -30px;
    }
    .close {
      bottom: -13px;
    }
  }
}
</style>