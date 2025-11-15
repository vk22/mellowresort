<template>
  <div class="keep-words" :class="[$style.maskedText]" v-html="$prismic.asHTML(text)" />
</template>

<script>
import { gsap } from 'gsap'

import VueTypes from 'vue-types'
import Util from '../assets/js/util/util'

export default {
  name: 'Title',
  props: {
    text: VueTypes.array.def([]),
  },
  watch: {
    text() {
      this.$nextTick(() => {
        this.resize()
      })
    },
  },
  data() {
    return {
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  mounted() {
    this.resize()
    window.addEventListener('resize', this.resize)
    console.log('text ',  this.$prismic.asHTML(this.text))
  },
  methods: {
    hide() {
      const lines = this.$el.querySelectorAll('.line .text');
      gsap.set(lines, { y: '110%', opacity: 0 })
    },
    show() {
      const lines = this.$el.querySelectorAll('.line .text');
      gsap.to(lines, { y: 0, opacity: 1, duration: 3, ease: 'power4.inOut', stagger: 0.1 })
    },
    breakText() {
      const item = this.$el;
       console.log('breakText ', item)
      if(item.innerText.trim() !== '') {
        if(!this.words) {
          const childs = [];
          const words = [];
          item.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach(p => {
            childs.push(...p.childNodes);
          })
          console.log('childs ', childs)
          childs.forEach(child => {
            if(child.nodeType === 3) {
              const text = child.textContent.trim();
              if(text !== '') {
                const array = text.split(' ');
                words.push(...array.map((word, i) => {
                  return {type: 'SPAN', word};
                }))
              }
            }else {
              const innerWords = [];
              child.childNodes.forEach(innerChild => {
                if(innerChild.nodeType === 3) {
                  const text = innerChild.textContent.trim();
                  if(text !== '') {
                    const array = text.split(' ');
                    innerWords.push(...array.map((word, i) => {
                      return {type: child.tagName, word};
                    }))
                  }
                }
              })
              if(innerWords.length > 0) {
                words.push(...innerWords);
              }
            }
          });
          this.words = words;
        }
        this.$el.innerHTML = '';
        this.words.forEach((word, i) => {
          const span = document.createElement(word.type);
          span.innerText = word.word;
          span.classList.add('word');
          this.$el.appendChild(span);
        })
        const maxW = Util.getStyleNumber(item, 'maxWidth');
        const clientW = item.parentElement.clientWidth;
        let w = maxW;
        if (maxW > clientW && clientW > 0) {
          w = clientW - 0;
        }
        
        const finalW = window.isNaN(w) ? clientW : w;
        
        Util.lineBreak(item.innerText, finalW, item);
      }
    },
    resize() {
      this.$nextTick(() => {
        this.breakText();
      });
    }
  }
}
</script>

<style lang="scss" module>
.maskedText {
  font-weight: inherit;
  font-family: $font-serif;
  text-align: inherit;
  text-decoration: inherit;
  & {
    margin: 0;
  }
  & > * {
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
    line-height: inherit;
    text-align: inherit;
    text-decoration: inherit;
    color: inherit;
    margin: 0;
  }
  p,
  & > * {
    margin: 0 !important;
  }
  strong, b {
    font-weight: inherit;
    font-family: $font-sans;
  }
  p:empty {
    margin-bottom: 1em !important;
  }
  :global(.line) {
    display: block;
    font-weight: inherit;
    :global(.word) {
      display: inline-block;
      &:not(:last-child):global(.right-space) {
        padding-right: 0.2em;
      }
      &:not(:first-child):global(.left-space) {
        padding-left: 0.2em;
      }
    }
    &:not(:last-child) {
      margin-bottom: 0.15em;
    }
    &:last-child {
      :global(.text) {
      }
    }
  }
  :global(.text) {
    display: inline-block;
    white-space: nowrap;
    font-weight: inherit;
    will-change: transform;
  }
  &[data-scroll-item] {
    :global(.text) {
      transition: transform 3s cubic-bezier(0.65, 0.2, 0, 1);
    }
    @for $i from 1 through 20 {
      :global(.line):nth-child(#{$i}) {
        :global(.text) {
          transition-delay: 0.1s * $i;
        }
      }
    }
    &:not(:global(.show)) {
      :global(.text) {
        opacity: 0;
        transform: translateY(110%);
      }
    }
  }
}
</style>
