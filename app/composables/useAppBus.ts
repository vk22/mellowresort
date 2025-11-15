import mitt from 'mitt'
import type { Ref } from 'vue'

type Events = {
  'scroll-pause': void
  'scroll-play': void
  'scroll-to': number
  'scroll-update-sections': void
  'scroll-reset': void
  'scroll-resize': { soft?: boolean }
  'scroll-after-resize': { soft?: boolean }
  'scroll-add-listener': (cb: (pos: number) => void) => void
  'scroll-remove-listener': (cb: (pos: number) => void) => void
  'scroll-call-parallax': void

  'theme': 'light' | 'dark'
  'theme-nav': 'light' | 'dark'

  'cursor-hide': void
  'cursor-update': void
  'cursor-update-element': HTMLElement
  'intro-hide': void
  'loading-show': void
  'loading-hide': void
  'intro-done': void
  'book-button-hide': void
  'book-button-show': void
  'menu-close': void
  'menu-toggle': void

}

export function useAppBus() {
  // useState гарантирует:
  // - сервер: отдельный экземпляр на каждый SSR-запрос
  // - клиент: один общий singleton на всё приложение (и переживает HMR)
  const state = useState<ReturnType<typeof mitt<Events>> | null>('__app_bus', () => null)

  if (!state.value) {
    state.value = mitt<Events>()
  }

  const bus = state.value
  return {
    on: bus.on,
    off: bus.off,
    emit: bus.emit,
    // если хочется – можно реэкспортнуть сам инстанс:
    bus,
  }
}
