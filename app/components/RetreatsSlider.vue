<template>
  <section
    :class="[$style.retreatsSlider]"
    data-scroll-section
  >
    <div class="container">
      <Title class="h2" :class="$style.title" :text="title" data-fade-in />
    </div>
    <div ref="slider" :class="$style.slider" data-cursor-text="Drag">
      <div ref="content" :class="$style.content">
        <NuxtLink
          v-for="(item, index) in items"
          :key="index"
          :class="$style.item"
          :to="`/${lang}/retreats/${item.uid}/`"
        >
          <ResponsiveImage
            :image="item.image"
            :ratio="524/300"
            :class="$style.itemImage"
          />
          <div :class="$style.itemContent">
            <h1>{{ item.title }}</h1>
            <h2 v-show="item.soon">{{soonText}}</h2>
            <span :class="$style.itemPrice">{{priceText}} <strong>{{item.price}}</strong></span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script>
import VueTypes from 'vue-types'
import Slider from '../assets/js/components/slider'

export default {
  name: 'RetreatsSlider',
  props: {
    title: VueTypes.array.def([]),
    items: VueTypes.array.def([]),
  },
  watch: {
    items() {
      this.$nextTick(() => {
        this.initSlider();
      })
    }
  },
  computed: {
    priceText() {
      return this.lang === 'es' ? 'Desde' : 'Starting from'
    },
    soonText() {
      return this.lang === 'es' ? 'Próximamente' : 'Coming soon'
    },
    lang() {
      return this.$route.params.lang || 'en'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initSlider();
    })
  },
  methods: {
    initSlider() {
      if(!this.slider && this.items.length > 0) {
        this.slider = new Slider({
          el: this.$refs.slider,
          content: this.$refs.content,
          startOnMiddle: true
        })
      }
    }
  },
}
</script>

<style lang="scss" module>
.retreatsSlider {
  position: relative;
  margin: 240px 0;
  .title {
    max-width: 460px;
    margin: 0 auto;
    margin-bottom: 42px;
    text-align: center;
  }
  .slider {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    cursor: grab;
    pointer-events: all;
  }
  .content {
    width: auto;
    display: inline-block;
    white-space: nowrap;
  }
  $width: '100vw / 4.8';
  .item {
    $ratio: 524/300;
    width: calc(#{$width});
    display: inline-block;
    vertical-align: top;
    will-change: transform;
    margin-right: 23px;
    color: $white;
    text-align: center;
    .itemContent {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      padding: 60px 30px;
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
      margin-bottom: 25px;
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
    &:nth-child(odd) {
      margin-top: 50px;
    }
  }
  @include respond-to('tablet') {
    margin: 120px 0;
    $width: '100vw / 3.8';
    .item {
      width: calc(#{$width});
    }
  }
  @include respond-to('mobile-medium') {
    margin: 100px 0;
    $width: '100vw / 1.8';
    .item {
      width: calc(#{$width});
      margin-right: 10px;
      &:nth-child(odd) {
        margin-top: 30px;
      }
    }
  }
}
</style>
