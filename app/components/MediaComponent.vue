<script setup>
import { computed } from 'vue'

// props
const props = defineProps({
  image: { type: Object, default: () => ({}) },
  video: { type: Object, default: () => ({}) },
  autoplay: { type: Boolean, default: true },
  ratio: { type: Number, default: 0 },
  footnote: { type: Array, default: () => [] },
  playOnHover: { type: Boolean, default: false },
  fromBeginning: { type: Boolean, default: false },
})

const hasImage = computed(() =>
  props.image?.url && !props.video?.url
)

const hasVideo = computed(() =>
  props.video?.url
)

const hasFootnote = computed(() =>
  props.footnote?.[0]?.text
)
</script>

<template>
  <div :class="$style.mediaComponent">

    <!-- IMAGE -->
    <ResponsiveImage
      v-if="hasImage"
      :class="[$style.media, $style.image]"
      :image="image"
      :ratio="ratio"
      :bg="false"
    />

    <!-- VIDEO -->
    <VideoComponent
      v-if="hasVideo"
      :class="[$style.media, $style.video]"
      :cover="image"
      :src="video"
      :autoplay="autoplay"
      :play-on-hover="playOnHover"
      :from-beginning="fromBeginning"
    />

    <!-- FOOTNOTE -->
    <RichText
      v-if="hasFootnote"
      :class="$style.footnote"
      :text="footnote"
    />
  </div>
</template>

<style lang="scss" module>
.mediaComponent {
  width: 100%;
  .footnote {
    font-weight: normal;
    font-size: 12px;
    line-height: 130%;
    margin-top: 10px;
    color: var(--text-color-secondary);
    transition: opacity 1.5s cubic-bezier(.53,.11,0,1), filter 1s cubic-bezier(.53,.11,0,1);
    strong, b {
      font-weight: normal;
      color: var(--text-color-primary);
    }
  }
  &[data-scroll-item] {
    .image,
    .video {
      overflow: hidden;
      > * {
        transition: opacity 1.5s cubic-bezier(.53,.11,0,1), filter 1s cubic-bezier(.53,.11,0,1), transform 1s cubic-bezier(.53,.11,0,1);
      }
    }
    &:not(:global(.show)) {
      .image > * ,
      .video > * {
        opacity: 0;
        filter: blur(10px);
        transform: scale(1.1);
      }
      .footnote {
        opacity: 0;
        filter: blur(10px);
      }
    }
  }
}
</style>
