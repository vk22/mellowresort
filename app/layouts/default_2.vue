<template>
  <main id="main" class="back">
    <!-- <Loading />
    <Intro />
    <ScrollPointer ref="scrollPointer" />
    <Navbar />
    <Menu
      :main-items="menu.mainItems"
      :secondary-items="menu.secondaryItems"
      :support-items="menu.supportItems"
      :social-items="menu.socialItems"
      :secondary-title="menu.secondaryTitle"
      :support-title="menu.supportTitle"
      :footer-left="menu.footerLeft"
      :footer-center="menu.footerCenter"
      :footer-right="menu.footerRight"
    />
    <BookButton />
    <BookingPopup v-bind="booking" />
    <CustomCursor />
    <div ref="page">
      <Nuxt />
      <Footer
        :newsletter-title="footer.newsletterTitle"
        :input-placeholder="footer.inputPlaceholder"
        :thanks-text="footer.thanksText"
        :copyright="footer.copyright"
        :column1="footer.column1"
        :column2="footer.column2"
        :social-items="menu.socialItems"
      />
    </div> -->
    <div ref="page">
      <slot></slot>
    </div>
  </main>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useEventBus } from "@vueuse/core";
useHead({
  meta: [
    { name: "description", content: "" },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "robots", content: "noindex" },
  ],
  link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
});

const mobileInitialized = ref(false);
const menu = ref({
  mainItems: [],
  secondaryItems: [],
  supportItems: [],
  socialItems: [],
  secondaryTitle: [],
  supportTitle: [],
  footerLeft: [],
  footerCenter: [],
  footerRight: [],
});

const page = ref(null);

const scroll = ref(null);
const scrollPaused = ref(false);

const scrollPauseBus = useEventBus("scroll-pause");
// scrollPauseBus.on(() => {
//   initScroll();
//   scrollPaused.value = true;
//   if (scroll.value) scroll.value.pause = true;
//   document.documentElement.classList.add("overflowHidden");
// });

// this.$nuxt.$on('scroll-play', () => {
//   this.initScroll()
//   if (this.scroll) this.scroll.pause = false
//   this.scrollPaused = undefined;
//   document.documentElement.classList.remove('overflowHidden');
// })
// this.$nuxt.$on('scroll-to', (pos) => {
//   this.initScroll()
//   if (this.scroll) this.scroll.scrollTo(pos)
// })
// this.$nuxt.$on('scroll-update-sections', (pos) => {
//   this.initScroll()
//   if (this.scroll) {
//     this.scroll.pause = true
//     setTimeout(() => {
//       this.scroll.updateSections()
//       this.scroll.resize()
//       this.scroll.pause = this.scrollPaused !== undefined ? this.scrollPaused : false;
//     }, 300)
//   }
// })
// this.$nuxt.$on('scroll-reset', () => {
//   this.initScroll()
//   if (this.scroll) {
//     setTimeout(() => {
//       this.scroll.scrollTo(0, true)
//       this.scroll.updateSections()
//       this.scroll.resize()
//     }, 300)
//   }
// })
// this.$nuxt.$on('scroll-resize', (data) => {
//   this.initScroll()
//   if (this.scroll) {
//     this.scroll.resize()
//     this.$nuxt.$emit('scroll-after-resize', data)
//   }
// })
// this.$nuxt.$on('scroll-add-listener', (cb) => {
//   this.initScroll()
//   if (this.scroll) {
//     this.scroll.addParalax(cb)
//   }
// })
// this.$nuxt.$on('scroll-remove-listener', (cb) => {
//   this.initScroll()
//   if (this.scroll) {
//     this.scroll.removeParalax(cb)
//   }
// })
// this.$nuxt.$on('scroll-call-parallax', () => {
//   this.initScroll()
//   if (this.scroll && this.scroll.callParalax) {
//     this.scroll.callParalax()
//   }
// })

// this.$nuxt.$on('theme', (theme) => {
//   document.documentElement.setAttribute('data-theme', theme)
// })
// this.$nuxt.$on('theme-nav', (theme) => {
//   document.documentElement.setAttribute('data-theme-nav', theme)
// })


/// methods
function setOS() {
  let os = "osx";
  if (navigator.platform) {
    if (navigator.platform.indexOf("Win") > -1) {
      os = "windows";
    } else if (navigator.platform.indexOf("Mac") > -1) {
      os = "osx";
    } else if (navigator.platform.indexOf("Linux") > -1) {
      os = "linux";
    }
  } else {
    if (navigator.userAgent.indexOf("Windows") > -1) {
      os = "windows";
    } else if (navigator.userAgent.indexOf("Mac") > -1) {
      os = "osx";
    } else if (navigator.userAgent.indexOf("Linux") > -1) {
      os = "linux";
    }
  }
  document.documentElement.setAttribute("data-os", os);
  document.documentElement.setAttribute("data-browser", Util.getBrowser());
  document.documentElement.setAttribute("data-touch", Util.isTouch());
}


const winW = ref(null);
const winH = ref(null);
const isMobile = ref(null);

function resize() {
      winW.value = window.innerWidth;
      winH.value = window.innerHeight;
      isMobile.value = winW.value <= 1024
      const vh = winH.value * 0.01
      if (isMobile.value && !mobileInitialized.value) {
        mobileInitialized.value = true
        document.documentElement.style.setProperty('--vh', `${vh}px`)
      } else if (!isMobile.value) {
        document.documentElement.style.setProperty('--vh', `${vh}px`)
      }
      document.documentElement.style.setProperty('--rvh', `${vh}px`)
      const container = document.querySelector('.container');
      if (container) {
        const rect = container.getBoundingClientRect();
        document.documentElement.style.setProperty(
          '--container-margin',
          `${rect.left}px`
        );
        document.documentElement.style.setProperty(
          '--container-width',
          `${rect.width}px`
        );
        document.documentElement.style.setProperty(
          '--column',
          `${rect.width / 12}px`
        )
      } else {
        document.documentElement.style.setProperty(
          '--column',
          `${winW.value / 12}px`
        )
      }
}

function initScroll() {
  if (!scroll.value) {
    scroll.value = new ScrollCtrl({
      page: this.$refs.page,
      pointer: this.$refs.scrollPointer.$el,
      hideCursor: () => {
        this.$nuxt.$emit('cursor-hide')
      },
    })
    window.scroll = this.scroll
    this.scroll.addParalax(this.scrollHandler);
    this.scrollHandler(0)
  }
}

onMounted(async () => {

});
</script>

<style lang="scss">
@use '~/assets/sass/main.scss' as *;


.back {
  color: $mycolor;
}
</style>

