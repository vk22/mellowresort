<template>
  <section
    :class="[$style.retreatSummary]"
    data-scroll-section
  >
    <div class="container" :class="$style.flex">
      <Title class="h2" :class="$style.title" :text="title" data-fade-in />
      <h2 class="h2" :class="$style.subtitle" data-fade-in>{{ $prismic.asText(subtitle) }}</h2>
      <div :class="$style.items" data-fade-in>
        <div
          v-if="sharedTitle && sharedTitle[0]"
          :class="[$style.item, $style.shared]"
        >
          <svg :class="$style.itemIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 86 45">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.8 1.97a6.9 6.9 0 1 0 0 13.8 6.9 6.9 0 0 0 0-13.8Zm-8.88 6.9a8.87 8.87 0 1 1 17.74 0 8.87 8.87 0 0 1-17.74 0Zm65.05-6.9a6.9 6.9 0 1 0 0 13.8 6.9 6.9 0 0 0 0-13.8Zm-8.87 6.9a8.87 8.87 0 1 1 17.74 0 8.87 8.87 0 0 1-17.74 0Zm-19.71.99a8.87 8.87 0 1 0 0 17.74 8.87 8.87 0 0 0 0-17.74Zm-10.84 8.87a10.84 10.84 0 1 1 21.68 0 10.84 10.84 0 0 1-21.68 0ZM29.2 27.8l-1.22 1.55a21.35 21.35 0 0 0-26.38 0L.38 27.8a23.32 23.32 0 0 1 28.82 0Zm56.18 0-1.22 1.55a21.35 21.35 0 0 0-26.38 0l-1.21-1.55a23.32 23.32 0 0 1 28.81 0Zm-57.9 14.98-2.32 1.42-1.03-1.68 2.33-1.42a30.56 30.56 0 0 1 31.86 0l2.33 1.42-1.03 1.68-2.33-1.42a28.58 28.58 0 0 0-29.8 0Z" />
          </svg>
          <h1 :class="$style.itemTitle">{{ $prismic.asText(sharedTitle) }}</h1>
          <RichText :class="$style.itemPrice" :text="sharedPrice" />
        </div>
        <div
          v-if="privateTitle && privateTitle[0]"
          :class="[$style.item, $style.private]"
        >
          <svg :class="$style.itemIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 86 45">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M42 6a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-11 9a11 11 0 1 1 22 0 11 11 0 0 1-22 0Zm-4.12 24.41-2.36 1.44-1.04-1.7 2.36-1.44a31 31 0 0 1 32.32 0l2.36 1.44-1.04 1.7-2.36-1.44a29 29 0 0 0-30.24 0Z"/>
          </svg>
          <h1 :class="$style.itemTitle">{{ $prismic.asText(privateTitle) }}</h1>
          <RichText :class="$style.itemPrice" :text="privatePrice" />
        </div>
      </div>
      <PrimaryButton
        v-show="bookText && bookText[0]"
        :class="$style.button"
        :text="bookText"
        data-fade-in
      />
    </div>
  </section>
</template>

<script>
import VueTypes from 'vue-types'

export default {
  name: 'retreatSummary',
  props: {
    title: VueTypes.array.def([]),
    subtitle: VueTypes.array.def([]),
    sharedTitle: VueTypes.array.def([]),
    sharedPrice: VueTypes.array.def([]),
    privateTitle: VueTypes.array.def([]),
    privatePrice: VueTypes.array.def([]),
    bookText: VueTypes.array.def([]),
  },
  mounted() {
  },
  methods: {
  },
}
</script>

<style lang="scss" module>
.retreatSummary {
  padding: 240px 0;
  text-align: center;
  .flex {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .title, .subtitle {
    max-width: 840px;
  }
  .title {
    font-size: 70px;
  }
  .subtitle {
    margin-top: 40px;
    font-family: $font-serif;
  }
  .items {
    width: 100%;
    max-width: 460px;
    margin-top: 72px;
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
  }
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    .itemIcon {
      height: 44px;
      margin-bottom: 32px;
      fill: currentColor;
    }
    .itemTitle {
      font-family: $font-serif;
      font-size: 21px;
      font-weight: normal;
      margin: 0;
      margin-bottom: 20px;
    }
    .itemPrice {
      font-size: 16px;
      font-weight: normal;
      b, strong {
        font-family: $font-serif;
        font-size: 28px;
        font-weight: inherit;
      }
    }
  }
  .button {
    margin-top: 72px;
  }
  @include respond-to('desktop-extra-large') {
    padding: toVW(240) 0;
    .title, .subtitle {
      max-width: toVW(840);
    }
    .title {
      font-size: toVW(70);
    }
    .subtitle {
      margin-top: toVW(40);
    }
    .items {
      max-width: toVW(460);
      margin-top: toVW(72);
    }
    .item {
      .itemIcon {
        height: toVW(44);
        margin-bottom: toVW(32);
      }
      .itemTitle {
        font-size: toVW(21);
        margin-bottom: toVW(20);
      }
      .itemPrice {
        font-size: toVW(16);
        b, strong {
          font-size: toVW(28);
        }
      }
    }
    .button {
      margin-top: toVW(72);
    }
  }
  @include respond-to('tablet-small') {
    padding: 160px 0;
    .title {
      font-size: 70px * 0.8;
    }
  }
  @include respond-to('mobile-medium') {
    padding: 90px 0;
    padding-bottom: 0px;
    .title, .subtitle {
      max-width: 320px;
    }
    .title {
      font-size: 38px;
    }
    .subtitle {
      font-size: 21px;
    }
    .items {
      flex-direction: column;
      align-items: center;
      margin-top: 60px;
    }
    .item {
      .itemTitle {
        font-size: 19px;
      }
      &:not(:last-child) {
        margin-bottom: 60px;
      }
    }
  }
}
</style>
