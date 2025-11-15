<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import Slider from '~/assets/js/components/slider'
import { useRoute } from 'vue-router'
import { useAppBus } from '~/composables/useAppBus'

const props = defineProps({
  introTitle: { type: Array, default: () => [] },
  introDescription: { type: Array, default: () => [] },
  chooseTitle: { type: Array, default: () => [] },
  chooseDescription: { type: Array, default: () => [] },
  specialRetreatTitle: { type: Array, default: () => [] },
  thanksTitle: { type: Array, default: () => [] },
  thanksDescription: { type: Array, default: () => [] },
  adventures: { type: Array, default: () => [] },
  specialRetreats: { type: Array, default: () => [] },
  stayForm: { type: Object, default: () => ({}) },
  standardRetreatForm: { type: Object, default: () => ({}) },
  specialRetreatForm: { type: Object, default: () => ({}) },
})

const route = useRoute()
const bus = useAppBus()

const isOpen = ref(false)
const currentStep = ref('intro')
const currentRetreat = ref(null)
const isMobile = ref(false)

const specialRetreatsSlider = ref(null)
const specialRetreatsContent = ref(null)

const priceText = computed(() =>
  route.params.lang === 'es' ? 'Desde' : 'Starting from'
)
const soonText = computed(() =>
  route.params.lang === 'es' ? 'Próximamente' : 'Coming soon'
)

const canBack = computed(() =>
  !['intro', 'thanks', 'adventures'].includes(currentStep.value)
)

function resize() {
  if (process.client) {
    isMobile.value = window.innerWidth <= 740
  }
}

function open() {
  isOpen.value = true
  currentStep.value = 'adventures'
}
function close() {
  isOpen.value = false
  currentStep.value = 'adventures'
}

function gotoAdventure(link) {
  switch (link.type) {
    case 'our_place':
      currentStep.value = 'formStay'
      break
    case 'standard_retreat':
      currentStep.value = 'formStandardRetreat'
      break
    case 'special_retreat_overview':
      currentStep.value = 'specialRetreats'
      break
  }
}

function back() {
  switch (currentStep.value) {
    case 'adventures':
      currentStep.value = 'intro'
      break
    case 'formStay':
    case 'formStandardRetreat':
      currentStep.value = 'adventures'
      break
    case 'specialRetreats':
      currentStep.value = 'adventures'
      currentRetreat.value = null
      break
    case 'thanks':
      currentStep.value = 'specialRetreats'
      break
  }
  document.querySelectorAll('.step').forEach(step => step.scrollTop = 0)
}

function selectRetreat(item) {
  currentRetreat.value = item
  currentStep.value = 'formSpecialRetreat'
}

function initSpecialRetreatsSlider() {
  if (!specialRetreatsSlider.value || props.specialRetreats.length === 0) return
  new Slider({
    el: specialRetreatsSlider.value,
    content: specialRetreatsContent.value,
    containerMargin: false,
  })
}

watch(() => props.specialRetreats, () => nextTick(initSpecialRetreatsSlider))

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)

  bus.on('booking-open', open)
  bus.on('booking-close', close)

  nextTick(initSpecialRetreatsSlider)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  bus.off('booking-open', open)
  bus.off('booking-close', close)
})
</script>

