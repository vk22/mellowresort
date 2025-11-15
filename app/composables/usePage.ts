// composables/usePage.ts
import { nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from '#app'
import { usePrismic } from '@prismicio/vue'
import Util from '~/utils/util'
import { useAppBus } from '~/composables/useAppBus'

type PrismicDoc =
  | { link_type?: 'Any'; url?: string } // external
  | { link_type?: 'Document'; type?: string; uid?: string } // internal
  | any

export function usePage() {
  const route = useRoute()
  const router = useRouter()
  const prismic = usePrismic()
  const bus = useAppBus()

  // ===== page transition (аналог transition: { leave() { ... } })
  const pageTransition = {
    name: 'page',
    mode: 'out-in',
    css: false,
    leave: (el: Element, done: () => void) => {
      ;(window as any).__pageLoadingTimeout &&
        clearTimeout((window as any).__pageLoadingTimeout)

      bus.emit('loading-show')
      bus.emit('cursor-hide')

      ;(window as any).__pageLoadingTimeout = setTimeout(() => {
        done()
      }, 1000)
    },
  }

  // ===== beforeRouteEnter analogue: записать имя предыдущего роута
  // вызови installRouteHistory в onMounted страницы и передай commit-функцию
  function installRouteHistory(commitPrevious: (name: string) => void) {
    const unreg = router.afterEach((_to, from) => {
      let name = (from?.name as string) ?? '404'
      try {
        commitPrevious(name)
      } catch {
        // no-op: проект может быть без Vuex/Pinia
      }
    })
    // Nuxt router.afterEach возвращает "unregister"
    onBeforeUnmount(() => {
      try {
        ;(unreg as any)?.()
      } catch {}
    })
  }

  // ===== было: methods.hideLoading(cb)
  async function hideLoading(cb?: () => void) {
    console.log('hideLoading')
    const main = document.getElementById('main')
    if (main) main.scrollTop = 0

    await nextTick()

    const intro = document.getElementById('intro')
    const introDone = intro?.getAttribute('data-done') === 'true'


    const run = () => {
      ;(window as any).__pageLoadingTimeout = setTimeout(() => {
        Util.waitForFont('Lausanne', () => {
          bus.emit('scroll-update-sections')
          bus.emit('intro-hide')
          bus.emit('loading-hide')
          cb && cb()
        })
      }, 100)
    }

    if (introDone) {
      run()
    } else {
      // дождаться интро
      const onIntroDone = () => {
        bus.off('intro-done', onIntroDone as any)
        run()
      }
      bus.on('intro-done', onIntroDone as any)
    }

    // сброс first-load флага
    const loading = document.getElementById('loading')
    const isFirst = loading?.getAttribute('data-first-load') === 'true'
    if (isFirst) loading?.setAttribute('data-first-load', 'false')
  }

  // ===== было: methods.camelCase
  function camelCase(str: string) {
    return str
      .replace(/_./g, (t) => t.toUpperCase())
      .replace(/_/g, '')
  }

  // ===== было: methods.prepareData(data)
  function prepareData(slice: any) {
    let name = String(slice.slice_type).toLowerCase().replace(/_/g, '-')

    const primary: Record<string, any> = {}
    Object.keys(slice.primary || {}).forEach((key) => {
      primary[camelCase(key)] = slice.primary[key]
    })

    if (name === 'highlights') name = 'retreat-highlights'

    if (name === 'text-and-image') {
      primary.title = primary.sectionTitle
      primary.description = primary.sectionDescription
      primary.image = primary.sectionImage
      primary.reverse = primary.imagePosition
    }
    if (name === 'title-and-text') {
      primary.text = primary.sectionText
    }
    if (name === 'retreat-highlights') {
      primary.image = primary.highlightsImage
      primary.columns = [
        {
          subtitle: prismic.asText(primary.highlightsSubtitle),
          title: primary.highlightsTitle,
          content: primary.highlightsItems,
        },
        {
          subtitle: prismic.asText(primary.whatIsIncludedSubtitle),
          title: primary.whatIsIncludedTitle,
          content: primary.whatIsIncludedItems,
        },
      ]
    }

    return {
      name,
      data: { ...primary, items: slice.items },
    }
  }

  // ===== было: methods.getLink(doc)
  function getLink(doc?: PrismicDoc) {
    const lang = (route.params as any).lang || 'en'
    let href = `/${lang}/`
    let isExternal = false

    if (!doc) return { href, isExternal }

    // внешняя ссылка
    if (doc.link_type && doc.link_type !== 'Document') {
      href = (doc as any).url
      isExternal = true
      return { href, isExternal }
    }

    // prismic document
    const d = doc as any
    if (d.type === 'standard_retreat') href = `/${lang}/retreats/standard/`
    else if (d.type === 'special_retreat') href = `/${lang}/retreats/${d.uid}/`
    else if (d.type)
      href = d.type === 'home' ? `/${lang}/` : `/${lang}/${d.type.replace('_', '-')}/`

    return { href, isExternal }
  }

  // вспомогательный: удобно включать базовую инициализацию страницы
  function useCommonPageInit() {
    onMounted(() => {
      bus.emit('scroll-reset')
      bus.emit('theme', 'dark')
      bus.emit('theme-nav', 'dark')
    })
  }

  return {
    // transition для definePageMeta
    pageTransition,

    // хелперы и логика
    hideLoading,
    camelCase,
    prepareData,
    getLink,
    installRouteHistory,
    useCommonPageInit,
  }
}
