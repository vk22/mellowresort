<script setup>
import { computed } from 'vue'

// Nuxt3 props
const props = defineProps({
  title: { type: Array, default: () => [] },
  items: { type: Array, default: () => [] },
  isDark: { type: Boolean, default: false },
  largePadding: { type: Boolean, default: false }
})

// Если раньше был `$prismic.asText`, то заменяем универсальной функцией:
const asText = (richText) => Array.isArray(richText)
  ? richText.map(x => x.text).join(' ')
  : ''
</script>

<template>
  <section
    :class="[$style.iconsSection, largePadding && $style.largePadding]"
    :data-section-theme="isDark ? 'dark' : undefined"
    data-scroll-section
  >
    <div class="container">

      <Title class="h2" :class="$style.title" :text="title" data-fade-in />

      <div :class="$style.icons">
        <div
          v-for="(item, index) in items"
          :key="index"
          :class="$style.item"
        >
          <ResponsiveImage
            :image="item.item_icon"
            :class="$style.itemIcon"
            data-fade-in-y
          />

          <h2 :class="$style.itemTitle" data-fade-in-y>
            {{ asText(item.item_title) }}
          </h2>

          <RichText
            :text="item.item_description"
            :class="$style.itemText"
            data-fade-in-y
          />
        </div>
      </div>

    </div>
  </section>
</template>

<style lang="scss" module>
@use "sass:math";
@use "sass:map";
@use "sass:meta";
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;

.iconsSection {
  position: relative;
  padding: 110px 0;
  text-align: center;

  .title {
    max-width: 480px;
    text-align: center;
    margin: 0 auto 110px;
  }

  .icons {
    display: flex;
    justify-content: space-around;
  }

  .item {
    width: calc(100% / 3);
    display: flex;
    flex-direction: column;
    align-items: center;

    .itemIcon {
      width: 80%;
      max-width: 120px;
      margin-bottom: 34px;
    }

    .itemTitle {
      font-family: $font-serif;
      font-size: 28px;
      font-weight: normal;
      line-height: 1.2;
      margin: 0;
    }

    .itemText {
      max-width: 280px;
      margin-top: 24px;
    }
  }

  &[data-section-theme="dark"] {
    background: $black;
    color: $white;
  }

  &.largePadding {
    padding: 240px 0;
  }

  @include respond-to('tablet') {
    padding: 80px 0;
    .title { margin-bottom: 80px; }
    .icons {
      flex-direction: column;
      .item {
        width: 100%;
        margin-bottom: 50px;
        &:last-child { margin-bottom: 0; }
      }
    }
  }

  @include respond-to('mobile-medium') {
    .title { margin-bottom: 60px; }
    .icons .item {
      .itemTitle { font-size: 21px; }
      .itemText { margin-top: 15px; }
    }
  }
}
</style>