<template>
  <div :class="[$style.bookingPopup, isOpen && $style.isOpen]" data-scroll-native>
    <div :class="$style.bg" />
    <div ref="card" :class="$style.card">
      <CloseButton :class="$style.close" @click="close" />

      <div :class="$style.steps">
        <!-- INTRO -->
        <div :class="[$style.step, $style.intro, currentStep === 'intro' && $style.active]">
          <Title class="h2" :class="$style.title" :text="introTitle" />
          <RichText :class="$style.description" :text="introDescription" />
        </div>

        <!-- ADVENTURES -->
        <div :class="[$style.step, $style.adventures, currentStep === 'adventures' && $style.active]">
          <Title class="h2" :class="$style.title" :text="chooseTitle" />
          <RichText :class="$style.description" :text="chooseDescription" />

          <div :class="$style.content">
            <div
              v-for="(adventure, index) in adventures"
              :key="index"
              :class="$style.adventure"
              @click="gotoAdventure(adventure.item_link)"
              data-cursor-pointer
            >
              <ResponsiveImage :class="$style.adventureImage" :image="adventure.item_image" :ratio="isMobile ? 180/315 : 500/380" />
              <div :class="$style.adventureContent">
                <h2>{{ adventure.item_title?.[0]?.text }}</h2>
                <hr />
                <RichText :class="$style.description" :text="adventure.item_description" />
              </div>
            </div>
          </div>
        </div>

        <!-- SPECIAL RETREATS (Slider) -->
        <div :class="[$style.step, $style.specialRetreats, currentStep === 'specialRetreats' && $style.active]">
          <div :class="$style.top">
            <Title class="h2" :class="$style.title" :text="specialRetreatTitle" />
          </div>

          <div ref="specialRetreatsSlider" :class="$style.slider" data-cursor-text="Drag">
            <div ref="specialRetreatsContent" :class="$style.content">
              <div
                v-for="(item, index) in specialRetreats"
                :key="index"
                :class="$style.item"
                @click="selectRetreat(item)"
              >
                <ResponsiveImage :image="item.image" :ratio="700/400" :class="$style.itemImage" />
                <div :class="$style.itemContent">
                  <h1>{{ item.title }}</h1>
                  <h2 v-if="item.soon">{{ soonText }}</h2>
                  <span :class="$style.itemPrice">{{ priceText }} <strong>{{ item.price }}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- FORMS -->
        <!-- <div :class="[$style.step, $style.formStep, currentStep === 'formStay' && $style.active]">
          <BookingForm :content="stayForm.primary" :items="stayForm.items" type="formStay" />
        </div>

        <div :class="[$style.step, $style.formStep, currentStep === 'formStandardRetreat' && $style.active]">
          <BookingForm :content="standardRetreatForm.primary" :items="standardRetreatForm.items" type="formStandardRetreat" />
        </div>

        <div :class="[$style.step, $style.formStep, currentStep === 'formSpecialRetreat' && $style.active]">
          <BookingForm :content="specialRetreatForm.primary" :items="specialRetreatForm.items" :retreat="currentRetreat" type="formSpecialRetreat" />
        </div> -->

        <!-- THANKS -->
        <div :class="[$style.step, $style.thanks, currentStep === 'thanks' && $style.active]">
          <Title class="h2" :class="$style.title" :text="thanksTitle" />
          <RichText :class="$style.description" :text="thanksDescription" />
        </div>
      </div>

      <div :class="[$style.footer, canBack && $style.show]">
        <ArrowButton :class="$style.back" @click="back" />
      </div>
    </div>
  </div>
</template>


