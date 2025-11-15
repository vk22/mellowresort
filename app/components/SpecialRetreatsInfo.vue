<template>
  <section
    :class="[$style.specialRetreatsInfo]"
  >
    <TextAndTwoImages :class="$style.textAndTwoImages" :title="title" :description="description" :images="images" is-dark />
    <TextAndImage :class="$style.textAndImage" :title="storyTitle" :description="storyDescription" :image="storyImage" is-dark />
    <RetreatsSliderMasked :class="$style.retreatsSliderMasked" :title="retreatsTitle" :subtitle="retreatsSubtitle" :description="retreatsDescription" :items="retreatsItems" is-dark />
    <IconsSection :class="$style.iconsSection" :title="iconsTitle" :items="iconsItems" is-dark />
    <MediaComponent
      :image="videoCover"
      :video="video"
      data-scroll-section
      data-section-theme="dark"
    />
  </section>
</template>

<script>
import VueTypes from 'vue-types'

export default {
  name: 'SpecialRetreatsInfo',
  props: {
    title: VueTypes.array.def([]),
    description: VueTypes.array.def([]),
    images: VueTypes.array.def([]),
    storyTitle: VueTypes.array.def([]),
    storyDescription: VueTypes.array.def([]),
    storyImage: VueTypes.object.def({}),
    retreatsTitle: VueTypes.array.def([]),
    retreatsSubtitle: VueTypes.array.def([]),
    retreatsDescription: VueTypes.array.def([]),
    retreatsItems: VueTypes.array.def([]),
    iconsTitle: VueTypes.array.def([]),
    iconsItems: VueTypes.array.def([]),
    videoCover: VueTypes.object.def({}),
    video: VueTypes.object.def({}),
  },
  data() {
    return {
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
  },
}
</script>

<style lang="scss" module>
.specialRetreatsInfo {
  position: relative;
  .iconsSection {
    padding: 240px 0;
  }
  @include respond-to('tablet-small') {
    .iconsSection {
      padding: 120px 0;
    }
  }
  @include respond-to('mobile-medium') {
    .iconsSection {
      padding: 90px 0;
    }
  }
}
</style>
