<template>
  <div :class="[$style.textSection]" data-scroll-section>
    <div class="container">
      <Title class="h2" v-if="largeTitle && largeTitle[0]" :class="$style.largeTitle" :text="largeTitle" />
      <Title class="h2" v-if="smallTitle && smallTitle[0]" :class="$style.smallTitle" :text="smallTitle" />
      <RichText :class="$style.content" :text="text" :margin="false" />
    </div>
  </div>
</template>

<script>
import VueTypes from 'vue-types'

export default {
  name: 'TextSection',
  components: {
  },
  props: {
    largeTitle: VueTypes.array.def([]),
    smallTitle: VueTypes.array.def([]),
    text: VueTypes.array.def([]),
  },
}
</script>

<style lang="scss" module>
.textSection {
  padding: 100px 0;
  .largeTitle {
    max-width: 1022px;
    margin: 0;
    margin-bottom: 180px;
    line-height: 1.58;
    &::first-letter {
      text-transform: uppercase;
      font-size: 2.763em;
      line-height: 0.7;
      float: left;
      margin-top: 0.3em;
      margin-right: 0.1em;
      display: inline-block;
    }
  }
  .smallTitle {
    max-width: 720px;
    margin: 0;
    margin-bottom: 80px;
  }
  .content {
    max-width: 970px;
    margin-left: auto;
    margin-right: 0;
    h1 {
      font-family: $font-serif;
      font-size: 21px;
      margin: 0;
      margin-bottom: 60px;
    }
  }
  @include respond-to('desktop-extra-large') {
    padding: toVW(100) 0;
    .largeTitle {
      max-width: toVW(1022);
      margin-bottom: toVW(180);
    }
    .smallTitle {
      max-width: toVW(720);
      margin-bottom: toVW(80);
    }
    .content {
      max-width: min(toVW(970), 1200px);
      h1 {
        font-size: toVW(21);
        margin-bottom: toVW(60);
      }
    }
  }
  @include respond-to('tablet') {
    padding: 20px 0;
  }
  @include respond-to('tablet-small') {
    .largeTitle {
      margin-bottom: 80px;
    }
  }
  @include respond-to('mobile-medium') {
    .largeTitle {
      margin-bottom: 60px;
      font-size: 21px;
      line-height: 1.4;
    }
    .smallTitle {
      margin-bottom: 40px;
    }
  }
}
</style>
