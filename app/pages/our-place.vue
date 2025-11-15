<template>
  <div :class="$style.page">
    <Header
      ref="headerRef"
      :image="header.image"
      :title="header.title"
      :location="header.location"
      :location-link="header.locationLink"
    />

    <TextAndImage
      :class="$style.design"
      :title="design.title"
      :description="design.description"
      :image="design.image"
      padding
      center-on-mobile
    />

    <PlacesSlider :items="grid" />

    <MediaComponent
      :image="media.image"
      :video="media.video"
      data-scroll-section
      data-section-theme="dark"
    />

    <Slider
      :title="ourEnvironment.title"
      :items="ourEnvironment.items"
      is-dark
    />

    <TextAndImage
      :class="$style.food"
      :title="food.title"
      :description="food.description"
      :image="food.image"
      padding
      reverse
      center-on-mobile
      is-dark
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute, useFetch } from "#app";
import { useHead } from "#imports";

import Util from "~/utils/util";
import { useAppBus } from "~/composables/useAppBus";
import { usePage } from "~/composables/usePage";

const { locale } = useI18n();

const $style = useCssModule();
const route = useRoute();
const bus = useAppBus();
const { hideLoading } = usePage();

// ─────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────
const headerRef = ref(null);

const header = reactive({
  title: [],
  image: {},
  location: [],
  locationLink: {},
});

const design = reactive({
  title: [],
  description: [],
  image: {},
});

const grid = ref([]);

const media = reactive({
  image: {},
  video: {},
});

const ourEnvironment = reactive({
  title: [],
  items: [],
});

const food = reactive({
  title: [],
  description: [],
  image: {},
});

const meta = reactive({
  title: "",
  description: "",
  image: "",
});

const dataReady = ref(false);
const domReady = ref(false);

const winW = ref(0);
const winH = ref(0);
const isMobile = ref(false);
const isVertical = ref(false);

// ─────────────────────────────────────────
//  RESIZE
// ─────────────────────────────────────────
function resize() {
  winW.value = window.innerWidth;
  winH.value = window.innerHeight;
  isMobile.value = winW.value <= 1024;
  isVertical.value = winH.value > winW.value;
}

// ─────────────────────────────────────────
//  INTRO LOGIC
// ─────────────────────────────────────────
function initIntro() {
  headerRef.value?.initIntro?.();
  bus.emit("book-button-hide");
}

function intro() {
  headerRef.value?.intro?.();
  setTimeout(() => {
    bus.emit("book-button-show", "#E9AEBC");
  }, 1800);
}

// ─────────────────────────────────────────
//  INIT (loader + animations)
// ─────────────────────────────────────────
function init() {
  if (!dataReady.value || !domReady.value || init.inited) return;
  init.inited = true;

  bus.emit("footer-show");
  bus.emit("scroll-reset");
  bus.emit("theme", "dark");
  bus.emit("theme-nav", "dark");

  Util.loadImages(document.body, () => {
    nextTick(() => {
      resize();
      bus.emit("scroll-reset");
      resize();
      setTimeout(() => {
        initIntro();
        hideLoading(() => {
          intro();
        });
      }, 500);
    });
  });
}

// ─────────────────────────────────────────
//  API: Fetch data without Prismic
// ─────────────────────────────────────────
async function loadData() {
  const endpoint = "/api/our-place";

  const { data } = await useFetch(endpoint, {
    method: "GET",
    query: { lang: locale.value },
  });

  console.log('loadData ', data.value)

  if (!data.value) return;

  const d = data.value.data;

  header.title = d.title;
  header.location = d.location_text;
  header.locationLink = d.location_link;
  header.image = d.header;

  design.title = d.design_title;
  design.description = d.design_description;
  design.image = d.design_image;

  grid.value = d.grid;

  media.image = d.video_cover;
  media.video = d.video;

  ourEnvironment.title = d.our_environment_title;
  ourEnvironment.items = d.our_environment_items;

  food.title = d.food_title;
  food.description = d.food_description;
  food.image = d.food_image;

  // meta
  meta.title = d.meta_title || "";
  meta.description = d.meta_description || "";
  meta.image = d.meta_image || "";

  dataReady.value = true;
}

// ─────────────────────────────────────────
//  HEAD (SEO)
// ─────────────────────────────────────────
useHead(() => ({
  title: meta.title,
  meta: [
    { name: "description", content: meta.description },
    { name: "twitter:title", content: meta.title },
    { name: "twitter:description", content: meta.description },
    { name: "twitter:image", content: meta.image },
    { name: "og:title", content: meta.title },
    { name: "og:description", content: meta.description },
    { name: "og:image", content: meta.image },
  ],
}));

// ─────────────────────────────────────────
//  LIFECYCLE
// ─────────────────────────────────────────
await loadData();

onMounted(() => {
  domReady.value = true;
  resize();
  window.addEventListener("resize", resize);
  init();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
});
</script>

<style lang="scss" module>
.page {
  width: 100%;
  min-height: 100vh;
}
</style>
