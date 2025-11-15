<template>
  <div :class="[$style.fullWidth, fullWidth && $style.full]" data-scroll-section>
    <div class="container">
      <MediaComponent
        :class="$style.mediaContainer"
        :image="image"
        :video="video"
        :autoplay="autoplay"
        :ratio="autoRatio ? 0 : 9 / 16"
        :footnote="footnote"
        data-scroll-item
      />
    </div>
  </div>
</template>

<script>
import VueTypes from 'vue-types'
import MediaComponent from '../MediaComponent'

export default {
  name: 'FullWidth',
  components: {
    MediaComponent,
  },
  props: {
    image: VueTypes.object.def({}),
    video: VueTypes.object.def({}),
    autoplay: VueTypes.bool.def(true),
    autoRatio: VueTypes.bool.def(true),
    footnote: VueTypes.array.def([]),
    fullWidth: VueTypes.bool.def(true),
  },
}
</script>

<style lang="scss" module>
.fullWidth {
  padding: 100px 0;
  .mediaContainer {
    width: 100%;
  }
  &:not(.full) {
    .mediaContainer {
      max-width: 60%;
      margin-left: auto;
      margin-right: 0;
    }
  }
  @include respond-to('tablet') {
    padding: 20px 0;
  }
}
</style>
