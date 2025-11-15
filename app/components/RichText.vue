
<template>
  <div class="prismicText margin" :class="margin ? 'margin' : 'noMargin'">
    <PrismicRichText
      :field="finalText"
      :components="components"
    />
  </div>

</template>

<script setup>
import { computed, h } from 'vue'
import { PrismicRichText } from '@prismicio/vue'
import { useI18n } from '#imports'

const props = defineProps({
  text: { type: Array, default: () => [] },
  margin: { type: Boolean, default: true },
  noHeadings: { type: Boolean, default: false }
})

const { locale } = useI18n()

const finalText = computed(() => {
  if (!props.noHeadings) return props.text
  return props.text.map((item) =>
    item.type?.startsWith('heading')
      ? { ...item, type: 'paragraph' }
      : item
  )
})

// Генератор правильных ссылок на основе документа
function linkResolver(doc) {
  if (!doc) return `/${locale.value}/`

  switch (doc.type) {
    case 'special_retreat':
    case 'retreat':
      return `/${locale.value}/retreats/${doc.uid}/`
    case 'journal_post':
      return `/${locale.value}/journal/${doc.uid}/`
    case 'home':
      return `/${locale.value}/`
    default:
      return `/${locale.value}/${doc.type}/${doc.uid || ''}`
  }
}

// Кастомный рендер <a>
const components = {
  hyperlink: ({ node, children }) =>
    h(
      resolveComponent('NuxtLink'),
      { to: linkResolver(node.data), class: 'underline hover:opacity-75 transition' },
      () => children
    )
}
</script>



<style lang="scss">
.prismicText {
  margin: 0;

  & > * {
    font: inherit;
    color: inherit;
    margin: 0;
    line-height: inherit;
  }

  p:not(:last-child) {
    margin-bottom: 1em;
  }

  a {
    text-decoration: underline;
  }

  &.noMargin {
    p,
    & > * {
      margin: 0 !important;
    }
  }
}
</style>
