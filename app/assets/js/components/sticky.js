import Util from '~/utils/util';
export default class Sticky {
  constructor(el, onProgress){
    this.el = el;
    this.placeholder = this.el.querySelector('[data-scroll-sticky-placeholder]');
    this.container = this.el.querySelector('[data-scroll-sticky-container]');
    this.content = this.el.querySelector('[data-scroll-sticky-content]');
    this.main = document.getElementById('main');
    this.progress = 0;
    this.last = 'isDown';

    this.onProgress = onProgress;
    this.resize = this.resize.bind(this);
    this.scroll = this.scroll.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.keydown = this.keydown.bind(this);

    this.resize();

    window.addEventListener('resize', this.resize);

    window.addEventListener('wheel', this.onScroll);
    document.addEventListener('touchmove',this.onScroll, { passive: false });
    document.addEventListener('keydown', this.keydown);
  }
  keydown(e) {
    if(this.isNavKey(e)) {
      this.scroll();
    }
  }
  isNavKey(e) {
    return e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Home' || e.key === 'End';
  }
  resize() {
    this.winH = window.innerHeight;
    this.isMobile = window.innerWidth <= 1024;
    this.height = this.content.getAttribute('data-scroll-sticky-height') ? Number(this.content.getAttribute('data-scroll-sticky-height')) * this.winH : this.content.scrollHeight + this.winH;
    this.heightMultiply = this.content.getAttribute('data-scroll-sticky-multiply') ? Number(this.content.getAttribute('data-scroll-sticky-multiply')) : 1;
    
    if(this.content.getAttribute('data-scroll-sticky-slides')) {
      const n = Number(this.content.getAttribute('data-scroll-sticky-slides'));
      this.height = 80 * n + this.winH;
    }

    this.height *= this.heightMultiply;

    const t = window.scroll.data ? window.scroll.data.t : 0;
    this.el.classList.add('no-transform');
    // this.top = t + this.el.getBoundingClientRect().top;
    this.top = Util.getPosition(this.el).y;
    console.log(this.el, this.height, this.top);
    this.el.classList.remove('no-transform');
  }
  onScroll() {
    this.scroll();
  }
  scroll(customPos, customIsDown) {
    if(this.isMobile) return;
    const pos = customPos === undefined ? window.scroll.data.t : customPos;
    if(pos <= this.top) {
      this.progress = 0;
    }
    else if(pos > this.top && pos < this.top + this.height) {
      this.progress = Math.max(Math.min(1, (pos - this.top) / (this.height - this.winH)), 0);
    }else {
      this.progress = 1;
    }
    let isDown = window.scroll.data.t > window.scroll.data.c;
    if(window.scroll.data.t === window.scroll.data.c) {
      isDown = this.last === 'isDown';
    }
    if(customIsDown !== undefined) {
      isDown = customIsDown;
    }
    this.onProgress(this.progress, isDown);
    this.last = isDown ? 'isDown' : 'isUp';
  }
  destroy() {
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('wheel', this.onScroll);
    document.removeEventListener('touchmove', this.onScroll);
    document.removeEventListener('keydown', this.keydown);
  }
}