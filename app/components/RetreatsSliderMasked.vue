<template>
  <section
    :class="[$style.retreatsSliderMasked]"
    :data-section-theme="isDark ? 'dark' : undefined"
    data-scroll-section
  >
    <div :class="$style.left">
      <span :class="$style.subtitle" data-fade-in>{{ $prismic.asText(title) }}</span>
      <Title class="h2" :class="$style.title" :text="subtitle" data-fade-in />
      <RichText :class="$style.description" :text="description" data-fade-in-y />
    </div>
    <div ref="slider" :class="$style.slider" data-cursor-text="Drag">
      <div ref="content" :class="$style.content">
        <NuxtLink
          v-for="(item, index) in items"
          :key="index"
          :class="$style.item"
          :to="`/${$route.params.lang}/retreats/${item.uid}/`"
        >
          <ResponsiveImage
            :image="item.image"
            :ratio="700/400"
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
  name: 'RetreatsSliderMasked',
  props: {
    title: VueTypes.array.def([]),
    subtitle: VueTypes.array.def([]),
    description: VueTypes.array.def([]),
    items: VueTypes.array.def([]),
    isDark: VueTypes.bool.def(false),
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
      return this.$route.params.lang === 'es' ? 'Desde' : 'Starting from'
    },
    soonText() {
      return this.$route.params.lang === 'es' ? 'Próximamente' : 'Coming soon'
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
          containerMargin: false
        })
      }
    }
  },
}
</script>

<style lang="scss" module>
.retreatsSliderMasked {
  position: relative;
  padding: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  $width: 35vw;
  .left {
    width: $width;
    padding-left: var(--container-margin);
    padding-bottom: 100px;
    .title {
      max-width: 400px;
    }
    .subtitle {
      display: block;
      margin-bottom: 15px;
    }
    .description {
      max-width: 350px;
      margin-top: 12px;
    }
  }
  
  .slider {
    width: calc(100vw - #{$width});
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
  .item {
    $ratio: 700/400;
    width: calc((100vw - #{$width}) / 2.8);
    display: inline-block;
    vertical-align: top;
    will-change: transform;
    margin-right: 30px;
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
  }
  &[data-section-theme="dark"] {
    background: $black;
    color: $white;
  }
  @include respond-to('tablet') {
    flex-direction: column;
    align-items: flex-start;
    .left {
      padding-bottom: 0;
      margin-bottom: 40px;
      .title {
      }
      .description {
      }
    }
    .slider {
      width: 100%;
      padding-left: var(--container-margin);
    }
    .item {
      width: calc(100vw / 2.8);
    }
  }
  @include respond-to('mobile-medium') {
    .item {
      width: calc(100vw / 1.8);
    }
  }
}
</style>
