<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const props = defineProps({
  marker: {
    type: Object,
    default: () => ({})
  }
})

// refs
const figure = ref(null)
let map = null
let markerMB = null

// INIT MAPBOX
const init = () => {
  if (!figure.value) return

  mapboxgl.accessToken =
    'pk.eyJ1Ijoiam9yZ2V0b2xvemExNyIsImEiOiJjbDdlMHpqMnkxMTV4M3VxZmx2enlwZTVoIn0.PgRgpAzi6wFmYcPj9PZHAw'

  map = new mapboxgl.Map({
    container: figure.value,
    style:
      'mapbox://styles/jorgetoloza17/cl7e1bi21000115ny5stvdabr/draft',
    projection: 'globe',
    scrollZoom: false
  })

  map.addControl(new mapboxgl.NavigationControl(), 'top-left')

  map.on('load', () => {
    createMarker()
  })
}

const createMarker = () => {
  if (!map) return
  if (!props.marker?.latitude || !props.marker?.longitude) return
  if (markerMB) return

  markerMB = new mapboxgl.Marker({
    color: '#ACAC7A'
  })
    .setLngLat([props.marker.longitude, props.marker.latitude])
    .addTo(map)

  map.setCenter([props.marker.longitude, props.marker.latitude])
  map.setZoom(5.5)
}

// update marker when data changes
watch(
  () => props.marker,
  () => {
    if (map) createMarker()
  },
  { deep: true }
)

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div :class="$style.mapbox">
    <div ref="figure" :class="$style.figure"></div>
  </div>
</template>

<style lang="scss" module>
@use "sass:math";
@use "sass:map";
@use "sass:meta";
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.mapbox {
  width: 100%;
  height: 100%;
  position: relative;

  &::after {
    content: "";
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    position: absolute;
    z-index: 9;
    top: -6px;
    left: -6px;
    border: 8px solid #F0ECE6;
    pointer-events: none;
    box-sizing: border-box;
  }

  .figure {
    width: 100%;
    height: 100%;
  }

  :global(.mapboxgl-map) {
    position: relative;
    will-change: transform;
    z-index: 0;

    &::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      inset: 0;
      z-index: 1;
      background: radial-gradient(
        50% 50% at 50% 50%,
        rgba(240, 236, 230, 0) 16.67%,
        #F0ECE6 100%
      );
      pointer-events: none;
      will-change: transform;
    }
  }

  :global(.mapboxgl-canvas-container) {
    position: relative;
    z-index: 0;
  }

  :global(.mapboxgl-control-container) {
    z-index: 2;
  }
}
</style>
