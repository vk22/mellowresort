<template>
  <div :class="[$style.shareButton]" data-cursor-pointer @click="share">
    <svg v-if="type === 'facebook'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 23">
      <path d="M7.298 22.5V12.235h3.317l.495-4H7.298V5.683c0-1.158.31-1.947 1.909-1.947h2.039V.157A26.324 26.324 0 0 0 8.276 0c-2.94 0-4.95 1.864-4.95 5.287v2.95H0v4h3.324V22.5h3.974Z" />
    </svg>
    <svg v-if="type === 'twitter'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 15">
      <path d="M6.683 15c8.019 0 12.405-5.771 12.405-10.776 0-.164 0-.328-.013-.49a8.324 8.324 0 0 0 2.175-1.96 9.749 9.749 0 0 1-2.504.595c.91-.473 1.591-1.217 1.917-2.094a9.575 9.575 0 0 1-2.769.919C17.237.587 16.368.184 15.421.05a4.943 4.943 0 0 0-2.765.399c-.846.393-1.519 1.017-1.915 1.777a3.337 3.337 0 0 0-.277 2.422A13.87 13.87 0 0 1 5.487 3.5C3.94 2.818 2.574 1.86 1.48.69c-.558.834-.728 1.82-.478 2.76.251.94.905 1.76 1.828 2.296A4.837 4.837 0 0 1 .85 5.273v.048c0 .874.349 1.722.986 2.398.638.677 1.525 1.141 2.512 1.315a4.992 4.992 0 0 1-1.969.065c.279.752.821 1.41 1.551 1.882s1.613.733 2.522.748c-1.543 1.054-3.45 1.626-5.414 1.624-.347 0-.694-.018-1.038-.054 1.994 1.111 4.314 1.7 6.683 1.698" />
    </svg>
    <svg v-if="type === 'spotify'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">
      <path d="M10.5006 21C6.25329 21.0055 2.42207 18.4485 0.797616 14.5242C-0.82684 10.5998 0.0763036 6.08305 3.08493 3.08508C5.73251 0.427937 9.59771 -0.612721 13.2215 0.355935C16.8453 1.32459 19.6757 4.15503 20.6444 7.77881C21.613 11.4026 20.5724 15.2678 17.9152 17.9154C15.9548 19.8925 13.2849 21.0032 10.5006 21ZM8.94306 13.929C10.8744 13.8887 12.7781 14.3928 14.4365 15.3836C14.5388 15.4522 14.6591 15.4887 14.7823 15.4887C15.0067 15.483 15.213 15.3644 15.3309 15.1734C15.4226 14.9963 15.4385 14.7896 15.375 14.6006C15.3213 14.4569 15.2095 14.3424 15.0671 14.2853C13.1999 13.1746 11.0584 12.6106 8.8863 12.6573C7.53867 12.6677 6.19624 12.8259 4.88314 13.1292C4.53887 13.221 4.32955 13.5694 4.41021 13.9164C4.49149 14.1965 4.74021 14.3951 5.03133 14.4125C5.0872 14.4123 5.14276 14.4041 5.19633 14.3883C6.42423 14.0961 7.68094 13.9421 8.94306 13.929ZM8.74337 10.8013C11.1063 10.7735 13.4339 11.3761 15.4864 12.547C15.6034 12.632 15.7443 12.6776 15.8889 12.6773C16.1721 12.6663 16.433 12.5206 16.591 12.2853C16.7144 12.1053 16.7528 11.8802 16.6961 11.6694C16.6577 11.4867 16.5429 11.3291 16.3808 11.2364C14.06 9.89616 11.4222 9.20262 8.74232 9.22802C7.32956 9.21937 5.92315 9.41766 4.56785 9.81657C4.15141 9.95365 3.91886 10.3964 4.04237 10.8171C4.14546 11.157 4.4663 11.3835 4.82114 11.3668C4.89657 11.3675 4.97179 11.3587 5.04499 11.3405C6.24288 10.9723 7.49024 10.7905 8.74337 10.8013ZM8.94201 7.55592C11.6367 7.47819 14.3062 8.09337 16.695 9.34258C16.8561 9.43058 17.037 9.47582 17.2205 9.47395C17.5464 9.48073 17.857 9.33592 18.0613 9.08193C18.1884 8.84948 18.2215 8.57716 18.1538 8.32103C18.0905 8.0655 17.9248 7.84731 17.6956 7.71777C15.0017 6.28597 11.9833 5.57493 8.9336 5.65366C7.24492 5.63628 5.56201 5.85345 3.93306 6.29896C3.47551 6.44046 3.19182 6.8971 3.26768 7.36999C3.34355 7.84288 3.75583 8.18787 4.23469 8.17915C4.32793 8.17923 4.42068 8.16577 4.51005 8.13921C5.95123 7.7306 7.44417 7.53376 8.94201 7.55487V7.55592Z" />
    </svg>
  </div>
</template>

<script>
import VueTypes from 'vue-types'

export default {
  name: 'ShareButton',
  props: {
    type: VueTypes.string.def('facebook'),
  },
  methods: {
    share() {
      const url = window.location.href;
      const type = this.type;
      switch (type) {
        case 'copy':
          navigator.clipboard.writeText(url);
          this.$el.classList.add('copying');
          setTimeout(() => {
            this.$el.classList.remove('copying');
          }, 1200);
          break;
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${url}`)}`,
            'sharer',
            'toolbar=0,status=0,width=580,height=480',
          );
          break;
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            'sharer',
            'toolbar=0,status=0,width=680,height=580',
          );
          break;
        case 'whatsapp':
          window.open(
            `https://wa.me/?text=${url}`,
            '_blank'
          );
          break;
        case 'linkedin':
          window.open(
            `https://linkedin.com/shareArticle?mini=true&url=${url}&summary=`,
            'sharer',
            'toolbar=0,status=0,width=580,height=325',
          );
          break;
        default:
          break;
      }
    }
  },
}
</script>

<style lang="scss" module>
.shareButton {
  width: 60px;
  height: 60px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    border: 1px solid currentColor;
    box-sizing: border-box;
    border-radius: 50%;
    transition: transform 1s $curve, opacity 1s $curve;
  }
  svg {
    width: auto;
    height: 26%;
    fill: currentColor;
    position: relative;
    z-index: 1;
  }
  &:hover {
    &::before {
      transform: scale(1.1);
      opacity: 1;
    }
  }
  @include respond-to('desktop-extra-large') {
    width: min(toVW(60), 90px);
    height: min(toVW(60), 90px);
  }
}
</style>