<style lang="scss" module>
@use "sass:math";
@use "sass:map";
@use "sass:meta";
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.bookingPopup {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999998;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  $card-width: #{Min(70vw, 1060px)};
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
    top: 45px;
    right: 120px;
    z-index: 2;
    transition: opacity 1s $curve;
  }
  .footer {
    width: 100%;
    height: 240px;
    padding-left: 125px;
    padding-bottom: 45px;
    display: flex;
    align-items: flex-end;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 8;
    pointer-events: none;
    background: linear-gradient(180deg, rgba($black, 0) 0%, rgba($black, 1) 80%);
    transition: opacity 1s $curve, transform 1s $curve;
    &:not(.show) {
      opacity: 0;
      transform: translateY(100%);
      &, * {
        pointer-events: none;
      }
    }
  }
  .back {
    pointer-events: all;
  }
  .card {
    width: $card-width;
    height: calc(var(--rvh, 1vh) * 100);
    box-sizing: border-box;
    background: $black;
    color: $white;
    position: relative;
    z-index: 1;
    transition: opacity 1s $curve, transform 1s $curve;
  }
  .steps {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .step {
    width: 100%;
    height: 100%;
    min-height: 100%;
    scroll-behavior: smooth;
    overflow-y: auto;
    padding: 125px;
    box-sizing: border-box;
    position: absolute;
    right: 0;
    top: 0;
    transition: opacity 0.5s ease-in-out 0.3s, transform 1s ease-in-out 0.3s;
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
    .description {
      max-width: 650px;
    }
    &:not(.active) {
      opacity: 0;
      transition-delay: 0s;
      &, * {
        pointer-events: none !important;
      }
    }
  }
  .intro, .thanks {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title, .description {
      transition: transform 1.5s $curve 0.5s, opacity 1.5s $curve 0.5s;
      will-change: transform, opacity;
    }
    .description {
      max-width: 300px;
      margin-top: 35px;
      transition-delay: 1.1s;
    }
  }
  .adventures {
    .description {
      margin-top: 35px;
    }
    .content {
      width: 100%;
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 120px;
    }
    .adventure {
      width: 32%;
      position: relative;
      color: white;
      overflow: hidden;
      transition: opacity 1.5s cubic-bezier(0, 0.25, 0, 1), transform 1.5s cubic-bezier(0, 0.25, 0, 1);
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
        padding: 22px;
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
        font-size: 14px;
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
        margin-top: 40px;
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
      @for $i from 1 through 10 {
        &:nth-child(#{$i}) {
          transition-delay: 0.4 + 0.05s * $i;
        }
      }
    }
    &:not(.active) {
      .adventure {
        opacity: 0;
        transform: translateY(200px);
      }
    }
  }
  .specialRetreats {
    padding-left: 0;
    padding-right: 0;
    .top {
      padding: 0 125px;
    }
    .slider {
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      cursor: grab;
      pointer-events: all;
      margin-top: 120px;
    }
    .content {
      width: auto;
      display: inline-block;
      white-space: nowrap;
    }
    .item {
      $ratio: 700/400;
      width: calc(#{$card-width} / 4.6);
      display: inline-block;
      vertical-align: top;
      will-change: transform;
      margin-right: 17px;
      color: $white;
      text-align: center;
      .itemContent {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box;
        padding: 37px 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
      }
      h1 {
        display: none;
      }
      h2 {
        font-weight: 700;
        font-size: 16px;
        line-height: 1.2;
        letter-spacing: -0.01em;
        margin: 0;
        margin-bottom: 10px;
      }
      .itemPrice {
        font-size: 14px;
        line-height: 1.5;
        letter-spacing: 0.01em;
        strong {
          font-family: $font-serif;
          font-weight: inherit;
        }
      }
      &:first-child {
        margin-left: 125px;
      }
      &:last-child {
        margin-right: 125px;
      }
    }
  }
  .formStep {
    .description {
      margin-top: 35px;
    }
    .content {
      width: 100%;
      padding-top: 40px;
      padding-bottom: 60px;
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
    .intro {
      .title, .description {
        transform: translateY(100px);
        opacity: 0;
      }
    }
  }
  @include respond-to('desktop') {
    $card-width: 100vw;
    .close {
      right: 70px;
    }
    .card {
      width: $card-width;
    }
    .step {
      padding: 70px;
    }
    .specialRetreats {
      padding-left: 0;
      padding-right: 0;
      .top {
        padding: 0 70px;
      }
      .slider {
        margin-top: 70px;
      }
      .item {
        width: calc(#{$card-width} / 3.6);
        .itemContent {
          padding: 24px;
        }
        &:first-child {
          margin-left: 70px;
        }
        &:last-child {
          margin-right: 70px;
        }
      }
    }
    .footer {
      height: 150px;
      padding-left: 70px;
    }
  }
  @include respond-to('tablet-small') {
    .adventures {
      .content {
        display: block;
      }
      .adventure {
        width: 100%;
        &:not(:first-child) {
          margin-top: 20px;
        }
      }
    }
    .specialRetreats {
      .item {
        width: calc(#{$card-width} / 3.2);
      }
    }
  }
  @include respond-to('mobile-medium') {
    .close {
      right: 30px;
      top: 26px;
    }
    .step {
      padding: 30px;
      padding-top: 90px;
      padding-bottom: 70px;
    }
    .adventures {
      .description {
        margin-top: 8px;
      }
      .content {
        margin-top: 40px;
      }
    }
    .specialRetreats {
      padding-left: 0;
      padding-right: 0;
      .top {
        padding: 0 30px;
      }
      .slider {
        margin-top: 30px;
      }
      .item {
        width: calc(#{$card-width} / 2.5);
        &:first-child {
          margin-left: 30px;
        }
        &:last-child {
          margin-right: 30px;
        }
      }
    }
    .footer {
      height: 100px;
      padding-left: 30px;
      padding-bottom: 30px;
    }
  }
  @include respond-to('mobile') {
    .specialRetreats {
      .item {
        width: calc(#{$card-width} / 1.8);
      }
    }
  }
}
</style>
