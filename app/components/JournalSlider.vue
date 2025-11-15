<template>
  <section
    :class="[$style.journalSlider]"
  >
    <div
      ref="mask"
      :class="$style.mask"
      :data-cursor-text="canDrag ? 'Drag' : undefined"
    >
      <div ref="content" :class="$style.content">
        <NuxtLink
          v-for="(item, itemIndex) in items"
          :key="itemIndex"
          :class="$style.item"
          :to="`/${$route.params.lang}/journal/${item.uid}/`"
        >
          <div :class="$style.imageContainer">
            <ResponsiveImage :class="$style.image" :image="item.cover" :ratio="350/400" />
          </div>
          <Title class="h3" :class="$style.title" :text="item.title" />
          <RichText :class="$style.description" :text="item.description" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script>
import VueTypes from 'vue-types'
import Slider from '../assets/js/components/slider'

export default {
  name: 'JournalSlider',
  props: {
    title: VueTypes.array.def([]),
    items: VueTypes.array.def([]),
  },
  data() {
    return {
      canDrag: true,
    }
  },
  watch: {
    items() {
      this.$nextTick(() => {
        if (this.slider) this.slider.updateSections()
        this.resize()
      })
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.resize()
      window.addEventListener('resize', this.resize)
      this.$nextTick(() => {
        setTimeout(() => {
          this.slider = new Slider({
            el: this.$refs.mask,
            content: this.$refs.content,
            margin: 130,
            containerMargin: true,
          })
          this.canDrag = this.slider.max > 0;
          this.resize()
        }, 500)
      })
    },
    prev() {
      this.slider.prev()
    },
    next() {
      this.slider.next()
    },
    resize() {
    },
  },
}
</script>

<style lang="scss" module>
.journalSlider {
  width: 100%;
  .mask {
    box-sizing: border-box;
    overflow: hidden;
    cursor: grab;
    pointer-events: all;
    position: relative;
    z-index: 1;
  }
  .content {
    width: auto;
    display: inline-block;
    white-space: nowrap;
  }
  .item {
    width: calc(100vw / 3);
    margin-right: 45px;
    display: inline-block;
    vertical-align: top;
    will-change: transform;
    white-space: normal;
    padding-bottom: 40px;
    border-bottom: 1px solid currentColor;
    .title {
      width: 100%;
      max-width: 380px;
      margin-bottom: 20px;
    }
    .imageContainer {
      width: 100%;
      overflow: hidden;
      margin-bottom: 40px;
      .image {
        will-change: transform;
        transition: transform 1s $curve;
      }
    }
    .description {
      width: 100%;
      max-width: 370px;
    }
    &:hover {
      .image {
        transform: scale(1.1);
      }
    }
  }
  @include respond-to('desktop-extra-large') {
    .item {
      .title {
        max-width: toVW(380);
      }
      .description {
        max-width: toVW(370);
      }
    }
  }
  @include respond-to('tablet-small') {
    .item {
      width: calc(100vw / 2.8);
    }
  }
  @include respond-to('mobile-medium') {
    .item {
      width: calc(100vw / 1.4);
      margin-right: 30px;
      .title {
        font-size: 28px;
      }
    }
  }
}
</style>
