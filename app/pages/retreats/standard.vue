<template>
  <!-- prettier-ignore -->
  <div ref="pageRoot" :class="$style.page">
    <Header ref="headerRef" v-bind="header" />

    <section :class="$style.mapSection" data-scroll-section>
      <div class="container">
        <MainTitle
          :class="$style.title"
          :text="map.title"
          class="h2"
          data-fade-in
        />
        <div :class="$style.flex">
          <div :class="$style.left">
            <Mapbox :class="$style.mapbox" :marker="map.marker" />
          </div>
          <div :class="$style.right">
            <RichText :class="$style.description" :text="map.description" />
          </div>
        </div>
      </div>
    </section>

    <RetreatHighlights
      :columns="highlights.columns"
      :image="highlights.image"
    />

    <Slider :title="features.title" :items="features.items" />

    <IconsSection
      v-if="retreats"
      :class="$style.iconsSection"
      :title="retreats.iconsTitle"
      :items="retreats.iconsItems"
    />

    <MediaComponent
      v-if="retreats"
      :image="retreats.videoCover"
      :video="retreats.video"
      data-scroll-section
      data-section-theme="dark"
    />

    <Testimonials
      :title="testimonials.title"
      :items="testimonials.items"
    />

    <RetreatPopup :color="'#A2BBC0'" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useFetch } from "#app";
import { useHead } from "#imports";
import { useI18n } from "vue-i18n";
import { asText } from "@prismicio/helpers";

import { useAppBus } from "~/composables/useAppBus";
import { usePage } from "~/composables/usePage";
import Util from "~/utils/util";

// стили
const $style = useCssModule();

// роут + язык
const route = useRoute();
const { locale } = useI18n();

// bus + page-композабл (анимации, лоадер и т.п.)
const bus = useAppBus();
const { hideLoading } = usePage();

/* ---------------------- STATE ---------------------- */

const pageRoot = ref(null);
const headerRef = ref(null);

const header = reactive({
  title: [],
  image: {},
  subtitle: [],
  location: [],
  locationLink: {},
  button: [],
  buttonDesktop: [],
  buttonMobile: [],
});

const map = reactive({
  title: [],
  description: [],
  marker: {},
});

const highlights = reactive({
  image: {},
  columns: [],
});

const features = reactive({
  title: [],
  items: [],
});

const retreats = reactive({
  iconsTitle: "",
  iconsItems: [],
});

const summary = reactive({
  title: [],
  subtitle: [],
  bookText: [],
  sharedTitle: [],
  sharedPrice: [],
  privateTitle: [],
  privatePrice: [],
});

const testimonials = reactive({
  title: [],
  items: [],
});

const popupContent = ref(null);

const meta = reactive({
  title: "",
  description: "",
  image: "",
});

// флаги
const domReady = ref(false);
const dataReady = ref(false);
const inited = ref(false);

const winW = ref(0);
const winH = ref(0);
const isMobile = ref(false);
const isTouch = ref(false);
const isVertical = ref(false);

/* ---------------------- FETCH DATA ---------------------- */

const getServerData = async (id) => {
  const { data, error } = await useFetch(`/api/${id}`, {
    method: "GET",
    query: {
      lang: locale.value || "en",
    },
  });
  if (error.value) return false;
  if (data.value) {
    return data.value.data;
  } else {
    return false;
  }
};

const serverData = await getServerData("retreats/standard");
console.log('serverData ', serverData)

if (serverData) {
  header.title = serverData.title;
  header.subtitle = serverData.duration;
  header.location = serverData.location;
  header.locationLink = serverData.location_link;
  header.image = serverData.header_image;
  header.button = serverData.book_text;
  header.buttonDesktop = serverData.book_text;
  header.buttonMobile =
    !serverData.book_text_mobile || !serverData.book_text_mobile[0]
      ? serverData.book_text
      : serverData.book_text_mobile;

  map.title = serverData.map_title;
  map.description = serverData.map_description;
  map.marker = serverData.map_location;

  highlights.image = serverData.highlights_image;
  highlights.columns = [
    {
      subtitle: asText(serverData.highlights_subtitle),
      title: serverData.highlights_title,
      content: serverData.highlights_items,
    },
    {
      subtitle: asText(serverData.what_is_included_subtitle),
      title: serverData.what_is_included_title,
      content: serverData.what_is_included_items,
    },
  ];
  features.title = serverData.features_title;
  features.items = serverData.features;

  popupContent.value = serverData.popupContent || null;

  if (serverData.meta) {
    meta.title = serverData.meta.title || "";
    meta.description = serverData.meta.description || "";
    meta.image = serverData.meta.image || "";
  }

  dataReady.value = true;
}

