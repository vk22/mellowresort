<template>
  <div :class="[$style.retreatPopup, isOpen && $style.isOpen]" data-scroll-native>
    <div :class="$style.bg" />
    <div ref="card" :class="$style.card" :style="{background: color}">
      <CloseButton :class="$style.close" @click.native="close" />
      <RichText :class="$style.content" :text="content" :margin="false" />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useEventBus } from '@vueuse/core'

const props = defineProps({
  color: {
    type: String,
    default: '#A2BBC0'
  }
})

const isOpen = ref(false)
const content = ref([])

// event bus
const bus = useEventBus('retreat-popup')

const open = (data) => {
  content.value = data.content
  nextTick(() => {
    isOpen.value = true
  })
}

const close = () => {
  isOpen.value = false
}

onMounted(() => {
  bus.on((event, data) => {
    if (event === 'open') open(data)
    if (event === 'close') close()
  })
})

onBeforeUnmount(() => {
  bus.reset()
})
</script>

<style lang="scss" module>

@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.retreatPopup {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999999;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  .bg {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    background: rgba(0, 0, 0, 0.5);
    transition: opacity 1s $curve;
  }
  .close {
    position: absolute;
    top: 66px;
    right: 70px;
    z-index: 2;
    transition: opacity 1s $curve;
  }
  .card {
    width: 95%;
    max-width: 740px;
    height: auto;
    max-height: calc(var(--vh, 1vh) * 100);
    overflow-y: auto;
    padding: 125px 70px;
    box-sizing: border-box;
    color: $white;
    position: relative;
    z-index: 1;
    transition: opacity 1s $curve, transform 1.2s $curve;
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba($white, 0.4);
    }
    &::-webkit-scrollbar-thumb:hover {
      background: rgba($white, 0.6);
    }
  }
  .content {
    h1, h2 {
      font-family: $font-serif;
      line-height: 1.2;
      margin: 0;
      strong, b {
        font-weight: inherit;
        font-family: $font-sans;
      }
    }
    h1 {
      font-size: 51px;
    }
    h2 {
      font-size: 21px;
    }
    h6 {
      color: transparent;
      width: 100%;
      max-width: 300px;
      height: 1px;
      margin: 2em 0 !important;
      background: $white;
    }
    p {
      & > em {
        font-family: $font-serif;
        font-size: 21px;
        font-style: normal;
      }
    }
  }
  @include respond-to('desktop-extra-large') {
    .card {
      max-width: toVW(740);
      padding: toVW(125) toVW(70);
    }
    .content {
      h1 {
        font-size: toVW(51);
      }
      h2 {
        font-size: toVW(21);
      }
      h6 {
        max-width: toVW(300);
      }
      p {
        & > em {
          font-size: toVW(21);
        }
      }
    }
  }
  &:not(.isOpen) {
    &, * {
      pointer-events: none;
    }
    .bg, .close, .card {
      opacity: 0;
    }
    .card {
      transform: translateX(100%);
    }
  }
  @include respond-to('desktop') {
    .close {
      top: 40px;
      right: 40px;
    }
    .card {
      padding: 60px 40px;
    }
    .content {
      h1 {
        font-size: 40px;
      }
      h2 {
        font-size: 18px;
      }
      h6 {
        max-width: 200px;
      }
      p {
        & > em {
          font-size: 18px;
        }
      }
    }
  }
  @include respond-to('mobile-medium') {
    .close {
      top: 20px;
      right: 20px;
    }
    .card {
      padding: 60px 30px;
    }
    .content {
      h1 {
        font-size: 38px;
      }
      h2 {
        font-size: 16px;
      }
      h6 {
        max-width: 200px;
      }
      p {
        & > em {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
