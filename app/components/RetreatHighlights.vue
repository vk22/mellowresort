<template>
  <section
    :class="$style.retreatHighlights"
    :data-section-theme="isMobile ? undefined : 'dark'"
    data-scroll-section
  >
    <div :class="$style.bg">
      <ResponsiveImage
        :image="image"
        :full="true"
        :class="$style.image"
      />
    </div>

    <div class="container">
      <div :class="$style.flex">
        <div
          v-for="(column, index) in columns"
          :key="index"
          :class="$style.column"
        >
          <h1 :class="$style.subtitle" data-fade-in>
            {{ column.subtitle }}
          </h1>

          <Title
            class="h2"
            :class="$style.title"
            :text="column.title"
            data-fade-in
          />

          <RichText
            :class="$style.content"
            :text="column.content"
            data-fade-in-y
          />
        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  image: {
    type: Object,
    default: () => ({})
  }
})

const isMobile = ref(false)

const resize = () => {
  isMobile.value = window.innerWidth <= 890
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
})
</script>



<style lang="scss" module>
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.retreatHighlights {
  position: relative;
  padding: 180px 0;
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    .image {
      width: 100%;
      height: 100%;
      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
  }
  .flex {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
  }
  .column {
    width: 45%;
  }
  .subtitle {
    font-size: 14px;
    line-height: 1.5;
    font-weight: normal;
    letter-spacing: 0.01em;
    margin: 0;
    margin-bottom: 17px;
  }
  .title {
    font-size: 50px;
  }
  .content {
    max-width: 550px;
    font-weight: 400;
    font-size: 21px;
    font-family: $font-serif;
    line-height: 1.5;
    margin-top: 40px;
    ul {
      padding-left: 1.1em;
      li {
        &:not(:last-child) {
          margin-bottom: 1em;
        }
      }
    }
  }
  &[data-section-theme="dark"] {
    color: $white;
  }
  @include respond-to('desktop-extra-large') {
    padding: toVW(180) 0;
    .flex {
      max-width: toVW(1200);
    }
    .subtitle {
      font-size: toVW(14);
      margin-bottom: toVW(17);
    }
    .title {
      font-size: toVW(50);
    }
    .content {
      max-width: toVW(550);
      font-size: toVW(21);
    }
  }
  @include respond-to('tablet') {
    color: $black;
    .bg {
      display: none;
    }
    .flex {
      flex-direction: column;
      align-items: flex-start;
    }
    .column {
      width: 100%;
      max-width: 550px;
      &:not(:last-child) {
        margin-bottom: 90px;
      }
    }
  }
  @include respond-to('tablet-small') {
    padding: 120px 0;
    .title {
      font-size: 38px;
    }
    .content {
      font-size: 18px;
    }
  }
  @include respond-to('mobile-medium') {
    padding: 90px 0;
    .content {
      font-size: 12px;
    }
  }
}
</style>