const serverDataIcons = await getServerData("retreats/special-retreats-info");

if (serverDataIcons) {
  retreats.iconsTitle = serverDataIcons.icons_title;
  retreats.iconsItems = serverDataIcons.icons;
}

const serverDataTestimonials = await getServerData("testimonials");

if (serverDataTestimonials) {
  testimonials.title = serverDataTestimonials.title;
  testimonials.items = serverDataTestimonials.items;
}

/* ---------------------- META / HEAD ---------------------- */

useHead(() => ({
  title: meta.title,
  meta: [
    { name: "description", content: meta.description },
    { hid: "twitter:title", name: "twitter:title", content: meta.title },
    {
      hid: "twitter:description",
      name: "twitter:description",
      content: meta.description,
    },
    { hid: "twitter:image", name: "twitter:image", content: meta.image },
    { hid: "og:title", property: "og:title", content: meta.title },
    {
      hid: "og:description",
      property: "og:description",
      content: meta.description,
    },
    { hid: "og:image", property: "og:image", content: meta.image },
  ],
}));

/* ---------------------- ЛОГИКА СТРАНИЦЫ ---------------------- */

function resize() {
  winW.value = window.innerWidth;
  winH.value = window.innerHeight;
  isMobile.value = winW.value <= 1024;
  isVertical.value = winH.value > winW.value;
}

function initIntro() {
  // Header.vue уже переведён и делает defineExpose({ initIntro, intro })
  headerRef.value?.initIntro();
  bus.emit("book-button-hide");
}

function intro() {
  headerRef.value?.intro();
  setTimeout(() => {
    bus.emit("book-button-show", "#A2BBC0");
  }, 1800);
}

function openPopup() {
  if (popupContent.value) {
    bus.emit("retreat-popup-open", { content: popupContent.value });
  }
}

function init() {
  if (!dataReady.value || !domReady.value || inited.value) return;

  inited.value = true;

  bus.emit("footer-show");
  bus.emit("scroll-reset");
  bus.emit("theme", "dark");
  bus.emit("theme-nav", "dark");

  // ждём картинки внутри страницы
  if (pageRoot.value) {
    Util.loadImages(pageRoot.value, () => {
      // после загрузки картинок
      nextTick(() => {
        resize();
        bus.emit("scroll-reset");
        resize();

        setTimeout(() => {
          initIntro();
          hideLoading(intro); // hideLoading вызовет intro как колбэк
        }, 500);
      });
    });
  }
}

/* ---------------------- LIFECYCLE ---------------------- */

onMounted(() => {
  domReady.value = true;
  isTouch.value = Util.isTouch();

  window.addEventListener("resize", resize);
  resize();

  // добавляем "листенер" для кнопки брони
  bus.emit("book-button-add-info-listener", openPopup);

  init();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
  bus.emit("book-button-remove-info-listener", openPopup);
});
</script>

<style lang="scss" module>
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.page {
  width: 100%;
  min-height: 100vh;

  .mapSection {
    width: 100%;
    padding: 240px 0;

    .title {
      max-width: 460px;
      margin: 0 auto 40px;
      text-align: center;
    }

    .flex {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        width: 45%;
        position: relative;
        z-index: 1;

        &::before {
          content: "";
          display: block;
          padding-bottom: 100%;
        }

        .mapbox {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
      }

      .right {
        width: 45%;

        .description {
          max-width: 670px;
        }
      }
    }
  }

  @include respond-to("desktop-extra-large") {
    .mapSection {
      padding: toVW(240) 0;

      .title {
        max-width: toVW(460);
      }

      .flex {
        .right {
          .description {
            max-width: #{Min(toVW(670), 1200px)};
          }
        }
      }
    }
  }

  @include respond-to("tablet-small") {
    .mapSection {
      padding: 160px 0;

      .flex {
        flex-direction: column-reverse;

        .left {
          width: 100%;
          margin-top: 40px;
        }

        .right {
          width: 100%;
        }
      }
    }
  }

  @include respond-to("mobile-medium") {
    .mapSection {
      padding: 90px 0;
    }
  }
}
</style>
