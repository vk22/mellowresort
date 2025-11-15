<template>
  <div
    ref="el"
    :class="[
      $style.customCursor,
      state.show && $style.show,
      state.showText && $style.showText,
      state.showTextLarge && $style.showTextLarge,
      state.showPointer && $style.showPointer,
      state.pressed && $style.pressed,
    ]"
  >
    <svg ref="bg" :class="$style.bg" viewBox="0 0 48 48">
      <circle ref="circle" :class="$style.circle" cx="24" cy="24" r="24" />
    </svg>
    <span ref="textEl" :class="$style.text">{{ state.text }}</span>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import gsap from 'gsap'
import Util from '~/utils/util'
import { cursorBus } from '~/composables/useCursorBus'
import { useAppBus } from '~/composables/useAppBus'
const bus = useAppBus()

const el = ref(null)
const bg = ref(null)
const circle = ref(null)
const textEl = ref(null)

const state = reactive({
  text: 'Unmute',
  mediaState: 'play',
  show: true,
  showLoop: false,
  showPointer: false,
  showText: false,
  showTextLarge: false,
  showMedia: false,
  pressed: false,
  scale: { t: 1, c: 1 },
  scaleClick: { t: 1, c: 1 },
  delta: { t: 0, c: 0 },
  bg: 'black',
  textColor: 'black',
  position: { s: [0, 0], c: [0, 0], t: [-100, -100] }
})

let animationLoop = null

function mousePress() {
  state.pressed = true
  state.scaleClick.t = 1.2
}

function mouseUp() {
  state.pressed = false
  state.scaleClick.t = 1
}

function mouseHandler(e) {
  const x = e.clientX
  const y = e.clientY

  state.delta.t = Math.hypot(x - state.position.s[0], y - state.position.s[1])
  state.position.t = [x, y]
  state.position.s = [x, y]

  updateCursor(e.target)
}

function updateCursor(target) {
  const hasText = target.closest('[data-cursor-text], [data-cursor-text-large]')
  const hasMedia = target.closest('[data-cursor-media]')
  const hasPointer = target.closest('[data-cursor-pointer]')
  const hide = target.closest('[data-cursor-hide]')

  state.showLoop = false
  state.showPointer = !!hasPointer
  state.showMedia = !!hasMedia
  state.showText = !!hasText
  state.showTextLarge = hasText?.hasAttribute('data-cursor-text-large')

  if (hasText) state.text = hasText.getAttribute('data-cursor-text') || hasText.innerText
  if (hide) state.show = false
  else state.show = true
}

function move() {
  state.position.c[0] += (state.position.t[0] - state.position.c[0]) * 0.15
  state.position.c[1] += (state.position.t[1] - state.position.c[1]) * 0.15

  const x = state.position.c[0] - el.value.clientWidth * 0.5
  const y = state.position.c[1] - el.value.clientHeight * 0.5

  el.value.style.transform = `translate(${x}px, ${y}px) scale(${state.scale.c * state.scaleClick.c})`

  requestAnimationFrame(move)
}

onMounted(() => {
  if (window.innerWidth < 970) return

  window.addEventListener('mousemove', mouseHandler)
  window.addEventListener('mousedown', mousePress)
  window.addEventListener('mouseup', mouseUp)

  cursorBus.on((event, payload) => {
    if (event === 'hide') state.show = false
  })

  // bus.on('footer-hide', () => {
  //   isHidden.value = true
  // })

  requestAnimationFrame(move)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', mouseHandler)
  window.removeEventListener('mousedown', mousePress)
  window.removeEventListener('mouseup', mouseUp)
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

.customCursor {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999998;
  pointer-events: none;
  mix-blend-mode: difference;
  .circle,
  .border,
  .text,
  .media,
  .arrow {
    transition: transform 1s $curve, opacity 1s $curve, fill 0.4s $curve,
      stroke 0.4s $curve, color 0.4s $curve;
  }
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    overflow: visible;
  }
  .circle {
    transform-origin: 50% 50%;
    transform: scale(1);
    opacity: 1;
    fill: currentColor !important;
  }
  .border {
    transform-origin: 50% 50%;
    transform: scale(1);
    opacity: 1;
    fill: none;
    stroke: currentColor;
    stroke-width: 1px;
    opacity: 0.5;
  }
  .text {
    width: 70px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    letter-spacing: 0.1em;
    text-align: center;
    font-size: 10px;
    line-height: 110%;
    white-space: normal;
    text-transform: uppercase;
    will-change: transform;
    transform-origin: 50% 50%;
    color: $black !important;
  }
  .arrow {
    width: 80%;
    top: 47%;
    left: 10%;
    position: absolute;
    fill: currentColor;
  }
  .media {
    width: 100%;
    overflow: visible;
    position: absolute;
    path {
      transition: transform 1s cubic-bezier(0.15, 0.05, 0, 1),
        opacity 1s cubic-bezier(0.15, 0.05, 0, 1);
      transform-origin: 50% 50%;
    }
    .iconPause,
    .iconPlay {
      fill: currentColor;
    }
    .iconPause {
      opacity: 0;
      transform: translateX(20px) scale(0.2);
    }
  }
  &:not(.pause) {
    .media {
      .iconPlay {
        opacity: 0;
        transform: translateX(-20px) scale(0.2);
      }
      .iconPause {
        opacity: 1;
        transform: none;
      }
    }
  }
  &:not(.showText) {
    .text {
      transform: translateX(-50%) translateY(-50%) scale(0.2);
      opacity: 0;
    }
  }
  &:not(.showMedia) {
    .media {
      transform: scale(0.2);
      opacity: 0;
    }
  }
  &:not(.showArrow) {
    .arrow {
      transform: scale(1.2);
      opacity: 0;
    }
  }
  &:not(.showPointer) {
    .circle {
      transform: scale(0.25);
      opacity: 1;
    }
  }
  &.showText {
    // mix-blend-mode: normal;
    .circle {
      transform: scale(1.4);
      opacity: 1;
    }
    .border {
      transform: scale(1.2);
      opacity: 0;
    }
    &.showTextLarge {
      mix-blend-mode: normal;
      .circle {
        transform: scale(1.6);
        fill: $red !important;
      }
    }
  }
  &.showPointer {
    .circle {
      transform: scale(0.5);
      opacity: 1;
    }
  }
  &.pressed {
    .arrow {
      transform: scale(0.8) !important;
    }
  }
  &:not(.show) {
    .circle,
    .text,
    .media,
    .arrow {
      opacity: 0;
      transform: scale(0.1);
    }
    .text {
      transform: translateX(-50%) translateY(-50%) scale(0.1);
    }
  }
  @include theme('dark') {
    color: $white;
  }
  @include theme('light') {
    color: $white;
  }
  @include respond-to('tablet-big') {
    display: none;
  }
  @include is-touch {
    display: none;
  }
}
</style>
