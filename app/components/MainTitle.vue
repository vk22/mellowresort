<template>
  <div ref="root" class="keep-words" :class="[$style.maskedText]" v-html="asHTML(text)" />
</template>

<script setup>
import { ref, defineProps, reactive, watch, onMounted, onBeforeUnmount, nextTick, defineExpose } from 'vue';
import { gsap } from 'gsap'
//import { asHtml } from '~/utils/asHtml'
import { asHTML } from '@prismicio/helpers'
import Util from '../utils/util'

const props = defineProps({
  text: {
    type: Array,
    required: false,
  }
});

console.log('props.text ', props.text)

const state = reactive({});
const root = ref(null)
const words = ref(null)

watch(() => state.text, function() {
  nextTick(() => {
    resize()
  })
});



function hide() {
  const lines = root.value.querySelectorAll('.line .text');
  gsap.set(lines, { y: '110%', opacity: 0 })
}

function show() {
  const lines = root.value.querySelectorAll('.line .text');
  gsap.to(lines, { y: 0, opacity: 1, duration: 3, ease: 'power4.inOut', stagger: 0.1 })
}

function breakText() {
  const item = root.value;
  // console.log('breakText ', item)
  if (!item) return;
  const words = [];
  if(item.innerText.trim() !== '') {
    if(!words.length) {
      const childs = [];
      
      item.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach(p => {
        childs.push(...p.childNodes);
      })
      // console.log('childs ', childs)
      childs.forEach(child => {
        // console.log('child ', child.nodeType)
        if(child.nodeType === 3) {
          const text = child.textContent.trim();
          // console.log('text ', text)
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
              // console.log('text ', text)
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
      // console.log('words ', words)

    }
    root.value.innerHTML = '';
    words.forEach((word, i) => {
      const span = document.createElement(word.type);
      span.innerText = word.word;
      span.classList.add('word');
      root.value.appendChild(span);
    })
    const maxW = Util.getStyleNumber(item, 'maxWidth');
    const clientW = item.parentElement.clientWidth;
    let w = maxW;
    if (maxW > clientW && clientW > 0) {
      w = clientW - 0;
    }
    
    const finalW = window.isNaN(w) ? clientW : w;
    // console.log('item.innerText ', item.innerText)
    
    Util.lineBreak(item.innerText, finalW, item);
  }
}

function resize() {
  nextTick(() => {
    breakText();
  });
}

onMounted(function() {
  resize()
  // window.addEventListener('resize', resize)
});

onBeforeUnmount(function() {
 //window.removeEventListener('resize', resize)
});

defineExpose({hide, show})

</script>

<style lang="scss" module>
@use "~/assets/sass/util/_variables.scss" as *;
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
