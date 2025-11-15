<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import Player from '@vimeo/player'

const props = defineProps({
  src: { type: Object, default: () => ({}) },
  cover: { type: Object, default: () => ({}) },
  autoplay: Boolean,
  playOnHover: Boolean,
  muted: Boolean,
  background: Boolean,
  customRatio: Number,
  onlyDesktop: Boolean,
  fromBeginning: Boolean,
})

const media = ref(null)
const player = ref(null)
const loaded = ref(false)
const paused = ref(true)
const isMobile = ref(false)
const ratio = ref(9/16)

const isNative = computed(() => props.src?.url && !props.src.url.includes('vimeo.com'))
const currentRatio = computed(() => props.customRatio || ratio.value)

onMounted(() => {
  isMobile.value = window.innerWidth <= 970
  init()

  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && props.autoplay && !paused.value) play()
    else pause()
  }, { threshold: 0.3 })
  obs.observe(media.value?.parentNode)
  onUnmounted(() => obs.disconnect())
})

watch(() => props.src, () => init())

function init() {
  if (props.onlyDesktop && isMobile.value) return

  if (isNative.value) initNative()
  else initVimeo()
}

function initNative() {
  const el = media.value
  if (!el) return
  el.addEventListener('loadedmetadata', () => {
    ratio.value = el.videoHeight / el.videoWidth
    loaded.value = true
    if (props.autoplay) play()
  })
}

function initVimeo() {
  if (!media.value) return
  player.value = new Player(media.value, {
    url: props.src.url,
    autoplay: props.autoplay,
    loop: true,
    background: true,
    muted: true,
  })
  player.value.on('loaded', async () => {
    const [w, h] = await Promise.all([player.value.getVideoWidth(), player.value.getVideoHeight()])
    ratio.value = h / w
    loaded.value = true
    if (props.autoplay) play()
  })
}

function play() {
  if (isNative.value) {
    media.value.muted = props.muted ?? true
    if (props.fromBeginning) media.value.currentTime = 0
    media.value.play()
  } else {
    player.value.setVolume(props.muted ? 0 : 1)
    if (props.fromBeginning) player.value.setCurrentTime(0)
    player.value.play()
  }
  paused.value = false
}

function pause() {
  if (isNative.value) media.value.pause()
  else player.value.pause()
  paused.value = true
}

function toggle() {
  if (props.playOnHover || (props.onlyDesktop && isMobile.value)) return
  paused.value ? play() : pause()
}
</script>

<template>
  <div
    class="videoComponent"
    :class="{ playing: !paused, loaded }"
    @click="toggle"
    @mouseover="playOnHover && play()"
    @mouseleave="playOnHover && pause()"
  >
    <div class="cover" :style="{ paddingBottom: `${currentRatio * 100}%`, backgroundImage: `url('${cover?.url}')` }" />

    <video
      v-if="isNative"
      ref="media"
      :src="src?.url"
      preload="metadata"
      playsinline
      loop
    />

    <div v-else ref="media" class="iframeContainer"></div>
  </div>
</template>

<style scoped lang="scss">
.videoComponent {
  position: relative;
  .cover {
    width: 100%;
    background-size: cover;
    background-position: center;
    transition: opacity 1s;
  }
  video, .iframeContainer {
    position: absolute;
    inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 1s;
  }
  &.playing video,
  &.playing .iframeContainer {
    opacity: 1;
  }
  &.playing .cover {
    opacity: 0;
  }
}
</style>
