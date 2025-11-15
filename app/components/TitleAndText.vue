<template>
  <div :class="[$style.titleAndText]" data-scroll-section>
    <div class="container">
      <Title
        class="h2"
        :class="$style.content"
        :text="text"
      />
    </div>
  </div>
</template>

<script>
import VueTypes from 'vue-types'

export default {
  name: 'TitleAndText',
  components: {
  },
  props: {
    text: VueTypes.array.def([]),
  },
}
</script>

<style lang="scss" module>
.titleAndText {
  margin: 240px 0;
  .content {
    width: 100%;
    b, strong {
      &:first-child {
        font-family: $font-sans;
        font-size: 0.3em;
        text-transform: uppercase;
        font-weight: normal;
        position: relative;
        top: -1em;
        margin-right: 3em;
      }
    }
  }
  @include respond-to('tablet') {
  }
}
</style>
