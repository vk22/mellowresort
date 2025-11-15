<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import gsap from 'gsap'
// import { footerBus } from '~/composables/useFooterBus'
import { asText } from '@prismicio/helpers'
import { useAppBus } from '~/composables/useAppBus'

const bus = useAppBus()

const props = defineProps({
  newsletterTitle: { type: Array, default: () => [] },
  inputPlaceholder: { type: String, default: '' },
  thanksText: { type: String, default: '' },
  column1: { type: Array, default: () => [] },
  column2: { type: Array, default: () => [] },
  copyright: { type: String, default: '' },
  socialItems: { type: Array, default: () => [] },
})

const el = ref(null)
const newsletterEmail = ref('')
const loading = ref(false)
const thanks = ref(false)
const isHidden = ref(false)

const route = useRoute()
const lang = computed(() => route.params.lang || 'en')

// footerBus.on((event) => {
//   if (event === 'hide') isHidden.value = true
//   if (event === 'show') isHidden.value = false
// })

bus.on('footer-hide', () => {
  isHidden.value = true
})

bus.on('footer-show', () => {
  isHidden.value = false
})

onMounted(() => {
  gsap.set(el.value, { opacity: 0 })
  gsap.to(el.value, { duration: 0.5, opacity: 1, delay: 0.5 })
})

watch(() => route.fullPath, () => {
  gsap.to(el.value, { duration: 0.5, opacity: 0 })
  gsap.to(el.value, { duration: 0.5, opacity: 1, delay: 2 })
})

async function subscribe() {
  loading.value = true
  try {
    await $fetch('/api/signup', {
      method: 'POST',
      body: { email: newsletterEmail.value }
    })
  } catch (e) {
    console.error(e)
  }
  newsletterEmail.value = ''
  loading.value = false
  thanks.value = true
  setTimeout(() => { thanks.value = false }, 5000)
}

function keydown(e) {
  if (e.key === 'Enter') subscribe()
}

function getSocialName(link) {
  const url = link?.url || ''
  if (url.includes('facebook')) return 'facebook'
  if (url.includes('twitter')) return 'twitter'
  if (url.includes('instagram')) return 'instagram'
  if (url.includes('youtube')) return 'youtube'
  if (url.includes('linkedin')) return 'linkedin'
  if (url.includes('spotify')) return 'spotify'
  return 'instagram'
}

function linkResolver(link) {
  if (!link) return `/${lang.value}/`
  if (link.type === 'standard_retreat') return `/${lang.value}/retreats/standard/`
  if (link.type === 'special_retreat') return `/${lang.value}/retreats/${link.uid}/`
  return link.type === 'home'
    ? `/${lang.value}/`
    : `/${lang.value}/${link.type.replace('_', '-')}/`
}
</script>

<style lang="scss" module>
@use "sass:map";
@use "sass:meta";
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.footer {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 118px 0;
  font-size: 16px;
  line-height: 1;
  .top {
    display: flex;
    align-items: center;
    justify-content: center;
    .newsletter {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .newsletterTitle {
      max-width: 420px;
      text-align: center;
    }
    .newsletterContainer {
      width: 100%;
      max-width: 300px;
      height: 35px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-top: 90px;
      border-bottom: 1px solid currentColor;
      transition: opacity 1s $curve;
      input {
        width: calc(100% - 30px);
        height: 100%;
        font-size: inherit;
        line-height: inherit;
        font-weight: normal;
        background: transparent;
        border: none;
        outline: none;
        color: inherit;
      }
      .newsletterButton {
        width: 30px;
        height: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        svg {
          width: 100%;
          fill: currentColor;
        }
      }
      &.loading {
        opacity: 0;
        &, * {
          pointer-events: none !important;
        }
      }
    }
    
  }
  .bottom {
    padding-top: 220px;
    display: flex;
    justify-content: space-between;
    .logo {

    }
    .left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .copyright {
      display: block;
      &.copyrightMobile {
        display: none;
      }
    }
    .social {
      display: flex;
      align-items: center;
      margin-top: 30px;
      .socialItem {
        width: 20px;
        height: 20px;
        display: inline-block;
        svg {
          width: 100%;
          height: 100%;
          fill: currentColor;
          transition: transform 1s $curve;
        }
        &:hover {
          svg {
            transform: scale(0.8);
          }
        }
        &:not(:last-child) {
          margin-right: 24px;
        }
      }
    }
    .right {
      display: flex;
    }
    .column {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      &:not(:last-child) {
        margin-right: 150px;
      }
    }
    .item {
      @include underline();
      line-height: 1;
      &:not(:last-child) {
        margin-bottom: 18px;
      }
      &:last-child {
        margin-top: 20px;
      }
    }
  }
  &.isHidden {
    display: none;
  }
  @include respond-to('desktop-extra-large') {
    font-size: toVW(16);
    padding: toVW(118) 0;
    min-height: auto;
    .top {
      .newsletter {
        .newsletterTitle {
          max-width: toVW(420);
        }
        .newsletterContainer {
          max-width: toVW(300);
          height: toVW(35);
          margin-top: toVW(90);
          .newsletterButton {
            width: toVW(30);
          }
        }
      }
    }
    .bottom {
      .social {
        .socialItem {
          width: toVW(20);
          height: toVW(20);
        }
      }
    }
  }
  @include respond-to('desktop') {
    .bottom {
      .right {
        .column {
          &:not(:last-child) {
            margin-right: 80px;
          }
        }
      }
    }
  }
  @include respond-to('tablet-small') {
    padding-top: 100px;
    font-size: 14px;
    .bottom {
      padding-top: 120px;
      flex-direction: column;
      align-items: flex-start;
      .copyright {
        opacity: 0.7;
      }
      .left {
        margin-bottom: 30px;
        .copyright {
          display: none;
        }
      }
      .copyrightMobile {
        display: block;
        margin-top: 50px;
      }
      .social {
        display: flex;
      }
      .right {
        .column {
          &:not(:last-child) {
            margin-right: 60px;
          }
        }
      }
    }
  }
  @include respond-to('mobile-medium') {
    padding-bottom: 60px;
    .top {
      .newsletterContainer {
        margin-top: 30px;
      }
    }
  }
}
</style>
